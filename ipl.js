const baseurl = "https://www.espn.in";
const url= "https://www.espn.in/cricket/scores/series/8048/season/2025/indian-premier-league";
const request = require("request");
const cheerio = require("cheerio");
const fs= require("fs");
const path= require("path");
const xlsx= require("xlsx");


function WritePlayerData(teamName,playerName,data,type){
    const baseDir= path.join(__dirname,"IPL");
    if(!fs.existsSync(baseDir)){
        fs.mkdirSync(baseDir);
    }
    const teamDir= path.join(baseDir, teamName);
    if(!fs.existsSync(teamDir)){
        fs.mkdirSync(teamDir);
    }
    const filePath= path.join(teamDir,playerName+".xlsx");
    let workbook;
    if(fs.existsSync(filePath)){
        workbook= xlsx.readFile(filePath);
    }else{
        workbook= xlsx.utils.book_new();
    }
    let sheetName= type;
    let  sheet= workbook.Sheets[sheetName];
    let SheetData= sheet? xlsx.utils.sheet_to_json(sheet): [];
    SheetData.push(data);
    const newSheet= xlsx.utils.json_to_sheet(SheetData);
    if (workbook.SheetNames.includes(sheetName)) {
      const index = workbook.SheetNames.indexOf(sheetName);
      workbook.SheetNames.splice(index, 1);
      delete workbook.Sheets[sheetName];
    }
    xlsx.utils.book_append_sheet(workbook,newSheet,sheetName);
    xlsx.writeFile(workbook,filePath);
}

function getScoreCardLinks(callback){
    request(url,(err,res,html)=>{
        if(err){
            console.log("Failed to load  match page:", err);
        }
        const $ = cheerio.load(html);
        const scoreCardLinks=[];
        $('a').each((i,el)=>{
            const text= $(el).text().trim().toLowerCase();
            if(text==='scorecard'){
                const href= $(el).attr('href');
                const fullLink=baseurl+href;
                scoreCardLinks.push(fullLink);
            }
        });
        callback(scoreCardLinks);
    });
}  

getScoreCardLinks((links)=>{
    for(let i=0; i<links.length; i++){
        scrapeDetails(links[i]);
    }
})

function scrapeDetails(url){
    request(url,(err,res,html)=>{
        if(err){
            console.log("Failed to load  match page:", err);
        }
        const $ = cheerio.load(html);
        const matchStatus = $('.cscore_time').first().text().trim();
        if (matchStatus.toLowerCase() === 'no result') {
            console.log("Skipping match due to 'No result' status:", url);
            return; 
        }
        const infoText= $('.cscore_info-overview').first().text().trim();
        let venue="Unknown";
        let date="Unknown";
        if(infoText.includes("at ")){
            let AfterAt= infoText.split("at ")[1];
            venue= AfterAt.split(",")[0].trim();
            date= AfterAt.split(",")[1].trim();
        }
        const teamNames = [];
        $(".accordion-header h2").each((i, elem) => {
          const text = $(elem).text().trim();
          if (text.includes("Innings")) {
            const teamName = text.split("Innings")[0].trim();
            teamNames.push(teamName);
          }
        });

        $(".sub-module.scorecard").each((i, inningElem) => {
            const teamName = teamNames[i];
          const opponentTeam = teamNames[1 - i]; 
          $(inningElem).find(".wrap.batsmen").each((j, elem) => {
              const playerCell = $(elem).find(".cell.batsmen a");
              const name = playerCell.text().trim();
              const runs = $(elem).find(".cell.runs").eq(0).text().trim();
              const balls = $(elem).find(".cell.runs").eq(1).text().trim();
              const fours = $(elem).find(".cell.runs").eq(3).text().trim();
              const sixes = $(elem).find(".cell.runs").eq(4).text().trim();
              const strikeRate = $(elem).find(".cell.runs").eq(5).text().trim();

            
              WritePlayerData(teamName,name,{
                opponentTeam,
                runs,
                balls,
                fours,
                sixes,
                strikeRate,
                venue,
                date
              },'Batting');
            });
        });

        $(".sub-module.scorecard").each((i, inningElem) => {
          const opponentTeam = teamNames[i];
          const teamName = teamNames[1 - i];
          $(inningElem).find(".scorecard-section.bowling tbody tr").each((i, elem) => {
              const name = $(elem).find("td").eq(0).find("a").text().trim();
              const overs = $(elem).find("td").eq(2).text().trim();
              const maidens = $(elem).find("td").eq(3).text().trim();
              const runs = $(elem).find("td").eq(4).text().trim();
              const wickets = $(elem).find("td").eq(5).text().trim();
              const economy = $(elem).find("td").eq(6).text().trim();
             

              WritePlayerData(teamName,name,{
                opponentTeam,
                overs,
                maidens,
                runs,
                wickets,
                economy,
                venue,
                date
              },'Bowling');
            });
        });
        
    });
}