## Features
- Scrapes scorecard links from IPL 2025 matches
- Extracts batsman and bowler stats (runs, wickets, economy, etc.)
- Skips matches with "No Result"
- Saves data in Excel format, organized by team and player

## Tech Stack
- Node.js
- Cheerio
- Request
- XLSX (for Excel file generation)
- File System (fs)

## Folder Structure
```
IPL/
├── Team 1/
│ ├── Player1.xlsx
│ └── Player2.xlsx
├── Team 2/
│ ├── Player1.xlsx
│ └── Player2.xlsx
...
```

## Usage
```bash
node index.js
