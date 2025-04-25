// --- Global Variables ---
const modeBtn = document.getElementById('modeBtn');
const body = document.body;
const overlay = document.getElementById('overlay');
const panel = document.getElementById('panel');
const panelTitle = document.getElementById('panelTitle');
const panelContent = document.getElementById('panelContent');
const fieldCardsContainer = document.getElementById('field-cards-container');
const reportCheckboxesContainer = document.getElementById('run-checkboxes'); // Changed from selector
const compareBtn = document.getElementById('compareBtn'); // Added compare button
const reportHeaderInfo = document.getElementById('report-header-info');
const comparisonArea = document.getElementById('comparison-area'); // Container for columns

let chartInstances = {}; // Store chart instances { runId: chartInstance }
let manifestData = {}; // To store the list of available reports
let loadedReportData = {}; // Store data for multiple loaded runs { runId: data }
let selectedRuns = []; // Array of run IDs currently selected for comparison

// --- Utility Functions ---
function escapeHtml(unsafe) {
    if (unsafe === null || typeof unsafe === 'undefined') return '';
    return String(unsafe).replace(/[&<>"']/g, (m) => {
        switch (m) {
            case '&': return '&amp;';
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '"': return '&quot;';
            case "'": return '&#039;';
            default: return m;
        }
    });
}

function formatDuration(seconds) {
    if (seconds === null || typeof seconds === 'undefined') return 'N/A';
    if (seconds < 60) return `${seconds.toFixed(1)} sec`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} min`;
    return `${(seconds / 3600).toFixed(1)} hr`;
}

// --- Dark Mode ---
function applyDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
        body.classList.add('dark');
        modeBtn.textContent = '☀️ Light';
    } else {
        body.classList.remove('dark');
        modeBtn.textContent = '🌙 Dark';
    }
    // Update all existing charts on mode change
    Object.values(chartInstances).forEach(chart => updateChartColors(chart));
}

modeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    modeBtn.textContent = body.classList.contains('dark') ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('darkMode', body.classList.contains('dark'));
    Object.values(chartInstances).forEach(chart => updateChartColors(chart));
});

// --- Chart.js Functions ---
function getChartColors() {
    const isDark = body.classList.contains('dark');
    return {
        backgroundColor: isDark ? '#3b82f6' : '#2563eb',
        borderColor: isDark ? '#1e40af' : '#1d4ed8',
        gridColor: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(203, 213, 225, 0.5)',
        ticksColor: isDark ? '#94a3b8' : '#6b7280',
        labelColor: isDark ? '#f8fafc' : '#1f2937'
    };
}

function renderOrUpdateChart(canvasId, labels, values) {
    const colors = getChartColors();
    const ctx = document.getElementById(canvasId)?.getContext('2d');
    if (!ctx) {
        console.error(`Canvas element with ID ${canvasId} not found.`);
        return;
    }

    const chartKey = canvasId; // Use canvasId as key for chart instance

    if (chartInstances[chartKey]) {
        // Update existing chart
        chartInstances[chartKey].data.labels = labels;
        chartInstances[chartKey].data.datasets[0].data = values;
        updateChartColors(chartInstances[chartKey]); // Apply current colors
        chartInstances[chartKey].update();
    } else {
        // Create new chart
        chartInstances[chartKey] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Completeness (%)',
                    data: values,
                    backgroundColor: colors.backgroundColor,
                    borderColor: colors.borderColor,
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) { label += ': '; }
                                if (context.parsed.x !== null) {
                                    label += context.parsed.x.toFixed(1) + '%';
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true, max: 100,
                        title: { display: true, text: 'Percentage Present (%)', color: colors.labelColor },
                        grid: { color: colors.gridColor },
                        ticks: { color: colors.ticksColor }
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: colors.ticksColor, autoSkip: false }
                    }
                }
            }
        });
    }
}

function updateChartColors(chartInstance) {
    if (!chartInstance) return;
    const colors = getChartColors();
    chartInstance.options.scales.x.title.color = colors.labelColor;
    chartInstance.options.scales.x.grid.color = colors.gridColor;
    chartInstance.options.scales.x.ticks.color = colors.ticksColor;
    chartInstance.options.scales.y.ticks.color = colors.ticksColor;
    chartInstance.data.datasets[0].backgroundColor = colors.backgroundColor;
    chartInstance.data.datasets[0].borderColor = colors.borderColor;
    chartInstance.update();
}

// --- Panel Logic ---
function showPanel(field) {
    if (selectedRuns.length === 0) {
        alert("Please select at least one report run to view details.");
        return;
    }

    panelTitle.innerHTML = `Comparison for: <code>${escapeHtml(field)}</code>`;
    let contentHTML = '<div class="comparison-grid">'; // Use grid for panel content

    selectedRuns.forEach((runId, index) => {
        const reportData = loadedReportData[runId];
        const data = reportData?.field_details?.[field];
        const processed_files = reportData?.processed_files;

        contentHTML += `<div class="panel-column">`; // Column for each run
        contentHTML += `<h4>Run: ${escapeHtml(runId)}</h4>`;

        if (!data || processed_files === undefined) {
            contentHTML += "<p class='note'>Data not available for this field in this run.</p>";
            contentHTML += `</div>`; // Close column
            return; // Skip to next run
        }

        // Presence Summary & File Lists
        const missing_count = data.missing_files?.length ?? 0;
        const present_extracted_count = data.present_files?.length ?? 0;
        const fallback_count = field === 'title' ? (reportData.title_is_filename_count ?? 0) : 0;
        const fallback_files = field === 'title' ? (reportData.title_fallback_files ?? []) : [];
        const present_extracted_perc = processed_files > 0 ? (present_extracted_count / processed_files) * 100 : 0;
        const fallback_perc = processed_files > 0 ? (fallback_count / processed_files) * 100 : 0;
        const missing_perc = processed_files > 0 ? (missing_count / processed_files) * 100 : 0;

        contentHTML += `<h5>Presence & File Lists</h5>`;
        contentHTML += `<p>Present (Extracted): ${present_extracted_count} (${present_extracted_perc.toFixed(1)}%)<br>`;
        if (field === 'title' && fallback_count > 0) {
            contentHTML += `Present (Fallback): ${fallback_count} (${fallback_perc.toFixed(1)}%)<br>`;
        }
        contentHTML += `Missing/Empty: ${missing_count} (${missing_perc.toFixed(1)}%)</p>`;

        contentHTML += `<details><summary>Show ${present_extracted_count} Files Present (Extracted)</summary><ul class="file-list">`;
        contentHTML += data.present_files.map(f => `<li>${escapeHtml(f)}</li>`).join('');
        contentHTML += `</ul></details>`;
        if (field === 'title' && fallback_files.length > 0) {
            contentHTML += `<details><summary>Show ${fallback_count} Files Present (Fallback)</summary><ul class="file-list">`;
            contentHTML += fallback_files.map(f => `<li>${escapeHtml(f)}</li>`).join('');
            contentHTML += `</ul></details>`;
        }
        contentHTML += `<details><summary>Show ${missing_count} Files Missing/Empty</summary><ul class="file-list">`;
        contentHTML += data.missing_files.map(f => `<li>${escapeHtml(f)}</li>`).join('');
        contentHTML += `</ul></details>`;

        // Average Value / List Length
        if (data.is_simple_avg) {
            let avgValStr = "N/A";
            if (data.average_value !== null && typeof data.average_value === 'number') {
                if (field === 'is_oa') avgValStr = `${data.average_value.toFixed(3)} (1=True, 0=False)`;
                else if (field === 'publication_year') avgValStr = `${data.average_value.toFixed(0)}`;
                else avgValStr = `${data.average_value.toFixed(1)}`;
            }
            contentHTML += `<h5>Average Value</h5><p>${avgValStr}</p>`;
        } else if (data.is_list_len) {
            let avgLenStr = "N/A";
             if (data.average_list_length !== null && typeof data.average_list_length === 'number') {
                 avgLenStr = `${data.average_list_length.toFixed(1)}`;
             }
            contentHTML += `<h5>Average List Length</h5><p>${avgLenStr}</p>`;
        }

        // Value Distribution (Categorical)
        if (data.is_categorical && data.value_counts && Object.keys(data.value_counts).length > 0) {
            contentHTML += `<h5>Value Distribution</h5>`;
            contentHTML += `<table><thead><tr><th>Value</th><th>Count</th><th>% of Present</th></tr></thead><tbody>`;
            const sortedValues = Object.entries(data.value_counts).sort(([,a],[,b]) => b-a);
            const current_presence_count = data.presence_count;
            for (const [value, count] of sortedValues) {
                const percPresent = current_presence_count > 0 ? (count / current_presence_count) * 100 : 0;
                contentHTML += `<tr><td><code>${escapeHtml(value)}</code></td><td class='count'>${count}</td><td class='percentage'>${percPresent.toFixed(1)}%</td></tr>`;
            }
            contentHTML += `</tbody></table>`;
        }

        // Source Breakdown
        if (data.sources && data.sources.length > 0) {
            contentHTML += `<h5>Source Breakdown</h5>`;
            contentHTML += `<table><thead><tr><th>Source</th><th>Count</th><th>% Pres.</th><th>% Tot.</th><th>Rel.</th></tr></thead><tbody>`;
            const current_presence_count = data.presence_count;
            for (const src of data.sources) {
                const percPresentStr = src.perc_present !== null ? `${src.perc_present.toFixed(1)}%` : 'N/A';
                const percTotalStr = processed_files > 0 ? `${src.perc_total.toFixed(1)}%` : 'N/A';
                contentHTML += `<tr><td><code>${escapeHtml(src.name)}</code></td><td class='count'>${src.count}</td><td class='percentage'>${percPresentStr}</td><td class='percentage'>${percTotalStr}</td><td class='reliability'>${escapeHtml(src.reliability)}</td></tr>`;
            }
            contentHTML += `</tbody></table>`;
        }

        // Trust Attributes (Show only once if comparing, maybe outside the loop?)
        if (index === 0 && data.trust_attributes && data.trust_attributes.length > 0) {
             contentHTML += `<div class='trust-attributes' style="grid-column: 1 / -1;"><h4>Potential Trustworthiness Indicators (for ${escapeHtml(field)})</h4><ul>`; // Span across grid columns
             for (const attr of data.trust_attributes) {
                 contentHTML += `<li><strong>${escapeHtml(attr.name)}:</strong> <em>${escapeHtml(attr.definition)}</em></li>`;
             }
             contentHTML += `</ul></div>`;
         }

        contentHTML += `</div>`; // Close column
    });

    contentHTML += '</div>'; // Close comparison-grid
    panelContent.innerHTML = contentHTML;

    // Adjust grid columns for panel based on number of selected runs
    const panelGrid = panelContent.querySelector('.comparison-grid');
    if(panelGrid) {
        panelGrid.style.gridTemplateColumns = `repeat(${selectedRuns.length}, 1fr)`;
    }

    overlay.style.display='flex'; // Use flex to enable centering
}


function hideOverlay(e){
    if(e.target.id === 'overlay' || e.target.classList.contains('close-btn')) {
        overlay.style.display='none';
        panelContent.innerHTML = ''; // Clear content
    }
}

// --- Data Loading and UI Update ---
async function loadSelectedReports() {
    selectedRuns = Array.from(reportCheckboxesContainer.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value);

    if (selectedRuns.length === 0) {
        reportHeaderInfo.textContent = 'Select one or more report runs using the checkboxes above and click \'Compare\'.';
        comparisonArea.innerHTML = ''; // Clear comparison area
        loadedReportData = {}; // Clear loaded data
        return;
    }

    console.log("Loading reports for:", selectedRuns);
    reportHeaderInfo.textContent = `Loading data for: ${selectedRuns.join(', ')}...`;
    comparisonArea.innerHTML = ''; // Clear previous comparison
    loadedReportData = {}; // Clear old data

    const promises = selectedRuns.map(runId => {
        if (!manifestData[runId]) {
            console.error(`Run ID ${runId} not found in manifest.`);
            return Promise.reject(`Run ID ${runId} not found`); // Reject promise for this run
        }
        const dataFile = manifestData[runId].data_file;
        return fetch(dataFile)
            .then(response => {
                if (!response.ok) { throw new Error(`HTTP error! status: ${response.status} for ${dataFile}`); }
                return response.json();
            })
            .then(data => {
                loadedReportData[runId] = restructureFetchedData(data); // Store restructured data
            })
            .catch(error => {
                console.error(`Error fetching or processing data file ${dataFile}:`, error);
                // Store error state or null for this run?
                loadedReportData[runId] = null; // Indicate failure for this run
            });
    });

    await Promise.allSettled(promises); // Wait for all fetches to complete or fail

    console.log("Finished loading selected reports:", loadedReportData);
    updateComparisonUI(); // Update UI after all data is loaded/attempted
}


function restructureFetchedData(data) {
    // (Function remains the same as previous correct version)
    const restructured = {
         run_id: data.run_id,
         pipeline_duration_seconds: data.pipeline_duration_seconds,
         analysis_duration_seconds: data.analysis_duration_seconds,
         total_files: data.total_files,
         processed_files: data.processed_files,
         error_files_count: data.error_files_count,
         error_filenames: data.error_filenames,
         fields_to_analyze: data.fields_to_analyze,
         title_is_filename_count: data.title_is_filename_count,
         title_fallback_files: data.title_fallback_files,
         field_details: {}
    };
    data.fields_to_analyze.forEach(field => {
         const pres_count = data.field_presence_counts?.[field] ?? 0;
         const processed = data.processed_files ?? 0;
         restructured.field_details[field] = {
             presence_count: pres_count,
             missing_count: data.field_missing_in_files?.[field]?.length ?? (processed - pres_count),
             presence_percentage: processed > 0 ? (pres_count / processed) * 100 : 0,
             average_value: data.field_averages?.[field] ?? null,
             average_list_length: data.field_avg_list_lengths?.[field] ?? null,
             value_counts: data.field_value_counts?.[field] ?? null,
             sources: data.field_source_counts?.[field] ? Object.entries(data.field_source_counts[field]).map(([name, count]) => {
                 const perc_present = pres_count > 0 && name !== 'missing_or_empty' ? (count / pres_count) * 100 : null;
                 const perc_total = processed > 0 ? (count / processed) * 100 : 0;
                 let source_reliability = "N/A";
                 if (name === 'missing_or_empty') source_reliability = "Field Absent/Empty";
                 else if (['openalex', 'crossref', 'grobid', 'filename_doi', 'user', 'openalex_concepts', 'openalex (inferred)'].includes(name)) source_reliability = "High (API/Parser/User/Inferred)";
                 else if (name === 'nlp') source_reliability = "Medium (NLP Dependent)";
                 else if (['unknown', 'unknown_doi_source', 'determination_method_missing'].includes(name)) source_reliability = "Low (Source Unknown)";
                 else source_reliability = "Variable (Check Source)";
                 return { name, count, perc_present, perc_total, reliability: source_reliability };
             }).sort((a, b) => {
                if (a.name === 'missing_or_empty') return 1; if (b.name === 'missing_or_empty') return -1; return b.count - a.count;
             }) : [],
             trust_attributes: data.field_to_trust_map?.[field] ? data.field_to_trust_map[field].map(attr_name => ({ name: attr_name, definition: data.trust_attributes?.[attr_name] ?? "Definition not found." })) : [],
             is_simple_avg: data.simple_fields_for_average?.includes(field) ?? false,
             is_list_len: data.list_fields_for_length?.includes(field) ?? false,
             is_categorical: data.categorical_fields?.includes(field) ?? false,
             present_files: data.field_present_in_files?.[field] ?? [],
             missing_files: data.field_missing_in_files?.[field] ?? []
         };
    });
    return restructured;
}


function updateComparisonUI() {
    if (selectedRuns.length === 0) {
        reportHeaderInfo.textContent = 'Select one or more report runs using the checkboxes above and click \'Compare\'.';
        comparisonArea.innerHTML = ''; // Clear comparison area
        return;
    }

    // Update Header
    reportHeaderInfo.innerHTML = `Comparing Runs: <strong>${selectedRuns.map(escapeHtml).join(', ')}</strong>`;

    // Set grid columns
    comparisonArea.style.gridTemplateColumns = `repeat(${selectedRuns.length}, 1fr)`;
    comparisonArea.innerHTML = ''; // Clear previous columns

    // Create a column for each selected run
    selectedRuns.forEach(runId => {
        const reportData = loadedReportData[runId];
        const columnDiv = document.createElement('div');
        columnDiv.className = 'run-column';

        if (!reportData) {
            columnDiv.innerHTML = `<h2>${escapeHtml(runId)}</h2><p style="color: red;">Error loading data for this run.</p>`;
            comparisonArea.appendChild(columnDiv);
            return; // Skip to next run if data failed to load
        }

        // Add Run Title and Basic Info
        let pipelineDurationStr = formatDuration(reportData.pipeline_duration_seconds);
        let analysisDurationStr = formatDuration(reportData.analysis_duration_seconds);
        columnDiv.innerHTML = `<h2>${escapeHtml(runId)}</h2>
                             <p class="timing-info">
                                 Processed: ${reportData.processed_files}/${reportData.total_files} files |
                                 Errors: ${reportData.error_files_count} |
                                 Pipeline Time: ${pipelineDurationStr} |
                                 Analysis Time: ${analysisDurationStr}
                             </p>`;

        // Add Chart Container
        const chartContainer = document.createElement('div');
        chartContainer.className = 'chart-container card chart-card'; // Reuse card style
        const canvasId = `chart-${runId}`;
        chartContainer.innerHTML = `<h4>Field Completeness</h4><canvas id="${canvasId}"></canvas>`;
        columnDiv.appendChild(chartContainer);

        // Add Field Cards Container for this run
        const fieldsContainerId = `fields-${runId}`;
        const fieldsContainer = document.createElement('div');
        fieldsContainer.id = fieldsContainerId;
        columnDiv.appendChild(fieldsContainer);

        comparisonArea.appendChild(columnDiv);

        // Render Chart for this column
        const labels = reportData.fields_to_analyze || [];
        const values = labels.map(field => reportData.field_details[field]?.presence_percentage ?? 0);
        renderOrUpdateChart(canvasId, labels, values);

        // Create Field Cards for this column
        createFieldCards(runId, fieldsContainerId);
    });
}

function createFieldCards(runId, containerId) {
    const container = document.getElementById(containerId);
    const reportData = loadedReportData[runId];
    if (!reportData || !reportData.fields_to_analyze || !container) return;

    container.innerHTML = ''; // Clear existing cards

    reportData.fields_to_analyze.forEach(field => {
        const data = reportData.field_details[field];
        if (!data) return;

        const card = document.createElement('div');
        card.className = 'card';

        let summaryInfo = `${data.presence_count} present (${data.presence_percentage.toFixed(1)}%) · ${data.missing_count} missing/empty`;
        if (field === 'title' && reportData.title_is_filename_count > 0) {
             const fallbackPerc = reportData.processed_files > 0 ? (reportData.title_is_filename_count / reportData.processed_files) * 100 : 0;
             summaryInfo = `${data.presence_count} extracted (${data.presence_percentage.toFixed(1)}%) · ${reportData.title_is_filename_count} fallback (${fallbackPerc.toFixed(1)}%) · ${data.missing_count} missing`;
        }

        // Pass runId to showPanel so it knows which dataset to primarily use if needed,
        // although the current showPanel uses the global selectedRuns list.
        card.innerHTML = `
            <div class='field-card-title' onclick="showPanel('${escapeHtml(field)}')">${escapeHtml(field)}</div>
            <div class='field-summary-info'>${summaryInfo}</div>
        `;
        container.appendChild(card);
    });
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    applyDarkModePreference();

    // Fetch the manifest file
    fetch(manifestFilePath)
        .then(response => {
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status} fetching manifest`); }
            return response.json();
        })
        .then(manifest => {
            console.log("Manifest loaded:", manifest);
            manifestData = manifest;

            // Populate checkboxes
            reportCheckboxesContainer.innerHTML = ''; // Clear placeholder/previous
            Object.keys(manifestData).sort().forEach(runId => {
                const div = document.createElement('div');
                div.style.display = 'inline-block'; // Keep checkboxes inline
                div.style.marginRight = '15px'; // Add spacing
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `cb-${runId}`;
                checkbox.value = runId;
                checkbox.name = 'reportRuns';
                const label = document.createElement('label');
                label.htmlFor = `cb-${runId}`;
                label.textContent = runId;
                div.appendChild(checkbox);
                div.appendChild(label);
                reportCheckboxesContainer.appendChild(div);
            });

            // Add event listener for compare button
            compareBtn.addEventListener('click', loadSelectedReports);

        })
        .catch(error => {
            console.error('Error fetching or processing manifest file:', error);
            reportHeaderInfo.textContent = 'Error loading report manifest. Cannot select reports.';
            reportCheckboxesContainer.innerHTML = '<span style="color: red;">Failed to load runs</span>';
        });
});