# Supported Species — iDEP / ShinyGO

Live pages for the iDEP and ShinyGO supported-species reference, published by [Orditus](https://orditus.com).

## Live pages

| Page | URL |
|------|-----|
| Supported Species browser | https://orditus-llc.github.io/supported-species/supported-species.html |
| Species breadth overview | https://orditus-llc.github.io/supported-species/species-breadth.html |

## What this is

iDEP and ShinyGO are free bioinformatics tools for differential expression and pathway analysis. This repo hosts the static assets for their supported-species reference page, which lets researchers confirm whether their organism is covered before uploading data.

**Coverage (as of September 2025 data build):**

- 13,390 species total
- 819 Ensembl species (curated gene sets: GO, KEGG, Reactome, MSigDB for human/mouse, and more)
- 12,535 STRING-db species (broad baseline: GO, Reactome, protein domains, network clusters)
- 36 Custom species (hand-built annotations)

Every species in the database has at least GO terms. Human and mouse have ~140 and ~79 gene-set collections respectively, including MSigDB.

## Files

| File | Description |
|------|-------------|
| `supported-species.html` | Searchable species browser — search by common name, latin name, or taxonomy ID; click a row to expand the full gene-set collection breakdown |
| `species-breadth.html` | Static marketing page summarizing species coverage |
| `supported-species-embed.html` | WordPress-pasteable fragment of the species browser (scoped CSS, no full HTML wrapper) |
| `species_catalog.js` | Data file loaded by the browser pages (`window.CATALOG`) |
| `species_catalog.json` | Same data in plain JSON for programmatic use |

## Embedding in WordPress

Paste the contents of `supported-species-embed.html` into a WordPress Custom HTML block (or via WPCode / Code Embed to allow scripts). The data file is served from this repo via GitHub Pages — no additional hosting needed.

## Tools

- [iDEP](https://bioinformatics.sdstate.edu/idep/) — integrated Differential Expression and Pathway analysis
- [ShinyGO](https://bioinformatics.sdstate.edu/go/) — gene ontology enrichment analysis
- [Orditus](https://orditus.com) — commercial support and enterprise licensing
