let csv = require('fast-csv');
let data = require('./data.js');

const log = console.log;
const header = ['name', 'age', 'lastStatement', 'userInfoUrl', 'data'];

let csvData = data.map(item => {
    return [
        item.name,
        item.age,
        item.lastStatement,
        item.userInfoUrl,
        item.date
    ];
});
csvData.unshift(header);

csv.writeToPath('./data.csv', csvData, {header: true}).on('finish', function(){
    log('ok!');
});