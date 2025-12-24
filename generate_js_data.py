import json
import os

data_dir = "docs/data"
output_file = "docs/kb_data.js"

kb_files = [
    "kb_ecu.json",
    "kb_electrical.json",
    "kb_fabrication.json",
    "kb_hacks.json",
    "kb_mechanical.json",
    "kb_safety.json",
    "kb_tips.json",
    "kb_volvo_p80.json"
]

all_data = []

print("Reading KB files...")
for filename in kb_files:
    filepath = os.path.join(data_dir, filename)
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                all_data.extend(data)
            else:
                print(f"Warning: {filename} is not a list")
    except Exception as e:
        print(f"Error reading {filename}: {e}")

print(f"Total items: {len(all_data)}")

js_content = f"const WRENCHGEEKS_KB_DATA = {json.dumps(all_data, indent=2)};"

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(js_content)

print(f"Generated {output_file}")
