const WRENCHGEEKS_KB_DATA = [
  {
    "category": "ecosystem_guide",
    "title": "Toyota JZ Engine Ecosystem (2JZ-GTE vs 2JZ-GE)",
    "content": "The JZ engine family is legendary, but the differences between the Turbo (GTE) and Non-Turbo (GE) variants are critical for builders.\n\n**2JZ-GTE (Turbo):**\n*   Factory Twin Turbo.\n*   Oil Squirters: Yes (under piston cooling).\n*   Head Gasket: Multi-layer steel (MLS), lower compression (~8.5:1).\n\n**2JZ-GE (Non-Turbo):**\n*   High Compression (~10:1).\n*   Oil Squirters: No (usually).\n*   **'Na-T' Conversion:** To turbocharge a GE reliably, you typically need a thicker head gasket (to lower compression) and must drill/tap the block or use a sandwich plate for turbo oil feed. The stock GE pistons are weaker than GTE pistons but can handle ~350-400whp reliably. With GTE rods/pistons, the GE block is just as strong.",
    "severity": "Info",
    "related_parts": [
      "toyota_2jz_gte",
      "toyota_2jz_ge",
      "supra_engine"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Toyota JZ Sump Configurations",
    "content": "Sump location is the #1 physical fitment issue when swapping JZ engines.\n\n*   **Front Sump:** Found in Toyota Aristo (JZS161) and Lexus GS300/IS300. The oil pan reservoir is at the front.\n    *   *Use Case:* Fits Lexus IS300, GS300, and some older Toyotas.\n*   **Rear Sump:** Found in Toyota Supra (JZA80) and Soarer (JZZ30). The reservoir is at the rear.\n    *   *Use Case:* Required for Nissan S-Chassis (240SX), Mazda RX-7, and BMW E36/E46 swaps to clear the subframe/crossmember.\n*   **Mid Sump:** Found in some Crown models (rare).",
    "severity": "High",
    "related_parts": [
      "jz_front_sump",
      "jz_rear_sump"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Toyota 1UZ-FE V8: Rod Strength & Boost",
    "content": "The 1UZ-FE 4.0L V8 is a budget-friendly powerhouse, but not all years are equal for forced induction.\n\n*   **Pre-1995 (Non-VVTi):** Known as 'Thick Rod' engines. These connecting rods are significantly beefier. The stock bottom end can handle 8-10 psi of boost (approx 400-450whp) relatively reliably.\n*   **1995+ (and VVTi):** 'Thin Rod' engines. Toyota lightened the internals for efficiency. These rods are much weaker and are not recommended for boost without upgrading internals.",
    "severity": "High",
    "related_parts": [
      "toyota_1uz_fe",
      "lexus_ls400_engine"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Toyota/Lexus Transmission Adapters (CD009 & R154)",
    "content": "Getting a manual transmission behind a UZ or JZ often involves mixing brands.\n\n*   **R154 (Toyota 5-Speed):** Factory option for 1JZ-GTE (Soarer/Supra). Strong (holds ~500-600hp), but prices have skyrocketed. Direct fit for JZ (with correct bellhousing).\n*   **CD009 (Nissan 6-Speed):** From 350Z/G35. Extremely strong and cheaper than R154. Requires an adapter plate (e.g., Collins, Fisch) and flywheel spacer to fit JZ or UZ engines. The sheer size of the CD009 bellhousing often requires transmission tunnel hammering.",
    "severity": "Medium",
    "related_parts": [
      "nissan_cd009",
      "toyota_r154",
      "transmission_adapter"
    ]
  },
  {
    "category": "interchange",
    "title": "Lexus/Toyota Brake Upgrades (LS400 & Supra)",
    "content": "OEM Big Brake Kits for Toyota/Lexus chassis.\n\n*   **LS400 (UCF20 1995-2000) Front Calipers:** Aluminum 4-piston monoblock calipers. Very light and strong. \n    *   *Fitment:* Bolt-on upgrade for Lexus SC300/400, GS300/400. Requires RCA (Roll Center Adjusters) or specific rotors/brackets for some applications to clear wheels.\n*   **Supra TT (JZA80) Brakes:** Larger rotors and 4-pot iron (or aluminum on later models) calipers.\n    *   *Fitment:* Direct bolt-on for SC300/400 and GS chassis. The 'Holy Grail' of OEM Toyota braking.",
    "severity": "Info",
    "related_parts": [
      "ls400_calipers",
      "supra_tt_brakes"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS Guide: Iron vs Aluminum Blocks",
    "content": "Identifying GM Gen 3/4 LS-based engines in the junkyard.\n\n*   **Iron Block (Trucks):** Found in Silverado, Sierra, Tahoe, Yukon. Codes: LQ4 (6.0L), LQ9 (6.0L HO), LM7 (5.3L), LR4 (4.8L). Heavy (~200lbs+ block weight) but virtually indestructible. Great for budget turbo builds.\n*   **Aluminum Block (Cars & Some Trucks):** Found in Corvette, Camaro, GTO, Trailblazer SS, and some pickups (L33). Codes: LS1, LS2, LS3, L33. ~80-100lbs lighter than iron. Preferred for handling/track builds.",
    "severity": "Info",
    "related_parts": [
      "gm_ls_engine",
      "lq4",
      "lq9",
      "lm7",
      "ls1"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS: 4.8L vs 5.3L Identification",
    "content": "The 4.8L (LR4) and 5.3L (LM7) truck engines look identical externally. The block casting numbers (e.g., '4.8/5.3') don't tell you which one it is.\n\n**How to tell:**\n1.  **VIN Code:** Check the 8th digit of the VIN. (e.g., 'V' is often 4.8L, 'T' is 5.3L - verify specific year codes).\n2.  **Piston Shape:** Pull a spark plug and inspect the piston top with a borescope or screwdriver.\n    *   **4.8L:** Flat top pistons.\n    *   **5.3L:** Dished pistons (most common Gen 3 LM7).\n    *   *Exception:* The L33 (Aluminum 5.3L) and some Gen 4 5.3s have flat tops.",
    "severity": "Medium",
    "related_parts": [
      "gm_lr4",
      "gm_lm7"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS: Cylinder Heads (Cathedral vs Rectangle)",
    "content": "Head choice dictates intake choice and power potential.\n\n*   **Cathedral Port (Gen 3/Early Gen 4):** Tall, narrow ports. High velocity, great low-end torque.\n    *   **706 / 862:** 4.8L/5.3L heads. Small valves, small combustion chambers (bumps compression). Good for budget builds.\n    *   **243 / 799:** Found on LS6 (Corvette Z06) and LS2 (Trucks/Cars). The best factory cathedral heads. D-shaped exhaust ports, larger valves, better flow.\n*   **Rectangle Port (Gen 4):** Wide, rectangular ports. Massive flow, best for high RPM/displacement.\n    *   **821:** LS3 heads (Corvette/Camaro). Hollow stem valves (lightweight).\n    *   **823:** L92 Truck heads (6.2L). Solid valves. Almost identical flow to 821.",
    "severity": "Info",
    "related_parts": [
      "ls_cathedral_port",
      "ls_rectangle_port",
      "head_casting_243",
      "head_casting_821"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS: Intake Manifolds",
    "content": "Intake choice depends on hood clearance and head type.\n\n*   **Truck Intake:** Tallest. Best low-end torque but ugly and rarely fits under car hoods (240SX, Mustang, etc.).\n*   **TBSS / NNBS (Trailblazer SS / New Body Style):** The best factory cathedral port intake. Flows significantly better than the standard truck intake and close to aftermarket units. Still tall.\n*   **Car Intakes (LS1/LS6/LS2/LS3):** Low profile. Required for most car swaps. LS6 intake is the best factory cathedral option for low clearance.",
    "severity": "Medium",
    "related_parts": [
      "ls_truck_intake",
      "ls6_intake",
      "tbss_intake"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS: Accessory Drive Spacing",
    "content": "The harmonic balancer and pulleys come in three offsets (depths). You cannot mix and match brackets/pulleys from different offsets.\n\n1.  **Truck:** Deepest spacing (sticks out furthest from engine). Alternator mounts high driver side. Cheapest/most common.\n2.  **F-Body (Camaro/Firebird 98-02) / GTO:** Middle spacing. Alternator mounts low driver side (often interferes with frame rails/steering boxes in swaps).\n3.  **Corvette (Y-Body) / CTS-V:** Shallowest spacing (tightest to engine). Alternator mounts high driver side. Best for swaps with limited radiator clearance (e.g., Miata, S2000).",
    "severity": "High",
    "related_parts": [
      "ls_accessory_drive"
    ]
  },
  {
    "category": "ecu",
    "partName": "GM '0411' PCM Swap (The LS Holy Grail)",
    "compatibleVehicles": [
      "Chevy Silverado / Tahoe (1999-2002)",
      "Chevy Express Van (2001-2002)",
      "Chevy Camaro / Corvette (LS1)"
    ],
    "years": "1999-2002",
    "notes": "The '0411' (Service #12200411) PCM is the gold standard for Gen 3 LS swaps. It has the fastest processor for that era and supports custom operating systems (COS) for boost/nitrous via HP Tuners or EFI Live. It can replace the slower '99-'00 'black box' ECUs in trucks with a pinout swap.",
    "matchLevel": "Match - Major Mods"
  },
  {
    "category": "ecu",
    "partName": "Honda OBD1 ECU Chipping (P28 / P72 / P06)",
    "compatibleVehicles": [
      "Honda Civic (1992-1995 EG)",
      "Honda Integra (1994-1995 DC)",
      "Honda Prelude (1992-1995)"
    ],
    "years": "1992-1995",
    "notes": "Honda OBD1 ECUs are legendary. You can solder a socket into them ('chipping') to run custom tunes (Hondata, Crome, Neptune). The P28 (Civic Si) is the most common VTEC ECU. The P06 (DX) can be converted to VTEC. The P72 (GSR) controls secondary intake runners (IABs).",
    "matchLevel": "Match - Modification"
  },
  {
    "category": "ecu",
    "partName": "Ford A9L / A9P ECU (Foxbody Mustang)",
    "compatibleVehicles": [
      "Ford Mustang 5.0L (1989-1993)",
      "Ford Mustang (Mass Air Conversions)"
    ],
    "years": "1989-1993",
    "notes": "The A9L (Manual) and A9P (Auto) are the most desirable Foxbody ECUs. They have the most aggressive fuel/timing curves and work best with modifications (heads/cam/intake). Warning: 30+ year old capacitors inside these OFTEN leak and destroy the board. Open it up and check!",
    "matchLevel": "Match - Direct Fit"
  },
  {
    "category": "ecu",
    "partName": "The 'Capacitor Plague' (90s ECU Repair)",
    "compatibleVehicles": [
      "Mitsubishi Eclipse / Talon (1G DSM)",
      "Toyota Supra / Lexus LS400 (Early 90s)",
      "Ford Mustang (Foxbody)",
      "Jeep Cherokee (XJ Renix/Mopar)"
    ],
    "years": "1988-1998",
    "notes": "If your 90s car has weird electrical gremlins, fishy smells, or won't start, check the ECU capacitors. Electrolytic capacitors from this era leak acid onto the circuit board. Replacing them ($5 in parts) can save a $500 ECU. Look for bulging tops or brown goo on the board.",
    "matchLevel": "Match - Repair"
  },
  {
    "category": "ecu",
    "partName": "VW / Audi Immobilizer Defeat (Immo 2/3)",
    "compatibleVehicles": [
      "Volkswagen Golf / Jetta Mk4",
      "Audi A4 (B5/B6)",
      "Volkswagen Passat B5"
    ],
    "years": "1999-2005",
    "notes": "You cannot just swap an ECU in these cars; the Immobilizer will shut off the engine after 2 seconds. You must either: 1) Clone the EEPROM from the old ECU to the new one, 2) Use VCDS/Vag-Tacho to pair the cluster and keys, or 3) Flash an 'Immo Off' file to the ECU EEPROM.",
    "matchLevel": "Match - Tech Info"
  },
  {
    "category": "ecu",
    "partName": "How to Replace an ECU (General Guide)",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "All",
    "notes": "1. DISCONNECT BATTERY NEGATIVE terminal (wait 10 mins for capacitors to discharge). 2. Locate ECU (usually behind glovebox, in kick panel, or under hood). 3. Unplug harness connectors (be gentle with plastic tabs!). 4. Unbolt bracket. 5. Install new ECU. 6. Reconnect battery. 7. Perform 'Idle Relearn' (usually let car idle for 10-15 mins with AC off, then 10 mins with AC on).",
    "matchLevel": "Match - Guide"
  },
  {
    "category": "ecu",
    "partName": "Nissan Nistune / Daughterboard",
    "compatibleVehicles": [
      "Nissan 300ZX (Z32)",
      "Nissan Skyline (R32/R33/R34)",
      "Nissan Silvia / 240SX (S13/S14)"
    ],
    "years": "1989-2002",
    "notes": "Nissan ECUs from the 90s can be modified with a 'daughterboard' (Nistune) that allows real-time tuning via USB, just like a standalone ECU, but retaining factory driveability and sensors. Much cheaper than a full Haltech/Link setup for street cars.",
    "matchLevel": "Match - Modification"
  },
  {
    "category": "electrical",
    "partName": "Multimeter 101: The 'Continuity Trap' (Beep Test)",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "WARNING: The 'Beep' (Continuity) test only tells you the circuit is not completely open. Most meters will beep even with 50+ Ohms of resistance. A battery cable holding on by ONE strand of copper will beep, but it will fail under load. Never trust a beep for high-current circuits.",
    "matchLevel": "Critical Safety"
  },
  {
    "category": "electrical",
    "partName": "Multimeter 101: Diode Mode vs. Ohms",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "Diode Mode (Arrow symbol) sends a specific voltage to test semiconductor junctions (diodes/transistors). Ohms Mode (O) measures resistance. Do not use Diode mode to check resistance; it gives confusing readings. Use Ohms for wires/grounds, Diode for alternators/rectifiers.",
    "matchLevel": "Electrical Basics"
  },
  {
    "category": "electrical",
    "partName": "Multimeter 101: Voltage Drop (The Only Real Test)",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "Resistance checks (Ohms) can lie because the circuit is off. Voltage Drop tests the circuit ON and UNDER LOAD. 1. Turn circuit ON. 2. Put one probe on Battery Pos, other on Device Pos. 3. Reading should be < 0.5V. If it reads 2V, you are losing 2V to corrosion in that wire.",
    "matchLevel": "Pro Tip"
  },
  {
    "category": "electrical",
    "partName": "Multimeter 101: Testing Grounds (Ohms)",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "Set meter to Ohms (O). Touch one probe to the chassis (clean metal) and the other to your ground wire/pin. A perfect ground is 0.0 O. Anything under 0.5 O is good. If you see 5.0 O or higher, you have a bad ground (corrosion or loose bolt), which causes weird electrical gremlins.",
    "matchLevel": "Electrical Basics"
  },
  {
    "category": "electrical",
    "partName": "Safety: Why NOT to use a Higher Fuse",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "DANGER: Fuses are rated to protect the WIRE, not the device. If a circuit has 18-gauge wire (rated for ~10 Amps) and you put a 20A fuse in it, the wire will melt and catch fire BEFORE the fuse blows. NEVER replace a blown fuse with a higher rating.",
    "matchLevel": "Critical Safety"
  },
  {
    "category": "electrical",
    "partName": "Theory: Fuse Ratings Explained",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "A fuse is a deliberate weak point. If a 10A fuse blows, it means more than 10 Amps flowed through it. This is usually caused by a 'Short to Ground' (power wire touching metal). Putting a bigger fuse just allows more current to flow into the short, turning your wiring harness into a heater.",
    "matchLevel": "Electrical Basics"
  },
  {
    "category": "electrical",
    "partName": "Theory: Parasitic Draw Test",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "If your battery dies overnight: 1. Disconnect Negative battery terminal. 2. Set meter to Amps (A) and move red probe to the '10A' port. 3. Connect meter in SERIES between the battery post and the cable. 4. Normal draw is < 0.05 Amps (50mA). If higher, pull fuses one by one until it drops.",
    "matchLevel": "Electrical Basics"
  },
  {
    "category": "fabrication",
    "partName": "Fabrication: Welding Exhausts",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "Stainless Steel (304) expands more than mild steel when hot. Always 'back purge' (fill the inside of the pipe with Argon) when TIG welding stainless to prevent 'sugaring' (crystallization) inside the pipe, which causes turbulence and cracking. Use V-Band clamps for modularity instead of slip-fits.",
    "matchLevel": "Tech Advice"
  },
  {
    "category": "fabrication",
    "partName": "Fabrication: Rust Repair / Patch Panels",
    "compatibleVehicles": [
      "Classic Cars",
      "Trucks"
    ],
    "years": "Universal",
    "notes": "1. CUT: Cut out the rust until you see clean, shiny metal. Do not weld over rust. 2. SHAPE: Use cardboard templates to match the curve. 3. WELD: Use 'stitch welding' (short zaps spaced out) to prevent warping the panel from heat. Cool with compressed air between welds. 4. PROTECT: Coat the BACK side of the patch with weld-through primer before installing.",
    "matchLevel": "Tech Advice"
  },
  {
    "category": "fabrication",
    "partName": "Wiring: Crimping vs Soldering",
    "compatibleVehicles": [
      "Automotive Wiring"
    ],
    "years": "Universal",
    "notes": "In high-vibration automotive environments, a proper CRIMP is often better than solder. Solder creates a rigid point that can crack under vibration. Use uninsulated barrel crimps with high-quality heat shrink (adhesive lined) for the most durable, weather-tight connection.",
    "matchLevel": "Tech Advice"
  },
  {
    "category": "fabrication",
    "partName": "Painting: Rattle Can Tips",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "You CAN get pro results with spray cans. 1. PREP: Sand with 400 grit, then clean with wax/grease remover. 2. WARMTH: Put the cans in a bucket of warm water for 10 mins before spraying (increases pressure, finer mist). 3. CLEAR COAT: Use a '2K' (2-part) Clear Coat in a can (has a button on the bottom to mix hardener). It is fuel resistant and won't fade like cheap 1K clear.",
    "matchLevel": "Tech Advice"
  },
  {
    "category": "hacks",
    "partName": "Hack: The 'Dirt Dip' for Stripped Screws",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "If a screw head is slightly stripped, wet the tip of your screwdriver (saliva or water) and dip it into fine dirt, sand, or valve grinding compound. The grit fills the gaps between the tool and the screw head, providing massive extra grip to break it loose without drilling.",
    "matchLevel": "Pro Tip"
  },
  {
    "category": "hacks",
    "partName": "Safety: Brake Cleaner & Welding (DEADLY)",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "NEVER weld on metal that has been cleaned with Chlorinated Brake Cleaner (usually Red bottle). The UV light from the welding arc turns the residue into Phosgene Gas (a WWI nerve agent). It can kill you or cause permanent lung damage instantly. Use Acetone or Non-Chlorinated cleaner for weld prep.",
    "matchLevel": "Critical Safety"
  },
  {
    "category": "hacks",
    "partName": "Solvents: What NOT to use on Plastic/Rubber",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "1. ACETONE: Instantly melts ABS plastic (interior trim, sensor housings). 2. BRAKE CLEANER: Swells and destroys rubber seals, o-rings, and boots. 3. GASOLINE: Dries out rubber, causing cracking. USE: Silicone spray or soapy water for rubber. Use Isopropyl Alcohol or dedicated interior cleaner for plastics.",
    "matchLevel": "Pro Tip"
  },
  {
    "category": "hacks",
    "partName": "Hack: The 'Acetone & ATF' Penetrating Fluid",
    "compatibleVehicles": [
      "Rusted Bolts"
    ],
    "years": "Universal",
    "notes": "The best penetrating fluid isn't bought, it's made. Mix a 50/50 solution of Acetone and Automatic Transmission Fluid (ATF). Tests show this mixture penetrates rusted threads significantly better than WD-40 or PB Blaster. Shake well before use.",
    "matchLevel": "Pro Tip"
  },
  {
    "category": "hacks",
    "partName": "Cleaning: Aluminum vs. Oven Cleaner",
    "compatibleVehicles": [
      "Aluminum Heads",
      "Intakes"
    ],
    "years": "Universal",
    "notes": "NEVER use oven cleaner (Sodium Hydroxide / Lye) to clean aluminum parts. It reacts violently, turning the aluminum black and dissolving it. Use 'Aluminum Safe' degreasers (like Simple Green Aircraft or specific aluminum brighteners) or a brass wire brush.",
    "matchLevel": "Pro Tip"
  },
  {
    "category": "hacks",
    "partName": "Hack: Removing Broken Bolts (Welding Trick)",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "If a bolt snaps off flush: 1. Place a washer over the hole. 2. Weld the washer to the broken bolt stud (the heat helps break the rust bond). 3. Weld a nut to the washer. 4. Let it cool slightly (not fully). 5. Unscrew it. The heat cycle is the secret sauce.",
    "matchLevel": "Pro Tip"
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS Guide: Iron vs Aluminum Blocks",
    "content": "Identifying GM Gen 3/4 LS-based engines in the junkyard.\n\n*   **Iron Block (Trucks):** Found in Silverado, Sierra, Tahoe, Yukon. Codes: LQ4 (6.0L), LQ9 (6.0L HO), LM7 (5.3L), LR4 (4.8L). Heavy (~200lbs+ block weight) but virtually indestructible. Great for budget turbo builds.\n*   **Aluminum Block (Cars & Some Trucks):** Found in Corvette, Camaro, GTO, Trailblazer SS, and some pickups (L33). Codes: LS1, LS2, LS3, L33. ~80-100lbs lighter than iron. Preferred for handling/track builds.",
    "severity": "Info",
    "related_parts": [
      "gm_ls_engine",
      "lq4",
      "lq9",
      "lm7",
      "ls1"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS: 4.8L vs 5.3L Identification",
    "content": "The 4.8L (LR4) and 5.3L (LM7) truck engines look identical externally. The block casting numbers (e.g., '4.8/5.3') don't tell you which one it is.\n\n**How to tell:**\n1.  **VIN Code:** Check the 8th digit of the VIN. (e.g., 'V' is often 4.8L, 'T' is 5.3L - verify specific year codes).\n2.  **Piston Shape:** Pull a spark plug and inspect the piston top with a borescope or screwdriver.\n    *   **4.8L:** Flat top pistons.\n    *   **5.3L:** Dished pistons (most common Gen 3 LM7).\n    *   *Exception:* The L33 (Aluminum 5.3L) and some Gen 4 5.3s have flat tops.",
    "severity": "Medium",
    "related_parts": [
      "gm_lr4",
      "gm_lm7"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS: Cylinder Heads (Cathedral vs Rectangle)",
    "content": "Head choice dictates intake choice and power potential.\n\n*   **Cathedral Port (Gen 3/Early Gen 4):** Tall, narrow ports. High velocity, great low-end torque.\n    *   **706 / 862:** 4.8L/5.3L heads. Small valves, small combustion chambers (bumps compression). Good for budget builds.\n    *   **243 / 799:** Found on LS6 (Corvette Z06) and LS2 (Trucks/Cars). The best factory cathedral heads. D-shaped exhaust ports, larger valves, better flow.\n*   **Rectangle Port (Gen 4):** Wide, rectangular ports. Massive flow, best for high RPM/displacement.\n    *   **821:** LS3 heads (Corvette/Camaro). Hollow stem valves (lightweight).\n    *   **823:** L92 Truck heads (6.2L). Solid valves. Almost identical flow to 821.",
    "severity": "Info",
    "related_parts": [
      "ls_cathedral_port",
      "ls_rectangle_port",
      "head_casting_243",
      "head_casting_821"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS: Intake Manifolds",
    "content": "Intake choice depends on hood clearance and head type.\n\n*   **Truck Intake:** Tallest. Best low-end torque but ugly and rarely fits under car hoods (240SX, Mustang, etc.).\n*   **TBSS / NNBS (Trailblazer SS / New Body Style):** The best factory cathedral port intake. Flows significantly better than the standard truck intake and close to aftermarket units. Still tall.\n*   **Car Intakes (LS1/LS6/LS2/LS3):** Low profile. Required for most car swaps. LS6 intake is the best factory cathedral option for low clearance.",
    "severity": "Medium",
    "related_parts": [
      "ls_truck_intake",
      "ls6_intake",
      "tbss_intake"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Junkyard LS: Accessory Drive Spacing",
    "content": "The harmonic balancer and pulleys come in three offsets (depths). You cannot mix and match brackets/pulleys from different offsets.\n\n1.  **Truck:** Deepest spacing (sticks out furthest from engine). Alternator mounts high driver side. Cheapest/most common.\n2.  **F-Body (Camaro/Firebird 98-02) / GTO:** Middle spacing. Alternator mounts low driver side (often interferes with frame rails/steering boxes in swaps).\n3.  **Corvette (Y-Body) / CTS-V:** Shallowest spacing (tightest to engine). Alternator mounts high driver side. Best for swaps with limited radiator clearance (e.g., Miata, S2000).",
    "severity": "High",
    "related_parts": [
      "ls_accessory_drive"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "The Maserati Tax Guide: Dodge Parts in Italian Suits",
    "content": "Owning a modern Maserati (Ghibli, Quattroporte, Levante) doesn't have to bankrupt you. Since the Fiat-Chrysler merger, these cars share a massive amount of DNA with Dodge, Jeep, and Chrysler. Knowing which parts cross-reference can save you 80-90%.\n\n**The Golden Rule:** Never buy a part from a Maserati dealer without checking the part number on the sticker first. If it says 'Mopar', 'Valeo', or 'Bosch', you can buy it cheaper elsewhere.\n\n**Key Interchanges:**\n*   **Window Switches:** The master switch in the Ghibli/QP is physically identical to the Dodge Charger/Chrysler 300. The buttons in the GranTurismo are from the Alfa Romeo MiTo/Dodge Dart.\n*   **Infotainment:** The 'Maserati Touch Control' is just a reskinned Chrysler Uconnect 8.4 system. While the firmware is specific, the screen hardware is often shared.\n*   **Start Button:** The 'Keyless Go' button is a standard Jeep Grand Cherokee part.\n*   **HVAC Actuators:** The clicking noise in your dash? That's a $30 Dodge blend door actuator, not a $400 Maserati part.\n*   **Transmission:** The ZF 8HP is bulletproof, but Maserati charges a fortune for service. Buy the pan/filter kit for a BMW or Dodge (ZF 8HP70/50) for a fraction of the price.",
    "severity": "Info",
    "related_parts": [
      "maserati_window_switches",
      "maserati_start_button",
      "maserati_hvac_actuator",
      "zf_8hp_service_kit"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Maserati F1 Transmission Pump Hack (4200 GT / Spyder)",
    "content": "The 'Cambiocorsa' F1 transmission in the 4200 GT and Spyder is a Magneti Marelli system. The most common failure is the hydraulic pump motor burning out.\n\n**The Fix:**\n*   **Maserati Dealer:** Will sell you the entire pump assembly for ~$2,500.\n*   **The Hack:** The electric motor itself is identical to the one used in the **Alfa Romeo 156 Selespeed** and **Fiat Stilo Abarth**. You can buy just the motor for ~$300-400 and swap it onto your existing pump head. It's a direct fit and saves you thousands.",
    "severity": "High",
    "related_parts": [
      "maserati_f1_pump",
      "alfa_selespeed_motor"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Levante Air Suspension Compressor",
    "content": "The Maserati Levante rides on air suspension that is prone to compressor failure. The unit is made by WABCO.\n\n**Interchange:**\n*   This same WABCO compressor is used in the **Jeep Grand Cherokee (WK2)** and **Ram 1500**. \n*   Don't pay the Trident tax. Order the Jeep part or a WABCO aftermarket replacement for the Grand Cherokee.",
    "severity": "Medium",
    "related_parts": [
      "levante_air_compressor",
      "jeep_wk2_compressor"
    ]
  },
  {
    "category": "mechanical",
    "title": "Miata 1.6L 'Glass' Diff Warning",
    "content": "The 1990-1993 Miata (1.6L) came with a 6-inch rear differential that is notoriously weak. It WILL break with stock power if launched hard, and definitely with any turbo. \n*   **The Fix:** Swap in the entire rear end (diff, axles, driveshaft) from a 1.8L (1994-2005) Miata. The 1.8L diff (7-inch) is bulletproof up to ~350hp.",
    "severity": "Critical",
    "related_parts": [
      "miata_16_diff",
      "miata_18_torsen"
    ]
  },
  {
    "category": "hacks",
    "title": "The 'Exhintake' Cam Mod",
    "content": "On 1999-2000 (NB1) and some other BP engines, you can take the exhaust camshaft and install it on the intake side. \n*   **Why:** The exhaust cam has more duration/lift than the stock intake cam. \n*   **Result:** Cheap horsepower (~6-10whp) for the cost of a junkyard cam and a new gear. Requires drilling the cam gear for proper timing.",
    "severity": "Medium",
    "related_parts": [
      "mazda_bp_engine",
      "exhintake_cam"
    ]
  },
  {
    "category": "mechanical",
    "title": "Short Nose Crank (SNC) Failure",
    "content": "Early 1990-1991 Miatas have a 'Short Nose Crank'. The crank pulley bolt can loosen, destroying the keyway and the crankshaft tip. \n*   **ID:** Look at the crank pulley. 4 slots = Short Nose (Risk). 8 slots = Long Nose (Safe). \n*   **Fix:** Check torque frequently or perform the 'Loctite Fix' if wobble starts.",
    "severity": "High",
    "related_parts": [
      "miata_snc",
      "b6ze_engine"
    ]
  },
  {
    "category": "interchange",
    "title": "NB Top Hats on NA Suspension",
    "content": "The NB (1999-2005) shock mounts ('top hats') are designed better than the NA (1990-1997) ones, allowing for more shock travel before hitting the bump stops. Swapping NB top hats onto an NA (requires matching shocks/springs or spacers) significantly improves ride quality and handling.",
    "severity": "Medium",
    "related_parts": [
      "miata_suspension",
      "nb_top_hats"
    ]
  },
  {
    "category": "mechanical",
    "partName": "Engine Timing Belt Replacement",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "Timing belts should be replaced every 60,000-100,000 miles depending on manufacturer. Always replace tensioner, idler pulleys, and seals at the same time. If the belt breaks on an interference engine, valves will bend. Check for oil leaks that could contaminate the belt.",
    "matchLevel": "Maintenance"
  },
  {
    "category": "mechanical",
    "partName": "Brake Rotor Resurfacing vs Replacement",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "Rotors can be resurfaced if they have at least 0.020\" of material above the discard thickness (stamped on rotor). Check for runout (should be <0.002\") and parallelism. Replace if cracked, warped, or below minimum thickness.",
    "matchLevel": "Maintenance"
  },
  {
    "category": "mechanical",
    "partName": "Suspension Bushings Replacement",
    "compatibleVehicles": [
      "Universal"
    ],
    "years": "Universal",
    "notes": "Worn bushings cause vague steering, clunking, and poor handling. Press out old bushings and press in new ones using a hydraulic press. Use polyurethane for performance, rubber for comfort. Torque to spec and grease if applicable.",
    "matchLevel": "Maintenance"
  },
  {
    "category": "drivetrain",
    "title": "Nissan CD009 Transmission Guide",
    "content": "The CD009 (6-speed manual) is legendary for holding 1000+ hp, but not all Z33 transmissions are CD009s. \n\n*   **CD001-CD008 (2003-2004):** Weak synchros (especially 3rd gear). Avoid for high power.\n*   **CD009 (2005-2006):** Triple cone synchros on 1st, 2nd, 3rd. The one you want.\n*   **CD00A (2007+ / Replacement):** The latest version, even stronger.\n*   **ID:** Look for the shifter bracket. CD009s have a specific casting mark, but the only sure way is the VIN or case stickers. 'CD0' on the case doesn't guarantee it's a 009.",
    "severity": "High",
    "related_parts": [
      "nissan_cd009",
      "nissan_350z_transmission"
    ]
  },
  {
    "category": "brakes",
    "title": "Akebono Big Brake Upgrade",
    "content": "The 'Akebono' brakes from the 370Z Sport / G37 Sport are a massive upgrade for 350Z, G35, and S-Chassis cars.\n*   **Specs:** 14.0\" Front Rotors (4-Piston), 13.8\" Rear Rotors (2-Piston).\n*   **Fitment:** Requires adapter brackets for 350Z/G35 (non-Sport). Requires 18\" or larger wheels with good clearance (high disk).",
    "severity": "Medium",
    "related_parts": [
      "akebono_brakes",
      "nissan_370z_sport"
    ]
  },
  {
    "category": "mechanical",
    "title": "VQ35 Engine Hierarchy",
    "content": "Not all VQ35s are equal.\n*   **DE (2003-2006):** Single throttle body. Known for oil consumption but cheap. 'RevUp' versions (2005-06 Manuals) have higher redline but WORSE oil consumption.\n*   **HR (2007-2008):** Dual throttle bodies. Much stronger block, higher revs. The 'High Rev' engine. Beware of the internal oil gallery gasket failure (low oil pressure death).\n*   **VHR (370Z/G37):** 3.7L with VVEL. Complex head, great power.",
    "severity": "High",
    "related_parts": [
      "vq35de",
      "vq35hr",
      "vq37vhr"
    ]
  },
  {
    "category": "hacks",
    "title": "3.69 Diff Gear Swap",
    "content": "The manual 370Z/G37 Sport comes with a 3.69 final drive ratio. Swapping this diff (or ring & pinion) into an Auto G35/350Z (usually 3.3) or a base manual (3.5) is a cheap way to get significantly faster acceleration at the cost of top speed/highway RPM.",
    "severity": "Medium",
    "related_parts": [
      "nissan_r200_diff",
      "final_drive_369"
    ]
  },
  {
    "category": "safety",
    "title": "If it smells wrong, stop.",
    "content": "Burning coolant, hot brakes, fried wiring \u2014 your nose catches danger before your eyes do.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "If a bolt fights you, it's telling you something.",
    "content": "Don't force it. Heat it, soak it, tap it, or rethink the angle.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "Batteries don't care about your feelings.",
    "content": "Treat every battery like it's ready to arc. Remove negative terminal first, reconnect last.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "Gravity is undefeated.",
    "content": "Anything heavy will fall the moment you stop respecting it \u2014 hoods, rotors, transmissions, springs.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "If you drop a tool, step back \u2014 not forward.",
    "content": "Old-timers learned this after stepping on a falling pry bar or wrench.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "Lefty loosey, righty tighty \u2014 unless it ain't.",
    "content": "Some components use reverse threads: fan clutches, some axle nuts, certain suspension parts.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "If the car just came off the road, it's too hot to touch.",
    "content": "Let it cool. Radiators, manifolds, and brake rotors stay hot longer than you think.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "Springs and tensioned parts are the silent killers.",
    "content": "Coil springs, serpentine tensioners, and clutch assemblies can launch tools \u2014 or fingers.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "Never trust a previous mechanic.",
    "content": "Always double-check torque, routing, and fastener type. People do wild things.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "If you're tired, you're dangerous.",
    "content": "Mistakes happen when you rush or wrench half-asleep.",
    "severity": "Critical"
  },
  {
    "category": "safety",
    "title": "Things to Look Out For (Across All Vehicle Types)",
    "content": "Rust around suspension mounts \u2014 catastrophic failure risk. Cracked or swollen brake hoses \u2014 they can burst under pressure. Loose or missing wheel fasteners \u2014 wheels can walk off. Fuel line seepage or damp spots \u2014 fire hazard. Battery corrosion or bulging \u2014 risk of acid leaks or explosion. Worn engine/transmission mounts \u2014 can cause sudden shifts or binding. Rodent damage to wiring \u2014 especially in parked or stored vehicles. Old or brittle vacuum lines \u2014 cause stalling, surging, or lean conditions. Loose heat shields or exhaust hangers \u2014 can drop or rattle into moving parts. Tire dry rot \u2014 even if tread looks good.",
    "severity": "Critical"
  },
  {
    "category": "tips",
    "title": "IMS Bearing Failure (The Elephant in the Room)",
    "content": "The Intermediate Shaft (IMS) bearing on M96 engines (1997-2005) is a sealed ball bearing that can fail catastrophically, destroying the engine. It is strongly recommended to replace this bearing with a ceramic or oil-fed upgrade whenever the transmission is removed (e.g., for a clutch job).",
    "severity": "Critical",
    "related_parts": [
      "porsche_ims_bearing"
    ]
  },
  {
    "category": "tips",
    "title": "Air Oil Separator (AOS) Failure",
    "content": "If your 996/986 starts smoking heavily (white smoke) on startup or under cornering, the AOS diaphragm has likely failed. This allows oil to be sucked into the intake. If ignored, it can cause hydrolock.",
    "severity": "High",
    "related_parts": [
      "porsche_aos_996"
    ]
  },
  {
    "category": "tips",
    "title": "General Maintenance Tip",
    "content": "Always check fluid levels when the engine is cold. Hot fluids expand and give false readings. Use the dipstick for oil, and check the reservoir for other fluids.",
    "severity": "Medium",
    "related_parts": []
  },
  {
    "category": "mechanical",
    "title": "Nissan CD009 Transmission Identification",
    "content": "The CD009 (and its replacement, the CD00A) is the strongest version of the Nissan 6-speed manual found in the 350Z and G35. \n\n**Identification:**\n*   **Early (CD001-CD008):** Found in 2003-2004 models. Prone to synchro grinding (especially 3rd gear). Avoid for high power.\n*   **CD009 (2005-2006):** Found in 'RevUp' engine models and late DEs. Features triple-cone synchros on 1st, 2nd, and 3rd, and double-cone on 4th. The case usually has 'CD009' stamped or cast near the shifter, but not always. The surest sign is the VIN year or a physical inspection of the synchros.\n*   **CD00A:** The current service replacement part from Nissan. It is functionally identical to the CD009 but with minor casting updates.\n\n**Swap Notes:** The CD009 bellhousing bolt pattern fits all VQ35DE, VQ35HR, and VQ37VHR engines, but the starter location and clutch slave cylinder setup differ between DE (external slave) and HR/VHR (internal CSC).",
    "severity": "Info",
    "related_parts": [
      "nissan_cd009",
      "nissan_cd00a",
      "vq35de_transmission"
    ]
  },
  {
    "category": "interchange",
    "title": "Akebono Big Brake Upgrade (Nissan Z/G)",
    "content": "The 'Sport Package' brakes from the 370Z (Z34) and G37 (V36) are a massive upgrade for older Nissan chassis (350Z, S13, S14, S15).\n\n**Specs:**\n*   **Front:** 4-Piston Calipers, 14.0\" (355mm) Rotors.\n*   **Rear:** 2-Piston Calipers, 13.8\" (350mm) Rotors.\n\n**Fitment:**\n*   **370Z / G37:** Direct bolt-on for base models (requires 19\" wheels or specific 18\"s with clearance).\n*   **350Z (Z33) / G35 (V35):** Requires adapter brackets (caliper mounting spacing is different). The brake lines also differ (banjo bolt vs. direct line).\n*   **S-Chassis (240SX):** Requires adapter brackets and usually 17\"+ wheels with low offset.",
    "severity": "High",
    "related_parts": [
      "nissan_akebono_calipers",
      "nissan_370z_brakes",
      "infiniti_g37_brakes"
    ]
  },
  {
    "category": "mechanical",
    "title": "Miata 1.6L vs 1.8L Differentials (The 'Glass' Diff)",
    "content": "The rear differential is the weak link in early Miatas.\n\n*   **1.6L (1990-1993):** Uses a 6-inch ring gear. Known as the 'Glass Diff'. It is extremely fragile and can break even at stock power levels if launched hard. Avoid spending money on LSDs for this unit.\n*   **1.8L (1994-2005):** Uses a 7-inch ring gear. Significantly stronger. Can handle 250+ whp reliably. \n\n**Upgrade Path:** If you have a 1.6L NA, the best upgrade is to swap the entire rear subframe, driveshaft, and axles from a 1.8L car. The Torsen LSD found in 1994+ 'R' package and some 'M' editions is the holy grail for street/track builds.",
    "severity": "Critical",
    "related_parts": [
      "mazda_miata_diff",
      "mazda_torsen_lsd",
      "mazda_viscous_lsd"
    ]
  },
  {
    "category": "hacks",
    "title": "The 'Exhintake' Cam Mod (Mazda BP Engine)",
    "content": "A legendary budget power mod for the Mazda 1.8L BP engine (NA/NB).\n\n**The Hack:** The exhaust camshaft from a BP engine has a duration and lift profile that works aggressively well on the *intake* side. By sourcing a second exhaust cam and installing it in the intake position, you gain duration (typically ~251\u00b0 vs stock ~240\u00b0) and lift.\n\n**The Catch:** You cannot just bolt it in. You must either:\n1.  Drill a new dowel pin hole in the cam gear to correct the timing.\n2.  Use an adjustable cam gear to dial out the phase difference.\n\n**Result:** A cheap 6-10whp gain at the top end, often for the cost of a junkyard camshaft.",
    "severity": "Medium",
    "related_parts": [
      "mazda_bp_engine",
      "mazda_miata_cams"
    ]
  },
  {
    "category": "mechanical",
    "title": "Nissan VQ35DE vs. RevUp vs. HR",
    "content": "Not all 3.5L VQ engines are created equal. Knowing the difference is vital for swaps and parts ordering.\n\n*   **VQ35DE (2003-2006):** Single throttle body. Intake collector is flat on top. Redline ~6600. Known for oil consumption in later years.\n*   **VQ35DE 'RevUp' (2005-2006 35th Anniv/Track):** Variable exhaust timing added. Redline 7000. Notorious for high oil consumption.\n*   **VQ35HR (2007-2008 350Z):** 'High Rev'. Dual throttle bodies. Symmetrical intake. Redline 7500. 80% different internal parts. Much stronger block, taller deck height. Transmission bolt pattern is same, but slave cylinder is internal (CSC).\n*   **VQ37VHR (370Z/G37):** The 3.7L evolution of the HR. Adds VVEL (Variable Valve Event and Lift).",
    "severity": "Info",
    "related_parts": [
      "nissan_vq35de",
      "nissan_vq35hr",
      "nissan_vq37vhr"
    ]
  },
  {
    "category": "safety",
    "title": "Miata 'Short Nose' Crank Failure (1990-1991)",
    "content": "Early 1.6L Miatas (1990-early 1991) have a crankshaft with a shorter 'nose' (keyway area) for the crank pulley bolt. \n\n**The Issue:** If the crank bolt is not torqued perfectly (or if it loosens over time), the keyway will wallow out, causing the crank pulley to wobble. This eventually destroys the crankshaft tip, requiring an engine replacement or a risky 'Loctite fix'.\n\n**Identification:** Check the crank pulley. If it has 4 slots, it's likely a Short Nose. If it has 8 slots, it's the updated Long Nose (safer). VIN cutoff is roughly ending in 209447.",
    "severity": "Critical",
    "related_parts": [
      "mazda_b6ze_crank",
      "mazda_miata_crank_pulley"
    ]
  },
  {
    "category": "interchange",
    "title": "Nissan 370Z / G37 Rear Diff Ratios",
    "content": "Swapping differential pumpkins is a popular way to change final drive ratios in the Z/G platform.\n\n*   **Manual 370Z/G37:** 3.69 ratio. Good balance.\n*   **Automatic 370Z/G37:** 3.36 ratio. Longer gears for highway cruising.\n*   **Manual 350Z/G35:** 3.54 ratio.\n*   **Automatic 350Z/G35:** 3.36 ratio.\n\n**The Upgrade:** Installing a Manual 370Z diff (3.69) into an Auto 370Z (3.36) provides a significant acceleration bump (effectively 'shortening' the gears). Ensure you match the input flange (3-bolt vs 4-bolt) or swap the flange from your old diff.",
    "severity": "Medium",
    "related_parts": [
      "nissan_r200_diff",
      "nissan_370z_diff"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Toyota JZ Engine Ecosystem (2JZ-GTE vs 2JZ-GE)",
    "content": "The JZ engine family is legendary, but the differences between the Turbo (GTE) and Non-Turbo (GE) variants are critical for builders.\n\n**2JZ-GTE (Turbo):**\n*   Factory Twin Turbo.\n*   Oil Squirters: Yes (under piston cooling).\n*   Head Gasket: Multi-layer steel (MLS), lower compression (~8.5:1).\n\n**2JZ-GE (Non-Turbo):**\n*   High Compression (~10:1).\n*   Oil Squirters: No (usually).\n*   **'Na-T' Conversion:** To turbocharge a GE reliably, you typically need a thicker head gasket (to lower compression) and must drill/tap the block or use a sandwich plate for turbo oil feed. The stock GE pistons are weaker than GTE pistons but can handle ~350-400whp reliably. With GTE rods/pistons, the GE block is just as strong.",
    "severity": "Info",
    "related_parts": [
      "toyota_2jz_gte",
      "toyota_2jz_ge",
      "supra_engine"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Toyota JZ Sump Configurations",
    "content": "Sump location is the #1 physical fitment issue when swapping JZ engines.\n\n*   **Front Sump:** Found in Toyota Aristo (JZS161) and Lexus GS300/IS300. The oil pan reservoir is at the front.\n    *   *Use Case:* Fits Lexus IS300, GS300, and some older Toyotas.\n*   **Rear Sump:** Found in Toyota Supra (JZA80) and Soarer (JZZ30). The reservoir is at the rear.\n    *   *Use Case:* Required for Nissan S-Chassis (240SX), Mazda RX-7, and BMW E36/E46 swaps to clear the subframe/crossmember.\n*   **Mid Sump:** Found in some Crown models (rare).",
    "severity": "High",
    "related_parts": [
      "jz_front_sump",
      "jz_rear_sump"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Toyota 1UZ-FE V8: Rod Strength & Boost",
    "content": "The 1UZ-FE 4.0L V8 is a budget-friendly powerhouse, but not all years are equal for forced induction.\n\n*   **Pre-1995 (Non-VVTi):** Known as 'Thick Rod' engines. These connecting rods are significantly beefier. The stock bottom end can handle 8-10 psi of boost (approx 400-450whp) relatively reliably.\n*   **1995+ (and VVTi):** 'Thin Rod' engines. Toyota lightened the internals for efficiency. These rods are much weaker and are not recommended for boost without upgrading internals.",
    "severity": "High",
    "related_parts": [
      "toyota_1uz_fe",
      "lexus_ls400_engine"
    ]
  },
  {
    "category": "ecosystem_guide",
    "title": "Toyota/Lexus Transmission Adapters (CD009 & R154)",
    "content": "Getting a manual transmission behind a UZ or JZ often involves mixing brands.\n\n*   **R154 (Toyota 5-Speed):** Factory option for 1JZ-GTE (Soarer/Supra). Strong (holds ~500-600hp), but prices have skyrocketed. Direct fit for JZ (with correct bellhousing).\n*   **CD009 (Nissan 6-Speed):** From 350Z/G35. Extremely strong and cheaper than R154. Requires an adapter plate (e.g., Collins, Fisch) and flywheel spacer to fit JZ or UZ engines. The sheer size of the CD009 bellhousing often requires transmission tunnel hammering.",
    "severity": "Medium",
    "related_parts": [
      "nissan_cd009",
      "toyota_r154",
      "transmission_adapter"
    ]
  },
  {
    "category": "interchange",
    "title": "Lexus/Toyota Brake Upgrades (LS400 & Supra)",
    "content": "OEM Big Brake Kits for Toyota/Lexus chassis.\n\n*   **LS400 (UCF20 1995-2000) Front Calipers:** Aluminum 4-piston monoblock calipers. Very light and strong. \n    *   *Fitment:* Bolt-on upgrade for Lexus SC300/400, GS300/400. Requires RCA (Roll Center Adjusters) or specific rotors/brackets for some applications to clear wheels.\n*   **Supra TT (JZA80) Brakes:** Larger rotors and 4-pot iron (or aluminum on later models) calipers.\n    *   *Fitment:* Direct bolt-on for SC300/400 and GS chassis. The 'Holy Grail' of OEM Toyota braking.",
    "severity": "Info",
    "related_parts": [
      "ls400_calipers",
      "supra_tt_brakes"
    ]
  },
  {
    "category": "mechanical",
    "title": "Volvo 850 T-5R / 850 R Identification",
    "content": "The '6750' is a typo for the legendary Volvo 850 T-5R (1995) and 850 R (1996-1997). These P80 platform cars are the holy grail of 90s Volvo performance. The T-5R was a limited run (Yellow/Black/Green) with a 15G turbo. The 850 R followed with mass production. Note: Euro Manual 850 Rs got the bigger 16T turbo and LSD (M59 transmission), while US/Auto versions kept the 15G.",
    "severity": "Info",
    "related_parts": [
      "volvo_850_t5r",
      "volvo_850_r",
      "p80_platform"
    ]
  },
  {
    "category": "interchange",
    "title": "P80 Platform 'Lego' Interchange",
    "content": "The Volvo P80 platform is highly modular. Most mechanical parts are interchangeable between the 850 (1993-1997), S70/V70 (1998-2000), and C70 (1998-2004). You can often bolt newer parts (brakes, turbos, manifolds) from the 1999-2000 models onto an older 850.",
    "severity": "High",
    "related_parts": [
      "volvo_s70",
      "volvo_v70",
      "volvo_c70"
    ]
  },
  {
    "category": "hacks",
    "title": "The 'Japan' Manifold Upgrade",
    "content": "The best factory exhaust manifold for an 850 is the 'Japan' or 'R' manifold (Part # 30637921) found on 2004-2007 S60 R / V70 R models. It flows significantly better than the stock 850 manifold and is a direct bolt-on to the 5-cylinder head. Look for it on P2 chassis R models in the junkyard.",
    "severity": "High",
    "related_parts": [
      "volvo_r_manifold",
      "volvo_s60r",
      "volvo_v70r"
    ]
  },
  {
    "category": "mechanical",
    "title": "Mitsubishi TD04HL Turbo Hierarchy",
    "content": "Stock 850 turbos run out of breath quickly. Upgrade path: 15G (Stock T-5R) -> 16T (1998 S70 T5) -> 18T (V70 R Phase 3) -> 19T (2000 V70 R AWD). The 19T is the 'Holy Grail' of stock-frame turbos, good for 330hp+. Warning: Check your exhaust flange type (Conical, Straight, or Angled) before buying.",
    "severity": "Medium",
    "related_parts": [
      "td04hl_15g",
      "td04hl_16t",
      "td04hl_18t",
      "td04hl_19t"
    ]
  },
  {
    "category": "hacks",
    "title": "302mm Brake Upgrade (OEM+)",
    "content": "The cheapest big brake kit for an 850. You need the caliper brackets (Part # 8602456) and 302mm rotors from a 1999-2000 V70 R or C70. You reuse your existing calipers; the bracket just moves them further out for more leverage. Requires 16-inch wheels minimum.",
    "severity": "Medium",
    "related_parts": [
      "volvo_302mm_brakes",
      "volvo_8602456"
    ]
  },
  {
    "category": "mechanical",
    "title": "Whiteblock Internals: N vs RN",
    "content": "The 850 uses the 'N' engine (1993-1998). The newer 'RN' engines (1999+, found in S60/V70) feature lighter cranks, longer rods, and better flowing heads. You can swap an RN block (e.g., from a 2002 S60 T5) into an 850 for a stronger base, but keep your original manifolds and sensors.",
    "severity": "High",
    "related_parts": [
      "volvo_whiteblock",
      "volvo_rn_engine"
    ]
  },
  {
    "category": "tips",
    "title": "Junkyard Gold: 1998 S70 T5",
    "content": "If you see a 1998 S70 T5 in the yard, grab the ECU (tunable M4.4), the 16T turbo (straight flange), and the White Injectors (350cc). These are perfect upgrades for a base 850 Turbo.",
    "severity": "Medium",
    "related_parts": [
      "volvo_s70_t5",
      "bosch_m4.4"
    ]
  }
];