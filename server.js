let http = require('http'),
    url = require('url'),
    fs = require('fs'),
    util = require('util'),
    superagent = require('superagent'),
    cheerio = require('cheerio'),
    async = require('async'),
    eventproxy = require('eventproxy');
let ep = new eventproxy(),
    urlsArray = [],
    pageUrls = [],
    pageNum = 200;

const dataArr = [];
const prefixRrl = 'https://www.tdcj.texas.gov/death_row/';

superagent.get('https://www.tdcj.texas.gov/death_row/dr_executed_offenders.html')
    .end(function(err, pres){
        if (err) {
            throw Error(err);
        } 
        let $ = cheerio.load(pres.text);
        $('.tdcj_table.indent tr').each(function(){
            let td = $(this).eq(0).find('td');

            urlsArray.push(td.eq(2).find('a').attr('href'));
        
            dataArr.push({
                execution: td.eq(0).text(),
                userInfoUrl:  prefixRrl + td.eq(1).find('a').attr('href'),
                lastStatement: prefixRrl + td.eq(2).find('a').attr('href'),
                name: td.eq(3).text() + ' ' + td.eq(4).text(),
                age: td.eq(6).text(),
                date: td.eq(7).text(),
            });
        });
        fs.writeFileSync('./data.js', JSON.stringify(dataArr, null, 4) , 'utf-8');
        // console.log(dataArr);
    });



