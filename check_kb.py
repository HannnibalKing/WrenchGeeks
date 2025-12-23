import json
import os

files = [f for f in os.listdir('docs/data') if f.endswith('.json')]
kb_items = []

for f in files:
    try:
        with open('docs/data/' + f) as file:
            data = json.load(file)
        if isinstance(data, list):
            items = data
        else:
            items = data.get('parts', [])
        for item in items:
            level = (item.get('matchLevel', '') or '').lower()
            notes = (item.get('notes', '') or '').lower()
            if any(k in level for k in ['tip', 'hack', 'guide', 'safety', 'basics', 'secret', 'theory']) or any(k in notes for k in ['how to', 'warning']):
                kb_items.append((f, item.get('partName', ''), level, notes))
    except Exception as e:
        print(f"Error in {f}: {e}")

print('KB items found:', len(kb_items))

# Categorize
electrical = 0
mechanical = 0
hacks = 0

for f, name, level, notes in kb_items:
    if level and (level.find('electrical') != -1 or level.find('sensor') != -1 or level.find('ecu') != -1 or notes.find('wire') != -1 or notes.find('volt') != -1):
        electrical += 1
    elif level and (level.find('fabrication') != -1 or level.find('welding') != -1 or level.find('mechanical') != -1 or notes.find('bolt') != -1 or notes.find('engine') != -1):
        mechanical += 1
    elif level and (level.find('hack') != -1 or level.find('tip') != -1 or level.find('trick') != -1 or level.find('secret') != -1):
        hacks += 1
    else:
        print(f'Uncategorized: {name} ({level})')

print(f'Electrical: {electrical}, Mechanical: {mechanical}, Hacks: {hacks}')