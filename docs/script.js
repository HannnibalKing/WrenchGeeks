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
        if (!vehicleIndex[make]) vehicleIndex[make] = {};
        models.forEach(model => {
            const modelName = model.name || model.model;
            if (!vehicleIndex[make][modelName]) vehicleIndex[make][modelName] = [];
            if (part && !vehicleIndex[make][modelName].includes(part)) {
                vehicleIndex[make][modelName].push(part);
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
        makes.forEach(make => {
            const option = document.createElement('option');
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
        });
    }

    let activeBuildFilter = null; // Global filter for Quick Builds

    makeSelect.addEventListener('change', () => {
        const selectedMake = makeSelect.value;
        modelSelect.innerHTML = '<option value="">-- Select Model --</option>';
        modelSelect.disabled = true;
        resultsSection.classList.add('hidden');
        partDetailsSection.classList.add('hidden');

        if (selectedMake && vehicleIndex[selectedMake]) {
            let models = Object.keys(vehicleIndex[selectedMake]).sort();
            
            // Apply Quick Build Filter if active
            if (activeBuildFilter && activeBuildFilter.make === selectedMake) {
                models = models.filter(model => {
                    return activeBuildFilter.keywords.some(keyword => 
                        model.toLowerCase().includes(keyword.toLowerCase())
                    );
                });
            }

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

    function display3DPrints(platformId) {
        if (!platformId || !printingData[platformId]) return;

        const prints = printingData[platformId];
        const container = document.createElement('div');
        container.className = 'printing-section';
        container.innerHTML = `<h3>3D Printable Parts <span style="font-size:0.8em; color:#888;">(Community Verified)</span></h3>`;
        
        const grid = document.createElement('div');
        grid.className = 'printing-grid';

        prints.forEach(item => {
            const card = document.createElement('div');
            card.className = 'print-card';
            
            const searchUrl = `https://www.yeggi.com/q/${encodeURIComponent(item.search_term)}/`;
            
            card.innerHTML = `
                <h4 style="margin-top:0;">${item.name}</h4>
                <p style="font-size:0.9em; margin-bottom:10px;">${item.description}</p>
                <a href="${searchUrl}" target="_blank" class="print-btn">Find STL Files ↗</a>
            `;
            grid.appendChild(card);
        });

        container.appendChild(grid);
        partsList.appendChild(container);
    }

    function showPartDetails(part, make, model) {
        selectorSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
        partDetailsSection.classList.remove('hidden');

        document.getElementById('partName').textContent = part.name;
        document.getElementById('partCategory').textContent = part.category;
        document.getElementById('partDescription').textContent = part.description;

        // Calculate Score Breakdown for this specific vehicle
        const vehicleAttrs = compatibilityEngine ? compatibilityEngine.getVehicleAttributes(make, model) : {};
        const scoreData = compatibilityEngine ? compatibilityEngine.calculateScore(part, vehicleAttrs, make, model) : { total: 0, breakdown: {} };
        const risk = compatibilityEngine ? compatibilityEngine.getRiskLevel(scoreData.total) : { level: "Unknown", color: "grey" };

        // Inject Score Display
        const scoreContainer = document.createElement('div');
        scoreContainer.className = 'score-container';
        scoreContainer.innerHTML = `
            <div class="score-header">
                <h3>Compatibility Score: ${scoreData.total}/100</h3>
                <span class="risk-badge ${risk.cssClass}">${risk.level}</span>
            </div>
            <ul class="score-breakdown">
                <li><strong>Platform Match:</strong> ${scoreData.breakdown.platform}/30</li>
                <li><strong>Engine Match:</strong> ${scoreData.breakdown.engine}/25</li>
                <li><strong>Mounting Match:</strong> ${scoreData.breakdown.mounting}/20</li>
                <li><strong>Protocol Match:</strong> ${scoreData.breakdown.protocol}/15</li>
                <li><strong>Era Match:</strong> ${scoreData.breakdown.era}/10</li>
            </ul>
        `;
        
        // Insert after description
        const desc = document.getElementById('partDescription');
        if(desc.nextSibling && desc.nextSibling.className === 'score-container') {
            desc.nextSibling.remove();
        }
        desc.parentNode.insertBefore(scoreContainer, desc.nextSibling);


        const specsList = document.getElementById('partSpecs');
        specsList.innerHTML = '';
        part.specs.forEach(spec => {
            const li = document.createElement('li');
            li.textContent = spec;
            specsList.appendChild(li);
        });

        const vehiclesContainer = document.getElementById('compatibleVehicles');
        vehiclesContainer.innerHTML = '';
        
        let allVehicles = [];
        if (part.compatibility) {
            part.compatibility.forEach(group => {
                group.models.forEach(m => allVehicles.push({ ...m, make: group.make }));
            });
        }
        if (part.compatibility_smart) {
             if (part.compatibility_smart.platforms) {
                part.compatibility_smart.platforms.forEach(pid => {
                    const v = relationships.platforms[pid];
                    if(v) allVehicles.push(...v);
                });
             }
             if (part.compatibility_smart.engines) {
                part.compatibility_smart.engines.forEach(eid => {
                    const v = relationships.engines[eid];
                    if(v) allVehicles.push(...v);
                });
             }
        }

        const grouped = groupBy(allVehicles, 'make');
        Object.keys(grouped).sort().forEach(make => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'vehicle-group';
            const header = document.createElement('h5');
            header.textContent = make;
            groupDiv.appendChild(header);
            const ul = document.createElement('ul');
            const uniqueModels = [];
            const seen = new Set();
            grouped[make].forEach(model => {
                const name = model.name || model.model;
                if(!seen.has(name)) {
                    seen.add(name);
                    uniqueModels.push(model);
                }
            });
            uniqueModels.forEach(model => {
                const li = document.createElement('li');
                const name = model.name || model.model;
                li.innerHTML = `<strong>${name}</strong> (${model.years}) - ${model.notes}`;
                ul.appendChild(li);
            });
            groupDiv.appendChild(ul);
            vehiclesContainer.appendChild(groupDiv);
        });

        const universalList = document.getElementById('universalParts');
        universalList.innerHTML = '';
        if (part.universal_alternatives && part.universal_alternatives.length > 0) {
            part.universal_alternatives.forEach(alt => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${alt.name}</strong>: ${alt.notes}`;
                universalList.appendChild(li);
            });
        } else {
            universalList.innerHTML = '<li>No universal alternatives listed.</li>';
        }
    }

    backButton.addEventListener('click', () => {
        partDetailsSection.classList.add('hidden');
        selectorSection.classList.remove('hidden');
        resultsSection.classList.remove('hidden');
    });

    // Quick Build Handler
    const quickBuildSelect = document.getElementById('quickBuildSelect');
    if (quickBuildSelect) {
        quickBuildSelect.addEventListener('change', (e) => {
            const build = e.target.value;
            
            // Reset filter if empty selection
            if (!build) {
                activeBuildFilter = null;
                makeSelect.value = "";
                makeSelect.dispatchEvent(new Event('change'));
                return;
            }

            let targetMake = "";
            let filterKeywords = [];

            switch (build) {
                case 'safari':
                    targetMake = "Porsche";
                    filterKeywords = ["G-Series", "964", "993", "SC", "Carrera"];
                    break;
                case 'exocet':
                    targetMake = "Mazda"; // Exocet uses Miata donor
                    filterKeywords = ["Miata (NA)", "Miata (NB)"];
                    break;
                case 'goblin':
                    targetMake = "Chevrolet"; // Goblin uses Cobalt donor
                    filterKeywords = ["Cobalt"];
                    break;
                case 'barra':
                    targetMake = "Ford";
                    filterKeywords = ["Falcon", "Territory"];
                    break;
                case 'kswap':
                    targetMake = "Honda";
                    filterKeywords = ["Civic", "Integra", "RSX", "TSX"];
                    break;
                case 'ls_swap':
                    targetMake = "Chevrolet";
                    filterKeywords = ["Silverado", "Corvette", "Camaro", "Tahoe"];
                    break;
                case 'rally_lancia':
                    targetMake = "Lancia";
                    filterKeywords = ["Delta"];
                    break;
                case 'rally_ford':
                    targetMake = "Ford";
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
