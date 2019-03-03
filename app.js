const fs = require('fs'),
    superagent = require("superagent"),
    cheerio = require("cheerio"),
    async = require("async");

const log = console.log;
const deathRowInfoUrl =  'https://www.tdcj.texas.gov/death_row/dr_executed_offenders.html'; // 主页url
const protocol = 'https://'
const prefixRrl = 'www.tdcj.texas.gov/death_row/';

const urlsArray = [];
const dataArr = [];

// 爬取首页信息得到url等内容
superagent.get(deathRowInfoUrl).end(function (err, pres) {
    // 常规的错误处理
    if (err) {
        log(err);
    }
    let $ = cheerio.load(pres.text);
    $('.tdcj_table.indent tr').each(function(){
        let td = $(this).eq(0).find('td');

        if (td.eq(2).find('a').attr('href')) {
            if (td.eq(2).find('a').attr('href').includes('dr_info/coblebillielast.html') ) {
                return;
            }
            urlsArray.push(protocol + prefixRrl + td.eq(2).find('a').attr('href').replace(/\/death_row\//, ''));
            dataArr.push({
                execution: td.eq(0).text(),
                userInfoUrl:  protocol + prefixRrl + td.eq(1).find('a').attr('href').replace(/\/death_row\//, ''),
                lastStatement: protocol + prefixRrl + td.eq(2).find('a').attr('href').replace(/\/death_row\//, ''),
                name: td.eq(3).text() + ' ' + td.eq(4).text(),
                age: td.eq(6).text(),
                date: td.eq(7).text(),
            });
        }
    });
    
    getInfo();
});

// 获取信息
function getInfo() {
    let reptileMove = function (url, callback) {
        superagent.get(url).end(function (err, sres) {
            if (err) {
                log(JSON.stringify(err, null, 4));
                return;
            }
            let delay = parseInt((Math.random() * 30000000) % 1000, 10);
            let i = urlsArray.indexOf(url);
            dataArr[i]['lastStatement'] = cheerio.load(sres.text)('#content_right').text().split('Last Statement:')[1].replace(/^\s+|\s+$/g,"");
            setTimeout(function(){
                callback(null, i);
                log('获取成功', i);
            }, delay);
        });
    };
    // 使用async控制异步抓取  mapLimit(arr, limit, iterator, [callback]) 异步回调
    //  网路不好的时候limit最好写小一点，不然有问题的
    async.mapLimit(urlsArray, 8, function (url, callback) {
        reptileMove(url, callback);
    }, function (err, result) {
        if (err) log(err);
        log('爬取完成');
        fs.writeFileSync('./data.js', JSON.stringify(dataArr, null, 4) , 'utf-8');
        log('写入完成');
    });
}