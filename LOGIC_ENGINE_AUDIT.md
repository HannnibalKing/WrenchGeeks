# WrenchGeeks Logic Engine Audit

## Overview
The WrenchGeeks "Compatibility Engine" is a custom JavaScript class (`CompatibilityEngine`) designed to determine part fitment dynamically. Unlike traditional databases that rely on static "Year/Make/Model" lookup tables, this engine uses a **relational approach** based on shared engineering attributes (Platforms and Engines).

## How It Works

### 1. Normalization
*   **Function:** `normalize(str)`
*   **Logic:** Converts all input text (vehicle names, models) to lowercase and strips out non-alphanumeric characters.
*   **Why:** Ensures that "350Z", "350-Z", and "350 z" are all treated as the same vehicle.

### 2. Attribute Extraction
*   **Function:** `getVehicleAttributes(make, model)`
*   **Logic:**
    *   Takes the user's selected Make and Model.
    *   Scans the `relationships.json` database.
    *   Identifies the **Platform ID** (e.g., `nissan_fm` for 350Z/G35) and **Engine ID** (e.g., `vq35de`).
*   **Result:** The car is no longer just a name; it is now a set of engineering keys (`platformId`, `engineId`).

### 3. Scoring Algorithm
*   **Function:** `calculateScore(part, vehicleAttributes, make, model)`
*   **Logic:** Assigns a "Fitment Score" (0-100) based on how the part matches the vehicle.

#### Scoring Hierarchy:
1.  **Verified Record (100 Points):**
    *   The part is explicitly listed for this specific model in the JSON file.
    *   *Example:* A "350Z Intake" listed for a "350Z".

2.  **Platform Mate (80 Points):**
    *   The part is NOT listed for this model, but fits another car on the same **Platform**.
    *   *Example:* A "G35 Control Arm" is not listed for a "350Z", but both share the `nissan_fm` platform ID. The engine infers it fits.

3.  **Engine Share (70 Points):**
    *   The part fits another car with the same **Engine**.
    *   *Example:* A "Maxima Alternator" might fit a "350Z" because both use the `vq35de` engine ID.

### 4. Text Analysis (Risk Adjustment)
*   **Logic:** The engine scans the `notes` field of the part data for keywords to adjust the score.
*   **Penalties:**
    *   `"modify"`, `"drill"`, `"cut"`, `"weld"` → **-40 Points** (Requires Fabrication).
    *   `"bracket"`, `"adapter"`, `"spacer"` → **-20 Points** (Requires Minor Mods).
*   **Bonuses:**
    *   `"direct fit"`, `"bolt-on"` → **Maintains 100 Score**.

### 5. Final Output
The score determines the "Risk Level" displayed to the user:
*   **90-100:** "Direct Fit" (Green)
*   **70-89:** "Minor Mods" (Yellow)
*   **50-69:** "Major Mods" (Orange)
*   **<50:** "Custom Fab" (Red)

## Summary
This system allows WrenchGeeks to "guess" compatibility accurately. If we add a new part for a "Toyota Supra (A90)", the engine automatically knows it might fit a "BMW Z4 (G29)" because they share the `bmw_clar` platform, without us having to manually write that link.
