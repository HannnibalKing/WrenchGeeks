class CompatibilityEngine {
    constructor(relationships) {
        this.relationships = relationships;
    }

    getVehicleAttributes(make, model) {
        const attributes = {
            platformId: null,
            engineId: null,
            yearRange: null
        };

        // Find Platform
        if (this.relationships.platforms) {
            for (const [id, vehicles] of Object.entries(this.relationships.platforms)) {
                const match = vehicles.find(v => v.make === make && (v.model === model || v.name === model));
                if (match) {
                    attributes.platformId = id;
                    attributes.yearRange = match.years;
                }
            }
        }

        // Find Engine
        if (this.relationships.engines) {
            for (const [id, vehicles] of Object.entries(this.relationships.engines)) {
                const match = vehicles.find(v => v.make === make && (v.model === model || v.name === model));
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
            platform: 0,
            engine: 0,
            mounting: 0,
            protocol: 0,
            era: 0
        };

        // 1. Platform Match (30%)
        if (part.compatibility_smart?.platforms?.includes(vehicleAttributes.platformId)) {
            score += 30;
            breakdown.platform = 30;
        }

        // 2. Engine Match (25%)
        if (part.compatibility_smart?.engines?.includes(vehicleAttributes.engineId)) {
            score += 25;
            breakdown.engine = 25;
        }

        // Check explicit compatibility list for specific notes
        let explicitMatch = null;
        if (part.compatibility) {
            part.compatibility.forEach(group => {
                if (group.make === make) {
                    const modelMatch = group.models.find(m => (m.name === model || m.model === model));
                    if (modelMatch) explicitMatch = modelMatch;
                }
            });
        }

        // Fallback: If explicit match exists but no smart match, award base points
        if (explicitMatch) {
             if (breakdown.platform === 0 && breakdown.engine === 0) {
                 score += 30; 
                 breakdown.platform = 30;
             }
        }

        // 3. Mounting Match (20%)
        let mountingScore = 0;
        if (explicitMatch) {
            const notes = (explicitMatch.notes || "").toLowerCase();
            if (notes.includes('bracket') || notes.includes('adapter') || notes.includes('modify') || notes.includes('requires')) {
                mountingScore = 10;
            } else {
                mountingScore = 20; // Assume stock/direct fit
            }
        } else if (breakdown.platform > 0 || breakdown.engine > 0) {
            mountingScore = 20; // Platform/Engine mates usually bolt on
        }
        score += mountingScore;
        breakdown.mounting = mountingScore;

        // 4. Protocol Match (15%)
        let protocolScore = 0;
        if (breakdown.platform > 0 || breakdown.engine > 0) {
            protocolScore = 15;
        } else if (explicitMatch) {
            protocolScore = 15; // If it's listed, it likely works
        } else {
            protocolScore = 0;
        }
        score += protocolScore;
        breakdown.protocol = protocolScore;

        // 5. Era Match (10%)
        if (score > 0) {
            score += 10;
            breakdown.era = 10;
        }

        return { total: Math.min(score, 100), breakdown };
    }
    
    getRiskLevel(score) {
        if (score >= 90) return { level: "OEM Bolt-On", cssClass: "risk-green" };
        if (score >= 75) return { level: "OEM+ Upgrade", cssClass: "risk-blue" };
        if (score >= 50) return { level: "Fabrication Required", cssClass: "risk-yellow" };
        return { level: "Expert Only", cssClass: "risk-red" };
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let partsData = [];
    let tipsData = [];
    let vehicleIndex = {}; 
    let compatibilityEngine = null;

    const makeSelect = document.getElementById('makeSelect');
    const modelSelect = document.getElementById('modelSelect');
    const resultsSection = document.getElementById('results');
    const partsList = document.getElementById('partsList');
    const donorList = document.getElementById('donorList');
    const donorVehicles = document.getElementById('donorVehicles');
    const tipsList = document.getElementById('tipsList');
    const partDetailsSection = document.getElementById('partDetails');
    const selectorSection = document.getElementById('selector');
    const backButton = document.getElementById('backButton');
    const selectedVehicleName = document.getElementById('selectedVehicleName');

    const dataFiles = [
        'data/relationships.json',
        'data/tips.json',
        'data/3d_printing.json',
        'data/fuel_system.json',
        'data/electrical_sensors.json',
        'data/suspension_steering.json',
        'data/brakes.json',
        'data/engine_mechanical.json',
        'data/cooling_hvac.json',
        'data/body_interior.json',
        'data/drivetrain.json',
        'data/body_exterior.json'
    ];

    let relationships = { engines: {}, platforms: {} };
    let printingData = {};

    Promise.all(dataFiles.map(file => fetch(file).then(resp => resp.json())))
        .then(allData => {
            const relationshipData = allData.find(d => d.platforms || d.engines);
            if (relationshipData) {
                relationships = relationshipData;
                compatibilityEngine = new CompatibilityEngine(relationships);
            }
            
            // Find 3D printing data (it's an object with keys like MAZDA_NA_NB, not an array of parts)
            const printingDataFile = allData.find(d => d.MAZDA_NA_NB || d.BMW_E30);
            if (printingDataFile) {
                printingData = printingDataFile;
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

            // Populate index from 3D Printing Data
            if (printingData) {
                Object.keys(printingData).forEach(key => {
                    // Try to find which platform this key corresponds to in relationships
                    // This is tricky because keys like "MAZDA_NA_NB" might not match exactly if not defined in relationships
                    // But let's try to map them if possible, or just rely on the fact that they should be in relationships.
                    // Actually, let's just ensure the vehicles for these keys are in the index.
                    
                    // If the key exists in relationships.platforms, add those vehicles
                    if (relationships.platforms && relationships.platforms[key]) {
                         relationships.platforms[key].forEach(v => addToIndex(v.make, [v], null));
                    }
                });
            }

            buildIndex(partsData);
            populateMakes();
        })
        .catch(err => {
            console.error('Error loading data:', err);
            resultsSection.innerHTML = `<div class="card" style="border-left: 4px solid red;"><h3>⚠️ Data Load Error</h3><p>Could not load the database. Please check your internet connection or try refreshing.</p><p>Details: ${err.message}</p></div>`;
            resultsSection.classList.remove('hidden');
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
                            const byMake = groupBy(vehicles, 'make');
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
                            const byMake = groupBy(vehicles, 'make');
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

    function populateMakes() {
        const makes = Object.keys(vehicleIndex).sort();
        makeSelect.innerHTML = '<option value="">-- Select Make --</option>';
        makes.forEach(make => {
            if (!make) return;
            const option = document.createElement('option');
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
        });
    }

    let activeBuildFilter = null; // placeholder (unused now)

    makeSelect.addEventListener('change', (e) => {
        const selectedMake = makeSelect.value;
        modelSelect.innerHTML = '<option value="">-- Select Model --</option>';
        modelSelect.disabled = true;
        resultsSection.classList.add('hidden');
        partDetailsSection.classList.add('hidden');
        if (donorList) donorList.classList.add('hidden');

        if (selectedMake && vehicleIndex[selectedMake]) {
            let models = Object.keys(vehicleIndex[selectedMake]).sort();
            
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model;
                modelSelect.appendChild(option);
            });
            modelSelect.disabled = false;
        }
    });

    modelSelect.addEventListener('change', () => {
        const make = makeSelect.value;
        const model = modelSelect.value;
        
        if (make && model) {
            showPartsForVehicle(make, model);
        } else {
            resultsSection.classList.add('hidden');
        }
    });

    function showPartsForVehicle(make, model) {
        const parts = vehicleIndex[make] ? vehicleIndex[make][model] : [];
        selectedVehicleName.textContent = `${make} ${model}`;
        partsList.innerHTML = '';
        
        const vehicleAttrs = compatibilityEngine ? compatibilityEngine.getVehicleAttributes(make, model) : {};

        // Show cross-platform / engine donor vehicles
        displayDonors(vehicleAttrs.platformId, vehicleAttrs.engineId, make, model);


        displayTips(make, model);
        display3DPrints(vehicleAttrs.platformId);

        if (parts && parts.length > 0) {
            // Calculate scores for all parts
            
            const scoredParts = parts.map(part => {
                const scoreData = compatibilityEngine ? compatibilityEngine.calculateScore(part, vehicleAttrs, make, model) : { total: 0, breakdown: {} };
                const risk = compatibilityEngine ? compatibilityEngine.getRiskLevel(scoreData.total) : { level: "Unknown", color: "grey" };
                return { part, score: scoreData.total, risk };
            });

            // Sort by score descending
            scoredParts.sort((a, b) => b.score - a.score);

            scoredParts.forEach(item => {
                const { part, score, risk } = item;
                const div = document.createElement('div');
                div.className = `part-item ${risk.cssClass}-border`;
                div.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4>${part.name}</h4>
                        <span class="risk-badge ${risk.cssClass}">${score}% - ${risk.level}</span>
                    </div>
                    <p>${part.category}</p>
                `;
                div.addEventListener('click', () => showPartDetails(part, make, model));
                partsList.appendChild(div);
            });
            resultsSection.classList.remove('hidden');
            partDetailsSection.classList.add('hidden');
            selectorSection.classList.remove('hidden');
        } else {
            partsList.innerHTML = '<p>No compatible parts found in database.</p>';
            resultsSection.classList.remove('hidden');
        }
    }

    function displayTips(make, model) {
        if (!tipsList) return;
        tipsList.innerHTML = '';
        tipsList.classList.add('hidden');

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
            tipsList.classList.remove('hidden');
            relevantTips.forEach(tip => {
                const div = document.createElement('div');
                div.className = `tip-card tip-${tip.severity ? tip.severity.toLowerCase() : 'info'}`;
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
        donorVehicles.innerHTML = '';

        const donors = [];
        const addDonor = (v, reason) => {
            const name = v.model || v.name;
            if (!name) return;
            const display = `${v.make} ${name}`;
            if (display.toLowerCase() === `${make} ${model}`.toLowerCase()) return; // skip self
            donors.push({ display, years: v.years || '', notes: v.notes || '', reason });
        };

        if (platformId && relationships.platforms && relationships.platforms[platformId]) {
            relationships.platforms[platformId].forEach(v => addDonor(v, 'Same platform'));
        }
        if (engineId && relationships.engines && relationships.engines[engineId]) {
            relationships.engines[engineId].forEach(v => addDonor(v, 'Shared engine'));
        }

        // Deduplicate by display name + reason
        const seen = new Set();
        donors.forEach(d => {
            const key = `${d.display}-${d.reason}`;
            if (seen.has(key)) return;
            seen.add(key);
            const li = document.createElement('li');
            const reasonText = d.reason ? ` – ${d.reason}` : '';
            const notesText = d.notes ? ` (${d.notes})` : '';
            li.textContent = `${d.display}${d.years ? ' [' + d.years + ']' : ''}${reasonText}${notesText}`;
            donorVehicles.appendChild(li);
        });

        if (donors.length > 0) {
            donorList.classList.remove('hidden');
        } else {
            donorList.classList.add('hidden');
        }
    }

    function displayKitDonors(kitKey) {
        if (!donorList || !donorVehicles) return;
        if (!kitDonors[kitKey]) return;

        // append (do not clear) to combine dynamic donors with kit list
        kitDonors[kitKey].forEach(d => {
            const li = document.createElement('li');
            const notesText = d.notes ? ` (${d.notes})` : '';
            li.textContent = `${d.make} ${d.model}${d.years ? ' [' + d.years + ']' : ''}${notesText}`;
            donorVehicles.appendChild(li);
        });
        donorList.classList.remove('hidden');
    }


    backButton.addEventListener('click', () => {
        partDetailsSection.classList.add('hidden');
        selectorSection.classList.remove('hidden');
        resultsSection.classList.remove('hidden');
    });

    // Build Guide Data
    const buildGuides = {
        'exocet': {
            title: "Exomotive Exocet (Kit Car)",
            description: "Miata-based tube frame. Strip NA/NB (and some NC) Miata donors and reuse subframes, drivetrain, and wiring as the backbone of the kit."
        },
        'mev_mevster': {
            title: "MEV Mevster (Kit Car)",
            description: "Miata donor, but with more bodywork/roof than the bare Exocet. Keep Miata running gear and wiring, add weather protection." 
        },
        'mev_replicar': {
            title: "MEV Replicar (Kit Car)",
            description: "Aston DBR1-inspired body over Miata running gear. Uses Miata donor parts throughout (engine, suspension, wiring)."
        },
        'goblin': {
            title: "DF Goblin (Kit Car)",
            description: "Cobalt-based mid-engine kit. Pull the Cobalt powertrain, harness, pedal box, hubs; the chassis bolts to the Goblin frame. SS/SC trims are best."
        },
        'factory_five_818': {
            title: "Factory Five 818 (Kit Car)",
            description: "Subaru WRX donor (2002–2007 common). Uses engine, trans, suspension, brakes, wiring. Mid-engine layout with turbo potential." 
        },
        'caterham_seven': {
            title: "Caterham/Westfield (Kit Car)",
            description: "Lotus Seven style. Often Ford donors (Sierra/Focus). Lightweight, front-engine RWD with donor suspension/brakes/drivetrain." 
        }
    };

    const kitDonors = {
        'exocet': [
            { make: 'Mazda', model: 'MX-5 Miata (NA)', years: '1990–1997', notes: 'Primary donor' },
            { make: 'Mazda', model: 'MX-5 Miata (NB)', years: '1999–2005', notes: 'Primary donor' },
            { make: 'Mazda', model: 'MX-5 Miata (NC)', years: '2006–2015', notes: 'Some kits support NC' }
        ],
        'mev_mevster': [
            { make: 'Mazda', model: 'MX-5 Miata (NA)', years: '1990–1997', notes: 'Donor' },
            { make: 'Mazda', model: 'MX-5 Miata (NB)', years: '1999–2005', notes: 'Donor' },
            { make: 'Mazda', model: 'MX-5 Miata (NC)', years: '2006–2015', notes: 'Possible donor' }
        ],
        'mev_replicar': [
            { make: 'Mazda', model: 'MX-5 Miata (NA)', years: '1990–1997', notes: 'Donor' },
            { make: 'Mazda', model: 'MX-5 Miata (NB)', years: '1999–2005', notes: 'Donor' }
        ],
        'goblin': [
            { make: 'Chevrolet', model: 'Cobalt', years: '2005–2010', notes: 'Donor' },
            { make: 'Pontiac', model: 'G5', years: '2007–2010', notes: 'Donor' },
            { make: 'Chevrolet', model: 'Cobalt SS', years: '2005–2010', notes: 'Best drivetrains (LSJ/LNF)' }
        ],
        'factory_five_818': [
            { make: 'Subaru', model: 'Impreza WRX (GD/GG)', years: '2002–2007', notes: 'Primary donor' },
            { make: 'Subaru', model: 'Impreza WRX STI (GD)', years: '2004–2007', notes: 'Premium donor' }
        ],
        'caterham_seven': [
            { make: 'Ford', model: 'Sierra', years: '1982–1993', notes: 'Common donor (EU)' },
            { make: 'Ford', model: 'Focus (Mk1)', years: '1998–2004', notes: 'Donor for later kits' }
        ]
    };

    // Quick Build Handler
    const quickBuildSelect = document.getElementById('quickBuildSelect');
    const buildGuideBanner = document.getElementById('buildGuideBanner');
    const buildGuideTitle = document.getElementById('buildGuideTitle');
    const buildGuideText = document.getElementById('buildGuideText');

    if (quickBuildSelect) {
        quickBuildSelect.addEventListener('change', (e) => {
            const build = e.target.value;
            
            // Reset filter if empty selection
            if (!build) {
                activeBuildFilter = null;
                makeSelect.value = "";
                makeSelect.dispatchEvent(new Event('change'));
                if(buildGuideBanner) buildGuideBanner.classList.add('hidden');
                return;
            }

            // Show Build Guide
            if (buildGuides[build] && buildGuideBanner) {
                buildGuideTitle.textContent = buildGuides[build].title;
                buildGuideText.textContent = buildGuides[build].description;
                buildGuideBanner.classList.remove('hidden');
            }

            let targetMake = "";
            let filterKeywords = [];

            switch (build) {
                case 'exocet':
                case 'mev_mevster':
                case 'mev_replicar':
                    targetMake = "Mazda"; // Miata donor
                    filterKeywords = ["MX-5", "Miata", "MX-5 Miata (NA)", "MX-5 Miata (NB)", "MX-5 Miata (NC)"];
                    break;
                case 'goblin':
                    targetMake = "Chevrolet"; // Goblin uses Cobalt donor
                    filterKeywords = ["Cobalt", "Cobalt SS", "G5"];
                    break;
                case 'factory_five_818':
                    targetMake = "Subaru"; // WRX donor
                    filterKeywords = ["Impreza", "WRX", "WRX STI"];
                    break;
                case 'caterham_seven':
                    targetMake = "Ford"; // Ford donors
                    filterKeywords = ["Sierra", "Focus"];
                    break;
            }

            if (targetMake) {
                // Set Global Filter
                activeBuildFilter = { make: targetMake, keywords: filterKeywords };
                quickBuildAutoSelectModel = true;
                quickBuildActiveKit = build;

                // Trigger Make Selection
                makeSelect.value = targetMake;
                // If the make exists in the list, trigger change to filter models
                if (makeSelect.value === targetMake) {
                    makeSelect.dispatchEvent(new Event('change'));
                } else {
                    // Fallback if make not found (e.g. "Lancia" might not be in top level if no parts yet, 
                    // but we fixed populateMakes to include all relationships)
                    console.warn(`Make ${targetMake} not found in dropdown`);
                }
            }
        });
    }
});
                    filterKeywords = ["Escort", "Sierra", "Focus RS"];
                    break;
                case 'kei_sport':
                    targetMake = "Suzuki"; // Broaden to Suzuki for Cappuccino/Alto
                    filterKeywords = ["Cappuccino", "Alto", "Jimny"];
                    break;
            }

            if (targetMake) {
                // Set Global Filter
                activeBuildFilter = { make: targetMake, keywords: filterKeywords };

                // Trigger Make Selection
                makeSelect.value = targetMake;
                makeSelect.dispatchEvent(new Event('change'));
                
                // Visual Feedback
                modelSelect.focus();
                // Optional: Open dropdown if possible (browser restrictions usually prevent this)
            }
        });
    }
});
