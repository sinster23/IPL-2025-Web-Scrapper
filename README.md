## 🏏 IPL Match Data Scraper
A Node.js script that scrapes detailed IPL 2025 match data (batsmen and bowlers stats) from ESPN Cricinfo and organizes it into structured Excel files, grouped by teams.

## 📦 Features
📂 Organizes player data into team folders.

📊 Stores batting and bowling stats in individual Excel sheets.

🌐 Scrapes match scorecard data from ESPN Cricinfo.

❌ Skips "No Result" matches automatically.


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
