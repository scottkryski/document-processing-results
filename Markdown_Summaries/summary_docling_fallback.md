# Metadata Extraction Summary: Run 'docling_fallback'
Analyzed **518** valid JSON files (out of 518 total). Skipped **0** error files.
Total Analysis Script Duration: **0.77 seconds**.

---

## DOI Determination Analysis
*(How the primary DOI was identified)*

| Method                           | Count | Percentage | Reliability Note        |
|----------------------------------|-------|------------|-------------------------|
| `grobid_parse                  ` |   403 |       77.8% | Variable/Consensus      |
| `docling_full                  ` |    14 |        2.7% | Low                     |
| `consensus (arxiv_scrape + 2)  ` |     9 |        1.7% | Variable/Consensus      |
| `docling_early                 ` |     6 |        1.2% | Medium                  |
| `cr_title_search               ` |     3 |        0.6% | Variable/Consensus      |
| `consensus (cr_title_search ...` |     2 |        0.4% | Variable/Consensus      |
| `consensus (arxiv_scrape + 1)  ` |     2 |        0.4% | Variable/Consensus      |
| `consensus (docling_early + 1) ` |     1 |        0.2% | Variable/Consensus      |
| `arxiv_scrape                  ` |     1 |        0.2% | Medium                  |
| **Total Methods Recorded**       |   441 |            |                         |

---

## Detailed Field Analysis
*Analysis includes presence, source breakdown, average values (where applicable), interpretation, NLP potential, and potential trust implications.*

### Field: `doi`
- **Presence (Extracted):** 441 / 518 (85.1%)
- **Missing/Empty:** 77 / 518 (14.9%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `grobid_parse              ` |   403 |                91.4% |               77.8% | Variable (Check Source) |
  | `docling_full              ` |    14 |                 3.2% |                2.7% | Variable (Check Source) |
  | `consensus (arxiv_scrape + 2)` |     9 |                 2.0% |                1.7% | Variable (Check Source) |
  | `docling_early             ` |     6 |                 1.4% |                1.2% | Variable (Check Source) |
  | `cr_title_search           ` |     3 |                 0.7% |                0.6% | Variable (Check Source) |
  | `consensus (cr_title_search + 1)` |     2 |                 0.5% |                0.4% | Variable (Check Source) |
  | `consensus (arxiv_scrape + 1)` |     2 |                 0.5% |                0.4% | Variable (Check Source) |
  | `consensus (docling_early + 1)` |     1 |                 0.2% |                0.2% | Variable (Check Source) |
  | `arxiv_scrape              ` |     1 |                 0.2% |                0.2% | Variable (Check Source) |
  | `missing_or_empty          ` |    77 |                  N/A |               14.9% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Authenticity`, `Clear Documentation of Methods`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (85.1%) suggests this field is consistently available from primary sources (APIs, Grobid parse).

### Field: `title`
- **Presence (Extracted):** 512 / 518 (98.8%)
- **Presence (Fallback Title):** 6 / 518 (1.2%)
- **Missing/Empty:** 0 / 518 (0.0%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   512 |               100.0% |               98.8% | Low (Source Unknown)    |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Transparency`, `Clear Reporting of Results`, `Authenticity`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (98.8%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
  - *Note:* 1.2% of titles were fallbacks using the filename, indicating extraction failure for the actual title in those cases.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `abstract`
- **Presence (Extracted):** 503 / 518 (97.1%)
- **Missing/Empty:** 15 / 518 (2.9%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   200 |                39.8% |               38.6% | High (API/Parser/User/Inferred) |
  | `crossref                  ` |   199 |                39.6% |               38.4% | High (API/Parser/User/Inferred) |
  | `grobid                    ` |   104 |                20.7% |               20.1% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    15 |                  N/A |                2.9% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Reporting of Results`, `Coherence of Findings`, `Transparency`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (97.1%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
    - Mix of API and Grobid sources indicates robustness; usually found if present in the document or APIs.

### Field: `authors`
- **Presence (Extracted):** 512 / 518 (98.8%)
- **Missing/Empty:** 6 / 518 (1.2%)
- **Average List Length:** 3.8 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `crossref                  ` |   397 |                77.5% |               76.6% | High (API/Parser/User/Inferred) |
  | `grobid_header             ` |    89 |                17.4% |               17.2% | Variable (Check Source) |
  | `openalex                  ` |    26 |                 5.1% |                5.0% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |     6 |                  N/A |                1.2% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Transparency`, `Honesty and Integrity`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (98.8%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
    - Mix of API and Grobid sources indicates robustness; usually found if present in the document or APIs.

### Field: `affiliations`
- **Presence (Extracted):** 481 / 518 (92.9%)
- **Missing/Empty:** 37 / 518 (7.1%)
- **Average List Length:** 2.0 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   366 |                76.1% |               70.7% | High (API/Parser/User/Inferred) |
  | `grobid_header             ` |   115 |                23.9% |               22.2% | Variable (Check Source) |
  | `missing_or_empty          ` |    37 |                  N/A |                7.1% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Transparency`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (92.9%) suggests this field is consistently available from primary sources (APIs, Grobid parse).

### Field: `journal_title`
- **Presence (Extracted):** 422 / 518 (81.5%)
- **Missing/Empty:** 96 / 518 (18.5%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   422 |               100.0% |               81.5% | Low (Source Unknown)    |
  | `missing_or_empty          ` |    96 |                  N/A |               18.5% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `External Validation`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (81.5%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `publisher`
- **Presence (Extracted):** 423 / 518 (81.7%)
- **Missing/Empty:** 95 / 518 (18.3%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   423 |               100.0% |               81.7% | Low (Source Unknown)    |
  | `missing_or_empty          ` |    95 |                  N/A |               18.3% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `External Validation`, `Transparency`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (81.7%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `issn`
- **Presence (Extracted):** 431 / 518 (83.2%)
- **Missing/Empty:** 87 / 518 (16.8%)
- **Average List Length:** 1.2 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   431 |               100.0% |               83.2% | Low (Source Unknown)    |
  | `missing_or_empty          ` |    87 |                  N/A |               16.8% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Authenticity`, `External Validation`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (83.2%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `publication_date`
- **Presence (Extracted):** 432 / 518 (83.4%)
- **Missing/Empty:** 86 / 518 (16.6%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `crossref                  ` |   409 |                94.7% |               79.0% | High (API/Parser/User/Inferred) |
  | `openalex                  ` |    16 |                 3.7% |                3.1% | High (API/Parser/User/Inferred) |
  | `grobid                    ` |     7 |                 1.6% |                1.4% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    86 |                  N/A |               16.6% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Documentation of Methods`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (83.4%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `publication_year`
- **Presence (Extracted):** 432 / 518 (83.4%)
- **Missing/Empty:** 86 / 518 (16.6%)
- **Average Value:** 1684 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   432 |               100.0% |               83.4% | Low (Source Unknown)    |
  | `missing_or_empty          ` |    86 |                  N/A |               16.6% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Documentation of Methods`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (83.4%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `license`
- **Presence (Extracted):** 300 / 518 (57.9%)
- **Missing/Empty:** 218 / 518 (42.1%)
- **Value Distribution (Top 5):**
  - `cc-by`: 60 (20.0%)
  - `https://creativecommons.org/licenses/by/4.0`: 43 (14.3%)
  - `http://creativecommons.org/licenses/by/4.0/`: 30 (10.0%)
  - `https://creativecommons.org/licenses/by/4.0/`: 21 (7.0%)
  - `http://creativecommons.org/licenses/by/4.0`: 14 (4.7%)
  - *(... and others)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `crossref                  ` |   207 |                69.0% |               40.0% | High (API/Parser/User/Inferred) |
  | `openalex                  ` |    93 |                31.0% |               18.0% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |   218 |                  N/A |               42.1% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Transparency`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (57.9%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `conflict_of_interest`
- **Presence (Extracted):** 100 / 518 (19.3%)
- **Missing/Empty:** 418 / 518 (80.7%)
- **Average List Length:** 0.2 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   100 |               100.0% |               19.3% | Low (Source Unknown)    |
  | `missing_or_empty          ` |   418 |                  N/A |               80.7% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Transparency`, `Honesty and Integrity`, `Fairness to Alternate Views`
- **Interpretation & Notes:**
  - **Difficult Extraction:** Low presence (19.3%) indicates the information is often sparse or absent in source documents/APIs.
    - **NLP Potential:** NLP classification/NER could potentially find sections/phrases, but structure varies greatly. May require more advanced LLM analysis or targeted section parsing. Often absent.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `references_count`
- **Presence (Extracted):** 518 / 518 (100.0%)
- **Missing/Empty:** 0 / 518 (0.0%)
- **Average Value:** 25.8 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   425 |                82.0% |               82.0% | High (API/Parser/User/Inferred) |
  | `grobid                    ` |    77 |                14.9% |               14.9% | High (API/Parser/User/Inferred) |
  | `none                      ` |    16 |                 3.1% |                3.1% | Variable (Check Source) |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Coherence of Findings`, `Scholarship Context`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (100.0%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
    - Primarily sourced from OpenAlex, indicating good coverage for API-retrievable metadata.

### Field: `keywords`
- **Presence (Extracted):** 479 / 518 (92.5%)
- **Missing/Empty:** 39 / 518 (7.5%)
- **Average List Length:** 4.9 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `grobid                    ` |   327 |                68.3% |               63.1% | High (API/Parser/User/Inferred) |
  | `openalex_concepts         ` |   152 |                31.7% |               29.3% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    39 |                  N/A |                7.5% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Reporting of Results`, `Coherence of Findings`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (92.5%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
    - Mix of API and Grobid sources indicates robustness; usually found if present in the document or APIs.

### Field: `openalex_id`
- **Presence (Extracted):** 425 / 518 (82.0%)
- **Missing/Empty:** 93 / 518 (18.0%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   425 |               100.0% |               82.0% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    93 |                  N/A |               18.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Authenticity`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (82.0%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `type`
- **Presence (Extracted):** 423 / 518 (81.7%)
- **Missing/Empty:** 95 / 518 (18.3%)
- **Value Distribution (Top 5):**
  - `journal-article`: 400 (94.6%)
  - `repository`: 12 (2.8%)
  - `proceedings-article`: 4 (0.9%)
  - `journal`: 2 (0.5%)
  - `report-component`: 1 (0.2%)
  - *(... and others)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   423 |               100.0% |               81.7% | Low (Source Unknown)    |
  | `missing_or_empty          ` |    95 |                  N/A |               18.3% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Documentation of Methods`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (81.7%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `is_oa`
- **Presence (Extracted):** 425 / 518 (82.0%)
- **Missing/Empty:** 93 / 518 (18.0%)
- **Average Value:** 80.3% (1=True, 0=False) *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex (inferred)       ` |   425 |               100.0% |               82.0% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    93 |                  N/A |               18.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (82.0%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `oa_status`
- **Presence (Extracted):** 425 / 518 (82.0%)
- **Missing/Empty:** 93 / 518 (18.0%)
- **Value Distribution (Top 5):**
  - `gold`: 177 (41.6%)
  - `diamond`: 65 (15.3%)
  - `green`: 60 (14.1%)
  - `bronze`: 59 (13.9%)
  - `hybrid`: 55 (12.9%)
  - *(... and others)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex (inferred)       ` |   425 |               100.0% |               82.0% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    93 |                  N/A |               18.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (82.0%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `oa_url`
- **Presence (Extracted):** 416 / 518 (80.3%)
- **Missing/Empty:** 102 / 518 (19.7%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex (inferred)       ` |   416 |               100.0% |               80.3% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |   102 |                  N/A |               19.7% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (80.3%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `cited_by_count`
- **Presence (Extracted):** 425 / 518 (82.0%)
- **Missing/Empty:** 93 / 518 (18.0%)
- **Average Value:** 35.1 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   425 |               100.0% |               82.0% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    93 |                  N/A |               18.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `External Validation`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (82.0%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `mentioned_datasets`
- **Presence (Extracted):** 0 / 518 (0.0%)
- **Missing/Empty:** 518 / 518 (100.0%)
- **Average List Length:** 0.0 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `missing_or_empty          ` |   518 |                  N/A |              100.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Clear Documentation of Methods`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Difficult Extraction:** Low presence (0.0%) indicates the information is often sparse or absent in source documents/APIs.
    - **NLP Potential:** Named Entity Recognition (NER) models are the primary way to extract these. Success depends entirely on NLP model accuracy and whether the terms are mentioned explicitly.

### Field: `mentioned_software`
- **Presence (Extracted):** 0 / 518 (0.0%)
- **Missing/Empty:** 518 / 518 (100.0%)
- **Average List Length:** 0.0 *(Avg over all 518 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `missing_or_empty          ` |   518 |                  N/A |              100.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Clear Documentation of Methods`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Difficult Extraction:** Low presence (0.0%) indicates the information is often sparse or absent in source documents/APIs.
    - **NLP Potential:** Named Entity Recognition (NER) models are the primary way to extract these. Success depends entirely on NLP model accuracy and whether the terms are mentioned explicitly.

### Field: `data_availability_statement`
- **Presence (Extracted):** 0 / 518 (0.0%)
- **Missing/Empty:** 518 / 518 (100.0%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `missing_or_empty          ` |   518 |                  N/A |              100.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Transparency`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Difficult Extraction:** Low presence (0.0%) indicates the information is often sparse or absent in source documents/APIs.
    - **NLP Potential:** Sentence classification models are needed to identify these statements. Requires training data and robust models; statements are often absent or ambiguously worded.

### Field: `code_availability_statement`
- **Presence (Extracted):** 0 / 518 (0.0%)
- **Missing/Empty:** 518 / 518 (100.0%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `missing_or_empty          ` |   518 |                  N/A |              100.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   518 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Transparency`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Difficult Extraction:** Low presence (0.0%) indicates the information is often sparse or absent in source documents/APIs.
    - **NLP Potential:** Sentence classification models are needed to identify these statements. Requires training data and robust models; statements are often absent or ambiguously worded.

---

## Ease of Extraction Summary (Based on Presence)
*Categorization based on **extracted** presence percentage: Easy >= 85.0%; Difficult < 50.0%; Medium otherwise.*

### Likely Low-Hanging Fruit (Easy: High Presence)
- **`abstract`**: 97.1% present. *(Avg: N/A)*
- **`affiliations`**: 92.9% present. *(Avg: 2.0)*
- **`authors`**: 98.8% present. *(Avg: 3.8)*
- **`doi`**: 85.1% present. *(Avg: N/A)*
- **`keywords`**: 92.5% present. *(Avg: 4.9)*
- **`references_count`**: 100.0% present. *(Avg: 25.8)*
- **`title`**: 98.8% present. *(Avg: N/A)*

### Likely More Difficult Fields (Difficult: Low Presence)
- **`code_availability_statement`**: 0.0% present. *(Avg: N/A)*
- **`conflict_of_interest`**: 19.3% present. *(Avg: 0.2)*
- **`data_availability_statement`**: 0.0% present. *(Avg: N/A)*
- **`mentioned_datasets`**: 0.0% present. *(Avg: 0.0)*
- **`mentioned_software`**: 0.0% present. *(Avg: 0.0)*

### Fields with Medium Presence
- **`cited_by_count`**: 82.0% present. *(Avg: 35.1)*
- **`is_oa`**: 82.0% present. *(Avg: 80.3% (1=True, 0=False))*
- **`issn`**: 83.2% present. *(Avg: 1.2)*
- **`journal_title`**: 81.5% present. *(Avg: N/A)*
- **`license`**: 57.9% present. *(Avg: N/A)*
- **`oa_status`**: 82.0% present. *(Avg: N/A)*
- **`oa_url`**: 80.3% present. *(Avg: N/A)*
- **`openalex_id`**: 82.0% present. *(Avg: N/A)*
- **`publication_date`**: 83.4% present. *(Avg: N/A)*
- **`publication_year`**: 83.4% present. *(Avg: 1684)*
- **`publisher`**: 81.7% present. *(Avg: N/A)*
- **`type`**: 81.7% present. *(Avg: N/A)*

---

## Trust Attribute Assessment
*Estimated ability to gather evidence for each attribute based on the presence of relevant metadata fields.*

### Directly Captured Attributes
*Attributes where relevant metadata is often easily extracted.*
- **`Clear Reporting of Results`** (~100% confidence)
  - *Key Fields:* `title`, `abstract`, `keywords`
- **`Coherence of Findings`** (~100% confidence)
  - *Key Fields:* `abstract`, `references_count`, `keywords`

### NLP-Assisted Attributes
*Attributes where some metadata is available, but full assessment likely requires NLP extraction for difficult fields.*
- **`Transparency`** (~55% confidence)
  - *Key Fields:* `title`, `abstract`, `authors`, `affiliations`, `publisher`, `license`, `conflict_of_interest`, `data_availability_statement`, `code_availability_statement`
- **`Honesty and Integrity`** (~55% confidence)
  - *Key Fields:* `authors`, `conflict_of_interest`
- **`Clear Documentation of Methods`** (~50% confidence)
  - *Key Fields:* `doi`, `publication_date`, `publication_year`, `type`, `mentioned_datasets`, `mentioned_software`
- **`Auditability and Method Consistency`** (~47% confidence)
  - *Key Fields:* `doi`, `openalex_id`, `oa_url`, `mentioned_datasets`, `mentioned_software`, `data_availability_statement`, `code_availability_statement`
- **`Open Science Practices`** (~45% confidence)
  - *Key Fields:* `license`, `is_oa`, `oa_status`, `oa_url`, `mentioned_datasets`, `mentioned_software`, `data_availability_statement`, `code_availability_statement`
- **`Fairness to Alternate Views`** (~40% confidence)
  - *Key Fields:* `conflict_of_interest`

### Difficult / Manual Assessment Attributes
*Attributes where relevant metadata is often sparse, difficult to extract automatically, or requires deeper analysis.*
- **`Authenticity`** (~50% confidence)
  - *Key Fields:* `doi`, `title`, `issn`, `openalex_id`
- **`External Validation`** (~40% confidence)
  - *Key Fields:* `journal_title`, `publisher`, `issn`, `cited_by_count`

---

*(End of Report)*