import json
import os

data_dir = "docs/data"
kb_files = [
    "kb_ecu.json",
    "kb_electrical.json",
    "kb_fabrication.json",
    "kb_hacks.json",
    "kb_mechanical.json",
    "kb_safety.json",
    "kb_tips.json"
]

print("Checking KB files...")

for filename in kb_files:
    filepath = os.path.join(data_dir, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        if isinstance(data, list):
            print(f"{filename}: Loaded as LIST with {len(data)} items.")
            if len(data) > 0:
                item = data[0]
                print(f"  First item keys: {list(item.keys())}")
                if "category" in item:
                    print(f"  Category: {item['category']}")
                else:
                    print("  WARNING: No 'category' field found!")
        else:
            print(f"{filename}: Loaded as {type(data)}. Expected list.")
            
    except Exception as e:
        print(f"{filename}: ERROR - {e}")
