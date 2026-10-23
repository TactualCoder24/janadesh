# Janadesh open data

Constituency-level results of the Lok Sabha (1951 to 2024) and every state assembly in the Janadesh dataset, as static files.
Credit "Janadesh" (https://janadesh-smoky.vercel.app) and the original sources below. The official results are public data of the Election Commission of India.

- `index.json` lists every election with its links.
- `ls/<year>.json|csv`, `ae/<state>/<year>.json|csv` hold one election each. `all-seats.csv` holds all of them.

## CSV columns

| column | meaning |
|---|---|
| election_id | for example `ls-2024`, `ae-delhi-2025` |
| kind, state, year, label | `LS` or `AE`; state (`India` for the Lok Sabha); election year and label |
| status | `official`, `official_winners_only` (real winner and runner-up, smaller-party votes estimated) or `reconstructed` (estimated seats) |
| seat_no, seat_name, category, region | constituency number, name, GEN / SC / ST, state (Lok Sabha) or district (assembly) where known |
| total_votes | votes counted for the listed candidates plus others |
| winner_party, winner_name, winner_votes | winner; names are blank where no candidate-level source exists |
| runner_up_party, runner_up_name, runner_up_votes | runner-up |
| margin, margin_pct | votes, and percentage points of total votes, between winner and runner-up |

The JSON files add the votes of every listed party in each seat (`votes`), votes of other candidates (`other_votes`), and the winner's `sex` and `age` where the source has them.
Party codes are explained by `parties` in each JSON file. Independents are one entry (`IND`): the best independent only; the rest are in `other_votes`.

## Sources

DataMeet india-election-data; gitcheckoutnikhil/india-elections-data; data-analytics.github.io; spfrantz/vidhan-sabha-2017-scraper and vidhan-sabha-2018; azadecon/assembly_elections_2023; Wikipedia election pages (official winners for 39 assembly elections, names).
The compilation here (name matching, repairs, reconstructed seats) is free to use with credit to Janadesh.
