# Logic Engine Improvement Plan

## 1. Add "Transmission" Logic
**Current State:** The engine only checks `platformId` and `engineId`.
**Problem:** A "CD009 Transmission" fits almost any VQ35DE car, but the engine currently only links it via the *Engine* ID. It doesn't know that the *Transmission* itself is a shared component (e.g., 350Z and G35 Manuals share a trans, but Autos share a different one).
**Improvement:** Add a `transmissionId` attribute to `relationships.json` and the `CompatibilityEngine`.
*   *Benefit:* Better accuracy for drivetrain swaps (e.g., "Does this shifter fit my car?").

## 2. Year Range Validation
**Current State:** The engine ignores years. If a part fits a "2003 350Z", it assumes it fits a "2008 350Z".
**Problem:** The 2007+ 350Z (HR engine) has a different hood, intake, and slave cylinder than the 2003-2006 (DE engine). The current engine might falsely recommend a DE intake for an HR car.
**Improvement:** Add `yearCheck(partYears, vehicleYears)` logic.
*   *Benefit:* Prevents "facelift" incompatibility issues.

## 3. "Generation" Awareness
**Current State:** It relies on `platformId`.
**Problem:** Some platforms span decades (e.g., Chevy Small Block). A "Platform Mate" match might suggest a 1970 part for a 1990 car if the platform ID isn't granular enough.
**Improvement:** Split platforms into generations (e.g., `mustang_sn95` vs `mustang_s197` instead of just `mustang`).
*   *Note:* We are already doing this partially (e.g., `nissan_fm`), but we need to be strict about it.

## 4. Enhanced Keyword Penalties
**Current State:** Checks for "modify", "drill", "cut".
**Improvement:** Add more specific electrical/software keywords.
*   `"harness"` / `"pinout"` -> **-15 Points** (Wiring required).
*   `"flash"` / `"tune"` / `"coding"` -> **-30 Points** (Software required).
*   `"JDM"` -> **-10 Points** (Might need harness extension for RHD->LHD).

## 5. "Confidence Score" Display
**Current State:** Shows "Direct Fit", "Minor Mods", etc.
**Improvement:** Display the actual % score to the user (e.g., "80% Match - Platform Mate").
*   *Benefit:* Transparency. Users trust numbers.

## 6. Reverse Compatibility (The "Donor" Search)
**Current State:** "I have a Car, what Parts fit?"
**Improvement:** "I have a Part (e.g., LS1 Engine), what Cars can I put it in?"
*   *Benefit:* Huge for engine swappers. We have the data, we just need a UI for it.
