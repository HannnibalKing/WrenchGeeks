class CompatibilityEngine {
    constructor(relationships) {
        this.relationships = relationships;
    }

    normalize(str) {
        return str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
    }

    getVehicleAttributes(make, model) {
        const attributes = {
            platformId: null,
            engineId: null,
            yearRange: null
        };

        const target = this.normalize(model);

        // Find Platform
        if (this.relationships.platforms) {
            for (const [id, vehicles] of Object.entries(this.relationships.platforms)) {
                const match = vehicles.find(v => {
                    if (v.make !== make) return false;
                    const vName = this.normalize(v.model || v.name);
                    return vName === target || vName.includes(target) || target.includes(vName);
                });
                if (match) {
                    attributes.platformId = id;
                    attributes.yearRange = match.years;
                }
            }
        }

        // Find Engine
        if (this.relationships.engines) {
            for (const [id, vehicles] of Object.entries(this.relationships.engines)) {
                const match = vehicles.find(v => {
                    if (v.make !== make) return false;
                    const vName = this.normalize(v.model || v.name);
                    return vName === target || vName.includes(target) || target.includes(vName);
                });
                if (match) {
                    attributes.engineId = id;
                    if (!attributes.yearRange) attributes.yearRange = match.years;
                }
            }
        }
        
        return attributes;
    }

    calculateScore(part, vehicleAttributes, make, model) {
        let score = 0;
        let breakdown = {
            source: "Unknown",
            base: 0,
            modifiers: []
        };

        const target = this.normalize(model);

        // 1. Determine Base Match Type
        let explicitMatch = null;
        if (part.compatibility) {
            part.compatibility.forEach(group => {
                if (group.make === make) {
                    const modelMatch = group.models.find(m => {
                        const mName = this.normalize(m.name || m.model);
                        return mName === target || mName.includes(target) || target.includes(mName);
                    });
                    if (modelMatch) explicitMatch = modelMatch;
                }
            });
        }

        if (explicitMatch) {
            score = 100;
            breakdown.source = "Verified Record";
            breakdown.base = 100;
        } else if (part.compatibility_smart?.platforms?.includes(vehicleAttributes.platformId)) {
            score = 80;
            breakdown.source = "Platform Mate";
            breakdown.base = 80;
        } else if (part.compatibility_smart?.engines?.includes(vehicleAttributes.engineId)) {
            score = 70;
            breakdown.source = "Engine Share";
            breakdown.base = 70;
        }

        // 2. Apply Modifiers based on Notes (Text Analysis)
        if (explicitMatch) {
            const notes = (explicitMatch.notes || "").toLowerCase();
            if (notes.includes("modify") || notes.includes("drill") || notes.includes("cut") || notes.includes("weld")) {
                score -= 40;
                breakdown.modifiers.push("Requires Fabrication (-40)");
            } else if (notes.includes("bracket") || notes.includes("adapter") || notes.includes("spacer") || notes.includes("upgrade")) {
                score -= 20;
                breakdown.modifiers.push("Requires Adapters/Mods (-20)");
            } else if (notes.includes("direct fit") || notes.includes("bolt-on") || notes.includes("plug and play") || notes.includes("stock")) {
                // Keep at 100
                breakdown.modifiers.push("Direct Fit Verified");
            }
        } else {
            // For Platform/Engine matches without explicit notes, assume some risk
            if (score > 0) {
                score -= 10; // Uncertainty penalty
                breakdown.modifiers.push("Unverified Fitment (-10)");
            }
        }

        return { total: Math.max(0, Math.min(score, 100)), breakdown };
    }
    
    getRiskLevel(score) {
        if (score >= 90) return { level: "Direct Fit", cssClass: "match-perfect" };
        if (score >= 70) return { level: "Minor Mods", cssClass: "match-good" };
        if (score >= 50) return { level: "Major Mods", cssClass: "match-possible" };
        return { level: "Custom Fab", cssClass: "match-possible" };
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let partsData = [];
    let tipsData = [];
    let vehicleIndex = {}; 
    let compatibilityEngine = null;

    const makeSelect = document.getElementById("makeSelect");
    const modelSelect = document.getElementById("modelSelect");
    const resultsSection = document.getElementById("results");
    const partsList = document.getElementById("partsList");
    const donorList = document.getElementById("donorList");
    const donorVehicles = document.getElementById("donorVehicles");
    const tipsList = document.getElementById("tipsList");
    const partDetailsSection = document.getElementById("partDetails");
    const backButton = document.getElementById("backButton");
    const selectedVehicleName = document.getElementById("selectedVehicleName");
    const makeLoadStatus = document.getElementById("makeLoadStatus");
    const subsystemSelect = document.getElementById("subsystemSelect");
    const yearSelect = document.getElementById("yearSelect");
    const searchButton = document.getElementById("searchButton");

    const dataFiles = [
        "data/relationships.json",
        "data/tips.json",
        "data/fuel_system.json",
        "data/electrical_sensors.json",
        "data/suspension_steering.json",
        "data/brakes.json",
        "data/engine_mechanical.json",
        "data/cooling_hvac.json",
        "data/body_interior.json",
        "data/drivetrain.json",
        "data/body_exterior.json",
        "data/legacy_swaps.json",
        "data/interchange_plus.json",
        "data/engine_swaps_master.json",
        "data/mega_interchange.json",
        "data/old_timer_secrets.json",
        "data/maintenance_ref.json",
        "data/maintenance_ref_part2.json",
        "data/universal_parts.json",
        "data/badge_engineering.json",
        "data/global_platforms.json",
        "data/jdm_euro_legends.json",
        "data/offroad_legends.json",
        "data/euro_vag_secrets.json",
        "data/aussie_muscle.json",
        "data/kei_car_secrets.json",
        "data/american_muscle.json",
        "data/french_connection.json",
        "data/heavy_duty_diesel.json",
        "data/motorcycle_interchange.json",
        "data/classic_trucks.json",
        "data/truck_car_interchange.json",
        "data/interior_interchange.json",
        "data/tech_guides.json",
        "data/fabrication_tips.json",
        "data/workshop_hacks.json",
        "data/electrical_basics.json"
    ];

    let relationships = { engines: {}, platforms: {} };

    Promise.all(dataFiles.map(file => fetch(`${file}?v=${new Date().getTime()}`).then(resp => {
            if (!resp.ok) throw new Error(`Failed to load ${file}: ${resp.status}`);
            return resp.json();
        }).catch(err => { throw new Error(`Fetch error for ${file}: ${err.message}`); })))
        .then(allData => {
            const relationshipData = allData.find(d => d.platforms || d.engines);
            if (relationshipData) {
                relationships = relationshipData;
                compatibilityEngine = new CompatibilityEngine(relationships);
            }
            
            partsData = allData.filter(d => d.parts).flatMap(d => d.parts);
            tipsData = allData.filter(d => d.tips).flatMap(d => d.tips);

            // Populate index from Relationships (so all vehicles appear, even without parts)
            if (relationships.platforms) {
                Object.values(relationships.platforms).flat().forEach(v => {
                    addToIndex(v.make, [v], null); // Pass null as part to just register the vehicle
                });
            }
            if (relationships.engines) {
                Object.values(relationships.engines).flat().forEach(v => {
                    addToIndex(v.make, [v], null);
                });
            }

            buildIndex(partsData);
            populateMakes();
            populateSubsystems();
            const totalMakes = Object.keys(vehicleIndex).length;
            const totalModels = Object.values(vehicleIndex).reduce((acc, models) => acc + Object.keys(models).length, 0);
            const totalParts = partsData.length;
            if (makeLoadStatus) {
                makeLoadStatus.textContent = totalMakes > 0
                    ? `Loaded ${totalMakes} makes / ${totalModels} models / ${totalParts} parts`
                    : "No makes loaded";
            }
        })
        .catch(err => {
            console.error("Error loading data:", err);
            resultsSection.innerHTML = `<div class="card" style="border-left: 4px solid red;">
                <h3> Data Load Error</h3>
                <p>Could not load the database. Please check your internet connection or try refreshing.</p>
                <p><strong>Tip:</strong> Try a Hard Refresh (Ctrl+F5 or Cmd+Shift+R) to clear old data.</p>
                <p>Details: ${err.message}</p>
            </div>`;
            resultsSection.classList.remove("hidden");
            if (makeLoadStatus) makeLoadStatus.textContent = "Error loading data";
        });

    function buildIndex(parts) {
        parts.forEach(part => {
            if (part.compatibility) {
                part.compatibility.forEach(group => {
                    addToIndex(group.make, group.models, part);
                });
            }
            if (part.compatibility_smart) {
                if (part.compatibility_smart.platforms) {
                    part.compatibility_smart.platforms.forEach(platformId => {
                        const vehicles = relationships.platforms[platformId];
                        if (vehicles) {
                            const byMake = groupBy(vehicles, "make");
                            Object.keys(byMake).forEach(make => {
                                addToIndex(make, byMake[make], part);
                            });
                        }
                    });
                }
                if (part.compatibility_smart.engines) {
                    part.compatibility_smart.engines.forEach(engineId => {
                        const vehicles = relationships.engines[engineId];
                        if (vehicles) {
                            const byMake = groupBy(vehicles, "make");
                            Object.keys(byMake).forEach(make => {
                                addToIndex(make, byMake[make], part);
                            });
                        }
                    });
                }
            }
        });
    }

    function addToIndex(make, models, part) {
        if (!make) return;
        const cleanMake = make.trim();
        
        if (!vehicleIndex[cleanMake]) vehicleIndex[cleanMake] = {};
        
        models.forEach(model => {
            const rawName = model.name || model.model;
            if (!rawName) return;
            const modelName = rawName.trim();

            if (!vehicleIndex[cleanMake][modelName]) vehicleIndex[cleanMake][modelName] = [];
            if (part && !vehicleIndex[cleanMake][modelName].includes(part)) {
                vehicleIndex[cleanMake][modelName].push(part);
            }
        });
    }

    function groupBy(arr, key) {
        return arr.reduce((acc, item) => {
            (acc[item[key]] = acc[item[key]] || []).push(item);
            return acc;
        }, {});
    }

    let modelGroups = {}; // Store grouped models

    function populateMakes() {
        // Show ALL makes, even if they don't have parts yet
        const makes = Object.keys(vehicleIndex).sort();

        makeSelect.innerHTML = "<option value=\"\">-- Select Make --</option>";
        makes.forEach(make => {
            if (!make) return;
            const option = document.createElement("option");
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
        });

        if (makeLoadStatus) {
            makeLoadStatus.textContent = makes.length > 0 ? `Registry Online: ${makes.length} Manufacturers Loaded` : "Registry Offline: No Manufacturers Found";
        }
        if (subsystemSelect) subsystemSelect.disabled = false;
    }

    function hasContent(make, model) {
        // Check for parts
        if (vehicleIndex[make][model] && vehicleIndex[make][model].length > 0) return true;
        
        return false;
    }

    const subsystemOptions = [
        "Body Exterior",
        "Body Interior",
        "Brakes",
        "Cooling/HVAC",
        "Drivetrain",
        "Electrical/Sensors",
        "Engine Mechanical",
        "Fuel System",
        "Suspension/Steering"
    ];

    let activeSubsystem = "";

    function populateSubsystems() {
        if (!subsystemSelect) return;
        subsystemSelect.innerHTML = "<option value=\"\">All subsystems</option>";
        subsystemOptions.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            subsystemSelect.appendChild(option);
        });
    }

    let activeBuildFilter = null; // placeholder (unused now)

    makeSelect.addEventListener("change", (e) => {
        const selectedMake = makeSelect.value;
        modelSelect.innerHTML = "<option value=\"\">-- Select Model --</option>";
        modelSelect.disabled = true;
        yearSelect.innerHTML = "<option value=\"\">-- Select Generation --</option>";
        yearSelect.disabled = true;
        if (subsystemSelect) subsystemSelect.disabled = true;
        if (searchButton) searchButton.disabled = true;
        resultsSection.classList.add("hidden");
        partDetailsSection.classList.add("hidden");
        if (donorList) donorList.classList.add("hidden");

        if (selectedMake && vehicleIndex[selectedMake]) {
            // Group models by Base Name
            modelGroups = {};
            const rawModels = Object.keys(vehicleIndex[selectedMake]).sort();
            
            // Pass 1: Identify Canonical Base Models from "Name (Gen)" pattern
            const canonicalBases = new Set();
            
            // Define explicit aliases to force grouping
            const modelAliases = {
                "Civic Si": "Civic",
                "Civic Type R": "Civic",
                "Impreza WRX": "Impreza / WRX",
                "Impreza WRX STI": "Impreza / WRX",
                "Impreza WRX/STI": "Impreza / WRX",
                "WRX": "Impreza / WRX",
                "WRX STI": "Impreza / WRX",
                "WRX / STI": "Impreza / WRX",
                "Impreza": "Impreza / WRX",
                "Mustang GT": "Mustang",
                "Mustang SVT Cobra": "Mustang",
                "Shelby GT350": "Mustang",
                "F-150": "F-Series",
                "F-250": "F-Series",
                "F-350": "F-Series",
                "Silverado 1500": "Silverado",
                "Sierra 1500": "Sierra",
                "M3": "3-Series",
                "M5": "5-Series",
                "S4": "A4",
                "RS4": "A4",
                "S6": "A6",
                "RS6": "A6",
                "Golf R": "Golf",
                "Golf GTI": "Golf",
                "Golf R32": "Golf",
                "Jetta GLI": "Jetta",
                "Focus ST": "Focus",
                "Focus RS": "Focus",
                "Fiesta ST": "Fiesta",
                "Lancer Evolution": "Lancer Evo",
                "GR Supra": "Supra",
                "S60": "S60 / V70",
                "V70": "S60 / V70",
                "S60 R / V70 R": "S60 / V70",
                "S60R / V70R": "S60 / V70"
            };

            rawModels.forEach(fullModelName => {
                // Match "Name (Gen)" OR "Name Gen X"
                const match = fullModelName.match(/^(.*?)\s*\(.*\)$/);
                if (match) {
                    let base = match[1].trim();
                    // Check alias
                    if (modelAliases[base]) base = modelAliases[base];
                    canonicalBases.add(base);
                } else {
                    // Check for "F-150 Gen 1" style without parens if any
                    // But our data uses parens mostly.
                    // Check if it matches an alias directly
                    if (modelAliases[fullModelName]) {
                        canonicalBases.add(modelAliases[fullModelName]);
                    }
                }
            });

            // Pass 2: Group models
            rawModels.forEach(fullModelName => {
                let baseName = fullModelName;
                const match = fullModelName.match(/^(.*?)\s*\(.*\)$/);
                
                if (match) {
                    baseName = match[1].trim();
                } else {
                    // Try to match orphans to canonical bases
                    // e.g. "E36 3-series" -> "3-Series"
                    // Sort bases by length desc to match "911 Carrera" before "911"
                    const sortedBases = Array.from(canonicalBases).sort((a, b) => b.length - a.length);
                    const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const normalizedFull = normalize(fullModelName);
                    
                    for (const base of sortedBases) {
                        const normalizedBase = normalize(base);
                        if (normalizedFull.includes(normalizedBase)) {
                            baseName = base;
                            break;
                        }
                    }
                }

                // Apply Alias Check again for the final baseName
                if (modelAliases[baseName]) baseName = modelAliases[baseName];
                
                if (!modelGroups[baseName]) modelGroups[baseName] = [];
                modelGroups[baseName].push(fullModelName);
            });

            const baseModels = Object.keys(modelGroups).sort();
            
            baseModels.forEach(baseName => {
                const option = document.createElement("option");
                option.value = baseName;
                option.textContent = baseName;
                modelSelect.appendChild(option);
            });
            modelSelect.disabled = false;
        }
    });

    modelSelect.addEventListener("change", () => {
        const make = makeSelect.value;
        const baseModel = modelSelect.value;
        
        yearSelect.innerHTML = "<option value=\"\">-- Select Generation --</option>";
        yearSelect.disabled = true;
        if (searchButton) searchButton.disabled = true;

        if (make && baseModel && modelGroups[baseModel]) {
            populateGenerations(make, baseModel);
        } else {
            resultsSection.classList.add("hidden");
        }
    });

    yearSelect.addEventListener("change", () => {
        const make = makeSelect.value;
        const generation = yearSelect.value; // This is now the Full Model Name

        if (make && generation) {
            if (subsystemSelect) subsystemSelect.disabled = false;
            if (searchButton) searchButton.disabled = false;
        } else {
            if (subsystemSelect) subsystemSelect.disabled = true;
            if (searchButton) searchButton.disabled = true;
        }
    });

    function populateGenerations(make, baseModel) {
        try {
            const variants = modelGroups[baseModel];
            
            // Create objects with sortable data
            const variantObjects = variants.map(fullModelName => {
                let yearRange = null;
                let startYear = 9999;
                
                if (compatibilityEngine) {
                    const attrs = compatibilityEngine.getVehicleAttributes(make, fullModelName);
                    yearRange = attrs.yearRange;
                    if (yearRange) {
                        const match = yearRange.match(/(\d{4})/);
                        if (match) startYear = parseInt(match[1]);
                    }
                }
                
                return {
                    fullModelName,
                    yearRange,
                    startYear
                };
            });

            // Sort by Start Year, then Alpha
            variantObjects.sort((a, b) => {
                if (a.startYear !== b.startYear) return a.startYear - b.startYear;
                return a.fullModelName.localeCompare(b.fullModelName);
            });

            yearSelect.innerHTML = "<option value=\"\">-- Select Generation --</option>";

            variantObjects.forEach(obj => {
                const { fullModelName, yearRange } = obj;
                const option = document.createElement("option");
                option.value = fullModelName; 
                
                // Display Text: Try to extract the generation info inside parens
                // "911 Carrera (996.1 - 5th Gen)" -> "996.1 - 5th Gen"
                const match = fullModelName.match(/\((.*?)\)$/);
                let displayText = "";

                if (match) {
                    displayText = match[1];
                } else {
                    // It's an orphan (e.g. "E36 3-series") grouped under "3-Series"
                    // Try to remove the base model name to clean it up
                    // "E36 3-series" - "3-Series" -> "E36"
                    const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const normBase = normalize(baseModel);
                    const normFull = normalize(fullModelName);
                    
                    if (normFull.includes(normBase) && normFull !== normBase) {
                        // This is a bit tricky to do cleanly with regex without strict delimiters
                        // Just show the full name for now, it's safer than showing "E36" if we strip wrong
                        displayText = fullModelName;
                    } else {
                        displayText = fullModelName;
                    }
                }
                
                // If the display text is just the same as base model (no parens), show "Standard / All Years"
                if (displayText === baseModel) displayText = "Standard / All Years";

                // Try to find year range from relationships to append if not present
                let yearInfo = "";
                if (yearRange && !displayText.includes(yearRange)) {
                    yearInfo = ` (${yearRange})`;
                }

                option.textContent = `${displayText}${yearInfo}`;
                yearSelect.appendChild(option);
            });
            
            yearSelect.disabled = false;
        } catch (e) {
            console.error("Error in populateGenerations:", e);
            yearSelect.innerHTML = "<option value=\"\">Error loading generations</option>";
        }
    }

    function parseYearRange(rangeStr) {
        if (!rangeStr) return [];
        const years = [];
        // Handle "1999–2005" (en dash) and "1999-2005" (hyphen)
        const parts = rangeStr.split(/[–-]/); 
        if (parts.length === 2) {
            const start = parseInt(parts[0]);
            let end = parts[1].toLowerCase().includes("present") ? new Date().getFullYear() : parseInt(parts[1]);
            if (isNaN(end)) end = start; // Handle single year or bad format
            
            for (let i = start; i <= end; i++) {
                years.push(i);
            }
        } else if (parts.length === 1) {
             years.push(parseInt(rangeStr));
        }
        return years;
    }

    if (subsystemSelect) {
        subsystemSelect.addEventListener("change", () => {
            activeSubsystem = subsystemSelect.value || "";
        });
    }

    if (searchButton) {
        searchButton.addEventListener("click", () => {
            const make = makeSelect.value;
            // modelSelect.value is the Base Name (e.g. "911 Carrera")
            // yearSelect.value is the Full Model Name (e.g. "911 Carrera (996)") which is the key in vehicleIndex
            const fullModelName = yearSelect.value; 
            
            if (make && fullModelName) {
                // Pass fullModelName as the model. Pass null for year since we are selecting by generation.
                showPartsForVehicle(make, fullModelName, null);
            }
        });
    }

    function showPartsForVehicle(make, model, year) {
        try {
            // Ensure results section is visible immediately to show we are trying
            resultsSection.classList.remove("hidden");
            partsList.innerHTML = "<p>Checking catalog...</p>";

            const parts = vehicleIndex[make] ? vehicleIndex[make][model] : [];
            
            if (!parts || parts.length === 0) {
                partsList.innerHTML = `
                    <div class="card" style="border-left: 4px solid var(--accent-color);">
                        <h3>🚧 Catalog Update Pending</h3>
                        <p>We have this vehicle in our registry, but we haven't indexed any compatible parts for it yet.</p>
                        <p>Check back soon as we continue to expand our interchange database.</p>
                    </div>`;
                return;
            }

            selectedVehicleName.textContent = `${make} ${model} ${year && year !== "Unknown" ? `(${year})` : ""}`;
            partsList.innerHTML = "";
            
            const vehicleAttrs = compatibilityEngine ? compatibilityEngine.getVehicleAttributes(make, model) : {};

            // Show cross-platform / engine donor vehicles
            displayDonors(vehicleAttrs.platformId, vehicleAttrs.engineId, make, model);


            displayTips(make, model);

            let filteredParts = parts;

            // Filter by Year if provided
            // Note: In the new UI, 'year' parameter is actually null because we select by Generation.
            // However, if we wanted to filter by specific year within generation, we'd need a 4th dropdown.
            // For now, we assume selecting the generation implies all years in that generation are valid context.
            // But if the part has specific year restrictions, we should check against the Generation's year range.
            
            const generationYearRange = vehicleAttrs.yearRange;
            if (generationYearRange) {
                const genYears = parseYearRange(generationYearRange);
                
                filteredParts = filteredParts.filter(part => {
                    if (part.compatibility) {
                        const makeEntry = part.compatibility.find(c => c.make === make);
                        if (makeEntry) {
                            const modelEntry = makeEntry.models.find(m => m.name === model || model.includes(m.name) || m.name.includes(model));
                            if (modelEntry && modelEntry.years) {
                                const partYears = parseYearRange(modelEntry.years);
                                // Check if there is ANY overlap between generation years and part years
                                const overlap = genYears.some(y => partYears.includes(y));
                                return overlap;
                            }
                        }
                    }
                    return true;
                });
            }

            if (activeSubsystem) {
            // Normalize for looser matching (e.g. "Suspension/Steering" vs "Suspension & Steering")
            const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
            const search = normalize(activeSubsystem);

            filteredParts = filteredParts.filter(part => {
                const cat = normalize(part.category || "");
                // Check if one contains the other
                return cat.includes(search) || search.includes(cat);
            });
        }

        if (filteredParts && filteredParts.length > 0) {
            // Calculate scores for all parts
            
            const scoredParts = filteredParts.map(part => {
                const scoreData = compatibilityEngine ? compatibilityEngine.calculateScore(part, vehicleAttrs, make, model) : { total: 0, breakdown: {} };
                const risk = compatibilityEngine ? compatibilityEngine.getRiskLevel(scoreData.total) : { level: "Unknown", color: "grey" };
                return { part, score: scoreData.total, risk };
            });

            // Sort by score descending
            scoredParts.sort((a, b) => b.score - a.score);

            scoredParts.forEach(item => {
                const { part, score, risk } = item;
                const div = document.createElement("div");
                div.className = `part-item ${risk.cssClass}`;
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4>${part.name}</h4>
                        <span class="risk-badge ${risk.cssClass}">${score}% - ${risk.level}</span>
                    </div>
                    <p>${part.category}</p>
                `;
                div.addEventListener("click", () => showPartDetails(part, make, model));
                partsList.appendChild(div);
            });
            resultsSection.classList.remove("hidden");
            partDetailsSection.classList.add("hidden");
            // selectorSection.classList.remove("hidden"); // Keep selector visible
        } else {
            partsList.innerHTML = "<p>No matching parts found in inventory.</p>";
            resultsSection.classList.remove("hidden");
        }
        } catch (e) {
            console.error("CRITICAL ERROR in showPartsForVehicle:", e);
            partsList.innerHTML = `<div class="card" style="border-left: 4px solid red;">
                <h3> System Failure</h3>
                <p>Something went wrong while displaying parts.</p>
                <p>Error: ${e.message}</p>
            </div>`;
        }
    }

    function displayTips(make, model) {
        if (!tipsList) return;
        tipsList.innerHTML = "";
        tipsList.classList.add("hidden");

        const relevantIds = [];
        for (const [id, vehicles] of Object.entries(relationships.platforms || {})) {
            if (vehicles.some(v => v.make === make && (v.model === model || v.name === model))) {
                relevantIds.push(id);
            }
        }
        for (const [id, vehicles] of Object.entries(relationships.engines || {})) {
            if (vehicles.some(v => v.make === make && (v.model === model || v.name === model))) {
                relevantIds.push(id);
            }
        }

        const relevantTips = tipsData.filter(tip => relevantIds.includes(tip.platform));

        if (relevantTips.length > 0) {
            tipsList.classList.remove("hidden");
            relevantTips.forEach(tip => {
                const div = document.createElement("div");
                div.className = `tip-card tip-${tip.severity ? tip.severity.toLowerCase() : "info"}`;
                div.innerHTML = `
                    <h4> ${tip.title}</h4>
                    <p>${tip.content}</p>
                `;
                tipsList.appendChild(div);
            });
        }
    }

    function displayDonors(platformId, engineId, make, model) {
        if (!donorList || !donorVehicles) return;
        donorVehicles.innerHTML = "";

        const donors = [];
        const addDonor = (v, reason) => {
            const name = v.model || v.name;
            if (!name) return;
            const display = `${v.make} ${name}`;
            if (display.toLowerCase() === `${make} ${model}`.toLowerCase()) return; // skip self
            donors.push({ display, years: v.years || "", notes: v.notes || "", reason });
        };

        if (platformId && relationships.platforms && relationships.platforms[platformId]) {
            relationships.platforms[platformId].forEach(v => addDonor(v, "Same platform"));
        }
        if (engineId && relationships.engines && relationships.engines[engineId]) {
            relationships.engines[engineId].forEach(v => addDonor(v, "Shared engine"));
        }

        // Deduplicate by display name + reason
        const seen = new Set();
        donors.forEach(d => {
            const key = `${d.display}-${d.reason}`;
            if (seen.has(key)) return;
            seen.add(key);
            const li = document.createElement("li");
            const reasonText = d.reason ? `  ${d.reason}` : "";
            const notesText = d.notes ? ` (${d.notes})` : "";
            li.textContent = `${d.display}${d.years ? " [" + d.years + "]" : ""}${reasonText}${notesText}`;
            donorVehicles.appendChild(li);
        });

        if (donors.length > 0) {
            donorList.classList.remove("hidden");
        } else {
            donorList.classList.add("hidden");
        }
    }

    function showPartDetails(part, make, model) {
        const partName = document.getElementById("partName");
        const partCategory = document.getElementById("partCategory");
        const partDescription = document.getElementById("partDescription");
        const partSpecs = document.getElementById("partSpecs");
        const compatibleVehicles = document.getElementById("compatibleVehicles");
        const universalParts = document.getElementById("universalParts");
        const proTipSection = document.getElementById("proTipSection");
        const proTipContent = document.getElementById("proTipContent");
        const selectorSection = document.getElementById("selector"); // Re-select here to be safe

        partName.textContent = part.name;
        partCategory.textContent = part.category;
        partDescription.textContent = part.description;

        // Specs
        partSpecs.innerHTML = "";
        if (part.average_price) {
            const li = document.createElement("li");
            li.innerHTML = `<strong> Average Price:</strong> ${part.average_price}`;
            li.style.color = "#10b981"; // Green color for money
            partSpecs.appendChild(li);
        }
        if (part.specs) {
            part.specs.forEach(spec => {
                const li = document.createElement("li");
                li.textContent = spec;
                partSpecs.appendChild(li);
            });
        }

        // Compatible Vehicles
        compatibleVehicles.innerHTML = "";
        if (part.compatibility) {
            part.compatibility.forEach(group => {
                const div = document.createElement("div");
                div.className = "vehicle-group";
                div.innerHTML = `<h5>${group.make}</h5>`;
                const ul = document.createElement("ul");
                group.models.forEach(m => {
                    const li = document.createElement("li");
                    
                    // Try to find vehicle lore
                    let lore = "";
                    if (compatibilityEngine) {
                        const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
                        const target = normalize(m.name || m.model);
                        
                        const findLore = (collection) => {
                            if (!collection) return null;
                            for (const vehicles of Object.values(collection)) {
                                const match = vehicles.find(v => {
                                    if (v.make !== group.make) return false;
                                    const vName = normalize(v.model || v.name);
                                    return vName === target || vName.includes(target) || target.includes(vName);
                                });
                                if (match && match.notes && match.notes !== "Platform Mate") return match.notes;
                            }
                            return null;
                        };
                        
                        const platformLore = findLore(relationships.platforms);
                        const engineLore = findLore(relationships.engines);
                        if (platformLore) lore = platformLore;
                        else if (engineLore) lore = engineLore;
                    }

                    const loreHtml = lore ? `<br><span style="color:var(--accent-color); font-size:0.85em;"><em>"${lore}"</em></span>` : "";

                    li.innerHTML = `<strong>${m.name || m.model}</strong> (${m.years}) <br><small>${m.notes}</small>${loreHtml}`;
                    ul.appendChild(li);
                });
                div.appendChild(ul);
                compatibleVehicles.appendChild(div);
            });
        }

        // Universal / Aftermarket
        universalParts.innerHTML = "";
        if (part.universal_alternatives) {
            part.universal_alternatives.forEach(alt => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${alt.name}</strong>: ${alt.notes}`;
                universalParts.appendChild(li);
            });
        }

        // Pro Tip / History
        if (proTipSection) {
            if (part.pro_tip || part.history) {
                proTipSection.classList.remove("hidden");
                proTipContent.innerHTML = "";
                if (part.history) {
                     proTipContent.innerHTML += `<p style="margin-bottom:0.5rem;"><strong> History:</strong> ${part.history}</p>`;
                }
                if (part.pro_tip) {
                     proTipContent.innerHTML += `<p><strong> Pro Tip:</strong> ${part.pro_tip}</p>`;
                }
            } else {
                proTipSection.classList.add("hidden");
            }
        }

        // Show/Hide Sections
        // selectorSection.classList.add("hidden"); // Don't hide selector in new layout
        resultsSection.classList.add("hidden");
        partDetailsSection.classList.remove("hidden");
        window.scrollTo(0, 0);
    }

    backButton.addEventListener("click", () => {
        partDetailsSection.classList.add("hidden");
        // selectorSection.classList.remove("hidden");
        resultsSection.classList.remove("hidden");
    });
});
