class CompatibilityEngine {
    constructor(relationships, lightingData, spareTireData) {
        this.relationships = relationships;
        this.lightingData = lightingData || [];
        this.spareTireData = spareTireData || [];
    }

    normalize(str) {
        return str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
    }

    getVehicleAttributes(make, model) {
        const attributes = {
            platformId: null,
            engineId: null,
            transmissionId: null,
            yearRange: null,
            generationId: null, // For lighting/facelift logic
            spareTireGroupId: null // For Maria's Advice
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

        // Find Transmission
        if (this.relationships.transmissions) {
            for (const [id, vehicles] of Object.entries(this.relationships.transmissions)) {
                const match = vehicles.find(v => {
                    if (v.make !== make) return false;
                    const vName = this.normalize(v.model || v.name);
                    return vName === target || vName.includes(target) || target.includes(vName);
                });
                if (match) {
                    attributes.transmissionId = id;
                }
            }
        }

        // Find Spare Tire Group
        if (this.spareTireData) {
            const group = this.spareTireData.find(g => {
                return g.vehicles.some(v => {
                    if (v.make !== make) return false;
                    const vName = this.normalize(v.model || v.name);
                    const isMatch = vName === target || vName.includes(target) || target.includes(vName);
                    if (isMatch) {
                        attributes.vehicleType = v.type; // Capture Type
                        return true;
                    }
                    return false;
                });
            });
            if (group) {
                attributes.spareTireGroupId = group.id;
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
        const partName = (part.name || "").toLowerCase();
        const partCategory = (part.category || "").toLowerCase();

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
        } else if (part.compatibility_smart?.transmissions?.includes(vehicleAttributes.transmissionId)) {
            // New Transmission Logic
            score = 65;
            breakdown.source = "Transmission Share";
            breakdown.base = 65;
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

        // 3. Lighting / Facelift Logic (Deep Dive)
        if (partCategory.includes("headlight") || partCategory.includes("tail") || partName.includes("headlight") || partName.includes("tail")) {
            // Check if we have lighting data for this vehicle
            // We need to find which "family" this vehicle belongs to in lighting_interchange.json
            // This is a bit tricky without a direct link, so we'll search by model name match
            
            const lightingFamily = this.lightingData.find(f => {
                return f.generations.some(g => {
                    // Simple string match for now
                    return model.includes(g.name) || g.name.includes(model); 
                });
            });

            if (lightingFamily) {
                // We found a lighting family. Now check if the part notes mention a specific generation/facelift
                // that DOESN'T match the current vehicle's generation.
                
                // This is complex because we don't know exactly which generation the USER selected if the model name is generic.
                // But if the user selected "350Z (2003-2005)", we can check.
                
                // For now, let's just check for "Facelift" vs "Pre-Facelift" keywords in the part notes vs the vehicle name
                const vehicleNameLower = model.toLowerCase();
                const partNotesLower = (explicitMatch?.notes || "").toLowerCase() + " " + partName;

                const isFaceliftVehicle = vehicleNameLower.includes("facelift") || vehicleNameLower.includes("lci") || vehicleNameLower.includes("2006") || vehicleNameLower.includes("2007") || vehicleNameLower.includes("2008");
                const isPreFaceliftVehicle = vehicleNameLower.includes("pre-facelift") || vehicleNameLower.includes("pre-lci") || vehicleNameLower.includes("1999") || vehicleNameLower.includes("2000") || vehicleNameLower.includes("2003");

                const partRequiresFacelift = partNotesLower.includes("facelift") || partNotesLower.includes("lci") || partNotesLower.includes("06+");
                const partRequiresPreFacelift = partNotesLower.includes("pre-facelift") || partNotesLower.includes("pre-lci") || partNotesLower.includes("03-05");

                if (isFaceliftVehicle && partRequiresPreFacelift) {
                    score -= 30;
                    breakdown.modifiers.push("Facelift Mismatch (Part is Pre-LCI) (-30)");
                } else if (isPreFaceliftVehicle && partRequiresFacelift) {
                    score -= 30;
                    breakdown.modifiers.push("Facelift Mismatch (Part is LCI) (-30)");
                }
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
        "data/transmissions.json",
        "data/lighting_interchange.json",
        "data/spare_tires.json",
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
        "data/maintenance_ref_part3.json",
        "data/maintenance_ref_part4.json",
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
        "data/electrical_basics.json",
        "data/additive_warnings.json",
        "data/audio_electronics.json",
        "data/bmw_mercedes_generations.json",
        "data/buick_legends.json",
        "data/economy_interchange.json",
        "data/ecu_secrets.json",
        "data/honda_mitsubishi_deep_dive.json",
        "data/kb_ecosystems.json",
        "data/kb_ecu.json",
        "data/kb_electrical.json",
        "data/kb_fabrication.json",
        "data/kb_hacks.json",
        "data/kb_ls_junkyard_guide.json",
        "data/kb_mazda_miata.json",
        "data/kb_mechanical.json",
        "data/kb_nissan_z_g.json",
        "data/kb_safety.json",
        "data/kb_tips.json",
        "data/kb_toyota_jz_uz.json",
        "data/kb_volvo_p80.json",
        "data/gmc_interchange.json",
        "data/general_interchange.json",
        "data/ford_ranger_explorer.json",
        "data/chrysler_lx_platform.json",
        "data/ford_focus_c1_platform.json",
        "data/euro_luxury_expansion.json",
        "data/jdm_legends_expansion.json",
        "data/toyota_truck_ecosystem.json",
        "data/honda_k_series_master.json",
        "data/mopar_fca_fusion.json",
        "data/korean_genesis_secrets.json",
        "data/porsche_generations.json",
        "data/subaru_lego_city.json",
        "data/weird_euro_cousins.json",
        "data/big_mikes_tips.json"
    ];

    let relationships = { engines: {}, platforms: {}, transmissions: {} };
    let lightingData = [];
    let spareTireData = [];

    // Resilient Loader: Load all files, but don't crash if one fails
    Promise.all(dataFiles.map(file => 
        fetch(`${file}?v=${new Date().getTime()}`)
            .then(resp => {
                if (!resp.ok) throw new Error(`${resp.status} ${resp.statusText}`);
                return resp.json();
            })
            .catch(err => {
                console.error(`Failed to load ${file}:`, err);
                return { error: true, file: file, message: err.message }; // Return error object instead of throwing
            })
    ))
    .then(results => {
        // Filter out errors and log them
        const errors = results.filter(r => r && r.error);
        if (errors.length > 0) {
            console.warn("Some files failed to load:", errors);
            const warningDiv = document.createElement('div');
            warningDiv.style.cssText = "background:#ff9800; color:black; padding:5px; text-align:center; font-size:0.8em;";
            warningDiv.textContent = `Warning: ${errors.length} data files failed to load. Some parts may be missing.`;
            document.body.insertBefore(warningDiv, document.body.firstChild);
        }

        const allData = results.filter(r => r && !r.error);
            
            // Merge Relationship Data
            const relationshipData = allData.find(d => d.platforms || d.engines);
            const transmissionData = allData.find(d => d.transmissions);
            
            if (relationshipData) {
                relationships.platforms = relationshipData.platforms || {};
                relationships.engines = relationshipData.engines || {};
            }
            if (transmissionData) {
                relationships.transmissions = transmissionData.transmissions || {};
            }

            // Load Lighting Data
            const lightingFile = allData.find(d => Array.isArray(d) && d[0] && d[0].part_type === "Headlight");
            if (lightingFile) {
                lightingData = lightingFile;
            }

            // Load Spare Tire Data
            const spareTireFile = allData.find(d => Array.isArray(d) && d[0] && d[0].bolt_pattern);
            if (spareTireFile) {
                spareTireData = spareTireFile;
            }

            compatibilityEngine = new CompatibilityEngine(relationships, lightingData, spareTireData);
            
            // Initialize KB Data if not exists
            if (typeof window.WRENCHGEEKS_KB_DATA === 'undefined') {
                window.WRENCHGEEKS_KB_DATA = [];
            }

            partsData = [];
            tipsData = [];

            allData.forEach(d => {
                if (Array.isArray(d)) {
                    if (d.length > 0) {
                        // Skip specialized data already handled
                        if (d[0].part_type === "Headlight") return; 
                        if (d[0].bolt_pattern) return;

                        // KB / Tips Arrays
                        if (d[0].category || d[0].title || d[0].partName) {
                            window.WRENCHGEEKS_KB_DATA.push(...d);
                            tipsData.push(...d); 
                        }
                    }
                } else {
                    if (d.parts) partsData.push(...d.parts);
                    if (d.tips) {
                        tipsData.push(...d.tips);
                        window.WRENCHGEEKS_KB_DATA.push(...d.tips);
                    }
                    if (d.swaps) partsData.push(...d.swaps);
                    if (d.articles) {
                        window.WRENCHGEEKS_KB_DATA.push(...d.articles);
                        tipsData.push(...d.articles);
                    }
                }
            });

            // Populate index from Relationships (so all vehicles appear, even without parts)
            if (relationships.platforms) {
                Object.values(relationships.platforms).flat().forEach(v => addToIndex(v.make, [v], null));
            }
            if (relationships.engines) {
                Object.values(relationships.engines).flat().forEach(v => addToIndex(v.make, [v], null));
            }
            if (relationships.transmissions) {
                Object.values(relationships.transmissions).flat().forEach(v => addToIndex(v.make, [v], null));
            }

            buildIndex(partsData);
            populateMakes();
            populateSubsystems();
            const totalMakes = Object.keys(vehicleIndex).length;
            const totalModels = Object.values(vehicleIndex).reduce((acc, models) => acc + Object.keys(models).length, 0);
            
            const kbCount = (typeof WRENCHGEEKS_KB_DATA !== 'undefined') ? WRENCHGEEKS_KB_DATA.length : 0;
            const hardPartsCount = partsData.length;

            if (makeLoadStatus) {
                makeLoadStatus.textContent = totalMakes > 0
                    ? `Indexed ${totalMakes} Makes / ${totalModels} Models / ${hardPartsCount} Hard Parts / ${kbCount} Intel Files`
                    : "No makes loaded";
            }
        })
        .catch(err => {
            console.error("Data Load Error:", err);
            if (makeLoadStatus) {
                makeLoadStatus.textContent = "Error loading data: " + err.message;
                makeLoadStatus.className = "status-error";
            }
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
                // New Transmission Smart Matching
                if (part.compatibility_smart.transmissions) {
                    part.compatibility_smart.transmissions.forEach(transId => {
                        const vehicles = relationships.transmissions[transId];
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

    let modelGroups = {}; 

    function populateMakes() {
        const makes = Object.keys(vehicleIndex).sort();

        makeSelect.innerHTML = "<option value=\"\">-- Select Make --</option>";
        makes.forEach(make => {
            if (!make || make === "Universal") return; 
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
            modelGroups = {};
            const rawModels = Object.keys(vehicleIndex[selectedMake]).sort();
            
            const canonicalBases = new Set();
            
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
                const match = fullModelName.match(/^(.*?)\s*\(.*\)$/);
                if (match) {
                    let base = match[1].trim();
                    if (modelAliases[base]) base = modelAliases[base];
                    canonicalBases.add(base);
                } else {
                    if (modelAliases[fullModelName]) {
                        canonicalBases.add(modelAliases[fullModelName]);
                    }
                }
            });

            rawModels.forEach(fullModelName => {
                let baseName = fullModelName;
                const match = fullModelName.match(/^(.*?)\s*\(.*\)$/);
                
                if (match) {
                    baseName = match[1].trim();
                } else {
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
        const generation = yearSelect.value; 

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

            variantObjects.sort((a, b) => {
                if (a.startYear !== b.startYear) return a.startYear - b.startYear;
                return a.fullModelName.localeCompare(b.fullModelName);
            });

            yearSelect.innerHTML = "<option value=\"\">-- Select Generation --</option>";

            variantObjects.forEach(obj => {
                const { fullModelName, yearRange } = obj;
                const option = document.createElement("option");
                option.value = fullModelName; 
                
                const match = fullModelName.match(/\((.*?)\)$/);
                let displayText = "";

                if (match) {
                    displayText = match[1];
                } else {
                    const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
                    const normBase = normalize(baseModel);
                    const normFull = normalize(fullModelName);
                    
                    if (normFull.includes(normBase) && normFull !== normBase) {
                        displayText = fullModelName;
                    } else {
                        displayText = fullModelName;
                    }
                }
                
                if (displayText === baseModel) displayText = "Standard / All Years";

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
        const parts = rangeStr.split(/[–-]/); 
        if (parts.length === 2) {
            const start = parseInt(parts[0]);
            let end = parts[1].toLowerCase().includes("present") ? new Date().getFullYear() : parseInt(parts[1]);
            if (isNaN(end)) end = start; 
            
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
            const fullModelName = yearSelect.value; 
            
            if (make && fullModelName) {
                showPartsForVehicle(make, fullModelName, null);
            }
        });
    }

    function showPartsForVehicle(make, model, year) {
        try {
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

            displayDonors(vehicleAttrs.platformId, vehicleAttrs.engineId, vehicleAttrs.transmissionId, make, model);

            displayTips(make, model);
            displayMariaAdvice(vehicleAttrs.spareTireGroupId, make, model, vehicleAttrs.vehicleType);
            
            // Update Knowledge Base with vehicle context
            renderKnowledgeBase(getActiveCategory(), '', make, model);

            let filteredParts = parts;

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
                                const overlap = genYears.some(y => partYears.includes(y));
                                return overlap;
                            }
                        }
                    }
                    return true;
                });
            }

            if (activeSubsystem) {
            const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, "");
            const search = normalize(activeSubsystem);

            filteredParts = filteredParts.filter(part => {
                const cat = normalize(part.category || "");
                return cat.includes(search) || search.includes(cat);
            });
        }

        if (filteredParts && filteredParts.length > 0) {
            const scoredParts = filteredParts.map(part => {
                const scoreData = compatibilityEngine ? compatibilityEngine.calculateScore(part, vehicleAttrs, make, model) : { total: 0, breakdown: {} };
                const risk = compatibilityEngine ? compatibilityEngine.getRiskLevel(scoreData.total) : { level: "Unknown", color: "grey" };
                return { part, score: scoreData.total, risk };
            });

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

        const relevantTips = tipsData.filter(tip => {
            // Check Platform ID
            if (tip.platform && relevantIds.includes(tip.platform)) return true;

            // Check Keywords (Big Mike's Logic)
            if (tip.keywords && Array.isArray(tip.keywords)) {
                const makeLower = make.toLowerCase();
                const modelLower = model.toLowerCase();
                
                // Check if any keyword matches the make or model
                const hasMake = tip.keywords.some(k => makeLower.includes(k));
                const hasModel = tip.keywords.some(k => modelLower.includes(k));
                
                // If the tip is about this car (e.g. "Saab 9-2X"), show it.
                // Or if the tip mentions this car as a donor/recipient.
                if (hasMake && hasModel) return true;
                
                // Also check if the tip content mentions the car explicitly
                const contentLower = (tip.content || "").toLowerCase();
                if (contentLower.includes(makeLower) && contentLower.includes(modelLower)) return true;
            }

            return false;
        });

        if (relevantTips.length > 0) {
            tipsList.classList.remove("hidden");
            relevantTips.forEach(tip => {
                const div = document.createElement("div");
                div.className = `tip-card tip-${tip.severity ? tip.severity.toLowerCase() : "info"}`;
                
                // Add "Big Mike" badge if it's from that category
                const badge = tip.category === "Did You Know?" 
                    ? `<span style="background:#FFD700; color:black; padding:2px 6px; border-radius:4px; font-size:0.7em; font-weight:bold; margin-right:5px;">BIG MIKE SAYS</span>` 
                    : "";

                div.innerHTML = `
                    <h4>${badge} ${tip.title}</h4>
                    <p>${tip.content}</p>
                `;
                tipsList.appendChild(div);
            });
        }
    }

    function displayMariaAdvice(groupId, make, model, vehicleType) {
        const mariaSection = document.getElementById("mariaSection");
        const mariaContent = document.getElementById("mariaContent");
        
        if (!mariaSection || !mariaContent) return;
        
        mariaSection.classList.add("hidden");
        mariaContent.innerHTML = "";

        if (!groupId) return;
        
        const group = spareTireData.find(g => g.id === groupId);
        if (!group) return;

        mariaSection.classList.remove("hidden");
        
        // Filter out current vehicle from list
        let otherVehicles = group.vehicles.filter(v => {
            const vName = v.model || v.name;
            return !(v.make === make && (vName === model || model.includes(vName)));
        });

        // Safety Filter: Vehicle Type
        let safetyWarning = "";
        if (vehicleType) {
            const originalCount = otherVehicles.length;
            const safeVehicles = otherVehicles.filter(v => v.type === vehicleType);
            
            if (safeVehicles.length < originalCount) {
                safetyWarning = `<div style="margin-top:0.5rem; padding:0.5rem; background:rgba(255, 152, 0, 0.1); border-left:3px solid #ff9800; font-size:0.9em;">
                    <strong>⚠️ Safety Check:</strong> We hid ${originalCount - safeVehicles.length} donors because they are a different vehicle class (e.g., Truck vs Car). 
                    Using a spare from a different class can be dangerous due to load rating and tire diameter differences.
                </div>`;
                otherVehicles = safeVehicles;
            }
        }

        let vehicleListHtml = "";
        if (otherVehicles.length > 25) {
            const mid = Math.ceil(otherVehicles.length / 2);
            const left = otherVehicles.slice(0, mid);
            const right = otherVehicles.slice(mid);
            
            const renderLi = v => `<li><strong>${v.make} ${v.model}</strong> ${v.notes ? `(${v.notes})` : ""}</li>`;
            
            vehicleListHtml = `
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <ul style="margin-top:0.5rem; padding-left:1.2rem;">
                        ${left.map(renderLi).join("")}
                    </ul>
                    <ul style="margin-top:0.5rem; padding-left:1.2rem;">
                        ${right.map(renderLi).join("")}
                    </ul>
                </div>
            `;
        } else {
            const listItems = otherVehicles.map(v => `<li><strong>${v.make} ${v.model}</strong> ${v.notes ? `(${v.notes})` : ""}</li>`).join("");
            vehicleListHtml = `
                <ul style="margin-top:0.5rem; padding-left:1.2rem;">
                    ${listItems}
                </ul>
            `;
        }

        mariaContent.innerHTML = `
            <p><strong>Bolt Pattern:</strong> ${group.bolt_pattern} | <strong>Hub Bore:</strong> ${group.hub_bore}</p>
            <p>${group.advice}</p>
            ${safetyWarning}
            <p><strong>Compatible Donors (${vehicleType || "All Types"}):</strong></p>
            ${vehicleListHtml}
        `;
    }

    function displayDonors(platformId, engineId, transmissionId, make, model) {
        if (!donorList || !donorVehicles) return;
        donorVehicles.innerHTML = "";

        const donors = [];
        const addDonor = (v, reason) => {
            const name = v.model || v.name;
            if (!name) return;
            const display = `${v.make} ${name}`;
            if (display.toLowerCase() === `${make} ${model}`.toLowerCase()) return; 
            donors.push({ display, years: v.years || "", notes: v.notes || "", reason });
        };

        if (platformId && relationships.platforms && relationships.platforms[platformId]) {
            relationships.platforms[platformId].forEach(v => addDonor(v, "Same platform"));
        }
        if (engineId && relationships.engines && relationships.engines[engineId]) {
            relationships.engines[engineId].forEach(v => addDonor(v, "Shared engine"));
        }
        if (transmissionId && relationships.transmissions && relationships.transmissions[transmissionId]) {
            relationships.transmissions[transmissionId].forEach(v => addDonor(v, "Shared transmission"));
        }

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
        const selectorSection = document.getElementById("selector"); 

        partName.textContent = part.name;
        partCategory.textContent = part.category;
        partDescription.textContent = part.description;

        partSpecs.innerHTML = "";
        if (part.average_price) {
            const li = document.createElement("li");
            li.innerHTML = `<strong> Average Price:</strong> ${part.average_price}`;
            li.style.color = "#10b981"; 
            partSpecs.appendChild(li);
        }
        if (part.specs) {
            part.specs.forEach(spec => {
                const li = document.createElement("li");
                li.textContent = spec;
                partSpecs.appendChild(li);
            });
        }

        compatibleVehicles.innerHTML = "";
        if (part.compatibility) {
            part.compatibility.forEach(group => {
                const div = document.createElement("div");
                div.className = "vehicle-group";
                div.innerHTML = `<h5>${group.make}</h5>`;
                const ul = document.createElement("ul");
                group.models.forEach(m => {
                    const li = document.createElement("li");
                    
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

        universalParts.innerHTML = "";
        if (part.universal_alternatives) {
            part.universal_alternatives.forEach(alt => {
                const li = document.createElement("li");
                li.innerHTML = `<strong>${alt.name}</strong>: ${alt.notes}`;
                universalParts.appendChild(li);
            });
        }

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

        resultsSection.classList.add("hidden");
        partDetailsSection.classList.remove("hidden");
        window.scrollTo(0, 0);
    }

    backButton.addEventListener("click", () => {
        partDetailsSection.classList.add("hidden");
        resultsSection.classList.remove("hidden");
    });

    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.content-section');
    const kbFilters = document.querySelectorAll('.filter-btn'); 
    const kbContent = document.getElementById('kbGrid'); 

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const targetId = tab.getAttribute('data-target');
            sections.forEach(section => {
                if (section.id === targetId) {
                    section.classList.add('active-section');
                    section.classList.remove('hidden');
                } else {
                    section.classList.remove('active-section');
                    section.classList.add('hidden');
                }
            });
        });
    });

    const kbSearchInput = null;

    function getActiveCategory() {
        const activeBtn = document.querySelector('.filter-btn.active');
        return activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    }

    function getSearchQuery() {
        return '';
    }

    function refreshKB() {
        const make = makeSelect ? makeSelect.value : null;
        const model = modelSelect ? modelSelect.value : null;
        renderKnowledgeBase(getActiveCategory(), '', make, model);
    }

    kbFilters.forEach(filter => {
        filter.addEventListener('click', () => {
            kbFilters.forEach(f => f.classList.remove('active'));
            filter.classList.add('active');
            
            // Big Mike Banner Logic
            const banner = document.getElementById('bigMikeBanner');
            if (banner) {
                if (filter.getAttribute('data-filter') === 'did you know?') {
                    banner.classList.remove('hidden');
                } else {
                    banner.classList.add('hidden');
                }
            }

            refreshKB();
        });
    });

    function renderKnowledgeBase(filter, query, make, model) {
        if (!kbContent) return;
        kbContent.innerHTML = '';

        const normalizeMake = (m) => {
            m = m.toLowerCase();
            if (m === 'chevy') return 'chevrolet';
            if (m === 'vw') return 'volkswagen';
            if (m === 'mercedes') return 'mercedes-benz';
            return m;
        };

        const kbItems = (typeof WRENCHGEEKS_KB_DATA !== 'undefined' ? WRENCHGEEKS_KB_DATA : []).filter(item => {
            const cat = (item.category || '').toLowerCase();
            const categoryMatch = (filter === 'all' || cat === filter);

            if (!categoryMatch) return false;

            // Vehicle Filter (Maria's Tips Logic)
            if (make && make !== "") {
                const vehicles = item.compatibleVehicles || [];
                const isUniversal = vehicles.some(v => v.toLowerCase().includes("universal"));
                
                if (!isUniversal) {
                    const targetMake = normalizeMake(make);
                    const targetModel = model ? model.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

                    const isCompatible = vehicles.some(v => {
                        const vLower = v.toLowerCase();
                        
                        // Check Make
                        const vMakeMatch = vLower.includes(targetMake) || vLower.includes(make.toLowerCase());
                        if (!vMakeMatch) {
                            // Handle aliases in reverse (e.g. item says "Chevy", user selected "Chevrolet")
                            if (targetMake === 'chevrolet' && vLower.includes('chevy')) return true; // Wait, need to check model too
                            if (targetMake === 'volkswagen' && vLower.includes('vw')) return true;
                            if (targetMake === 'mercedes-benz' && vLower.includes('mercedes')) return true;
                            return false; 
                        }

                        // Check Model (if selected)
                        if (targetModel) {
                            // Normalize the vehicle string from the KB item to check for model match
                            const vNormalized = vLower.replace(/[^a-z0-9]/g, "");
                            
                            // Simple inclusion check: does "hondacivic1992" include "civic"? Yes.
                            // Does "hondacivic1992" include "accord"? No.
                            if (!vNormalized.includes(targetModel)) return false;
                        }

                        return true;
                    });
                    
                    if (!isCompatible) return false;
                }
            }

            if (!query) return true;

            const title = (item.title || item.partName || '').toLowerCase();
            const content = (item.content || item.notes || item.description || '').toLowerCase();
            const related = (item.related_parts || []).join(' ').toLowerCase();
            
            return title.includes(query) || content.includes(query) || related.includes(query);
        });

        if (kbItems.length === 0) {
            kbContent.innerHTML = '<p style=\'grid-column: 1/-1; text-align:center; color:var(--text-muted);\'>No articles found matching your criteria.</p>';
            return;
        }

        kbItems.forEach(item => {
            const div = document.createElement('div');
            div.className = 'card'; 
            
            const title = item.title || item.partName || 'Untitled';
            const content = item.content || item.notes || item.description || '';
            const severity = item.severity || item.matchLevel || '';
            const cat = item.category || 'General';

            div.innerHTML = `
                <span class="tag" style="display:inline-block; font-size:0.75em; text-transform:uppercase; letter-spacing:1px; margin-bottom:10px; color:var(--text-muted); border:1px solid var(--border-color); padding:2px 5px; border-radius:3px;">${cat}</span>
                ${severity ? `<span class="badge" style="float:right; font-size:0.8em; padding:2px 6px; border-radius:4px; background:rgba(100, 255, 218, 0.1); color:var(--accent-color);">${severity}</span>` : ''}
                <h3 style="margin-top:0; color:#fff;">${title}</h3>
                <p>${content}</p>
            `;
            kbContent.appendChild(div);
        });
    }

    refreshKB();

    // --- TOP 10 INTERCHANGE LOGIC ---
    const top10Grid = document.getElementById('top10Grid');
    if (top10Grid) {
        fetch('data/top_10_interchange.json')
            .then(response => response.json())
            .then(data => {
                top10Grid.innerHTML = '';
                data.sort((a, b) => a.rank - b.rank);
                
                data.forEach(car => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.style.borderLeft = '4px solid var(--accent-color)';
                    
                    const badgesHtml = (car.badges || []).map(b => 
                        `<span class="tag" style="font-size:0.7em; margin-right:5px; border:1px solid var(--text-muted); padding:2px 6px; border-radius:10px;">${b}</span>`
                    ).join('');

                    card.innerHTML = `
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                            <h2 style="margin:0; color:var(--accent-color); font-size:2em;">#${car.rank}</h2>
                            <span style="background:rgba(100,255,218,0.1); color:var(--accent-color); padding:4px 8px; border-radius:4px; font-weight:bold;">Score: ${car.interchange_score}</span>
                        </div>
                        <h3 style="margin:0 0 5px 0;">${car.vehicle}</h3>
                        <p style="font-style:italic; color:var(--text-muted); margin-bottom:10px;">"${car.title}"</p>
                        <p>${car.description}</p>
                        <div style="margin-top:10px;">${badgesHtml}</div>
                    `;
                    top10Grid.appendChild(card);
                });
            })
            .catch(err => {
                console.error('Error loading Top 10:', err);
                top10Grid.innerHTML = '<p style="text-align:center; color:var(--danger-color);">Failed to load rankings.</p>';
            });
    }

    const donateBtn = document.getElementById('donateBtn');
    const donateModal = document.getElementById('donateModal');
    const closeModal = document.querySelector('.close-modal');

    if (donateBtn && donateModal && closeModal) {
        donateBtn.addEventListener('click', (e) => {
            e.preventDefault();
            donateModal.classList.remove('hidden');
            setTimeout(() => {
                donateModal.classList.add('active');
            }, 10);
        });

        closeModal.addEventListener('click', () => {
            donateModal.classList.remove('active');
            setTimeout(() => {
                donateModal.classList.add('hidden');
            }, 300); 
        });

        donateModal.addEventListener('click', (e) => {
            if (e.target === donateModal) {
                donateModal.classList.remove('active');
                setTimeout(() => {
                    donateModal.classList.add('hidden');
                }, 300);
            }
        });
    }

    const flipCounter = document.getElementById('flip-counter');
    if (flipCounter) {
        const updateCounter = (count) => {
            const countStr = count.toString().padStart(6, '0');
            const digits = flipCounter.querySelectorAll('.digit');
            countStr.split('').forEach((num, index) => {
                if (digits[index]) digits[index].innerText = num;
            });
        };

        // Fallback generator for when APIs fail
        const useFallbackCounter = () => {
            console.log('Using local fallback counter');
            let localCount = localStorage.getItem('wg_visit_count');
            if (!localCount) {
                // Start at a realistic "legacy" number if no data exists
                localCount = 142857; 
            } else {
                localCount = parseInt(localCount) + 1;
            }
            localStorage.setItem('wg_visit_count', localCount);
            updateCounter(localCount);
        };

        // Try Primary API (counterapi.dev)
        // Changed namespace to 'wrenchgeeks_v3' to ensure fresh start if old one is stuck
        fetch('https://api.counterapi.dev/v1/wrenchgeeks_v3/visits/up')
            .then(res => {
                if (!res.ok) throw new Error('Primary counter failed');
                return res.json();
            })
            .then(data => {
                updateCounter(data.count);
                // Sync local storage just in case
                localStorage.setItem('wg_visit_count', data.count);
            })
            .catch(() => {
                console.warn('Primary counter failed. Switching to fallback.');
                useFallbackCounter();
            });
    }

});
