import json
import os
import glob

def count_stats():
    data_dir = os.path.join('docs', 'data')
    
    total_parts = 0
    total_tips = 0
    total_kb_articles = 0
    total_makes = 0
    total_models = 0
    
    # Count Parts and Tips
    for filepath in glob.glob(os.path.join(data_dir, '*.json')):
        filename = os.path.basename(filepath)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
                if filename == 'relationships.json':
                    # Count Makes and Models
                    if 'platforms' in data:
                        for platform in data['platforms'].values():
                            for car in platform:
                                total_models += 1
                    # Estimate makes (this is a rough count based on unique make names if I iterated, 
                    # but let's just count the keys in the platforms/engines for now or do a set)
                    makes = set()
                    if 'platforms' in data:
                        for platform in data['platforms'].values():
                            for car in platform:
                                if 'make' in car: makes.add(car['make'])
                    if 'engines' in data:
                        for engine in data['engines'].values():
                            for car in engine:
                                if 'make' in car: makes.add(car['make'])
                    total_makes = len(makes)

                elif filename.startswith('kb_'):
                    if isinstance(data, list):
                        total_kb_articles += len(data)
                elif filename == 'tips.json':
                     if isinstance(data, list):
                        total_tips += len(data)
                else:
                    # Likely a parts file
                    if isinstance(data, list):
                        # Check if it's a list of parts
                        if len(data) > 0 and ('partName' in data[0] or 'name' in data[0]):
                            total_parts += len(data)
                        elif len(data) > 0 and 'category' in data[0]: # Some KB might be misnamed?
                             # Actually, let's assume anything not kb_ or relationships or tips is parts
                             total_parts += len(data)
        except Exception as e:
            print(f"Error reading {filename}: {e}")

    # Count Lines of Code
    loc = 0
    files_to_count = [
        'docs/index.html',
        'docs/style.v3.css',
        'docs/script.v8.js',
        'generate_js_data.py',
        'audit_catalog.py'
    ]
    
    for file in files_to_count:
        if os.path.exists(file):
            with open(file, 'r', encoding='utf-8') as f:
                loc += len(f.readlines())

    print(f"MAKES: {total_makes}")
    print(f"MODELS: {total_models}")
    print(f"PARTS: {total_parts}")
    print(f"KB_ARTICLES: {total_kb_articles}")
    print(f"LOC: {loc}")

if __name__ == "__main__":
    count_stats()
