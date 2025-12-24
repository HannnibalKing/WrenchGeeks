import json
import os
import glob

def load_json(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading {filepath}: {e}")
        return {}

def audit_coverage():
    base_dir = "docs/data"
    
    # 1. Load Relationships (The Source of Truth for Platforms)
    relationships = load_json(os.path.join(base_dir, "relationships.json"))
    if not relationships:
        return

    all_platforms = set(relationships.get("platforms", {}).keys())
    covered_platforms = set()
    
    # 2. Scan all other files for usage
    data_files = glob.glob(os.path.join(base_dir, "*.json"))
    
    print(f"Scanning {len(data_files)} files for platform coverage...")
    
    for file_path in data_files:
        if "relationships.json" in file_path:
            continue
            
        data = load_json(file_path)
        
        # Handle different file structures
        items = []
        if isinstance(data, list):
            items = data
        elif isinstance(data, dict):
            # Check for 'parts', 'tips', 'swaps' keys
            for key in ['parts', 'tips', 'swaps', 'articles']:
                if key in data:
                    items.extend(data[key])
        
        # Check each item for platform references
        for item in items:
            # Check compatibility_smart
            if "compatibility_smart" in item:
                platforms = item["compatibility_smart"].get("platforms", [])
                covered_platforms.update(platforms)
            
            # Check direct platform key (tips.json)
            if "platform" in item:
                if isinstance(item["platform"], list):
                    covered_platforms.update(item["platform"])
                else:
                    covered_platforms.add(item["platform"])

    # 3. Calculate Results
    uncovered = all_platforms - covered_platforms
    coverage_pct = (len(covered_platforms) / len(all_platforms)) * 100
    
    print(f"\n=== COVERAGE AUDIT ===")
    print(f"Total Platforms: {len(all_platforms)}")
    print(f"Covered Platforms: {len(covered_platforms)}")
    print(f"Coverage: {coverage_pct:.1f}%")
    
    if uncovered:
        print(f"\n=== GHOST TOWNS (0 Parts/Tips) ===")
        for p in sorted(uncovered):
            print(f"- {p}")
    else:
        print("\nAll platforms have at least one part or tip!")

if __name__ == "__main__":
    audit_coverage()