import json
import os
from collections import defaultdict

DATA_DIR = 'docs/data'

def load_json(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return None

def normalize(text):
    if not text: return ""
    return text.lower().strip()

def audit_catalog():
    vehicle_counts = defaultdict(set) # Make -> Set of Models
    part_counts = defaultdict(int) # Make -> Count of parts
    
    # 1. Scan Relationships (The "Truth" of what vehicles are supported structurally)
    relationships = load_json(os.path.join(DATA_DIR, 'relationships.json'))
    if relationships:
        if 'platforms' in relationships:
            for platform_id, vehicles in relationships['platforms'].items():
                for v in vehicles:
                    vehicle_counts[v['make']].add(v['model'] or v['name'])
        
        if 'engines' in relationships:
            for engine_id, vehicles in relationships['engines'].items():
                for v in vehicles:
                    vehicle_counts[v['make']].add(v['model'] or v['name'])

    # 2. Optimized: Single pass through all data files
    # Load and cache all JSON files at once to avoid repeated I/O
    data_files_cache = {}
    
    for filename in os.listdir(DATA_DIR):
        if not filename.endswith('.json') or filename == 'relationships.json' or filename.startswith('kb_'):
            continue
        
        filepath = os.path.join(DATA_DIR, filename)
        data = load_json(filepath)
        if data:
            data_files_cache[filename] = data
    
    # Process cached data
    for filename, data in data_files_cache.items():
        # Handle different file structures (list of parts vs object with 'parts' key)
        parts_list = []
        if isinstance(data, list):
            parts_list = data
        elif isinstance(data, dict) and 'parts' in data:
            parts_list = data['parts']
            
        for part in parts_list:
            if not isinstance(part, dict): continue
            
            # Check compatibility array
            if 'compatibility' in part:
                for comp in part['compatibility']:
                    make = comp.get('make')
                    if make:
                        part_counts[make] += 1
                        for model in comp.get('models', []):
                            model_name = model.get('model') or model.get('name')
                            if model_name:
                                vehicle_counts[make].add(model_name)

    # 3. Analysis
    print("=== CATALOG AUDIT REPORT ===\n")
    
    all_makes = sorted(vehicle_counts.keys())
    print(f"Total Makes Found: {len(all_makes)}")
    
    print("\n--- Vehicle Coverage by Make ---")
    for make in all_makes:
        models = sorted(list(vehicle_counts[make]))
        part_count = part_counts.get(make, 0)
        print(f"{make}: {len(models)} models, {part_count} parts references")
        # print(f"  Models: {', '.join(models[:5])}..." if len(models) > 5 else f"  Models: {', '.join(models)}")

    # 4. Identify Gaps (Subjective list of major manufacturers)
    major_makes = [
        "Ford", "Chevrolet", "Toyota", "Honda", "Nissan", "BMW", "Mercedes-Benz", 
        "Volkswagen", "Audi", "Subaru", "Mazda", "Dodge", "Jeep", "Hyundai", "Kia"
    ]
    
    print("\n--- Potential Gaps (Major Manufacturers) ---")
    for make in major_makes:
        # Normalize check
        found = False
        for existing_make in all_makes:
            if normalize(make) == normalize(existing_make):
                found = True
                if len(vehicle_counts[existing_make]) < 3:
                    print(f"[WARNING] {make} is present but has very few models ({len(vehicle_counts[existing_make])}).")
                break
        
        if not found:
            print(f"[MISSING] {make} is completely missing from the catalog.")

    # 5. Empty Data Files Check - use cached data
    print("\n--- Empty or Low Content Files ---")
    for filename, data in data_files_cache.items():
        count = 0
        if isinstance(data, list): 
            count = len(data)
        elif isinstance(data, dict) and 'parts' in data: 
            count = len(data['parts'])
        
        if count < 5:
            print(f"{filename}: Only {count} items")

if __name__ == "__main__":
    audit_catalog()
