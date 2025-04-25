// --- Global Variables ---
const modeBtn = document.getElementById('modeBtn');
const body = document.body;
const overlay = document.getElementById('overlay');
const panel = document.getElementById('panel');
const panelTitle = document.getElementById('panelTitle');
const panelContent = document.getElementById('panelContent');
const fieldCardsContainer = document.getElementById('field-cards-container');
let completenessChart; // Chart instance
let fieldData = {}; // To store fetched analysis data

// --- Utility Functions ---
function escapeHtml(unsafe) {
    return unsafe === null || typeof unsafe === 'undefined' ? '' : String(unsafe)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
    if (completenessChart) {
        updateChartColors();
    }
}

modeBtn.addEventListener('click', () => {
    body.classList.toggle('dark');
    modeBtn.textContent = body.classList.contains('dark') ? '☀️ Light' : '🌙 Dark';
    localStorage.setItem('darkMode', body.classList.contains('dark'));
    updateChartColors();
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

function renderChart() {
    const colors = getChartColors();
    const ctx = document.getElementById('completenessChart').getContext('2d');
    if (completenessChart) { completenessChart.destroy(); }
    completenessChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: chartLabels, // Defined in HTML
            datasets: [{
                label: 'Completeness (%)',
                data: chartValues, // Defined in HTML
                backgroundColor: colors.backgroundColor,
                borderColor: colors.borderColor,
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false, // Allow chart to resize height
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
                    ticks: { color: colors.ticksColor, autoSkip: false } // Show all labels
                }
            }
        }
    });
}

function updateChartColors() {
    if (!completenessChart) return;
    const colors = getChartColors();
    completenessChart.options.scales.x.title.color = colors.labelColor;
    completenessChart.options.scales.x.grid.color = colors.gridColor;
    completenessChart.options.scales.x.ticks.color = colors.ticksColor;
    completenessChart.options.scales.y.ticks.color = colors.ticksColor;
    completenessChart.data.datasets[0].backgroundColor = colors.backgroundColor;
    completenessChart.data.datasets[0].borderColor = colors.borderColor;
    completenessChart.update();
}

// --- Panel Logic ---
function showPanel(field) {
  const data = fieldData.field_details[field]; // Access nested data
  const processed_files = fieldData.processed_files; // Get total processed files count

  if (!data || processed_files === undefined) {
      console.error('No data for field or processed_files count missing:', field);
      panelContent.innerHTML = "<p style='color: red;'>Error displaying details for this field.</p>";
      overlay.style.display = 'block'; // Show overlay even on error to indicate click worked
      return;
  }

  panelTitle.innerHTML = `Details for: <code>${escapeHtml(field)}</code>`;
  let contentHTML = '';

  // --- Presence Summary & File Lists ---
  contentHTML += `<h4>Presence & File Lists</h4>`;
  const missing_count = data.missing_files?.length ?? 0; // Use length of file list for missing count
  const present_extracted_count = data.present_files?.length ?? 0;
  const fallback_count = field === 'title' ? (fieldData.title_is_filename_count ?? 0) : 0; // Get fallback count specifically for title
  const fallback_files = field === 'title' ? (fieldData.title_fallback_files ?? []) : [];

  const present_extracted_perc = processed_files > 0 ? (present_extracted_count / processed_files) * 100 : 0;
  const fallback_perc = processed_files > 0 ? (fallback_count / processed_files) * 100 : 0;
  const missing_perc = processed_files > 0 ? (missing_count / processed_files) * 100 : 0;

  contentHTML += `<p>Present (Extracted): ${present_extracted_count} (${present_extracted_perc.toFixed(1)}%)<br>`;
  if (field === 'title') {
      contentHTML += `Present (Fallback): ${fallback_count} (${fallback_perc.toFixed(1)}%)<br>`;
  }
  contentHTML += `Missing/Empty: ${missing_count} (${missing_perc.toFixed(1)}%)</p>`;

  // File Lists with Details tags
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


  // --- Average Value / List Length ---
  if (data.is_simple_avg) {
      let avgValStr = "N/A";
      if (data.average_value !== null && typeof data.average_value === 'number') {
          if (field === 'is_oa') avgValStr = `${data.average_value.toFixed(3)} (Avg over ${processed_files} files; 1=True, 0=False)`;
          else if (field === 'publication_year') avgValStr = `${data.average_value.toFixed(0)} (Avg over ${processed_files} files)`;
          else avgValStr = `${data.average_value.toFixed(1)} (Avg over ${processed_files} files)`;
      }
      contentHTML += `<h4>Average Value</h4><p>${avgValStr}</p>`;
  } else if (data.is_list_len) {
      let avgLenStr = "N/A";
       if (data.average_list_length !== null && typeof data.average_list_length === 'number') {
           avgLenStr = `${data.average_list_length.toFixed(1)}`;
       }
      contentHTML += `<h4>Average List Length</h4><p>${avgLenStr} (Avg over ${processed_files} files)</p>`;
  }

  // --- Value Distribution (Categorical) ---
  if (data.is_categorical && data.value_counts && Object.keys(data.value_counts).length > 0) {
      contentHTML += `<h4>Value Distribution</h4>`;
      contentHTML += `<table><thead><tr><th>Value</th><th>Count</th><th>% of Present (Extracted)</th></tr></thead><tbody>`;
      const sortedValues = Object.entries(data.value_counts).sort(([,a],[,b]) => b-a);
      const current_presence_count = data.presence_count; // Use the count of *extracted* values for percentage base
      for (const [value, count] of sortedValues) {
          // Calculate percentage based on files where the field was actually *extracted*
          const percPresent = current_presence_count > 0 ? (count / current_presence_count) * 100 : 0;
          contentHTML += `<tr><td><code>${escapeHtml(value)}</code></td><td class='count'>${count}</td><td class='percentage'>${percPresent.toFixed(1)}%</td></tr>`;
      }
      contentHTML += `</tbody></table>`;
  }

  // --- Source Breakdown ---
  if (data.sources && data.sources.length > 0) {
      contentHTML += `<h4>Source Breakdown</h4>`;
      contentHTML += `<table><thead><tr><th>Source</th><th>Count</th><th>% of Present (Extracted)</th><th>% of Total (Valid)</th><th>Reliability</th></tr></thead><tbody>`;
      const current_presence_count = data.presence_count; // Use extracted count
      for (const src of data.sources) {
          // Adjust percentage calculation for sources based on extracted count
          const percPresentStr = (src.name !== 'missing_or_empty' && current_presence_count > 0) ? `${((src.count / current_presence_count) * 100).toFixed(1)}%` : 'N/A';
          const percTotalStr = processed_files > 0 ? `${((src.count / processed_files) * 100).toFixed(1)}%` : 'N/A';
          contentHTML += `<tr><td><code>${escapeHtml(src.name)}</code></td><td class='count'>${src.count}</td><td class='percentage'>${percPresentStr}</td><td class='percentage'>${percTotalStr}</td><td class='reliability'>${escapeHtml(src.reliability)}</td></tr>`;
      }
      contentHTML += `</tbody></table>`;
      contentHTML += `<p class='note'>'openalex (inferred)' means OA fields likely came from OpenAlex data based on context (presence of OpenAlex ID), but wasn't explicitly tagged.</p>`;
  }

  // --- Trust Attributes ---
  if (data.trust_attributes && data.trust_attributes.length > 0) {
      contentHTML += `<div class='trust-attributes'><h4>Potential Trustworthiness Indicators</h4><ul>`;
      for (const attr of data.trust_attributes) {
          contentHTML += `<li><strong>${escapeHtml(attr.name)}:</strong> <em>${escapeHtml(attr.definition)}</em></li>`;
      }
      contentHTML += `</ul></div>`;
  } else {
       contentHTML += `<div class='trust-attributes'><h4>Potential Trustworthiness Indicators</h4><ul><li><em>No direct trust attributes strongly mapped.</em></li></ul></div>`;
  }

  panelContent.innerHTML = contentHTML;
  overlay.style.display='flex'; // Use flex to enable centering
}

function hideOverlay(e){
    if(e.target.id === 'overlay' || e.target.classList.contains('close-btn')) {
        overlay.style.display='none';
        panelContent.innerHTML = ''; // Clear content
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    applyDarkModePreference();
    renderChart();

    fetch(dataFilePath) // dataFilePath is defined in the HTML
        .then(response => {
            if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
            return response.json();
        })
        .then(data => {
            console.log("Analysis data loaded successfully.");
            // Restructure fetched data slightly for easier access in showPanel
            fieldData = {
                 processed_files: data.processed_files,
                 fields_to_analyze: data.fields_to_analyze,
                 title_is_filename_count: data.title_is_filename_count, // Add fallback count
                 title_fallback_files: data.title_fallback_files,       // Add fallback files
                 field_details: {}
            };
            data.fields_to_analyze.forEach(field => {
                 fieldData.field_details[field] = {
                     presence_count: data.field_presence_counts?.[field] ?? 0,
                     missing_count: data.field_missing_in_files?.[field]?.length ?? (data.processed_files - (data.field_presence_counts?.[field] ?? 0)), // Recalculate missing based on list or count
                     presence_percentage: data.processed_files > 0 ? ((data.field_presence_counts?.[field] ?? 0) / data.processed_files) * 100 : 0,
                     average_value: data.field_averages?.[field] ?? null,
                     average_list_length: data.field_avg_list_lengths?.[field] ?? null,
                     value_counts: data.field_value_counts?.[field] ?? null,
                     sources: data.field_source_counts?.[field] ? Object.entries(data.field_source_counts[field]).map(([name, count]) => {
                         const pres_count = data.field_presence_counts?.[field] ?? 0;
                         const perc_present = pres_count > 0 && name !== 'missing_or_empty' ? (count / pres_count) * 100 : null;
                         const perc_total = data.processed_files > 0 ? (count / data.processed_files) * 100 : 0;
                         let source_reliability = "N/A";
                         if (name === 'missing_or_empty') source_reliability = "Field Absent/Empty";
                         else if (['openalex', 'crossref', 'grobid', 'filename_doi', 'user', 'openalex_concepts', 'openalex (inferred)'].includes(name)) source_reliability = "High (API/Parser/User/Inferred)";
                         else if (name === 'nlp') source_reliability = "Medium (NLP Dependent)";
                         else if (['unknown', 'unknown_doi_source', 'determination_method_missing'].includes(name)) source_reliability = "Low (Source Unknown)";
                         else source_reliability = "Variable (Check Source)";
                         return { name, count, perc_present, perc_total, reliability: source_reliability };
                     }).sort((a, b) => { // Sort, putting missing last
                        if (a.name === 'missing_or_empty') return 1;
                        if (b.name === 'missing_or_empty') return -1;
                        return b.count - a.count;
                     }) : [],
                     trust_attributes: data.field_to_trust_map?.[field] ? data.field_to_trust_map[field].map(attr_name => ({ name: attr_name, definition: data.trust_attributes?.[attr_name] ?? "Definition not found." })) : [],
                     is_simple_avg: data.simple_fields_for_average?.includes(field) ?? false,
                     is_list_len: data.list_fields_for_length?.includes(field) ?? false,
                     is_categorical: data.categorical_fields?.includes(field) ?? false,
                     present_files: data.field_present_in_files?.[field] ?? [],
                     missing_files: data.field_missing_in_files?.[field] ?? []
                 };
            });
            createFieldCards(); // Create cards *after* data is loaded
        })
        .catch(error => {
            console.error('Error fetching or processing analysis data:', error);
            fieldCardsContainer.innerHTML = "<p style='color: red;'>Error loading analysis data. Please check the console and ensure 'report_data.json' exists and is valid.</p>";
        });
});

function createFieldCards() {
    if (!fieldData.fields_to_analyze || !fieldCardsContainer) return;
    fieldCardsContainer.innerHTML = ''; // Clear placeholder

    fieldData.fields_to_analyze.forEach(field => {
        const data = fieldData.field_details[field];
        const card = document.createElement('div');
        card.className = 'card';
        // Adjust summary info for title
        let summaryInfo = `${data.presence_count} present (${data.presence_percentage.toFixed(1)}%) · ${data.missing_count} missing/empty`;
        if (field === 'title' && fieldData.title_is_filename_count > 0) {
             const fallbackPerc = fieldData.processed_files > 0 ? (fieldData.title_is_filename_count / fieldData.processed_files) * 100 : 0;
             summaryInfo = `${data.presence_count} extracted (${data.presence_percentage.toFixed(1)}%) · ${fieldData.title_is_filename_count} fallback (${fallbackPerc.toFixed(1)}%) · ${data.missing_count} missing`;
        }

        card.innerHTML = `
            <div class='field-card-title' onclick="showPanel('${escapeHtml(field)}')">${escapeHtml(field)}</div>
            <div class='field-summary-info'>${summaryInfo}</div>
        `;
        fieldCardsContainer.appendChild(card);
    });
}