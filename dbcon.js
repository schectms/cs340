var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_nelsonc4',
  password        : '----',
  database        : 'cs340_nelsonc4'
});
module.exports.pool = pool;
