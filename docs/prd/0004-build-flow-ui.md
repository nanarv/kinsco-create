# Build-flow UI (Base → Mix-ins → Topping → Shape → Name → Submit)

GitHub issue: https://github.com/nanarv/kinsco-create/issues/4

## Problem Statement

The pieces needed to build and save a Cookie already exist and are tested (`TintedIcon`, `CookieRenderer`, `submitCookie`/`fetchCookies`, `submitEmailSignup`), but there is no screen that lets a player actually use them. Right now the app is a single static placeholder with no buttons — a player at the pop-up table can't build anything.

## Solution

A step-by-step build flow takes a player through Base → Mix-ins → Topping → Shape → Name, assembling their choices into a `Cookie` object as they go, with a live preview rendered via `CookieRenderer` at every step. At the end, the player optionally leaves an email, then submits — calling `submitCookie` (and `submitEmailSignup` if they opted in) and confirming the Cookie was saved. The step/selection logic lives in a single pure `buildFlowReducer`, with the actual screens kept as thin, mostly-presentational components driven by that reducer's state.

## User Stories

1. As a player, I want to pick a Base for my Cookie, so that I can start building.
2. As a player, I want to add zero to four Mix-ins, so that I can customize what's mixed into my dough.
3. As a player, I want to remove a Mix-in I already added, so that I can change my mind before moving on.
4. As a player, I want to pick a Topping, so that I can finish the look of my Cookie.
5. As a player, I want to pick a Shape for the whole Cookie, so that its overall silhouette matches what I imagine.
6. As a player, for each of Base/Mix-in/Topping, I want to either pick a preset option or type my own custom name, so that I'm not limited to the presets.
7. As a player, for each of Base/Mix-in/Topping, I want to choose a color from a set of swatches, so that I can make the Component look the way I want.
8. As a player, for each Mix-in, I want to choose a render Pattern (flecks or swirl), so that it visually matches how I imagine that ingredient sitting on the cookie.
9. As a player, I want to see a live preview of my Cookie as I make choices, so that I know what I'm building before I commit to it.
10. As a player, I want to go back to a previous step and change an earlier choice, so that I'm not locked into my first decision.
11. As a player, I want to name my finished Cookie, so that it has an identity in the Gallery.
12. As a player, I want to optionally leave my email at the end, so that I can hear about future pop-ups, without it being required to finish.
13. As a player, once I submit, I want confirmation that my Cookie was saved, so that I know I'm done.
14. As a developer, I want the step/selection logic centralized in one pure reducer, so that the flow's behavior (which step is current, what's selected, when you can advance) is testable without rendering any screen.
15. As a developer, I want each step screen to be a thin consumer of the reducer's state, so that screens can be built/restyled without touching the underlying flow logic.
16. As a developer, I want the final assembled object to be a valid `Cookie` (per `src/types.ts`) with no further transformation needed before calling `submitCookie`, so that the UI layer and the persistence layer stay decoupled through the existing typed shape.

## Implementation Decisions

- **`buildFlowReducer`** (new, pure function): `(state, action) => state`. Actions cover selecting/clearing a Base, adding/removing/editing a Mix-in (including its Pattern), selecting a Topping, selecting a Shape, setting the Cookie name, advancing to the next step, and going back. State tracks the current step and the in-progress selections in the same shape as `ComponentChoice`/`MixInChoice`/`Cookie` from `src/types.ts`, so the final state requires no transformation before being passed to `submitCookie`.
- **Custom-named entries**: per the existing `ComponentChoice` type, choosing a preset sets `iconId` and clears `customName`; typing a custom name sets `customName` and sets `iconId` to `null`. `TintedIcon`'s existing fallback behavior (issue #1) already handles rendering `iconId: null` correctly — no new rendering logic needed here.
- **Color selection**: implemented as a row of preset swatch buttons (the ~12-16 colors agreed on previously), not a literal color-wheel input widget. The swatch *interaction* (a button-per-color, current selection highlighted) is in scope; a polished rotating color-wheel control is not — swatches are functionally equivalent and simpler to build for v1.
- **Shape selection**: a simple set of preset Shape options (round, star, heart, etc.) presented the same way as the swatch pattern — pick one, it's highlighted, advance.
- **Live preview**: at every step, the in-progress state (cast to a partial `Cookie`-shaped preview) is rendered via the existing `CookieRenderer` (issue #2), reusing it rather than building a second preview renderer.
- **Mix-in cardinality**: zero to four Mix-ins, consistent with the `Cookie.mixIns` array already being unbounded by type but agreed at 0-4 in product scope; the Mix-ins step UI allows adding up to four and removing down to zero, with no requirement to add any.
- **Submission**: on the final step, calls `submitCookie` (issue #2) with the assembled `Cookie`, and — only if the player entered an email — also calls `submitEmailSignup` (issue #3). These two calls are independent (per ADR 0003, no Cookie id is ever passed to `submitEmailSignup`); a failure in one should not silently prevent the other from being attempted.
- **Navigation**: forward/back between steps only; no ability to jump directly to an arbitrary step out of order for this v1.

## Testing Decisions

- A good test for `buildFlowReducer` dispatches a sequence of actions and asserts the resulting state: current step advances/regresses correctly, Base/Topping/Shape selections are recorded, Mix-ins can be added and removed (including hitting the zero and four boundaries), and the state at the final step is a valid `Cookie` shape ready for `submitCookie`. This is the primary, most heavily tested module — same "assert on output, not internals" approach used for `TintedIcon`/`CookieRenderer`.
- The step screens themselves (the thin, mostly-presentational components) get lighter testing — primarily that they render the current reducer state and dispatch the right action on the right interaction (e.g. clicking a Base option dispatches `SELECT_BASE` with that id) — using the same React Testing Library approach already established (`TintedIcon.test.tsx`, `CookieRenderer.test.tsx`).
- The submission step's dual-call behavior (`submitCookie` always, `submitEmailSignup` only if an email was entered) should be tested against fake/mocked repository functions, consistent with how `submitCookie`/`fetchCookies` and `submitEmailSignup` are already tested with injectable fake Supabase clients (`src/lib/testHelpers/fakeSupabaseClient.ts`).
- Prior art: `buildFlowReducer` tests follow the same vertical-slice TDD approach already used for `TintedIcon`, `CookieRenderer`, and the repository functions (issues #1-#3) — one behavior, one test, minimal implementation, repeat.

## Out of Scope

- The Gallery page (a separate, not-yet-built PRD per issue #2's scope boundary).
- A polished rotating/visual color-wheel widget — preset swatch buttons only for this v1.
- Real homemade art — placeholder grayscale Icons only (per issue #1).
- QR code generation or pop-up signage design — this PRD covers the in-browser flow only, not how players physically reach the URL.
- Email format validation beyond basic non-empty input (per issue #3's scope boundary — validation UX is explicitly deferred, and this PRD is where it would have landed, but is still not being specified here).
- Jumping directly to an arbitrary step out of sequence.
- Editing or deleting a Cookie after submission.

## Further Notes

- Depends on `TintedIcon` (issue #1: https://github.com/nanarv/kinsco-create/issues/1), `CookieRenderer`/`submitCookie` (issue #2: https://github.com/nanarv/kinsco-create/issues/2), and `submitEmailSignup` (issue #3: https://github.com/nanarv/kinsco-create/issues/3) — this PRD is the first one that actually renders a usable screen, composing all three.
- Relevant ADRs: all three (`docs/adr/0001`, `0002`, `0003`) apply transitively through the components/functions this PRD consumes, but this PRD introduces no new architectural decisions of its own — it's UI composition over already-decided plumbing.
- Relevant glossary terms (`CONTEXT.md`): Cookie, Component, Icon, Pattern, Shape, Email Signup.
