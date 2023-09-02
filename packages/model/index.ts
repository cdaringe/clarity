import * as zod from "zod";

const exprSym = Symbol("expr");
export const expr = (payload: string): Expression => ({
  [exprSym]: true,
  payload,
});

export function isExpr(x: unknown): x is Expression {
  // deno-lint-ignore no-explicit-any
  return !!x && exprSym in (x as any);
}

export function toJson(ctx: unknown, payload: Ser): JSONValue {
  if (isExpr(payload)) {
    return eval(payload.payload);
  }
  return JSON.stringify(payload, (key, value) =>
    key ? (isObject(value) ? toJson(ctx, value) : value) : value
  );
}

function isObject(obj: unknown) {
  return obj != null && obj.constructor.name === "Object";
}

type RoutingDeclaration = {
  path: string;
  method: "GET";
  entityId?: string;
};

type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [key: string]: JSONValue };

type Expression = { [exprSym]: true; payload: string };

export type Ser = JSONValue | Expression;

export type ClarityMiddlewareOptions =
  | { kind: "group"; payload: ClarityMiddlewareOptions[] }
  | { kind: "router"; payload: Record<string, RoutingDeclaration> }
  | { kind: "bodyparser"; payload?: never }
  | { kind: "response-json"; payload: Ser }
  | {
      kind: "expression";
      payload: {
        /**
         * @todo use JSONLogic for static, portable computation.
         * For now... deno compatible js expressions
         */
        expr: Expression;
        outputMode: { kind: "value" } | { kind: "field"; fieldName: string };
      };
    }
  | {
      kind: "api-call";
      payload: {
        clientName: string;
        options: {
          init: RequestInit;
        };
      };
    };

const middlewareSchema = zod.object({
  kind: zod.string(),
  payload: zod.any(),
});

const supportedProtocolsSchema = zod.union([
  zod.literal("http"),
  zod.literal("udp"),
]);

const ingressHandlerSchema = zod.object({
  protocol: supportedProtocolsSchema,
  port: zod.number().int().positive(),
  entityId: zod.string().min(1),
});

// user types
type IngressHandler = zod.infer<typeof ingressHandlerSchema>;

const egressSchemaHandler = zod.object({
  protocol: supportedProtocolsSchema,
});
const egressSchema = zod.record(egressSchemaHandler);

type EgressHandler = zod.infer<typeof egressSchema>;

/**
 * Ingress is a mapping of some unique id to processing inbound work.
 * Generally, each ingress handler is mapped to an egress handler (via a router)
 * if events or responses are to be emitted as consequence of an ingress event.
 */
const ingressSchema = zod.record(ingressHandlerSchema);
type Ingress = zod.infer<typeof ingressSchema>;

type Egress = zod.infer<typeof egressSchema>;

// const entitiesSchema = zod.object({
//   kind: zod.literal("http_middleware"),
//   type: zod.union([zod.literal("bodyparser"), zod.literal("router")]),
// });
const entitiesSchema = zod.record(middlewareSchema);
type Entity = zod.infer<typeof entitiesSchema>;

// system types

// const routerEntrySchema = zod.object({
//   entityId: zod.string().min(1),
//   egressId: zod.string().min(1),
// });

// const routerSchema = zod.record(routerEntrySchema);
// type Router = zod.infer<typeof routerSchema>;

export const systemSchema = zod
  .object({
    ingress: ingressSchema,
    // router: routerSchema,
    entities: entitiesSchema,
    graph: zod.record(zod.array(zod.string())),
    egress: egressSchema,
  })
  .superRefine((sys, ctx) => {
    // for (const key in sys.graph) {
    //   if (!(key in sys.entities)) {
    //     ctx.addIssue({
    //       code: zod.ZodIssueCode.custom,
    //       message: `graph ${key} missing from entities`,
    //       fatal: true,
    //     });
    //   }
    // }
    for (const key in sys.ingress) {
      const ingress = sys.ingress[key];
      if (!ingress) throw new Error(`missing ingress: ${key}`);
      if (!(ingress.entityId in sys.entities)) {
        ctx.addIssue({
          code: zod.ZodIssueCode.custom,
          message: `ingress[${key}] enitity ${ingress.entityId} missing from entities`,
          fatal: true,
        });
      }
    }
  });
export type System = Omit<zod.infer<typeof systemSchema>, "entities"> & {
  entities: Record<string, ClarityMiddlewareOptions>;
};

// const router = {
//   "fake-in": {
//     entityId: "fake-entity",
//     egressId: "fake-out",
//   },
// };

export const system: System = {
  ingress: {
    "fake-in": {
      protocol: "http",
      port: 8080,
      entityId: "a",
    } as const,
    "fake-in-2": {
      protocol: "http",
      port: 9090,
      entityId: "c",
    } as const,
  },
  egress: {
    "fake-out": {
      protocol: "http",
    } as const,
  },
  entities: {
    a: {
      kind: "bodyparser",
    },
    b: {
      kind: "router",
      payload: {
        "/": {
          method: "GET",
          path: "/",
          entityId: "c",
        },
      },
    },
    c: {
      kind: "expression",
      payload: {
        expr: expr("3 * 17"),
        outputMode: { kind: "field", fieldName: "simpleSum" },
      },
    },
    d: {
      kind: "response-json",
      payload: {
        ok: true,
        value: expr("ctx.state.request.simpleSum"),
      },
    },
  },
  graph: {
    a: ["b"],
    c: ["d"],
  },
};
