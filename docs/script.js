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
    const makeLoadStatus = document.getElementById('makeLoadStatus');
    const subsystemSelect = document.getElementById('subsystemSelect');
    const searchButton = document.getElementById('searchButton');

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
            populateSubsystems();
            const totalMakes = Object.keys(vehicleIndex).length;
            const totalModels = Object.values(vehicleIndex).reduce((acc, models) => acc + Object.keys(models).length, 0);
            const totalParts = partsData.length;
            if (makeLoadStatus) {
                makeLoadStatus.textContent = totalMakes > 0
                    ? `Loaded ${totalMakes} makes / ${totalModels} models / ${totalParts} parts`
                    : 'No makes loaded';
            }
            console.info('Data loaded', { totalMakes, totalModels, totalParts });
        })
        .catch(err => {
            console.error('Error loading data:', err);
            resultsSection.innerHTML = `<div class="card" style="border-left: 4px solid red;">
                <h3>⚠️ Data Load Error</h3>
                <p>Could not load the database. Please check your internet connection or try refreshing.</p>
                <p><strong>Tip:</strong> Try a Hard Refresh (Ctrl+F5 or Cmd+Shift+R) to clear old data.</p>
                <p>Details: ${err.message}</p>
            </div>`;
            resultsSection.classList.remove('hidden');
            if (makeLoadStatus) makeLoadStatus.textContent = 'Error loading data';
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

        if (makeLoadStatus) {
            makeLoadStatus.textContent = makes.length > 0 ? `Loaded ${makes.length} makes` : 'No makes loaded';
        }
        if (subsystemSelect) subsystemSelect.disabled = false;
    }

    const subsystemOptions = [
        '3D Printing',
        'Body Exterior',
        'Body Interior',
        'Brakes',
        'Cooling/HVAC',
        'Drivetrain',
        'Electrical/Sensors',
        'Engine Mechanical',
        'Fuel System',
        'Suspension/Steering'
    ];

    let activeSubsystem = '';

    function populateSubsystems() {
        if (!subsystemSelect) return;
        subsystemSelect.innerHTML = '<option value="">All subsystems</option>';
        subsystemOptions.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            subsystemSelect.appendChild(option);
        });
    }

    let activeBuildFilter = null; // placeholder (unused now)

    makeSelect.addEventListener('change', (e) => {
        const selectedMake = makeSelect.value;
        modelSelect.innerHTML = '<option value="">-- Select Model --</option>';
        modelSelect.disabled = true;
        if (subsystemSelect) subsystemSelect.disabled = true;
        if (searchButton) searchButton.disabled = true;
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
            if (subsystemSelect) subsystemSelect.disabled = false;
            if (searchButton) searchButton.disabled = false;
        } else {
            if (subsystemSelect) subsystemSelect.disabled = true;
            if (searchButton) searchButton.disabled = true;
            resultsSection.classList.add('hidden');
        }
    });

    if (subsystemSelect) {
        subsystemSelect.addEventListener('change', () => {
            activeSubsystem = subsystemSelect.value || '';
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const make = makeSelect.value;
            const model = modelSelect.value;
            console.log('Search clicked for:', make, model);
            if (make && model) {
                showPartsForVehicle(make, model);
            } else {
                console.warn('Search clicked but make/model missing');
            }
        });
    }

    function showPartsForVehicle(make, model) {
        try {
            console.log('Showing parts for:', make, model);
            
            // Ensure results section is visible immediately to show we are trying
            resultsSection.classList.remove('hidden');
            partsList.innerHTML = '<p>Searching database...</p>';

            const parts = vehicleIndex[make] ? vehicleIndex[make][model] : [];
            console.log('Parts found in index:', parts ? parts.length : 0);
            
            if (!parts) {
                partsList.innerHTML = '<p>No parts found for this specific model in the index.</p>';
                return;
            }

            selectedVehicleName.textContent = `${make} ${model}`;
            partsList.innerHTML = '';
            
            const vehicleAttrs = compatibilityEngine ? compatibilityEngine.getVehicleAttributes(make, model) : {};
            console.log('Vehicle Attributes:', vehicleAttrs);

            // Show cross-platform / engine donor vehicles
            displayDonors(vehicleAttrs.platformId, vehicleAttrs.engineId, make, model);


            displayTips(make, model);
            display3DPrints(vehicleAttrs.platformId);

            let filteredParts = parts;

            if (activeSubsystem) {
            console.log('Filtering by subsystem:', activeSubsystem);
            // Normalize for looser matching (e.g. "Suspension/Steering" vs "Suspension & Steering")
            const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const search = normalize(activeSubsystem);

            filteredParts = parts.filter(part => {
                const cat = normalize(part.category || '');
                // Check if one contains the other
                return cat.includes(search) || search.includes(cat);
            });
        }
        console.log('Filtered parts count:', filteredParts.length);

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
            console.log('No parts found, showing empty message');
            partsList.innerHTML = '<p>No compatible parts found in database matching your criteria.</p>';
            resultsSection.classList.remove('hidden');
        }
        } catch (e) {
            console.error("CRITICAL ERROR in showPartsForVehicle:", e);
            partsList.innerHTML = `<div class="card" style="border-left: 4px solid red;">
                <h3>⚠️ Application Error</h3>
                <p>Something went wrong while displaying parts.</p>
                <p>Error: ${e.message}</p>
            </div>`;
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
    backButton.addEventListener('click', () => {
        partDetailsSection.classList.add('hidden');
        selectorSection.classList.remove('hidden');
        resultsSection.classList.remove('hidden');
    });
});
