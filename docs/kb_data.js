const WRENCHGEEKS_KB_DATA = [
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
  }
];