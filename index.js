"use strict";
const express = require("express"),
  request = require("request");

var app = express();
var port = process.env.PORT || process.env.port || 1235;
app.set("port", port);

app.use(express.json());
app.listen(app.get("port"), function () {
  console.log("[app.listen]Node app is running on port", app.get("port"));
});

module.exports = app;

app.post("/webhook", function (req, res) {
  //1.DialogFlow會來呼叫這一支程式
  //2.DialogFlow要給我需要的所有選手字串
  let data = req.body;
  let playersString = data.queryResult.queryText;
  console.log("queryText:" + playersString);
  console.log("試看看不用重跑ngrok");

  //3.
  var nameArr = playersString.split("\n");
  console.log("nameArr = ");
  console.log(nameArr);

  //--------------------------------

  //已經改成這個效能比較好的
  function makeRandomNum() {
    var temp = [];
    for (var i = 0; i < 24; i++) {
      temp.push(i);
    }
    var randomArr = [];
    for (var i = 0; i < 24; i++) {
      var randomNum = Math.floor(Math.random() * temp.length);
      randomArr.push(temp[randomNum]);
      temp.splice(randomNum, 1);
    }
    return randomArr;
  }

  var randomArr = makeRandomNum();

  //--------------------------------

  var strReturn =
    "各位球友好，我是汪星人\n以下是我為大家排得賽程\n希望大家會喜歡\n";
  for (var i = 0; i < 24; i++) {
    if (i % 4 == 0) {
      console.log("第" + (i / 4 + 1) + "組");
      strReturn += "\n" + "第" + (i / 4 + 1) + "組" + "\n";
    }
    console.log(nameArr[randomArr[i]]);
    strReturn += "  " + nameArr[randomArr[i]] + "\n";
  }

  res.json({ fulfillmentText: strReturn });
});
