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
        if (score >= 90) return { level: "Direct Transplant (Low Risk)", cssClass: "risk-green" };
        if (score >= 75) return { level: "Compatible Donor (Moderate Risk)", cssClass: "risk-blue" };
        if (score >= 50) return { level: "Invasive Surgery (High Risk)", cssClass: "risk-yellow" };
        return { level: "Experimental (Critical Risk)", cssClass: "risk-red" };
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
    const yearSelect = document.getElementById('yearSelect');
    const searchButton = document.getElementById('searchButton');

    const dataFiles = [
        'data/relationships.json',
        'data/tips.json',
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
        // Filter makes to only those that have models with parts
        const makes = Object.keys(vehicleIndex).filter(make => {
            return Object.keys(vehicleIndex[make]).some(model => hasContent(make, model));
        }).sort();

        makeSelect.innerHTML = '<option value="">-- Select Make --</option>';
        makes.forEach(make => {
            if (!make) return;
            const option = document.createElement('option');
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
        });

        if (makeLoadStatus) {
            makeLoadStatus.textContent = makes.length > 0 ? `Registry Online: ${makes.length} Manufacturers Loaded` : 'Registry Offline: No Manufacturers Found';
        }
        if (subsystemSelect) subsystemSelect.disabled = false;
    }

    function hasContent(make, model) {
        // Check for parts
        if (vehicleIndex[make][model] && vehicleIndex[make][model].length > 0) return true;
        
        return false;
    }

    const subsystemOptions = [
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
        yearSelect.innerHTML = '<option value="">-- Select Year --</option>';
        yearSelect.disabled = true;
        if (subsystemSelect) subsystemSelect.disabled = true;
        if (searchButton) searchButton.disabled = true;
        resultsSection.classList.add('hidden');
        partDetailsSection.classList.add('hidden');
        if (donorList) donorList.classList.add('hidden');

        if (selectedMake && vehicleIndex[selectedMake]) {
            let models = Object.keys(vehicleIndex[selectedMake])
                .filter(model => hasContent(selectedMake, model))
                .sort();
            
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
        
        yearSelect.innerHTML = '<option value="">-- Select Year --</option>';
        yearSelect.disabled = true;
        if (searchButton) searchButton.disabled = true;

        if (make && model) {
            populateYears(make, model);
        } else {
            resultsSection.classList.add('hidden');
        }
    });

    yearSelect.addEventListener('change', () => {
        const make = makeSelect.value;
        const model = modelSelect.value;
        const year = yearSelect.value;

        if (make && model && year) {
            if (subsystemSelect) subsystemSelect.disabled = false;
            if (searchButton) searchButton.disabled = false;
        } else {
            if (subsystemSelect) subsystemSelect.disabled = true;
            if (searchButton) searchButton.disabled = true;
        }
    });

    function populateYears(make, model) {
        // Find the vehicle definition to get the year range
        let yearRange = null;
        
        // Check platforms
        if (relationships.platforms) {
            for (const vehicles of Object.values(relationships.platforms)) {
                const match = vehicles.find(v => v.make === make && (v.model === model || v.name === model));
                if (match && match.years) {
                    yearRange = match.years;
                    break;
                }
            }
        }
        // Check engines if not found
        if (!yearRange && relationships.engines) {
            for (const vehicles of Object.values(relationships.engines)) {
                const match = vehicles.find(v => v.make === make && (v.model === model || v.name === model));
                if (match && match.years) {
                    yearRange = match.years;
                    break;
                }
            }
        }

        if (yearRange) {
            const years = parseYearRange(yearRange);
            years.sort((a, b) => b - a); // Descending
            years.forEach(y => {
                const option = document.createElement('option');
                option.value = y;
                option.textContent = y;
                yearSelect.appendChild(option);
            });
            yearSelect.disabled = false;
        } else {
            // Fallback if no years found (shouldn't happen with good data)
            const option = document.createElement('option');
            option.value = "Unknown";
            option.textContent = "Unknown Year";
            yearSelect.appendChild(option);
            yearSelect.disabled = false;
        }
    }

    function parseYearRange(rangeStr) {
        const years = [];
        const parts = rangeStr.split('–'); // En dash
        if (parts.length === 2) {
            const start = parseInt(parts[0]);
            let end = parts[1].toLowerCase() === 'present' ? new Date().getFullYear() : parseInt(parts[1]);
            if (isNaN(end)) end = start; // Handle single year or bad format
            
            for (let i = start; i <= end; i++) {
                years.push(i);
            }
        } else if (parts.length === 1) {
             // Try hyphen if en dash failed
             const parts2 = rangeStr.split('-');
             if (parts2.length === 2) {
                const start = parseInt(parts2[0]);
                let end = parts2[1].toLowerCase() === 'present' ? new Date().getFullYear() : parseInt(parts2[1]);
                for (let i = start; i <= end; i++) {
                    years.push(i);
                }
             } else {
                 years.push(parseInt(rangeStr));
             }
        }
        return years;
    }

    if (subsystemSelect) {
        subsystemSelect.addEventListener('change', () => {
            activeSubsystem = subsystemSelect.value || '';
        });
    }

    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const make = makeSelect.value;
            const model = modelSelect.value;
            const year = yearSelect.value;
            console.log('Search clicked for:', make, model, year);
            if (make && model) {
                showPartsForVehicle(make, model, year);
            } else {
                console.warn('Search clicked but make/model missing');
            }
        });
    }

    function showPartsForVehicle(make, model, year) {
        try {
            console.log('Showing parts for:', make, model, year);
            
            // Ensure results section is visible immediately to show we are trying
            resultsSection.classList.remove('hidden');
            partsList.innerHTML = '<p>Scanning donor network...</p>';

            const parts = vehicleIndex[make] ? vehicleIndex[make][model] : [];
            console.log('Parts found in index:', parts ? parts.length : 0);
            
            if (!parts) {
                partsList.innerHTML = '<p>No compatible organs found in the registry.</p>';
                return;
            }

            selectedVehicleName.textContent = `${make} ${model} ${year && year !== 'Unknown' ? `(${year})` : ''}`;
            partsList.innerHTML = '';
            
            const vehicleAttrs = compatibilityEngine ? compatibilityEngine.getVehicleAttributes(make, model) : {};
            console.log('Vehicle Attributes:', vehicleAttrs);

            // Show cross-platform / engine donor vehicles
            displayDonors(vehicleAttrs.platformId, vehicleAttrs.engineId, make, model);


            displayTips(make, model);

            let filteredParts = parts;

            // Filter by Year if provided
            if (year && year !== "Unknown") {
                const selectedYear = parseInt(year);
                filteredParts = filteredParts.filter(part => {
                    // Check for explicit compatibility restrictions
                    if (part.compatibility) {
                        const makeEntry = part.compatibility.find(c => c.make === make);
                        if (makeEntry) {
                            // Find model entry that matches the selected model name
                            const modelEntry = makeEntry.models.find(m => m.name === model || model.includes(m.name) || m.name.includes(model));
                            
                            if (modelEntry && modelEntry.years) {
                                const allowedYears = parseYearRange(modelEntry.years);
                                if (!allowedYears.includes(selectedYear)) {
                                    return false; // Explicitly restricted to other years
                                }
                            }
                        }
                    }
                    return true; // No explicit restriction found, or matches
                });
            }

            if (activeSubsystem) {
            console.log('Filtering by subsystem:', activeSubsystem);
            // Normalize for looser matching (e.g. "Suspension/Steering" vs "Suspension & Steering")
            const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const search = normalize(activeSubsystem);

            filteredParts = filteredParts.filter(part => {
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
            partsList.innerHTML = '<p>No matches found in donor registry.</p>';
            resultsSection.classList.remove('hidden');
        }
        } catch (e) {
            console.error("CRITICAL ERROR in showPartsForVehicle:", e);
            partsList.innerHTML = `<div class="card" style="border-left: 4px solid red;">
                <h3>⚠️ System Failure</h3>
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

    function showPartDetails(part, make, model) {
        const partName = document.getElementById('partName');
        const partCategory = document.getElementById('partCategory');
        const partDescription = document.getElementById('partDescription');
        const partSpecs = document.getElementById('partSpecs');
        const compatibleVehicles = document.getElementById('compatibleVehicles');
        const universalParts = document.getElementById('universalParts');
        const proTipSection = document.getElementById('proTipSection');
        const proTipContent = document.getElementById('proTipContent');

        partName.textContent = part.name;
        partCategory.textContent = part.category;
        partDescription.textContent = part.description;

        // Specs
        partSpecs.innerHTML = '';
        if (part.average_price) {
            const li = document.createElement('li');
            li.innerHTML = `<strong>💰 Average Price:</strong> ${part.average_price}`;
            li.style.color = '#10b981'; // Green color for money
            partSpecs.appendChild(li);
        }
        if (part.specs) {
            part.specs.forEach(spec => {
                const li = document.createElement('li');
                li.textContent = spec;
                partSpecs.appendChild(li);
            });
        }

        // Compatible Vehicles
        compatibleVehicles.innerHTML = '';
        if (part.compatibility) {
            part.compatibility.forEach(group => {
                const div = document.createElement('div');
                div.className = 'vehicle-group';
                div.innerHTML = `<h5>${group.make}</h5>`;
                const ul = document.createElement('ul');
                group.models.forEach(m => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${m.name || m.model}</strong> (${m.years}) <br><small>${m.notes}</small>`;
                    ul.appendChild(li);
                });
                div.appendChild(ul);
                compatibleVehicles.appendChild(div);
            });
        }

        // Universal / Aftermarket
        universalParts.innerHTML = '';
        if (part.universal_alternatives) {
            part.universal_alternatives.forEach(alt => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${alt.name}</strong>: ${alt.notes}`;
                universalParts.appendChild(li);
            });
        }

        // Pro Tip / History
        if (proTipSection) {
            if (part.pro_tip || part.history) {
                proTipSection.classList.remove('hidden');
                proTipContent.innerHTML = '';
                if (part.history) {
                     proTipContent.innerHTML += `<p style="margin-bottom:0.5rem;"><strong>📜 History:</strong> ${part.history}</p>`;
                }
                if (part.pro_tip) {
                     proTipContent.innerHTML += `<p><strong>💡 Pro Tip:</strong> ${part.pro_tip}</p>`;
                }
            } else {
                proTipSection.classList.add('hidden');
            }
        }

        // Show/Hide Sections
        selectorSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        partDetailsSection.classList.remove('hidden');
        window.scrollTo(0, 0);
    }

    backButton.addEventListener('click', () => {
        partDetailsSection.classList.add('hidden');
        selectorSection.classList.remove('hidden');
        resultsSection.classList.remove('hidden');
    });
});
