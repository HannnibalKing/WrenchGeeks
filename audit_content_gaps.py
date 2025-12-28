import json

# Load current data
try:
    with open('docs/data/relationships.json', 'r', encoding='utf-8') as f:
        rel_data = json.load(f)
    platforms = rel_data.get('platforms', {})
    all_platform_ids = set(platforms.keys())
    all_vehicle_names = set()
    for p_list in platforms.values():
        for v in p_list:
            all_vehicle_names.add(f"{v['make']} {v['model']}".lower())
except FileNotFoundError:
    print("Error: relationships.json not found.")
    platforms = {}
    all_vehicle_names = set()

try:
    with open('docs/data/big_mikes_tips.json', 'r', encoding='utf-8') as f:
        tips_data = json.load(f)
    tips_keywords = set()
    for tip in tips_data:
        for k in tip.get('keywords', []):
            tips_keywords.add(k.lower())
except FileNotFoundError:
    print("Error: big_mikes_tips.json not found.")
    tips_data = []
    tips_keywords = set()

# List of "Parts Bin Specials" to check for
parts_bin_candidates = {
    "Noble M12": ["noble", "mondeo", "sonata"],
    "Pagani Zonda": ["pagani", "rover", "climate"],
    "Jaguar XJ220": ["xj220", "rover", "taillights"],
    "MG SV": ["mg sv", "punto"],
    "Invicta S1": ["invicta", "passat"],
    "SSC Ultimate Aero": ["ssc", "focus"],
    "Mosler MT900": ["mosler", "corvette"],
    "Lotus Elise": ["elise", "toyota", "celica"], # We have platform, checking tips
    "Koenigsegg": ["koenigsegg", "ford"],
    "Spyker C8": ["spyker", "audi"],
    "Wiesmann": ["wiesmann", "bmw"],
    "Morgan Aero 8": ["morgan", "bmw", "mini"],
    "TVR": ["tvr", "ford", "rover"],
    "De Tomaso Pantera": ["pantera", "ford", "cleveland"],
    "Iso Grifo": ["iso", "chevy", "corvette"],
    "Facel Vega": ["facel", "chrysler"],
    "Jensen Interceptor": ["jensen", "mopar", "440"],
    "Sunbeam Tiger": ["sunbeam", "ford", "260", "289"],
    "Shelby Cobra": ["cobra", "ace", "ford"],
    "DMC DeLorean": ["delorean", "prv", "renault", "volvo"],
    "Bricklin SV-1": ["bricklin", "amc", "ford"],
    "Vector W8": ["vector", "gm", "oldsmobile"]
}

# List of Major Modern Missing Makes
modern_missing_candidates = [
    "Tesla", "Rivian", "Lucid", "Polestar", "Genesis", "Isuzu"
]

print("--- AUDIT REPORT: MISSING CONTENT ---")

print("\n[MISSING PARTS BIN TIPS]")
missing_tips = []
for car, keywords in parts_bin_candidates.items():
    # Check if any keyword combo exists in tips
    found = False
    # Simple check: if the car name is in keywords
    car_key = car.split()[0].lower()
    if car_key in tips_keywords:
        found = True
    
    if not found:
        missing_tips.append(car)

if missing_tips:
    for m in missing_tips:
        print(f" - {m}")
else:
    print(" - None! Great coverage.")

print("\n[MISSING MAJOR MAKES IN DATABASE]")
missing_makes = []
existing_makes = set()
for v_name in all_vehicle_names:
    existing_makes.add(v_name.split()[0])

for make in modern_missing_candidates:
    if make.lower() not in existing_makes:
        missing_makes.append(make)

if missing_makes:
    for m in missing_makes:
        print(f" - {m}")
else:
    print(" - None! Major makes covered.")

print("\n[RECOMMENDATION]")
print(f"Found {len(missing_tips)} potential 'Big Mike' stories to add.")
print(f"Found {len(missing_makes)} major manufacturers missing from the platform database.")
