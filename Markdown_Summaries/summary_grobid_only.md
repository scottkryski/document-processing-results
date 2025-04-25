# Metadata Extraction Summary: Run 'grobid_only'
Analyzed **517** valid JSON files (out of 518 total). Skipped **1** error files.
Total Analysis Script Duration: **0.64 seconds**.
*Skipped error files: OpenAlex_ifnm.1000216_ERROR_partial.json*

---

## DOI Determination Analysis
*(How the primary DOI was identified)*

| Method                           | Count | Percentage | Reliability Note        |
|----------------------------------|-------|------------|-------------------------|
| `grobid_parse                  ` |   406 |       78.5% | Variable/Consensus      |
| `consensus (arxiv_scrape + 1)  ` |    10 |        1.9% | Variable/Consensus      |
| `cr_title_search               ` |     2 |        0.4% | Variable/Consensus      |
| `arxiv_scrape                  ` |     2 |        0.4% | Medium                  |
| `consensus (cr_title_search ...` |     1 |        0.2% | Variable/Consensus      |
| **Total Methods Recorded**       |   421 |            |                         |

---

## Detailed Field Analysis
*Analysis includes presence, source breakdown, average values (where applicable), interpretation, NLP potential, and potential trust implications.*

### Field: `doi`
- **Presence (Extracted):** 421 / 517 (81.4%)
- **Missing/Empty:** 96 / 517 (18.6%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `grobid_parse              ` |   406 |                96.4% |               78.5% | Variable (Check Source) |
  | `consensus (arxiv_scrape + 1)` |    10 |                 2.4% |                1.9% | Variable (Check Source) |
  | `cr_title_search           ` |     2 |                 0.5% |                0.4% | Variable (Check Source) |
  | `arxiv_scrape              ` |     2 |                 0.5% |                0.4% | Variable (Check Source) |
  | `consensus (cr_title_search + 1)` |     1 |                 0.2% |                0.2% | Variable (Check Source) |
  | `missing_or_empty          ` |    96 |                  N/A |               18.6% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Authenticity`, `Clear Documentation of Methods`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (81.4%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `title`
- **Presence (Extracted):** 508 / 517 (98.3%)
- **Presence (Fallback Title):** 9 / 517 (1.7%)
- **Missing/Empty:** 0 / 517 (0.0%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   508 |               100.0% |               98.3% | Low (Source Unknown)    |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Transparency`, `Clear Reporting of Results`, `Authenticity`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (98.3%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
  - *Note:* 1.7% of titles were fallbacks using the filename, indicating extraction failure for the actual title in those cases.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `abstract`
- **Presence (Extracted):** 502 / 517 (97.1%)
- **Missing/Empty:** 15 / 517 (2.9%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   194 |                38.6% |               37.5% | High (API/Parser/User/Inferred) |
  | `crossref                  ` |   191 |                38.0% |               36.9% | High (API/Parser/User/Inferred) |
  | `grobid                    ` |   117 |                23.3% |               22.6% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    15 |                  N/A |                2.9% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Reporting of Results`, `Coherence of Findings`, `Transparency`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (97.1%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
    - Mix of API and Grobid sources indicates robustness; usually found if present in the document or APIs.

### Field: `authors`
- **Presence (Extracted):** 508 / 517 (98.3%)
- **Missing/Empty:** 9 / 517 (1.7%)
- **Average List Length:** 3.8 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `crossref                  ` |   381 |                75.0% |               73.7% | High (API/Parser/User/Inferred) |
  | `grobid_header             ` |   103 |                20.3% |               19.9% | Variable (Check Source) |
  | `openalex                  ` |    24 |                 4.7% |                4.6% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |     9 |                  N/A |                1.7% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Transparency`, `Honesty and Integrity`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (98.3%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
    - Mix of API and Grobid sources indicates robustness; usually found if present in the document or APIs.

### Field: `affiliations`
- **Presence (Extracted):** 478 / 517 (92.5%)
- **Missing/Empty:** 39 / 517 (7.5%)
- **Average List Length:** 2.0 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   356 |                74.5% |               68.9% | High (API/Parser/User/Inferred) |
  | `grobid_header             ` |   122 |                25.5% |               23.6% | Variable (Check Source) |
  | `missing_or_empty          ` |    39 |                  N/A |                7.5% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Transparency`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (92.5%) suggests this field is consistently available from primary sources (APIs, Grobid parse).

### Field: `journal_title`
- **Presence (Extracted):** 407 / 517 (78.7%)
- **Missing/Empty:** 110 / 517 (21.3%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   407 |               100.0% |               78.7% | Low (Source Unknown)    |
  | `missing_or_empty          ` |   110 |                  N/A |               21.3% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `External Validation`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (78.7%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `publisher`
- **Presence (Extracted):** 407 / 517 (78.7%)
- **Missing/Empty:** 110 / 517 (21.3%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   407 |               100.0% |               78.7% | Low (Source Unknown)    |
  | `missing_or_empty          ` |   110 |                  N/A |               21.3% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `External Validation`, `Transparency`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (78.7%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `issn`
- **Presence (Extracted):** 421 / 517 (81.4%)
- **Missing/Empty:** 96 / 517 (18.6%)
- **Average List Length:** 1.2 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   421 |               100.0% |               81.4% | Low (Source Unknown)    |
  | `missing_or_empty          ` |    96 |                  N/A |               18.6% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Authenticity`, `External Validation`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (81.4%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `publication_date`
- **Presence (Extracted):** 418 / 517 (80.9%)
- **Missing/Empty:** 99 / 517 (19.1%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `crossref                  ` |   394 |                94.3% |               76.2% | High (API/Parser/User/Inferred) |
  | `openalex                  ` |    14 |                 3.3% |                2.7% | High (API/Parser/User/Inferred) |
  | `grobid                    ` |    10 |                 2.4% |                1.9% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    99 |                  N/A |               19.1% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Documentation of Methods`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (80.9%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `publication_year`
- **Presence (Extracted):** 418 / 517 (80.9%)
- **Missing/Empty:** 99 / 517 (19.1%)
- **Average Value:** 1632 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   418 |               100.0% |               80.9% | Low (Source Unknown)    |
  | `missing_or_empty          ` |    99 |                  N/A |               19.1% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Documentation of Methods`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (80.9%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `license`
- **Presence (Extracted):** 292 / 517 (56.5%)
- **Missing/Empty:** 225 / 517 (43.5%)
- **Value Distribution (Top 5):**
  - `cc-by`: 59 (20.2%)
  - `https://creativecommons.org/licenses/by/4.0`: 43 (14.7%)
  - `http://creativecommons.org/licenses/by/4.0/`: 29 (9.9%)
  - `https://creativecommons.org/licenses/by/4.0/`: 21 (7.2%)
  - `http://creativecommons.org/licenses/by/4.0`: 13 (4.5%)
  - *(... and others)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `crossref                  ` |   202 |                69.2% |               39.1% | High (API/Parser/User/Inferred) |
  | `openalex                  ` |    90 |                30.8% |               17.4% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |   225 |                  N/A |               43.5% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Transparency`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (56.5%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `conflict_of_interest`
- **Presence (Extracted):** 100 / 517 (19.3%)
- **Missing/Empty:** 417 / 517 (80.7%)
- **Average List Length:** 0.2 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   100 |               100.0% |               19.3% | Low (Source Unknown)    |
  | `missing_or_empty          ` |   417 |                  N/A |               80.7% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Transparency`, `Honesty and Integrity`, `Fairness to Alternate Views`
- **Interpretation & Notes:**
  - **Difficult Extraction:** Low presence (19.3%) indicates the information is often sparse or absent in source documents/APIs.
    - **NLP Potential:** NLP classification/NER could potentially find sections/phrases, but structure varies greatly. May require more advanced LLM analysis or targeted section parsing. Often absent.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `references_count`
- **Presence (Extracted):** 517 / 517 (100.0%)
- **Missing/Empty:** 0 / 517 (0.0%)
- **Average Value:** 25.9 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   408 |                78.9% |               78.9% | High (API/Parser/User/Inferred) |
  | `grobid                    ` |    94 |                18.2% |               18.2% | High (API/Parser/User/Inferred) |
  | `none                      ` |    15 |                 2.9% |                2.9% | Variable (Check Source) |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Coherence of Findings`, `Scholarship Context`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (100.0%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
    - Primarily sourced from OpenAlex, indicating good coverage for API-retrievable metadata.

### Field: `keywords`
- **Presence (Extracted):** 473 / 517 (91.5%)
- **Missing/Empty:** 44 / 517 (8.5%)
- **Average List Length:** 4.8 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `grobid                    ` |   327 |                69.1% |               63.2% | High (API/Parser/User/Inferred) |
  | `openalex_concepts         ` |   146 |                30.9% |               28.2% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |    44 |                  N/A |                8.5% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Reporting of Results`, `Coherence of Findings`
- **Interpretation & Notes:**
  - **Easy Extraction:** High presence (91.5%) suggests this field is consistently available from primary sources (APIs, Grobid parse).
    - Mix of API and Grobid sources indicates robustness; usually found if present in the document or APIs.

### Field: `openalex_id`
- **Presence (Extracted):** 408 / 517 (78.9%)
- **Missing/Empty:** 109 / 517 (21.1%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   408 |               100.0% |               78.9% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |   109 |                  N/A |               21.1% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Authenticity`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (78.9%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `type`
- **Presence (Extracted):** 407 / 517 (78.7%)
- **Missing/Empty:** 110 / 517 (21.3%)
- **Value Distribution (Top 5):**
  - `journal-article`: 389 (95.6%)
  - `repository`: 11 (2.7%)
  - `proceedings-article`: 4 (1.0%)
  - `journal`: 2 (0.5%)
  - `journal-issue`: 1 (0.2%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `unknown                   ` |   407 |               100.0% |               78.7% | Low (Source Unknown)    |
  | `missing_or_empty          ` |   110 |                  N/A |               21.3% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Clear Documentation of Methods`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (78.7%) is moderate. Extraction success may vary depending on document type and source availability.
  - *Note:* Source often marked 'unknown' (100.0% of present), suggesting potential gaps in source tracking or reliance on less structured extraction (e.g., Docling fallback without specific tagging).

### Field: `is_oa`
- **Presence (Extracted):** 408 / 517 (78.9%)
- **Missing/Empty:** 109 / 517 (21.1%)
- **Average Value:** 78.3% (1=True, 0=False) *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex (inferred)       ` |   408 |               100.0% |               78.9% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |   109 |                  N/A |               21.1% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (78.9%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `oa_status`
- **Presence (Extracted):** 408 / 517 (78.9%)
- **Missing/Empty:** 109 / 517 (21.1%)
- **Value Distribution (Top 5):**
  - `gold`: 174 (42.6%)
  - `diamond`: 65 (15.9%)
  - `green`: 58 (14.2%)
  - `bronze`: 55 (13.5%)
  - `hybrid`: 53 (13.0%)
  - *(... and others)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex (inferred)       ` |   408 |               100.0% |               78.9% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |   109 |                  N/A |               21.1% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (78.9%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `oa_url`
- **Presence (Extracted):** 405 / 517 (78.3%)
- **Missing/Empty:** 112 / 517 (21.7%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex (inferred)       ` |   405 |               100.0% |               78.3% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |   112 |                  N/A |               21.7% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (78.3%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `cited_by_count`
- **Presence (Extracted):** 408 / 517 (78.9%)
- **Missing/Empty:** 109 / 517 (21.1%)
- **Average Value:** 13.4 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `openalex                  ` |   408 |               100.0% |               78.9% | High (API/Parser/User/Inferred) |
  | `missing_or_empty          ` |   109 |                  N/A |               21.1% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `External Validation`
- **Interpretation & Notes:**
  - **Medium Extraction:** Presence (78.9%) is moderate. Extraction success may vary depending on document type and source availability.

### Field: `mentioned_datasets`
- **Presence (Extracted):** 0 / 517 (0.0%)
- **Missing/Empty:** 517 / 517 (100.0%)
- **Average List Length:** 0.0 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `missing_or_empty          ` |   517 |                  N/A |              100.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Clear Documentation of Methods`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Difficult Extraction:** Low presence (0.0%) indicates the information is often sparse or absent in source documents/APIs.
    - **NLP Potential:** Named Entity Recognition (NER) models are the primary way to extract these. Success depends entirely on NLP model accuracy and whether the terms are mentioned explicitly.

### Field: `mentioned_software`
- **Presence (Extracted):** 0 / 517 (0.0%)
- **Missing/Empty:** 517 / 517 (100.0%)
- **Average List Length:** 0.0 *(Avg over all 517 valid files, missing treated as 0)*
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `missing_or_empty          ` |   517 |                  N/A |              100.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Clear Documentation of Methods`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Difficult Extraction:** Low presence (0.0%) indicates the information is often sparse or absent in source documents/APIs.
    - **NLP Potential:** Named Entity Recognition (NER) models are the primary way to extract these. Success depends entirely on NLP model accuracy and whether the terms are mentioned explicitly.

### Field: `data_availability_statement`
- **Presence (Extracted):** 0 / 517 (0.0%)
- **Missing/Empty:** 517 / 517 (100.0%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `missing_or_empty          ` |   517 |                  N/A |              100.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
- **Potential Trustworthiness Indicators:**
  - `Open Science Practices`, `Transparency`, `Auditability and Method Consistency`
- **Interpretation & Notes:**
  - **Difficult Extraction:** Low presence (0.0%) indicates the information is often sparse or absent in source documents/APIs.
    - **NLP Potential:** Sentence classification models are needed to identify these statements. Requires training data and robust models; statements are often absent or ambiguously worded.

### Field: `code_availability_statement`
- **Presence (Extracted):** 0 / 517 (0.0%)
- **Missing/Empty:** 517 / 517 (100.0%)
- **Source Breakdown:**
  | Source                     | Count | % of Present (Extr.) | % of Total (Valid) | Reliability Note        |
  |----------------------------|-------|----------------------|--------------------|-------------------------|
  | `missing_or_empty          ` |   517 |                  N/A |              100.0% | Field Absent/Empty      |
  | **Total Records Analyzed** |   517 |                      |                    |                         |
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
- **`affiliations`**: 92.5% present. *(Avg: 2.0)*
- **`authors`**: 98.3% present. *(Avg: 3.8)*
- **`keywords`**: 91.5% present. *(Avg: 4.8)*
- **`references_count`**: 100.0% present. *(Avg: 25.9)*
- **`title`**: 98.3% present. *(Avg: N/A)*

### Likely More Difficult Fields (Difficult: Low Presence)
- **`code_availability_statement`**: 0.0% present. *(Avg: N/A)*
- **`conflict_of_interest`**: 19.3% present. *(Avg: 0.2)*
- **`data_availability_statement`**: 0.0% present. *(Avg: N/A)*
- **`mentioned_datasets`**: 0.0% present. *(Avg: 0.0)*
- **`mentioned_software`**: 0.0% present. *(Avg: 0.0)*

### Fields with Medium Presence
- **`cited_by_count`**: 78.9% present. *(Avg: 13.4)*
- **`doi`**: 81.4% present. *(Avg: N/A)*
- **`is_oa`**: 78.9% present. *(Avg: 78.3% (1=True, 0=False))*
- **`issn`**: 81.4% present. *(Avg: 1.2)*
- **`journal_title`**: 78.7% present. *(Avg: N/A)*
- **`license`**: 56.5% present. *(Avg: N/A)*
- **`oa_status`**: 78.9% present. *(Avg: N/A)*
- **`oa_url`**: 78.3% present. *(Avg: N/A)*
- **`openalex_id`**: 78.9% present. *(Avg: N/A)*
- **`publication_date`**: 80.9% present. *(Avg: N/A)*
- **`publication_year`**: 80.9% present. *(Avg: 1632)*
- **`publisher`**: 78.7% present. *(Avg: N/A)*
- **`type`**: 78.7% present. *(Avg: N/A)*

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
- **`Clear Documentation of Methods`** (~46% confidence)
  - *Key Fields:* `doi`, `publication_date`, `publication_year`, `type`, `mentioned_datasets`, `mentioned_software`
- **`Open Science Practices`** (~45% confidence)
  - *Key Fields:* `license`, `is_oa`, `oa_status`, `oa_url`, `mentioned_datasets`, `mentioned_software`, `data_availability_statement`, `code_availability_statement`
- **`Auditability and Method Consistency`** (~44% confidence)
  - *Key Fields:* `doi`, `openalex_id`, `oa_url`, `mentioned_datasets`, `mentioned_software`, `data_availability_statement`, `code_availability_statement`
- **`Fairness to Alternate Views`** (~40% confidence)
  - *Key Fields:* `conflict_of_interest`

### Difficult / Manual Assessment Attributes
*Attributes where relevant metadata is often sparse, difficult to extract automatically, or requires deeper analysis.*
- **`Authenticity`** (~45% confidence)
  - *Key Fields:* `doi`, `title`, `issn`, `openalex_id`
- **`External Validation`** (~40% confidence)
  - *Key Fields:* `journal_title`, `publisher`, `issn`, `cited_by_count`

---

*(End of Report)*