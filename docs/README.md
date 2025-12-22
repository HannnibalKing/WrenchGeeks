# Car Part God - Compatibility Database

## Smart Compatibility System

We have implemented a "Smart" compatibility system to reduce data entry and ensure accuracy.

### How it works

Instead of listing every single compatible vehicle for every part, we now define **Relationships** in `data/relationships.json`.

1.  **Platforms**: Define a chassis code (e.g., `PORSCHE_986_996`) and list all cars that share it.
2.  **Engines**: Define an engine code (e.g., `VAG_18T`) and list all cars that use it.

### Usage in Data Files

In your part JSON files (e.g., `fuel_system.json`), you can now use `compatibility_smart`:

```json
{
  "id": "example_part",
  "name": "Example Part",
  "compatibility_smart": {
    "engines": ["VAG_18T"],
    "platforms": ["VW_MK4"]
  }
}
```

This will automatically "fill in" all the vehicles associated with that engine or platform in the application.

### Tech Stack

*   **Core**: Modern Vanilla JavaScript (ES6+)
*   **Data**: JSON
*   **Architecture**: Relationship-based Indexing

To upgrade to a full React/Vite stack, run `npm create vite@latest` in this directory.
