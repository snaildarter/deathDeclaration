let http = require('http'),
    url = require('url'),
    fs = require('fs'),
    util = require('util'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    eventproxy = require('eventproxy');
let ep = new eventproxy(),
    urlsArray = [];

const log =  console.log;
const dataArr = [
    {
        "execution": "559",
        "userInfoUrl": "https://www.tdcj.texas.gov/death_row/dr_info/jenningsrobert.jpg",
        "lastStatement": "https://www.tdcj.texas.gov/death_row/dr_info/jenningsrobertlast.html",
        "name": "Jennings Robert",
        "age": "61",
        "date": "1/30/2019"
    },
    {
        "execution": "558",
        "userInfoUrl": "https://www.tdcj.texas.gov/death_row/dr_info/brazielalvin.html",
        "lastStatement": "https://www.tdcj.texas.gov/death_row/dr_info/brazielalvinlast.html",
        "name": "Braziel, Jr. Alvin",
        "age": "43",
        "date": "12/11/2018"
    },
    {
        "execution": "557",
        "userInfoUrl": "https://www.tdcj.texas.gov/death_row/dr_info/garciajoseph.html",
        "lastStatement": "https://www.tdcj.texas.gov/death_row/dr_info/garciajosephlast.html",
        "name": "Garcia Joseph",
        "age": "47",
        "date": "12/04/2018"
    },
    {
        "execution": "556",
        "userInfoUrl": "https://www.tdcj.texas.gov/death_row/dr_info/_ramos.jpg",
        "lastStatement": "https://www.tdcj.texas.gov/death_row/dr_info/ramosrobertlast.html",
        "name": "Ramos Robert",
        "age": "64",
        "date": "11/14/2018"
    },
    {
        "execution": "555",
        "userInfoUrl": "https://www.tdcj.texas.gov/death_row/dr_info/ackerdaniel.html",
        "lastStatement": "https://www.tdcj.texas.gov/death_row/dr_info/ackerdaniellast.html",
        "name": "Acker Daniel",
        "age": "46",
        "date": "9/27/2018"
    },
    {
        "execution": "554",
        "userInfoUrl": "https://www.tdcj.texas.gov/death_row/dr_info/clarktroy.html",
        "lastStatement": "https://www.tdcj.texas.gov/death_row/dr_info/clarktroylast.html",
        "name": "Clark Troy",
        "age": "51",
        "date": "9/26/2018"
    },
    {
        "execution": "553",
        "userInfoUrl": "https://www.tdcj.texas.gov/death_row/dr_info/youngchristopher.html",
        "lastStatement": "https://www.tdcj.texas.gov/death_row/dr_info/youngchristopherlast.html",
        "name": "Young Christopher",
        "age": "34",
        "date": "7/17/2018"
    },
    {
        "execution": "552",
        "userInfoUrl": "https://www.tdcj.texas.gov/death_row/dr_info/bibledanny.html",
        "lastStatement": "https://www.tdcj.texas.gov/death_row/dr_info/bibledannylast.html",
        "name": "Bible Danny",
        "age": "66",
        "date": "6/27/2018"
    }
];
urlsArray = dataArr.map(item => item.lastStatement);
console.log(urlsArray);


const prefixRrl = 'https://www.tdcj.texas.gov/death_row/';

// superagent.get('https://www.tdcj.texas.gov/death_row/dr_executed_offenders.html')
//     .end(function(err, pres){
//         if (err) {
//             throw Error(err);
//         } 
//         let $ = cheerio.load(pres.text);
//         $('.tdcj_table.indent tr').each(function(){
//             let td = $(this).eq(0).find('td');

//             urlsArray.push(td.eq(2).find('a').attr('href'));
        
//             dataArr.push({
//                 execution: td.eq(0).text(),
//                 userInfoUrl:  prefixRrl + td.eq(1).find('a').attr('href'),
//                 lastStatement: prefixRrl + td.eq(2).find('a').attr('href'),
//                 name: td.eq(3).text() + ' ' + td.eq(4).text(),
//                 age: td.eq(6).text(),
//                 date: td.eq(7).text(),
//             });
//         });
//         fs.writeFileSync('./data.js', JSON.stringify(dataArr, null, 4) , 'utf-8');
//     });
let i = 0;
async function getLastStatement = (url, cb) => {
    i += 1;
    log('现在的并发数是', i);
    superagent.get(url).end(function(err, pres){
        if (err) {
            throw Error(err);
        } 
        let $ = cheerio.load(pres.text);
        let str = $('#content_right').text();
        console.log(str);
        i -= 1;
        cb(str);
        // fs.writeFileSync('./data.js', JSON.stringify(dataArr, null, 4) , 'utf-8');
    });
};
// getLastStatement('https://www.tdcj.texas.gov/death_row/dr_info/bibledannylast.html')


async.mapLimit(urlsArray, 2, function(url, callback){
    getLastStatement(urlsArray, function(str){
        log(str)
    });
}, function(err, result){
    log('final');
    log(result);
});
