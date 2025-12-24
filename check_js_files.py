import os
import re

def check_missing_files():
    # Read JS file
    with open('docs/script.v2.js', 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract dataFiles array
    match = re.search(r'const dataFiles = \[(.*?)\];', content, re.DOTALL)
    if not match:
        print("Could not find dataFiles array in script.v2.js")
        return

    # Parse JS array items
    js_files_raw = match.group(1).split(',')
    js_files = []
    for item in js_files_raw:
        clean = item.strip().strip('"').strip("'")
        if clean:
            js_files.append(os.path.basename(clean))

    # Get actual files
    actual_files = [f for f in os.listdir('docs/data') if f.endswith('.json')]

    # Compare
    missing_in_js = set(actual_files) - set(js_files)
    extra_in_js = set(js_files) - set(actual_files)

    print(f"Total files in directory: {len(actual_files)}")
    print(f"Total files in JS: {len(js_files)}")
    print(f"Missing in JS: {missing_in_js}")
    print(f"Extra in JS (files that don't exist): {extra_in_js}")

if __name__ == "__main__":
    check_missing_files()
