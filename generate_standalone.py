import json
import os

data_dir = "docs/data"
output_file = "docs/kb_standalone.html"

kb_files = [
    "kb_ecu.json",
    "kb_electrical.json",
    "kb_fabrication.json",
    "kb_hacks.json",
    "kb_mechanical.json",
    "kb_safety.json",
    "kb_tips.json"
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

html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WrenchGeeks - Knowledge Base (Offline Mode)</title>
    <style>
        :root {{
            --bg-color: #0a192f;
            --card-bg: #112240;
            --text-main: #ccd6f6;
            --text-muted: #8892b0;
            --accent-color: #64ffda;
            --border-color: #233554;
        }}
        body {{
            background-color: var(--bg-color);
            color: var(--text-main);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }}
        .container {{
            max-width: 1000px;
            margin: 0 auto;
        }}
        h1 {{ color: var(--accent-color); text-align: center; }}
        .controls {{
            display: flex;
            justify-content: center;
            gap: 10px;
            margin-bottom: 30px;
            flex-wrap: wrap;
        }}
        button {{
            background: transparent;
            border: 1px solid var(--accent-color);
            color: var(--accent-color);
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
        }}
        button.active, button:hover {{
            background: var(--accent-color);
            color: var(--bg-color);
        }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
        }}
        .card {{
            background: var(--card-bg);
            padding: 20px;
            border-radius: 4px;
            border-left: 4px solid var(--accent-color);
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        }}
        .card h3 {{ margin-top: 0; color: #fff; }}
        .badge {{
            float: right;
            font-size: 0.8em;
            padding: 2px 6px;
            border-radius: 4px;
            background: rgba(100, 255, 218, 0.1);
            color: var(--accent-color);
        }}
        .tag {{
            display: inline-block;
            font-size: 0.75em;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            color: var(--text-muted);
            border: 1px solid var(--border-color);
            padding: 2px 5px;
            border-radius: 3px;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>The Archive (Standalone)</h1>
        <p style="text-align:center; color:var(--text-muted);">
            This version has all data embedded. It does not rely on external files.
        </p>

        <div class="controls">
            <button class="filter-btn active" data-filter="all">All</button>
            <button class="filter-btn" data-filter="safety">Safety</button>
            <button class="filter-btn" data-filter="mechanical">Mechanical</button>
            <button class="filter-btn" data-filter="electrical">Electrical</button>
            <button class="filter-btn" data-filter="fabrication">Fabrication</button>
            <button class="filter-btn" data-filter="hacks">Hacks</button>
            <button class="filter-btn" data-filter="ecu">ECU</button>
            <button class="filter-btn" data-filter="tips">Tips</button>
        </div>

        <div id="grid" class="grid"></div>
    </div>

    <script>
        // EMBEDDED DATA
        const kbData = {json.dumps(all_data)};

        const grid = document.getElementById('grid');
        const buttons = document.querySelectorAll('.filter-btn');

        function render(filter) {{
            grid.innerHTML = '';
            
            const items = kbData.filter(item => {{
                const cat = (item.category || '').toLowerCase();
                if (filter === 'all') return true;
                return cat === filter;
            }});

            if (items.length === 0) {{
                grid.innerHTML = '<p style="grid-column: 1/-1; text-align:center;">No items found.</p>';
                return;
            }}

            items.forEach(item => {{
                const div = document.createElement('div');
                div.className = 'card';
                
                const title = item.title || item.partName || 'Untitled';
                const content = item.content || item.notes || item.description || '';
                const severity = item.severity || item.matchLevel || '';
                const cat = item.category || 'General';

                div.innerHTML = `
                    <span class="tag">${{cat}}</span>
                    ${{severity ? `<span class="badge">${{severity}}</span>` : ''}}
                    <h3>${{title}}</h3>
                    <p>${{content}}</p>
                `;
                grid.appendChild(div);
            }});
        }}

        buttons.forEach(btn => {{
            btn.addEventListener('click', () => {{
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                render(btn.getAttribute('data-filter'));
            }});
        }});

        // Initial Render
        render('all');
    </script>
</body>
</html>
"""

with open(output_file, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"Generated {output_file}")
