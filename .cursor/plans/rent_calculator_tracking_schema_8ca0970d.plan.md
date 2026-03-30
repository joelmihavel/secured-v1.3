---
name: Rent Calculator Tracking Schema
overview: "Define a clear PostHog event schema for `/rent-calculator` and instrument key interactions: area selection, numeric input edits, and furniture rent/buy toggles, while keeping event volume clean and analysis-friendly."
todos:
  - id: define-events
    content: Add typed rent calculator tracking helpers and payload types in posthog utility
    status: completed
  - id: wire-interactions
    content: Instrument area, mode, furniture toggle, and input commit interactions with the new events
    status: completed
  - id: state-snapshot
    content: Add optional debounced state snapshot event for analytics-friendly settled state
    status: completed
  - id: validate-schema
    content: Verify naming consistency, deduping, and expected event volume in dev
    status: completed
isProject: false
---

# Rent Calculator PostHog Schema for `/rent-calculator`

## Goals

- Measure how users interact with the calculator, specifically:
  - area selection
  - numeric input edits
  - furniture mode (`rent` vs `buy`)
- Keep schema easy to query and stable over time.
- Reuse existing tracking conventions in `[/Users/srinandh/Desktop/website-v2/src/lib/posthog-tracking.ts](/Users/srinandh/Desktop/website-v2/src/lib/posthog-tracking.ts)` (`trackEvent` + typed payload helpers).

## Proposed Event Model

### 1) Page Session Event

- **Event**: `rent_calculator_viewed`
- **When**: once on page load.
- **Why**: denominator for all funnels.
- **Core props**:
  - `surface`: `"rent_calculator_page"`
  - `default_mode`: `"roommate" | "1bhk"`
  - `default_area`: string
  - `default_furniture_mode`: `"rent" | "buy"`

### 2) Area Selection Event

- **Event**: `rent_calculator_area_selected`
- **When**: user clicks an area chip in `[/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/sections/ControlsSection.tsx](/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/sections/ControlsSection.tsx)`.
- **Core props**:
  - `area_selected`: string
  - `previous_area`: string
  - `mode`: `"roommate" | "1bhk"`
  - `interaction_source`: `"area_chip"`

### 3) Mode Switch Event

- **Event**: `rent_calculator_mode_changed`
- **When**: `Shared Living` / `Solo Living` tab change in `[/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/RentCalculatorClient.tsx](/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/RentCalculatorClient.tsx)`.
- **Core props**:
  - `mode_selected`: `"roommate" | "1bhk"`
  - `previous_mode`: `"roommate" | "1bhk"`

### 4) Furniture Toggle Event

- **Event**: `rent_calculator_furniture_mode_changed`
- **When**: `Rent/Buy` toggle in `[/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/sections/ComparisonTableSection.tsx](/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/sections/ComparisonTableSection.tsx)`.
- **Core props**:
  - `furniture_mode_selected`: `"rent" | "buy"`
  - `previous_furniture_mode`: `"rent" | "buy"`
  - `mode`: `"roommate" | "1bhk"`
  - `area`: string

### 5) Input Edited Event (single generic event)

- **Event**: `rent_calculator_input_edited`
- **When**: numeric input commit (on blur / Enter), not every keystroke.
- **Core props**:
  - `input_name`: enum
    - `"flent_rent" | "trad_rent" | "trad_maint" | "trad_deposit" | "trad_brokerage" | "trad_painting"`
  - `new_value`: number
  - `previous_value`: number
  - `mode`: `"roommate" | "1bhk"`
  - `area`: string
  - `furniture_mode`: `"rent" | "buy"`
  - `edit_method`: `"typed"`

### 6) Optional “State Snapshot” Event (recommended)

- **Event**: `rent_calculator_state_updated`
- **When**: debounced (e.g., 800-1200ms) after any meaningful change.
- **Why**: gives one canonical row per settled state for analysis.
- **Core props**:
  - `mode`, `area`, `furniture_mode`
  - all effective input values (`flent_rent`, `eff_trad_rent`, `eff_maint`, `eff_deposit`, `eff_brokerage`, `trad_painting`)
  - key outputs (`flent_total`, `trad_total`, `savings`, `flent_wins`)

## Schema Conventions

- Use snake_case properties and past-tense events (consistent with existing events like `property_page_viewed`).
- Keep enums explicit and narrow (typed unions).
- Avoid free-form labels for query-critical fields.
- Never send PII.

## Implementation Placement

- Add typed event helpers in `[/Users/srinandh/Desktop/website-v2/src/lib/posthog-tracking.ts](/Users/srinandh/Desktop/website-v2/src/lib/posthog-tracking.ts)`:
  - `trackRentCalculatorViewed`
  - `trackRentCalculatorAreaSelected`
  - `trackRentCalculatorModeChanged`
  - `trackRentCalculatorFurnitureModeChanged`
  - `trackRentCalculatorInputEdited`
  - `trackRentCalculatorStateUpdated` (optional)
- Fire events from:
  - `[/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/RentCalculatorClient.tsx](/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/RentCalculatorClient.tsx)`
  - `[/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/sections/ControlsSection.tsx](/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/sections/ControlsSection.tsx)`
  - `[/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/sections/ComparisonTableSection.tsx](/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/sections/ComparisonTableSection.tsx)`
  - optionally `[/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/components/primitives/EditCell.tsx](/Users/srinandh/Desktop/website-v2/src/app/rent-calculator/components/primitives/EditCell.tsx)` for blur/commit semantics.

## Data Quality Guardrails

- Fire edit events on **commit**, not per keypress.
- Deduplicate mode/area/furniture events when selected value is unchanged.
- Add simple unit checks to prevent invalid numbers (already non-negative in input handler).
- Keep one source of truth for payload fields in typed helper functions.

## Suggested Analysis Views in PostHog

- Funnel: `rent_calculator_viewed` → `rent_calculator_area_selected` → `rent_calculator_input_edited`.
- Breakdown `rent_calculator_furniture_mode_changed` by `mode` and `area`.
- Trends on `input_name` for most-edited fields.
- Distribution of `savings` from `rent_calculator_state_updated`.

