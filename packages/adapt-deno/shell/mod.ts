// deno-lint-ignore-file no-explicit-any
import { assert, log, model, oak } from "./deps.ts";

type SystemState<ReqState = Record<string, unknown>> = {
  request: ReqState;
  sys: model.System;
  serversByName: Record<string, ClarityApplication>;
};

type ClarityApplication = oak.Application<SystemState>;
type ClarityMiddleware = oak.Middleware<SystemState>;

function assertNever(_: never, msg: string): void {
  throw new Error(msg);
}

function middlewarseByType(
  node: string,
  middlewaresById: Record<string, ClarityMiddleware>,
  app: ClarityApplication,
): ClarityMiddleware {
  const t = app.state.sys.entities[node];
  assert(t, `missing entity: ${node}`);
  switch (t.kind) {
    case "bodyparser": {
      return function bp(_ctx, next) {
        // bodyparser is frivolous. oak already provides an excellent bp design
        return next();
      };
    }
    case "router": {
      const router = new oak.Router<SystemState>();
      for (const key in t.payload) {
        const routingDecl = t.payload[key as keyof typeof t.payload];
        assert(routingDecl, `missing routing configuration for path: ${key}`);
        const methodName = routingDecl.method.toLowerCase() as "get";
        const childMw = routingDecl.entityId
          ? bindMiddlewareGraph(routingDecl.entityId, middlewaresById, app)
          : null;
        router[methodName](key, async function handleRoute(ctx, next) {
          if (childMw) {
            await childMw(ctx, next);
          } else {
            // no entity provided. support the route... but it's a no-op, and
            // will likely 404 in other middleware
          }
        });
      }
      return router.routes();
    }
    case "group": {
      return function group(_ctx, _next) {
        throw new Error("unimplemented");
      };
    }
    case "response-json": {
      return function responseJson(ctx, next) {
        ctx.response.body = model.toJson(ctx, t.payload);
        ctx.response.status = 200;
        ctx.response.type = "application/json";
        return next();
      };
    }
    case "api-call": {
      throw new Error("unimplemented!");
    }
    case "expression": {
      return function exprMiddleware(ctx, next) {
        // @warn obviously don't do this, but we're experimenting here people!
        const value = eval(t.payload.expr.payload);
        /**
         * Update ctx.state.req with the expr field
         */
        if (t.payload.outputMode.kind === "field") {
          const parts = t.payload.outputMode.fieldName.split(".");
          const lastPartI = parts.length - 1;
          parts.reduce<Record<string, any>>((acc, it, i) => {
            if (!acc[it]) {
              acc[it] = {};
            }
            if (i === lastPartI) {
              acc[it] = value;
            }
            return acc[it];
          }, ctx.state.request);
        }
        return next();
      };
    }
    default: {
      assertNever(t, `unhandled case: ${String(t)}`);
      throw new Error("unreachable");
    }
  }
}

/**
 * Create a graph for processing the ingress.
 * Depth first traversal, accumulating middlewares as
 * fold back _up_ the graph, hydrating the middleware
 * cache as we go up.
 */
function bindMiddlewareGraph(
  node: string,
  middlewaresById: Record<string, ClarityMiddleware>,
  app: ClarityApplication,
): ClarityMiddleware {
  const existing = middlewaresById[node];
  if (existing) {
    return existing;
  }
  const childNodes = app.state.sys.graph[node] || [];
  log.debug(`binding middleware @ ${node} + [${childNodes.length} children]`);
  const childrenMiddleware = childNodes.map((child) =>
    bindMiddlewareGraph(child, middlewaresById, app)
  );
  const mw = oak.composeMiddleware([
    middlewarseByType(node, middlewaresById, app),
    ...childrenMiddleware,
  ]);
  middlewaresById[node] = mw;
  return mw;
}

export const createSystem = async (sys: model.System) => {
  const ingressEntries = Object.entries(sys.ingress);
  const serversByName = ingressEntries.reduce<
    Record<keyof typeof sys.ingress, ClarityApplication>
  >((acc, [key, ingressSettings]) => {
    log.debug(`creating new system`);
    const app = new oak.Application<SystemState>({
      contextState: "prototype",
      state: {
        request: {},
        get serversByName() {
          return serversByName;
        },
        sys,
      },
    });

    // koa/oak like many `app.use(...)`, but to make the graphy
    // nature of the user specified graph, we only really bind a single
    // middleware, and compose them all ourself.
    const middlewaresById: Record<string, ClarityMiddleware> = {};
    app.use(function initIsolatedRequestState(ctx, next) {
      // give each new request its own request state--don't mutate the application state.
      // we must do this because ctx is cloned by default, but we chose the "prototype"
      // ctx.state mode instead. so as to not mutate the prototype values, allocate
      // fresh request memory for safe mutation downstream.
      ctx.state.request = {};
      return next();
    });
    app.use(
      bindMiddlewareGraph(ingressSettings.entityId, middlewaresById, app),
    );
    acc[key] = app;
    return acc;
  }, {});

  await Promise.all(
    ingressEntries.map(([key, { port }]) => {
      log.debug(`server starting on port: ${port}`);
      const app = serversByName[key];
      assert(app);
      return app.listen({ port });
    }),
  );
};
