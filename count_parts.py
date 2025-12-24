import os
import json

data_dir = 'docs/data'
total_parts = 0
file_count = 0

print("--- Part Count by File ---")
for filename in os.listdir(data_dir):
    if filename.endswith('.json') and filename != 'relationships.json' and not filename.startswith('kb_'):
        filepath = os.path.join(data_dir, filename)
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            count = 0
            if isinstance(data, list):
                count = len(data)
            elif isinstance(data, dict) and 'parts' in data:
                count = len(data['parts'])
            
            print(f"{filename}: {count}")
            total_parts += count
            file_count += 1
        except Exception as e:
            print(f"Error reading {filename}: {e}")

print("-" * 30)
print(f"Total Files Scanned: {file_count}")
print(f"Total Parts Supported: {total_parts}")
