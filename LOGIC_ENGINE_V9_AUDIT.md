# Logic Engine v9 Audit Report
**Date:** December 24, 2025
**Version:** v9.0 (Live)
**Status:** Active

## 1. System Overview
The **Logic Engine v9** (`CompatibilityEngine`) is the core intelligence behind the Car Part God interchange system. It has been significantly upgraded from v8 to include **Transmission Matching**, **Advanced Lighting Logic**, and the **"Maria's Advice" Spare Tire System**.

### Core Components
*   **Class:** `CompatibilityEngine` (in `script.v9.js`)
*   **Data Sources:**
    *   `relationships.json` (Platforms, Engines, Transmissions)
    *   `lighting_interchange.json` (Headlight/Taillight Generations)
    *   `spare_tires.json` (Bolt Patterns & Hub Bores)
    *   `transmissions.json` (Transmission Families)

## 2. Scoring Algorithm (v9)
The engine calculates a compatibility score (0-100) based on a hierarchy of match types.

| Match Type | Score | Description |
| :--- | :--- | :--- |
| **Explicit Match** | **100%** | Part is explicitly listed for this vehicle in the database. |
| **Platform Mate** | **80%** | Vehicle shares the same chassis/platform (e.g., VW Golf Mk4 <-> Audi TT Mk1). |
| **Engine Share** | **70%** | Vehicle shares the same engine (e.g., Silverado 5.3L <-> Corvette LS1). |
| **Transmission Share** | **65%** | **(NEW)** Vehicle shares the same transmission (e.g., 350Z CD009 <-> G35). |

### Modifiers & Penalties
The engine applies penalties based on text analysis of part notes and vehicle attributes:

*   **Fabrication Required:** `-40` (Keywords: "cut", "weld", "drill")
*   **Adapters Required:** `-20` (Keywords: "bracket", "spacer", "adapter")
*   **Unverified Match:** `-10` (Platform/Engine match with no specific notes)
*   **Facelift Mismatch:** `-30` **(NEW)**
    *   Detects if a user has a "Pre-Facelift" car but the part is for a "Facelift/LCI" model (or vice versa).
    *   Prevents generation mismatches common in BMW (LCI) and JDM (Facelift) parts.

## 3. New Features Audit

### A. Transmission Logic
*   **Status:** Active
*   **Function:** Identifies vehicles sharing transmission codes (e.g., ZF 8HP, CD009, T56).
*   **Data Source:** `transmissions.json` linked via `relationships.transmissions`.
*   **Risk Level:** Rated at 65% (Major Mods/Match Possible) because transmission swaps often require bellhousing or driveshaft modifications even if the core unit is the same.

### B. Lighting & Facelift Logic
*   **Status:** Active
*   **Function:** "Deep Dive" analysis for Headlights and Taillights.
*   **Logic:**
    1.  Identifies if the part is a lighting component.
    2.  Checks `lighting_interchange.json` for generation details.
    3.  Scans vehicle name for year/facelift keywords (e.g., "2003", "Pre-LCI").
    4.  Scans part notes for restriction keywords (e.g., "06+", "Facelift only").
    5.  Applies `-30` penalty if a conflict is found.

### C. "Maria's Advice" (Spare Tires)
*   **Status:** Active
*   **Function:** Specialized UI for spare tire interchange.
*   **Trigger:** Vehicle belongs to a group in `spare_tires.json`.
*   **Display:** Pink-accented card (`#e91e63`) at the top of the results.
*   **Data Points:**
    *   **Bolt Pattern:** (e.g., 5x114.3)
    *   **Hub Bore:** (e.g., 67.1mm vs 60.1mm)
    *   **Advice:** Specific warnings (e.g., "Must use hub centric rings").
    *   **Donors:** Lists compatible vehicles, filtering out the user's current car.

## 4. Engine Data Audit (`relationships.json`)
The `engines` database maps vehicles to their powerplants, enabling the 70% "Engine Share" match.

**Key Engine Groups Identified:**
*   **VAG_18T:** VW Golf/Jetta/Passat, Audi A4/TT (1.8T 20v)
*   **GM_LS_GEN3:** Corvette C5, Camaro/Firebird (LS1), Silverado (Gen 1 LS)
*   **GM_LS_GEN4:** Corvette C6, GTO, TrailBlazer SS (LS2)
*   **GM_LS_TRUCK:** Silverado/Sierra/Tahoe/Suburban (4.8/5.3/6.0 Vortec)
*   **BMW_N54/N55:** E90/E92 335i, 135i, 535i
*   **HONDA_K_SERIES:** Civic Si, RSX Type-S, TSX
*   **NISSAN_VQ35:** 350Z, G35, FX35, Altima V6

## 5. Recommendations
1.  **Expand Transmission Data:** The `transmissions.json` file is new; continue populating it with more manual transmission families (e.g., Honda K-Series transmissions, Subaru 5MT/6MT).
2.  **Refine Facelift Data:** Ensure `lighting_interchange.json` covers more models beyond the initial set to fully leverage the new logic.
3.  **Monitor "Maria's Advice":** User feedback suggests this is a high-value feature. Ensure Hub Bore data is 100% accurate to prevent safety issues.
