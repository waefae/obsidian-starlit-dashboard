# 1. Project Identity

## What is Starlit?

Starlit is a personal dashboard plugin for Obsidian.

It combines:

- personal planning;
- task awareness;
- academic/work tracking;
- visual motivation.

It is not only a productivity tool.

It is a personal interface layer over a vault.

The user should feel:

> "I am entering my own workspace."

---

# 2. Why Starlit Exists

Most productivity systems optimize only:

- speed;
- completion;
- efficiency.

Starlit focuses on:

- continuity;
- motivation;
- personal attachment;
- identity.

A dashboard should not feel like corporate software.

It should feel like a personal room.

---

# 3. Current Version Goal

## Current project stage:

Build a polished default dashboard experience.

Priority:

1. Stable architecture.
2. Good performance.
3. Beautiful default design.
4. Reusable components.
5. Preparation for future customization.

---

# 4. What We Are NOT Building Now

## NOT NOW:

### ❌ Full world editor

We are not currently building:

- drag and drop;
- resizing;
- widget marketplace;
- free placement.

Reason:

The first version needs a strong default experience.

---

### ❌ Full theme engine

We are not currently building:

- unlimited themes;
- visual theme creator;
- CSS editor.

But:

The architecture should allow this later.

---

### ❌ Generic dashboard builder

Starlit is not:

- Notion clone;
- website builder;
- Canvas replacement.

---

### ❌ Maximum abstraction

Do not create systems only because they may be useful someday.

Every abstraction must solve an existing problem.

---

# 5. Future Vision

Long-term Starlit can become:

A customizable personal interface builder.

Possible future:

```
Settings

↓

Choose widgets

↓

Choose theme/assets

↓

Open editor

↓

Arrange dashboard

↓

Save workspace
```

---

# 6. Architecture Principles

## Principle 1

### Components do not know where things come from.

Wrong:

```
getVaultImage(
 app,
 "040 Projects/assets/focus.png"
)
```

inside component.

Correct:

```
assets.focus.background
```

Component asks for resource.

It does not manage resource.

---

## Principle 2

### Logic, visual representation and resources are separate.

Three layers:

```
Logic

↓

Components

↓

Assets / Theme / Settings
```

---

## Principle 3

### Repeated behavior becomes a machine.

If multiple components repeat:

- create element;
- add classes;
- attach events;

consider extracting helper.

But:

Do not create abstractions without repetition.

---

# 7. Folder Responsibilities

## main.ts

Role:

Plugin lifecycle.

Responsible for:

- loading plugin;
- opening dashboard;
- detecting active dashboard;
- global events.

NOT responsible for:

- creating UI;
- rendering widgets;
- styling.

---

## layouts/

Role:

Page composition.

Example:

```
homepage.ts
```

Responsible for:

- deciding which components appear;
- arranging sections.

Not responsible for:

- internal component logic.

---

## components/

Role:

Visual blocks.

Examples:

```
focus.ts
calendar.ts
hero.ts
```

A component:

- creates DOM;
- manages its own interactions;
- displays data.

A component does NOT:

- manage global settings;
- know asset paths;
- manage other components.

---

## modules/

Role:

Feature logic.

A module represents a system.

Examples:

```
modules/progress
modules/calendar
```

Contains:

- data processing;
- state;
- algorithms.

A module can serve multiple components.

---

## utils/

Role:

Small reusable tools.

Examples:

- image helpers;
- formatting;
- DOM helpers.

A util should not contain business logic.

---

## assets/

Role:

Static resources.

Examples:

- SVG;
- fonts;
- images.

---

# 8. Data Flow

Current:

```
Vault data

↓

modules

↓

components

↓

DOM
```

Future:

```
Settings

↓

Theme / Assets manager

↓

components
```

---

# 9. Component Philosophy

A component should be:

- independent;
- replaceable;
- readable.

Bad:

```
Focus component
 ├── loads images
 ├── reads settings
 ├── calculates progress
 └── saves global state
```

Good:

```
Focus component

receives:

- data
- assets
- settings

renders:
- UI
- interactions
```

---

# 10. Asset Philosophy

All visual resources should eventually be replaceable:

- icons;
- banners;
- backgrounds;
- illustrations;
- fonts.

Default:

```
Starlit assets
```

User:

```
Custom assets
```

Priority:

```
User asset

↓

Default asset
```

---

# 11. Theme Philosophy

Two layers:

## OG Starlit

The official visual identity.

Includes:

- Starlit icons;
- colors;
- decorations.

## User customization

Allows:

- icon pack;
- colors;
- images;
- fonts.

---

# 12. Layout Philosophy

Current:

Hardcoded curated layout.

This is intentional.

It is a preset.

Not a limitation.

Future:

```
Preset layout

↓

Responsive layout

↓

Custom layout editor
```

---

# 13. Responsive Strategy

Desktop and mobile are different layouts.

Do not assume:

```
desktop layout
=
mobile layout
```

Future layout data should support:

```
desktop configuration

mobile configuration
```

---

# 14. Future Extension Points

Leave connections for:

## Settings

Possible:

```
settings/
theme
assets
layout
widgets
```

---

## Asset manager

Possible:

```
default asset

↓

custom asset

↓

theme pack
```

---

## Layout engine

Possible:

```
widget definition

↓

position

↓

render
```

---

# 15. Decisions Already Made

## Why not Canvas?

Canvas provides:

- free positioning;
- nodes.

But Starlit requires:

- responsive layouts;
- widgets;
- adaptive screens.

Canvas can inspire storage format, but is not the engine.

---

## Why not make everything configurable immediately?

Because:

- complexity grows too fast;
- default experience matters;
- editing systems are harder than creating products.

---

## Why separate visual component and mechanics?

Example:

Progress:

```
components/progressBar.ts

visual


modules/progress/

logic
```

Because appearance can change without rewriting behavior.

---

# 16. Things We Avoid

Never:

- put business logic into components;
- put UI rendering into modules;
- hardcode user-specific paths everywhere;
- create classes for single functions;
- create abstractions "just in case";
- sacrifice performance for architecture.