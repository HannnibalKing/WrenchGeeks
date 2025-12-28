import json

# Load relationships (Source of Truth for Platforms)
with open('docs/data/relationships.json', 'r', encoding='utf-8') as f:
    rel_data = json.load(f)

all_platforms = set(rel_data['platforms'].keys())

# Load generated spare tires data
with open('docs/data/spare_tires.json', 'r', encoding='utf-8') as f:
    spare_data = json.load(f)

covered_platforms = set()

# spare_data is a list of groups
for group in spare_data:
    if 'vehicles' in group:
        for vehicle in group['vehicles']:
            if 'platform_id' in vehicle:
                covered_platforms.add(vehicle['platform_id'])

missing_platforms = all_platforms - covered_platforms

if missing_platforms:
    print(f"Missing {len(missing_platforms)} platforms:")
    for p in sorted(missing_platforms):
        print(p)
else:
    print("SUCCESS: All platforms are covered in spare_tires.json!")
