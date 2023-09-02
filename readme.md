# clarity

[![main](https://github.com/cdaringe/clarity/actions/workflows/main.yml/badge.svg)](https://github.com/cdaringe/clarity/actions/workflows/main.yml)

**warning**: this readme is a thought dump. don't read it ;)

clarity is a means to build software.

clarity is a VPL for application development. it could be branded as a low-code
platform, but that would do it a disservice, missing the key intent of the
design.

the human mind does not think in code. we design systems based on logical
workflows & constraints. code is merely the manifestation of those designs. we
toil over our programming languages (which is very fun), however, we
continuously re-design every little grain of our stacks. the amount of duplicate
functionality between our systems is staggering. further, our current design
practices and review processes all-to-often start at and end at the code layer.
this is disappointing. i don't think in code--i translate to code. when
reviewing code, i'm decrypting other's dialect, and mapping that dialect into my
mental model of the system. what if instead of code, during change cycles, we
started with the model, _then_ looked at the code? i posit the only reason that
we do not is simply because there does not exist yet a general purpose VPL
solution that can present an excellent visual explorer of a system, using
standardized flows and constraints.

clarity is naive attempt to apply VPL strategies to be compatible with (some)
general purpose language domains. it generally applies to top-level artifacts,
vs library components.

naively, most top-level artifacts in software do the following:

- accept input
- parse/map/reduce content from input sources
- do effects
- yield output
- ...repeat

These entities can absolutely be modelled using a VPL. The trick is, GPL code
doesn't project well into visual models. GPL code is in of itself a DSL for that
programming context, not a higher level context of systems/flows. projecting up
from code is hard, but projecting down into code from a systems DSL is easy.

example of viable use cases:

- an HTTP API server to provide business informatin
  - GET /users, POST /admins, GET /documents/:department-id
- a bot to respond to various automations
- a CLI to map commands to effects

We care about the properties and capabilities of the system. Why should we even
bother _talking_ about code? For many applications in software engineering, we
should have a standard communication mechanisms on describing work streams, not
on codepaths. Engineers should be able to jump project to project and
add/subtract/mutate value, without even knowing the language. For some software,
this is clearly infeasible. For example, we wouldn't write a parser in the VPL.
Keep low-level implementation content in code, absolutely! However, if we could
do visual design and effective visual code review, why wouldn't we pick the
fastest, safest, and most secure option available?

Many know the OSI networking layers. Conceptually, what if software had a
similar model?

| network model      | software model                        |
| ------------------ | ------------------------------------- |
| Physical Layer     | Physical layer 1 (gates, transistors) |
| Data Link Layer    | Physical layer 2, ALU, CPU            |
| Network Layer      | Assembly                              |
| Transport Layer    | ByteCode                              |
| Session Layer      | Source Code                           |
| Presentation Layer | System Declaration (VPL, `clarity`)   |
| Application Layer  | Nirvana (non-existent)                |

Why is it that we are content exchanging design at an arbitrary low-level?
Should we not strive to make it as easy as possible to describe and communicate
our software's capability, and leave the rest to compilers? For a community that
loves giving work to compilers, why have we not yet asked this of them? For a
community that loves building user interfaces, why have we not yet built systems
that communicate engineering design effectively, across PLs?

Other constraints:

- observability
- debug-ability
- relative performance (to hand crafted servers)
- testability

## open questions

- I have a niche feature, can it be represented visually?

examples, i need to add cookies if "X", or I need my application to perform
various services, not just req/res style architecture.

answer: by design, the system maps inputs => outputs via entities, where
entities are a graph of workstreams.

entities can mutate contents. egress can emit contents. in either example,
entities can be authored to acheive these means.ideally, they can be authored to
do so in a well structured, easily reviewable manner. reviewable means not just
_in code_, but _in context_.

```js
export function someRandomFunction(ctx) {
  if (ctx.req.headers.foo === "bar") {
    ctx.res.headers.barbaz = ctx.reqState.barbazelton;
  }
}
```

That's a _pretty_ simple function. But, it's not necessarily easy to review. Why
not? Who else is using this function? What happens if there are many users of
the fn? Is anyone else using `barbaz`?

There's often inadequate context during coding review. So, `clarity` says
"define the system" rather than write the code. In many cases, you'll get more
boilerplate, but you won't review code--you'll ideally review an interactive
architecture diagram, demonstrating changes to the system.

The code may look like:

```js
{
  entities: {
    set_barbaz: {
      kind: "http_modheader",
      payload: {
        rules: [
          "eq", ["field", ["request", "header"], "foo"],
          "set", ["response", "header"], ["field", ["ctx", "reqState", "barbazelton"]]
        ]
      }
    }
  }
}
```

...but that's fine. You may not even _read_ the code-diff.

Ideally, clarity takes your base design, applies the patches, and let's you
review the changes fully contextualized, in some sort of multi-layer, arbitrary
depth, visual architecture interface.
