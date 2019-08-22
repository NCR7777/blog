const mysql = require('mysql');

let connect = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "blog"
});

connect.connect();

module.exports = connect;