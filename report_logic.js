/* ----------------- Globals ----------------- */
let reportMeta = {};
let reportData = {};
let selectedRuns = [];
const keyFieldsForChart = ['title', 'abstract', 'authors', 'doi', 'references_count', 'keywords'];
// let activeFieldForModal = null; // No longer needed for the old modal
let displayMode = 'percent'; // 'percent' | 'count'
// let detailModal; // Removed old modal instance
let fieldDetailModal; // *** NEW: Bootstrap modal instance for Field Details ***
let ragContextModal; // Bootstrap modal instance for RAG context
let ragCueDetailModal; // Bootstrap modal instance for RAG Cue Details

/* ----------------- Fetch & Init ----------------- */
document.addEventListener('DOMContentLoaded', () => {
    fetch('reports_manifest.json')
        .then(r => {
            if (!r.ok) throw new Error(`HTTP error! status: ${r.status}`);
            return r.json();
        })
        .then(m => {
            reportMeta = m;
            if (Object.keys(reportMeta).length === 0) {
                 console.warn("Manifest file loaded but is empty or invalid.");
                 return Promise.resolve(); // Resolve gracefully to show error later
            }
            // Fetch data for runs listed in the manifest
            return Promise.all(
                Object.entries(m).map(([id, meta]) => {
                    if (!meta.data_file) {
                        console.error(`Manifest entry for '${id}' is missing 'data_file'. Skipping.`);
                        return Promise.resolve(null); // Skip this run
                    }
                    return fetch(meta.data_file)
                        .then(r => {
                            if (!r.ok) throw new Error(`Failed to fetch ${meta.data_file}: ${r.status}`);
                            return r.json();
                        })
                        .then(d => ({ id, data: d })) // Return data with its ID
                        .catch(e => {
                            console.error(`Failed to load or parse data for ${id} from ${meta.data_file}: ${e}`);
                            return null; // Indicate failure for this run
                        });
                })
            );
        })
        .then(results => {
            // Filter out runs where data failed to load (results will contain null for failures)
            const loadedData = results.filter(r => r !== null);
            reportData = loadedData.reduce((acc, { id, data }) => {
                acc[id] = data;
                return acc;
            }, {});

            // Update reportMeta to only include successfully loaded runs
            const loadedRunIds = Object.keys(reportData);
            reportMeta = Object.entries(reportMeta)
                             .filter(([id]) => loadedRunIds.includes(id))
                             .reduce((obj, [key, value]) => { obj[key] = value; return obj; }, {});

            initApp();
         })
        .catch(e => {
            console.error("Initialization failed:", e);
            document.body.innerHTML = `<div class="alert alert-danger m-5" role="alert">Failed to initialize report data. Check console for errors and ensure 'reports_manifest.json' is present and correct. Error: ${e.message}</div>`;
        });
});

/* ----------------- App Initialization ----------------- */
function initApp() {
    if (Object.keys(reportMeta).length === 0) {
         document.body.innerHTML = `<div class="alert alert-warning m-5" role="alert">No valid report data could be loaded. Please check the data files listed in 'reports_manifest.json' and the manifest file itself.</div>`;
         return;
    }
    // detailModal = new bootstrap.Modal(document.getElementById('detailModal')); // Removed old modal
    fieldDetailModal = new bootstrap.Modal(document.getElementById('fieldDetailModal')); // *** NEW: Init Field Detail modal ***
    ragContextModal = new bootstrap.Modal(document.getElementById('ragContextModal')); // Init RAG context modal
    ragCueDetailModal = new bootstrap.Modal(document.getElementById('ragCueDetailModal')); // Init RAG Cue Detail modal
    buildToolbar();
    buildSummaryCards();
    buildFieldList();
    renderChart(); // Initial chart render (will handle visibility)
    renderRagAnalysis(); // Initial RAG table render
}

/* ----------------- UI BUILDERS ----------------- */
function buildToolbar() {
    const bar = document.getElementById('toolbar');
    bar.innerHTML = '';
    selectedRuns = []; // Reset selected runs

    // Sort runs based on timestamp in manifest (newest first) if available
    const sortedRunIds = Object.keys(reportMeta).sort((a, b) => {
        const timeA = reportMeta[a]?.timestamp ? new Date(reportMeta[a].timestamp).getTime() : 0;
        const timeB = reportMeta[b]?.timestamp ? new Date(reportMeta[b].timestamp).getTime() : 0;
        return timeB - timeA; // Descending order
    });


    sortedRunIds.forEach((run) => {
        const div = document.createElement('div');
        div.className = 'form-check form-check-inline'; // Inline checks
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.className = 'form-check-input';
        cb.checked = true; // Default check all
        cb.value = run;
        cb.id = `check-${run}`;
        cb.addEventListener('change', handleRunToggle);
        selectedRuns.push(run); // Add to selected

        const label = document.createElement('label');
        label.className = 'form-check-label';
        label.htmlFor = cb.id;
        label.textContent = run;

        div.append(cb, label);
        bar.append(div);
    });

    // Metric toggle button
    const metricBtn = document.createElement('button');
    metricBtn.className = 'btn btn-info btn-sm ms-auto'; // Push subsequent buttons right
    metricBtn.textContent = displayMode === 'percent' ? '% Mode' : '# Mode';
    metricBtn.title = 'Toggle between percentage and count view';
    metricBtn.addEventListener('click', () => {
        displayMode = displayMode === 'percent' ? 'count' : 'percent';
        metricBtn.textContent = displayMode === 'percent' ? '% Mode' : '# Mode';
        updateFieldBadges();
        renderChart(); // Re-render chart with new mode (handles visibility)
        renderRagAnalysis(); // Re-render RAG table
        // No need to update field detail modal unless it's open, which is handled separately
    });
    bar.append(metricBtn);

    // Dark mode toggle button
    const modeBtn = document.createElement('button');
    modeBtn.className = 'btn btn-secondary btn-sm';
    const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light'; // Default to light if not set
    document.documentElement.setAttribute('data-bs-theme', currentTheme); // Ensure it's set
    modeBtn.innerHTML = currentTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
    modeBtn.title = 'Toggle light/dark theme';
    modeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-bs-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-bs-theme', newTheme);
        modeBtn.innerHTML = newTheme === 'dark' ? '☀️ Light' : '🌙 Dark';
        updateChartColors(); // Update chart colors immediately
        // No need to re-render modals unless open, handled separately
    });
    bar.append(modeBtn);
}

function handleRunToggle(e) {
    const cb = e.target;
    const runId = cb.value;
    if (cb.checked) {
        if (!selectedRuns.includes(runId)) {
            selectedRuns.push(runId);
        }
    } else {
        if (selectedRuns.length <= 1) { // Prevent unchecking last one
            cb.checked = true;
            // Maybe add a small visual feedback like a shake?
            cb.closest('.form-check').classList.add('shake');
            setTimeout(()=> cb.closest('.form-check').classList.remove('shake'), 500);
            return;
        }
        selectedRuns = selectedRuns.filter((r) => r !== runId);
    }
    // Maintain original definition order from manifest
    selectedRuns.sort((a, b) => Object.keys(reportMeta).indexOf(a) - Object.keys(reportMeta).indexOf(b));
    updateFieldBadges();
    renderChart(); // Update chart (handles visibility)
    renderRagAnalysis(); // Update RAG table too
    // No need to update modals unless open
}

/* ----------------- Summary Cards ----------------- */
function buildSummaryCards() {
    const grid = document.getElementById('summaryGrid');
    grid.innerHTML = '';
    // Sort runs by timestamp (newest first) for display order
    const sortedRunIds = Object.keys(reportData).sort((a, b) => {
        const timeA = reportMeta[a]?.timestamp ? new Date(reportMeta[a].timestamp).getTime() : 0;
        const timeB = reportMeta[b]?.timestamp ? new Date(reportMeta[b].timestamp).getTime() : 0;
        return timeB - timeA; // Descending order
    });

    sortedRunIds.forEach(id => {
        const d = reportData[id];
        const meta = reportMeta[id] || {}; // Get corresponding meta entry
        const col = document.createElement('div');
        col.className = 'col-xl col-lg-4 col-md-6 col-sm-12'; // More flexible columns

        const card = document.createElement('div');
        card.className = 'card h-100 shadow-sm';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body d-flex flex-column';

        const title = document.createElement('h5');
        title.className = 'card-title text-primary mb-1';
        title.textContent = id;

        const count = document.createElement('p');
        count.className = 'display-6 fw-semibold mb-0';
        count.textContent = d.processed_files?.toLocaleString() ?? 'N/A';

        const sub1 = document.createElement('p');
        sub1.className = 'card-text text-muted mb-1';
        sub1.textContent = 'files processed';

        // Add pipeline duration if available
        if (meta.pipeline_duration_seconds !== null && meta.pipeline_duration_seconds !== undefined) {
            const durationP = document.createElement('p');
            durationP.className = 'card-text text-muted small mb-1';
            durationP.textContent = `Pipeline: ${meta.pipeline_duration_seconds.toFixed(1)}s`;
            cardBody.appendChild(durationP);
        }

        // Add timestamp if available
        if (meta.timestamp) {
            const timestampP = document.createElement('p');
            timestampP.className = 'card-text text-muted small mb-1';
            timestampP.textContent = `Ran: ${meta.timestamp}`;
            cardBody.appendChild(timestampP);
        }


        const sub2 = document.createElement('p');
        sub2.className = `card-text mt-auto pt-2 ${d.error_files_count > 0 ? 'text-danger fw-bold' : 'text-muted'}`;
        sub2.textContent = `Errors: ${d.error_files_count?.toLocaleString() ?? 'N/A'}`;

        cardBody.append(title, count, sub1, sub2); // Append error count last
        card.append(cardBody);
        col.append(card);
        grid.append(col);
    });
}

/* ----------------- Field List & Badges ----------------- */
function buildFieldList() {
   const sampleRunId = Object.keys(reportData)[0];
   if (!sampleRunId || !reportData[sampleRunId]?.fields_to_analyze) {
        console.warn("No fields_to_analyze found in sample report data.");
        return;
   }
   const fields = reportData[sampleRunId].fields_to_analyze.sort(); // Use fields from data

   const list = document.getElementById('fieldList');
   list.innerHTML = '';

   fields.forEach((f) => {
        const btn = document.createElement('button');
        // *** Add 'clickable' class ***
        btn.className = 'field-btn clickable btn btn-sm btn-outline-secondary w-100 d-flex justify-content-between align-items-center mb-1';
        btn.dataset.field = f;
        // *** Update click handler to call new modal function ***
        btn.addEventListener('click', () => {
            // Highlight the selected button in the list
            document.querySelectorAll('.field-btn.active').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            openFieldDetailModal(f); // *** Call new modal function ***
        });

        const fieldNameSpan = document.createElement('span');
        fieldNameSpan.textContent = f;
        fieldNameSpan.style.marginRight = '5px'; // Space between name and badge

        const badgeContainer = document.createElement('span'); // Container for alignment
        badgeContainer.className = 'badge-container';

        const badge = document.createElement('span');
        badge.className = 'badge custom-badge rounded-pill'; // Base badge classes
        badgeContainer.appendChild(badge)

        btn.append(fieldNameSpan, badgeContainer);
        list.append(btn);
    });
    updateFieldBadges();
}

// Helper to calculate stats for metadata fields (Unchanged)
function calculateFieldStats(field) {
    const values = selectedRuns.map(run => {
        const d = reportData[run];
        if (!d) return null; // No data for this run
        const count = d.field_presence_counts?.[field] ?? 0;
        const total = d.processed_files ?? 0;
        if (displayMode === 'percent') {
            return total === 0 ? 0 : (count / total) * 100;
        } else {
            return count;
        }
    }).filter(v => v !== null); // Filter out nulls where run data was missing

     if (values.length === 0) return { avg: 0, min: 0, max: 0, count: 0 };

     const sum = values.reduce((a, b) => a + b, 0);
     const avg = sum / values.length;
     const min = Math.min(...values);
     const max = Math.max(...values);

     return { avg, min, max, count: values.length };
}


// UpdateFieldBadges (Unchanged)
function updateFieldBadges() {
    document.querySelectorAll('.field-btn').forEach((btn) => {
        const field = btn.dataset.field;
        const badge = btn.querySelector('.badge');
        if (!badge) return;

        if (!selectedRuns.length) {
            badge.innerHTML = '-'; // Clear content
            badge.className = 'badge custom-badge rounded-pill bg-light text-dark';
            return;
        }

        try {
            const stats = calculateFieldStats(field);
            let badgeClass = 'bg-secondary'; // Default/count color

            if (displayMode === 'percent') {
                badge.innerHTML = `${stats.avg.toFixed(0)}% <span class="badge-stats">(${stats.min.toFixed(0)}-${stats.max.toFixed(0)}%)</span>`;
                if (stats.avg > 90) badgeClass = 'bg-success';
                else if (stats.avg > 70) badgeClass = 'bg-warning text-dark';
                else badgeClass = 'bg-danger';
            } else {
                 badge.innerHTML = `${stats.avg.toLocaleString(undefined, {maximumFractionDigits:0})} <span class="badge-stats">(${stats.min.toLocaleString()}-${stats.max.toLocaleString()})</span>`;
                 badgeClass = 'bg-secondary'; // Use secondary for count mode
            }
             badge.className = `badge custom-badge rounded-pill ${badgeClass}`;

        } catch (error) {
            console.error(`Error updating badge for field ${field}:`, error);
            badge.innerHTML = 'Err';
            badge.className = 'badge custom-badge rounded-pill bg-dark';
        }
    });
}

/* ----------------- Chart (Plotly Grouped Bar) ----------------- */
function renderChart() {
    const chartContainer = document.getElementById('chartContainer'); // Target the container div
    const chartDiv = document.getElementById('mainChart');

    // *** Conditional Display Logic ***
    if (selectedRuns.length <= 1) {
        Plotly.purge(chartDiv); // Clear any existing chart
        chartContainer.classList.add('hidden'); // Hide the container
        // Add message only if the container doesn't already have one
        if (!chartContainer.querySelector('p')) {
             chartContainer.innerHTML = '<p class="text-center text-muted mt-5">Select two or more runs to view comparison chart.</p>';
        }
        return;
    } else {
        chartContainer.classList.remove('hidden'); // Ensure container is visible
        // Restore chart div if message was there
        if (!document.getElementById('mainChart')) {
             chartContainer.innerHTML = '<div id="mainChart"></div>';
        }
    }
    // *** END Conditional Display Logic ***

    if (!reportData) { // Should not happen if runs are selected, but good check
        Plotly.purge(chartDiv);
        chartDiv.innerHTML = '<p class="text-center text-muted mt-5">Report data is missing.</p>';
        return;
    }

    // Filter keyFieldsForChart to only include fields actually present in the data
    const firstRunId = selectedRuns[0];
    const firstRunData = reportData[firstRunId];
    if (!firstRunData || !firstRunData.field_presence_counts) {
         Plotly.purge(chartDiv);
         chartDiv.innerHTML = '<p class="text-center text-muted mt-5">No field presence data found for the first selected run.</p>';
         return;
    }
    const availableKeyFields = keyFieldsForChart.filter(f => firstRunData.field_presence_counts.hasOwnProperty(f));

    if (availableKeyFields.length === 0) {
         Plotly.purge(chartDiv);
        chartDiv.innerHTML = '<p class="text-center text-muted mt-5">None of the key fields for charting were found in the selected reports.</p>';
        return;
    }

    const traces = availableKeyFields.map(field => {
        const values = selectedRuns.map(run => {
            const d = reportData[run];
             if (!d) return 0;
            const count = d.field_presence_counts?.[field] ?? 0;
            const total = d.processed_files ?? 0;
            if (displayMode === 'percent') {
                return total === 0 ? 0 : (count / total) * 100;
            } else {
                return count;
            }
        });
        return {
            x: selectedRuns, // Runs on X-axis for grouped vertical bars
            y: values,
            name: field,
            type: 'bar',
            text: values.map(v => (displayMode === 'percent' ? v.toFixed(1) + '%' : v.toLocaleString())), // Text on bars
            textposition: 'none', // Or 'auto', 'outside' - disable for now to avoid clutter
            hoverinfo: 'x+y+name', // Show Run, Value, Field Name on hover
        };
    });

    const layout = {
        title: `Comparison of Key Fields Across Runs`,
        barmode: 'group', // Group bars per run
        xaxis: {
            title: 'Selected Runs',
            automargin: true,
            tickangle: selectedRuns.length > 4 ? -45 : 0, // Angle ticks if many runs
        },
        yaxis: {
            title: displayMode === 'percent' ? '% Present' : 'Count Present',
            range: displayMode === 'percent' ? [0, 100] : null,
            automargin: true,
        },
        margin: { l: 60, r: 20, t: 50, b: selectedRuns.length > 4 ? 100 : 50 }, // Adjust margins dynamically (esp. bottom)
        legend: {
            orientation: "h", // Horizontal legend
            yanchor: "bottom",
            y: -0.3, // Position legend below x-axis (adjust if needed based on bottom margin)
            xanchor: "center",
            x: 0.5
        },
        hovermode: 'closest' // Improve hover behavior for grouped bars
    };

    Plotly.react('mainChart', traces, layout, {responsive: true}); // Use react for efficient updates, target the inner div
    updateChartColors(); // Apply colors
}


// updateChartColors (Unchanged)
function updateChartColors() {
    const chartDiv = document.getElementById('mainChart');
    if (!chartDiv || !chartDiv.data) return; // Check if chart exists

    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const isDark = currentTheme === 'dark';

    const layoutUpdate = {
        plot_bgcolor: isDark ? '#212529' : '#ffffff',
        paper_bgcolor: isDark ? '#212529' : '#ffffff',
        'font.color': isDark ? '#dee2e6' : '#212529',
        'xaxis.gridcolor': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        'yaxis.gridcolor': isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        'xaxis.zerolinecolor': isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        'yaxis.zerolinecolor': isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        'xaxis.linecolor': isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        'yaxis.linecolor': isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
        'legend.bgcolor': isDark ? 'rgba(33, 37, 41, 0.8)' : 'rgba(255, 255, 255, 0.8)', // Semi-transparent legend background
    };

    try {
        Plotly.update(chartDiv, {}, layoutUpdate);
    } catch (error) {
        // Ignore errors if the chart div doesn't exist (e.g., when hidden)
        if (!document.getElementById('mainChart')) {
             console.debug("Chart div not found, skipping color update.");
        } else {
            console.warn("Plotly layout update failed:", error);
        }
    }
}


/* ----------------- Field Detail Modal ----------------- */
function openFieldDetailModal(fieldName) {
    const titleEl = document.getElementById('fieldDetailModalLabel');
    const bodyEl = document.getElementById('fieldDetailBody');

    titleEl.textContent = `Details for Field: ${fieldName}`;
    bodyEl.innerHTML = `<div class="text-center p-4"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading details...</div>`;
    fieldDetailModal.show();

    // Aggregate data across selected runs
    const presentFilesData = [];
    const missingFilesData = [];
    let dataStructureExists = false;

    selectedRuns.forEach(runId => {
        const runData = reportData[runId];
        if (!runData) return;

        // Check if the necessary structures exist for this run
        const hasFileData = runData.field_present_in_files && runData.field_missing_in_files;
        const hasValueData = runData.field_values_per_file;

        if (hasFileData || hasValueData) {
            dataStructureExists = true; // Mark that we found *some* relevant data
        }

        // Get files where present and their values
        const presentInRun = runData.field_present_in_files?.[fieldName] || [];
        const valuesInRun = runData.field_values_per_file?.[fieldName] || {};
        presentInRun.forEach(filename => {
            presentFilesData.push({
                filename: filename,
                run_id: runId,
                value: valuesInRun[filename] // Will be undefined if value wasn't stored, handle later
            });
        });

        // Get files where missing
        const missingInRun = runData.field_missing_in_files?.[fieldName] || [];
        missingInRun.forEach(filename => {
            missingFilesData.push({
                filename: filename,
                run_id: runId
            });
        });
    });

    // Sort files alphabetically
    presentFilesData.sort((a, b) => a.filename.localeCompare(b.filename));
    missingFilesData.sort((a, b) => a.filename.localeCompare(b.filename));

    // Helper to format values for display
    const formatFieldValue = (value) => {
        if (value === undefined) {
            return '<span class="value-display missing">Value not recorded</span>';
        } else if (value === null) {
            return '<span class="value-display missing">null</span>';
        } else if (Array.isArray(value)) {
            if (value.length === 0) {
                return '<span class="value-display missing">Empty List []</span>';
            } else {
                let listHtml = '<ul>';
                // Limit displayed items for very long lists
                const itemsToShow = value.slice(0, 20);
                itemsToShow.forEach(item => {
                    // Recursively format list items if they are objects/arrays
                    if (typeof item === 'object' && item !== null) {
                         listHtml += `<li><pre class="value-display">${htmlEscape(JSON.stringify(item, null, 2))}</pre></li>`;
                    } else {
                         listHtml += `<li>${htmlEscape(String(item))}</li>`;
                    }
                });
                 if (value.length > 20) {
                     listHtml += `<li class="fst-italic text-muted small">... (${value.length - 20} more items not shown)</li>`;
                 }
                listHtml += '</ul>';
                return listHtml;
            }
        } else if (typeof value === 'object') {
            // Pretty print objects/dictionaries
            return `<pre class="value-display">${htmlEscape(JSON.stringify(value, null, 2))}</pre>`;
        } else if (typeof value === 'string' && value === '') {
             return '<span class="value-display missing">Empty String ""</span>';
        } else {
            // Handle primitives (string, number, boolean)
            return `<span class="value-display">${htmlEscape(String(value))}</span>`;
        }
    };


    // Generate content after a short delay
    setTimeout(() => {
        bodyEl.innerHTML = ''; // Clear loading

        if (!dataStructureExists) {
            bodyEl.innerHTML = '<p class="text-center text-danger">Detailed field data structures (`field_present_in_files`, `field_missing_in_files`, `field_values_per_file`) are missing from all selected report files. Cannot display details.</p>';
            return;
        }

        // --- Present Section ---
        const presentSection = document.createElement('div');
        presentSection.className = 'file-list-section';
        presentSection.innerHTML = `<h5>Present In Files (${presentFilesData.length})</h5>`;
        if (presentFilesData.length > 0) {
            presentFilesData.forEach(fileInfo => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'file-entry';
                // *** Display filename and run_id first ***
                entryDiv.innerHTML = `<span class="filename">${htmlEscape(fileInfo.filename)}</span><span class="run-id">(${htmlEscape(fileInfo.run_id)})</span>`;
                // *** Then append the formatted value ***
                entryDiv.innerHTML += formatFieldValue(fileInfo.value);
                presentSection.appendChild(entryDiv);
            });
        } else {
            presentSection.insertAdjacentHTML('beforeend', '<p class="text-muted fst-italic">Field was not present (or value not recorded) in any files across the selected runs.</p>');
        }
        bodyEl.appendChild(presentSection);

        // --- Missing Section ---
        const missingSection = document.createElement('div');
        missingSection.className = 'file-list-section';
        missingSection.innerHTML = `<h5>Missing/Empty In Files (${missingFilesData.length})</h5>`;
        if (missingFilesData.length > 0) {
             missingFilesData.forEach(fileInfo => {
                const entryDiv = document.createElement('div');
                entryDiv.className = 'file-entry';
                entryDiv.innerHTML = `<span class="filename">${htmlEscape(fileInfo.filename)}</span><span class="run-id">(${htmlEscape(fileInfo.run_id)})</span>`;
                // Optionally add a placeholder for value if needed:
                // entryDiv.innerHTML += '<span class="value-display missing">N/A</span>';
                missingSection.appendChild(entryDiv);
            });
        } else {
             missingSection.insertAdjacentHTML('beforeend', '<p class="text-muted fst-italic">Field was present in all files across the selected runs.</p>');
        }
        bodyEl.appendChild(missingSection);

    }, 100); // Delay for modal animation
}

// Listener to clear active state when Field Detail modal closes
document.getElementById('fieldDetailModal').addEventListener('hidden.bs.modal', () => {
     document.querySelectorAll('.field-btn.active').forEach(b => b.classList.remove('active'));
});


/* ----------------- RAG Analysis Rendering (Unchanged) ----------------- */
// --- MANUAL MAPPING (Keep this as before) ---
const attributeToCueMap = {
    "Actionability": ["actionability_claim"],
    "Appropriate Sampling": ["sampling_justification_statement"],
    "Appropriate Statistical Tests": ["stats_appropriateness_claim"],
    "Auditability and Method Consistency": ["procedural_stability_statement", "data_availability_statement", "code_availability_statement", "materials_availability_statement"], // Grouped based on likely intent
    "Authenticity": ["authenticity_claim"],
    "Clear Documentation of Methods": ["methods_documentation_claim"], // Note: JSON has 200 checks for this cue? Might be error in data generation.
    "Clear Reporting of Results": ["results_reporting_claim"],
    "Coherence of Findings": ["coherence_claim"],
    "Complementary Approaches": ["complementary_methods_statement"],
    "Construct Validity": ["construct_validity_statement"],
    "Data Protection and Privacy": ["data_protection_statement"],
    "Ethical Oversight": ["ethical_approval_statement"],
    "External Validation": ["peer_review_statement"], // Assuming peer review implies external validation for this context
    "External Validity": ["external_validity_discussion"],
    "Fairness to Alternate Views": ["alternate_views_discussion"],
    "Honesty and Integrity": [], // No specific cue seems to fit directly, maybe COI/Funding? Handled under Transparency
    "Inclusiveness of Perspectives": ["inclusive_sampling_statement"],
    "Informed Consent": ["informed_consent_statement"],
    "Inter-Rater Reliability": ["inter_rater_statement"],
    "Internal Validity": ["internal_validity_claim"],
    "Member Checking": ["member_checking_statement"],
    "Methodology Selection Rationale": ["method_rationale_statement"],
    "Neutral Analysis Procedures": ["neutral_analysis_statement"],
    "Open Science Practices": ["data_availability_statement", "code_availability_statement", "materials_availability_statement", "preregistration_statement"], // Grouped
    "Procedural Stability": ["procedural_stability_statement"], // Also under Auditability, but listed separately in image
    "Randomization": ["randomization_statement"],
    "Reporting of Effect Sizes and Confidence": ["effect_size_reporting_statement"],
    "Research Self Awareness": ["reflexivity_statement"],
    "Scholarship Context": [], // No direct cue, inferred from references_count elsewhere
    "Test-Retest Reliability": ["test_retest_statement"],
    "Thick Description": ["thick_description_claim"],
    "Transparency": ["funding_disclosure", "coi_declaration"], // Grouped
    "Triangulation": ["triangulation_statement"]
};
// --- END MANUAL MAPPING ---

function renderRagAnalysis() {
    console.log("Attempting to render RAG analysis...");
    const ragArea = document.getElementById('ragAnalysisArea');
    ragArea.innerHTML = '<p class="text-center text-muted">Loading RAG analysis summary...</p>';

    if (!selectedRuns.length) {
        ragArea.innerHTML = '<p class="text-center text-muted">Select runs to view RAG analysis summary.</p>';
        console.log("No runs selected for RAG.");
        return;
    }

    // Check if ANY selected run has the necessary count structures AND detailed results
    const hasRagData = selectedRuns.some(runId =>
        reportData[runId]?.rag_cue_results_counts &&
        typeof reportData[runId].rag_cue_results_counts === 'object' &&
        reportData[runId]?.trust_attributes && // Also need definitions
        reportData[runId]?.rag_detailed_cue_results // *** Check for detailed results ***
    );

    if (!hasRagData) {
        ragArea.innerHTML = '<p class="text-center text-muted">Selected run(s) JSON data missing key RAG structures (e.g., counts, definitions, or detailed results). Cannot generate RAG summary.</p>';
        console.error("Aborting RAG render: Missing expected RAG data keys in reportData for selected runs.", reportData);
        return;
    }
    console.log("Found RAG count, definition, and detailed structures in at least one selected run.");

    // --- Aggregate RAG Data Across Selected Runs (Counts only) ---
    const aggregated_cue_counts = defaultdict(() => ({ found_true: 0, found_false: 0, files_checked: 0 }));
    const aggregated_evidence_counts = defaultdict(int);
    const aggregated_context_lengths = defaultdict(listFactory); // Use factory
    let trust_attributes_definitions = {}; // Store definitions from the first valid run

    selectedRuns.forEach(runId => {
        const runData = reportData[runId];
        // Ensure this run has the necessary count data before processing aggregates
        if (runData?.rag_cue_results_counts && typeof runData.rag_cue_results_counts === 'object') {
            console.log(`Aggregating RAG counts for run: ${runId}`);

            // Get definitions if not already found
            if (Object.keys(trust_attributes_definitions).length === 0 && runData.trust_attributes) {
                trust_attributes_definitions = runData.trust_attributes;
            }

            // Aggregate Cue Results
            const run_cue_counts = runData.rag_cue_results_counts || {};
            for (const [cue, counts] of Object.entries(run_cue_counts)) {
                 if (counts && typeof counts === 'object') {
                    const found_true = counts.found_true || 0;
                    const found_false = counts.found_false || 0;
                    aggregated_cue_counts[cue].found_true += found_true;
                    aggregated_cue_counts[cue].found_false += found_false;
                    aggregated_cue_counts[cue].files_checked += (found_true + found_false);
                 } else {
                      console.warn(`Invalid counts structure for cue '${cue}' in run '${runId}'`);
                 }
            }

            // Aggregate Evidence Counts
            const run_evidence_counts = runData.rag_evidence_present_counts || {};
            for (const [cue, count] of Object.entries(run_evidence_counts)) {
                aggregated_evidence_counts[cue] += count || 0;
            }

            // Aggregate Context Doc Lengths/Counts (using the provided data structure)
            const run_context_counts = runData.rag_context_docs_counts || {};
             for (const [cue, lengths] of Object.entries(run_context_counts)) {
                 if (Array.isArray(lengths)) {
                     aggregated_context_lengths[cue].push(...lengths);
                 }
             }
        } else {
             console.warn(`Run ${runId} selected but contains no valid 'rag_cue_results_counts' data.`);
        }
    });

    // Check if *any* RAG data was actually aggregated
    if (Object.keys(aggregated_cue_counts).length === 0) {
         ragArea.innerHTML = '<p class="text-center text-muted">No RAG cue data found in the selected run(s) after aggregation.</p>';
         console.error("Aborting RAG render: No cues were aggregated. Check individual run data.", aggregated_cue_counts);
         return;
    }
     if (Object.keys(trust_attributes_definitions).length === 0) {
         ragArea.innerHTML = '<p class="text-center text-muted">Trust attribute definitions (`trust_attributes`) not found in any selected run data.</p>';
         console.error("Aborting RAG render: Missing trust_attributes definitions.");
         return;
     }

    console.log("Aggregated Cue Counts:", aggregated_cue_counts);
    console.log("Aggregated Evidence Counts:", aggregated_evidence_counts);
    console.log("Aggregated Context Lengths:", aggregated_context_lengths);


    // --- Build HTML Table ---
    const table = document.createElement('table');
    table.id = 'ragAnalysisTable';
    table.className = 'table table-sm table-striped table-hover table-bordered';

    const thead = table.createTHead();
    thead.innerHTML = `
        <tr>
            <th>Trust Attribute</th>
            <th>Specific Cue</th>
            <th class="text-end">Avg. % Found True</th>
            <th class="text-end">% Evidence (if Found)</th>
            <th class="text-end">Avg. Context Docs</th>
            <th>Actions</th> <!-- Keep Actions column for potential future use -->
        </tr>`;
    const tbody = table.createTBody();

    // Use the order from trust_attributes_definitions if possible, otherwise sort keys from manual map
    const sortedAttributes = Object.keys(trust_attributes_definitions).sort((a, b) => {
         // Try to match the order in the image/definitions if possible
         const orderA = Object.keys(attributeToCueMap).indexOf(a);
         const orderB = Object.keys(attributeToCueMap).indexOf(b);
         if (orderA !== -1 && orderB !== -1) return orderA - orderB;
         if (orderA !== -1) return -1; // Put known ones first
         if (orderB !== -1) return 1;
         return a.localeCompare(b); // Fallback sort
     });


    if (sortedAttributes.length === 0) {
         ragArea.innerHTML = '<p class="text-center text-muted">No trust attributes found to display.</p>';
         console.log("No attributes found to build table.");
         return;
    }


    sortedAttributes.forEach(attribute => {
        // Get cues associated with this attribute from our manual map
        const cues = (attributeToCueMap[attribute] || []).filter(cueName => aggregated_cue_counts[cueName]); // Only include cues with aggregated data
        const definition = trust_attributes_definitions[attribute] || 'No definition found.';

        // Sort cues alphabetically for consistent display within an attribute
        cues.sort();

        if (!cues || cues.length === 0) {
             // Skip attributes with no mapped/found cues for cleaner table
             console.log(`Attribute '${attribute}' has no mapped cues with data. Skipping row.`);
        } else {
            cues.forEach((cueName, index) => {
                console.log(`Processing row for Attribute: ${attribute}, Cue: ${cueName}`); // Log row processing
                const row = tbody.insertRow();

                // Add Attribute cell only for the first cue of that attribute
                if (index === 0) {
                    const attrCell = row.insertCell();
                    attrCell.rowSpan = cues.length;
                    attrCell.innerHTML = `<span title="${htmlEscape(definition)}">${htmlEscape(attribute)}</span>`;
                    attrCell.className = 'attribute-cell';
                    attrCell.style.verticalAlign = 'top'; // Align rowspan cell content to top
                }

                // Add Cue cell - MAKE IT CLICKABLE
                const cueCell = row.insertCell();
                const readableCueName = cueName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                cueCell.innerHTML = `<span title="Click for details. Internal Key: ${cueName}">${htmlEscape(readableCueName)}</span>`; // Display readable name
                cueCell.className = 'cue-cell cue-cell-clickable'; // Add clickable class
                cueCell.onclick = () => openRagCueDetailModal(attribute, cueName); // *** Add click handler ***

                // --- Calculations ---
                const counts = aggregated_cue_counts[cueName];
                const found_true = counts.found_true;
                const total_assessments_for_cue = counts.files_checked; // Use the count of files that assessed this cue

                // Calculate % Found True based on files where this cue was assessed
                const perc_found_true = (total_assessments_for_cue > 0) ? (found_true / total_assessments_for_cue) * 100 : 0;

                const evidence_present_count = aggregated_evidence_counts[cueName];
                // Calculate % Evidence Present *only* out of the times it was found true
                const perc_evidence_present = (found_true > 0) ? (evidence_present_count / found_true) * 100 : 0;

                const context_lengths = aggregated_context_lengths[cueName];
                let avg_docs = 0;
                // Calculate average based on the list of numbers provided in rag_context_docs_counts
                if (context_lengths && context_lengths.length > 0) {
                    try {
                        avg_docs = context_lengths.reduce((a, b) => a + (b || 0), 0) / context_lengths.length; // Ensure b is treated as 0 if null/undefined
                    } catch { avg_docs = 0; }
                }

                // Log calculated values before inserting
                console.log(`  Cue: ${cueName}, Found True: ${found_true}, Total Assessed: ${total_assessments_for_cue}, % Found: ${perc_found_true.toFixed(1)}, Evidence Count: ${evidence_present_count}, % Evidence: ${perc_evidence_present.toFixed(1)}, Avg Docs: ${avg_docs.toFixed(1)}`);

                // --- Insert Cells ---
                row.insertCell().textContent = total_assessments_for_cue > 0 ? `${perc_found_true.toFixed(1)}%` : '-';
                row.cells[row.cells.length - 1].className = 'text-end';
                row.insertCell().textContent = found_true > 0 ? `${perc_evidence_present.toFixed(1)}%` : '-'; // Show '-' if never found true
                row.cells[row.cells.length - 1].className = 'text-end';
                row.insertCell().textContent = context_lengths.length > 0 ? avg_docs.toFixed(1) : '-'; // Show '-' if no context counts
                row.cells[row.cells.length - 1].className = 'text-end';

                 // Actions Cell (Keep empty for now, or add other actions later)
                 const actionCell = row.insertCell();
                 actionCell.innerHTML = ''; // Clear the old context button

            });
        }
    });

    ragArea.innerHTML = ''; // Clear loading message *before* appending table
    ragArea.appendChild(table);
    console.log("RAG analysis table rendered.");
}


/* ----------------- RAG Context Modal (Original - Keep if needed for other purposes) ----------------- */
function openRagContextModal(attributeName, cueName) {
    // ... (keep existing implementation if you still need this specific modal elsewhere)
    // ... (otherwise, this function might become redundant)
    console.warn("openRagContextModal called, but might be replaced by openRagCueDetailModal");
    const titleEl = document.getElementById('ragContextModalLabel');
    const bodyEl = document.getElementById('ragContextBody');
    titleEl.textContent = `Legacy Context: ${attributeName} / ${cueName}`;
    bodyEl.innerHTML = `<p class="text-warning">This modal might be deprecated. Use the Cue Detail modal instead.</p>`;
    ragContextModal.show();
}

/* ----------------- RAG Cue Detail Modal (Unchanged) ----------------- */
function openRagCueDetailModal(attributeName, cueName) {
    const titleEl = document.getElementById('ragCueDetailModalLabel');
    const bodyEl = document.getElementById('ragCueDetailBody');

    // Use readable cue name for title
    const readableCueName = cueName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    titleEl.textContent = `Details for Cue: ${readableCueName}`;
    bodyEl.innerHTML = `<div class="text-center p-4"><span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading details...</div>`;
    ragCueDetailModal.show();

    // Aggregate detailed data for this cue across selected runs
    const allFoundFiles = [];
    const allNotFoundFiles = [];
    let detailedDataExists = false;

    selectedRuns.forEach(runId => {
        const runData = reportData[runId];
        if (runData?.rag_detailed_cue_results?.[cueName]) {
            detailedDataExists = true; // Mark that we found the structure somewhere
            const cueDetails = runData.rag_detailed_cue_results[cueName];
            if (cueDetails.found_in_files) {
                allFoundFiles.push(...cueDetails.found_in_files.map(f => ({ ...f, run_id: runId }))); // Add run_id for context
            }
            if (cueDetails.not_found_in_files) {
                allNotFoundFiles.push(...cueDetails.not_found_in_files.map(f => ({ ...f, run_id: runId }))); // Add run_id
            }
        }
    });

    // Sort files alphabetically within each category
    allFoundFiles.sort((a, b) => a.filename.localeCompare(b.filename));
    allNotFoundFiles.sort((a, b) => a.filename.localeCompare(b.filename));

    // Generate content after a short delay
    setTimeout(() => {
        bodyEl.innerHTML = ''; // Clear loading

        if (!detailedDataExists) {
            bodyEl.innerHTML = '<p class="text-center text-danger">Detailed RAG cue results structure (`rag_detailed_cue_results`) is missing from all selected report files. Cannot display details.</p>';
            return;
        }

        // --- Found Section ---
        const foundSection = document.createElement('div');
        foundSection.innerHTML = `<h5>Found In Files (${allFoundFiles.length})</h5>`;
        if (allFoundFiles.length > 0) {
            allFoundFiles.forEach(fileInfo => {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'file-section';
                fileDiv.innerHTML = `<h6>${htmlEscape(fileInfo.filename)} <small class="text-muted">(${htmlEscape(fileInfo.run_id)})</small></h6>`;

                // Evidence
                const evidenceP = document.createElement('p');
                evidenceP.innerHTML = '<strong>Evidence:</strong> ';
                if (fileInfo.evidence) {
                    evidenceP.innerHTML += `<q class="evidence-quote">${htmlEscape(fileInfo.evidence)}</q>`;
                } else {
                    evidenceP.innerHTML += `<span class="no-evidence">No evidence provided</span>`;
                }
                fileDiv.appendChild(evidenceP);

                // Context Docs
                const contextDocs = fileInfo.context_docs || [];
                if (contextDocs.length > 0) {
                    const details = document.createElement('details');
                    const summary = document.createElement('summary');
                    summary.textContent = `Retrieved Context (${contextDocs.length} doc${contextDocs.length === 1 ? '' : 's'})`;
                    details.appendChild(summary);

                    contextDocs.forEach(doc => {
                        const docDiv = document.createElement('div');
                        docDiv.className = 'context-doc ps-2';
                        const metadata = doc.metadata || {};
                        let metaString = `Source: ${htmlEscape(metadata.source_pdf || 'N/A')}`;
                        if (metadata.chunk_index !== undefined) metaString += `, Chunk: ${metadata.chunk_index}`;
                        docDiv.innerHTML = `
                            <p class="mb-1 small text-muted"><em>${metaString}</em></p>
                            <pre>${htmlEscape(doc.page_content || '')}</pre>
                        `;
                        details.appendChild(docDiv);
                    });
                    fileDiv.appendChild(details);
                } else {
                    fileDiv.insertAdjacentHTML('beforeend', '<p class="small fst-italic text-muted">No context documents recorded for this file.</p>');
                }
                foundSection.appendChild(fileDiv);
            });
        } else {
            foundSection.insertAdjacentHTML('beforeend', '<p class="text-muted fst-italic">Cue was not found in any files across the selected runs.</p>');
        }
        bodyEl.appendChild(foundSection);

        bodyEl.insertAdjacentHTML('beforeend', '<hr class="my-4">'); // Separator

        // --- Not Found Section ---
        const notFoundSection = document.createElement('div');
        notFoundSection.innerHTML = `<h5>Not Found In Files (${allNotFoundFiles.length})</h5>`;
         if (allNotFoundFiles.length > 0) {
            allNotFoundFiles.forEach(fileInfo => {
                const fileDiv = document.createElement('div');
                fileDiv.className = 'file-section';
                fileDiv.innerHTML = `<h6>${htmlEscape(fileInfo.filename)} <small class="text-muted">(${htmlEscape(fileInfo.run_id)})</small></h6>`;

                // Evidence (Usually empty when not found, but display if present)
                const evidenceP = document.createElement('p');
                evidenceP.innerHTML = '<strong>Evidence:</strong> ';
                 if (fileInfo.evidence) {
                    evidenceP.innerHTML += `<q class="evidence-quote">${htmlEscape(fileInfo.evidence)}</q>`;
                } else {
                    evidenceP.innerHTML += `<span class="no-evidence">No evidence provided (as expected when not found)</span>`;
                }
                fileDiv.appendChild(evidenceP);

                // Context Docs (Potentially useful for debugging why it wasn't found)
                const contextDocs = fileInfo.context_docs || [];
                if (contextDocs.length > 0) {
                    const details = document.createElement('details');
                    const summary = document.createElement('summary');
                    summary.textContent = `Retrieved Context (${contextDocs.length} doc${contextDocs.length === 1 ? '' : 's'})`;
                    details.appendChild(summary);

                    contextDocs.forEach(doc => {
                        const docDiv = document.createElement('div');
                        docDiv.className = 'context-doc ps-2';
                        const metadata = doc.metadata || {};
                        let metaString = `Source: ${htmlEscape(metadata.source_pdf || 'N/A')}`;
                        if (metadata.chunk_index !== undefined) metaString += `, Chunk: ${metadata.chunk_index}`;
                        docDiv.innerHTML = `
                            <p class="mb-1 small text-muted"><em>${metaString}</em></p>
                            <pre>${htmlEscape(doc.page_content || '')}</pre>
                        `;
                        details.appendChild(docDiv);
                    });
                    fileDiv.appendChild(details);
                } else {
                    fileDiv.insertAdjacentHTML('beforeend', '<p class="small fst-italic text-muted">No context documents recorded for this file.</p>');
                }
                 notFoundSection.appendChild(fileDiv);
            });
        } else {
             notFoundSection.insertAdjacentHTML('beforeend', '<p class="text-muted fst-italic">Cue was found in all files where it was assessed across the selected runs.</p>');
        }
        bodyEl.appendChild(notFoundSection);

    }, 100); // Delay for modal animation
}


/* ----------------- Utilities & Event Listeners ----------------- */
// Utility to escape HTML
function htmlEscape(str) {
    if (!str) return '';
    // Basic escaping, consider a more robust library if complex HTML injection is a concern
    return String(str)
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&apos;');
}


// Listener to clear active state when Field Detail modal closes
document.getElementById('fieldDetailModal').addEventListener('hidden.bs.modal', () => {
     document.querySelectorAll('.field-btn.active').forEach(b => b.classList.remove('active'));
});

// Helper for defaultdict behavior in JS
const defaultdict = (defaultFactory) => {
  return new Proxy({}, {
    get: (target, name) => name in target ? target[name] : (target[name] = defaultFactory())
  });
};
const int = () => 0; // Factory for integer default
const listFactory = () => []; // Factory for empty array default