const mysql = require("mysql");

module.exports = {
  //mysql
  sqlFunction: function (id) {
    console.log("有成功跑到這行");
    var connection = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "kkk",
      port: 8889,
    });
    connection.connect();
    connection.query(
      `SELECT * from StrongPlayer where id = ${id}`,
      function (error, results, fields) {
        if (error) throw error;
        console.log("SQL結果為： ", results[0]);
      }
    );
    connection.end();
  },
  //mysql
};
