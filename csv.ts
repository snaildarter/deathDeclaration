import * as csv from 'fast-csv';
import * as data from './data'


const log = console.log;
const header = ['name', 'age', 'lastStatement', 'userInfoUrl', 'data'];

const csvData = data.map(item => [
    item.name,
    item.age,
    item.lastStatement,
    item.userInfoUrl,
    item.date
]);
csvData.unshift(header);

csv.writeToPath('./data.csv', csvData).on('finish', function(){
    log('transfer ok!');
});