# Kinsco Create

A pop-up bakery's web game where customers build a custom cookie and publish it to a public gallery.

## Language

**Cookie**:
The customer-built item, composed of a Base, Mix-ins, and a Topping. Becomes a gallery entry once Submitted.
_Avoid_: Creation, build

**Shape**:
The cookie's overall outer silhouette (e.g. round, star, heart) — a build step, not tied to any single component.
_Avoid_: Form

**Icon**:
The grayscale homemade art asset representing one Base/Mix-in/Topping option (e.g. the drizzle icon, the dough icon), tinted via the color wheel while its baked-in shading shows through.
_Avoid_: Shape (when referring to a component's art), graphic, image

**Email Signup**:
An optional, standalone capture of an email address at Submission time. Has no link to any Cookie or person — gameplay stays fully anonymous.
_Avoid_: Customer, account, subscriber

**Component**:
A slot a Cookie is built from: one Base, zero-to-four Mix-ins, and one Topping. Each Component holds a chosen Icon and a color.
_Avoid_: Part, ingredient, layer

**Gallery**:
The public, reverse-chronological view of all Submitted Cookies, re-rendered live from their stored data.
_Avoid_: Feed, showcase

**Pattern**:
A property unique to Mix-in Components describing how its tinted Icon repeats or distributes across the cookie (e.g. flecks, swirl).
_Avoid_: Style, texture, design

**Restart Cookie**:
A confirmed, destructive action during the build flow that clears every choice made so far and returns the player to the Base step.
_Avoid_: Reset, clear, undo
