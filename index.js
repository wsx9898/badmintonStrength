"use strict";
const express = require("express"),
  request = require("request");

var app = express();
var port = process.env.PORT || process.env.port || 1236;
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

  // //3.
  var nameList = playersString.split("\n");
  console.log("nameList = ");
  console.log(nameList);

  // //--------------------------------

  // //已經改成這個效能比較好的
  // function makeRandomNum() {
  //   var temp = [];
  //   for (var i = 0; i < 24; i++) {
  //     temp.push(i);
  //   }
  //   var randomArr = [];
  //   for (var i = 0; i < 24; i++) {
  //     var randomNum = Math.floor(Math.random() * temp.length);
  //     randomArr.push(temp[randomNum]);
  //     temp.splice(randomNum, 1);
  //   }
  //   return randomArr;
  // }

  // var randomArr = makeRandomNum();

  // //----------------------------------------------------------------------------------------------
  var numberList = nameList.map((n) => {
    return parseInt(n.slice(-1));
  });
  console.log("numberList = " + numberList);

  function getMedian(arr) {
    arr = arr.sort((a, b) => a - b);
    let median;
    if (arr.length % 2 === 0) {
      //數目為偶數
      median = (arr[arr.length / 2] + arr[arr.length / 2 - 1]) / 2;
    } else {
      //數目為奇數
      median = arr[(arr.length - 1) / 2];
    }
    return median;
  }

  var average = 0;
  numberList.forEach((n) => {
    average = average + n;
  });
  average = average / 24;
  console.log("平均戰力 = " + average);

  var a_team = [];
  var b_team = [];

  numberList.forEach((n, i) => {
    if (n > average) {
      a_team.push(nameList[i]);
    } else {
      b_team.push(nameList[i]);
    }
  });

  // //現在九位
  // console.log(a_team);
  // //現在十五位
  // console.log(b_team);

  //產生亂數陣列
  function makeRandomNum(randomRange) {
    var temp = [];
    for (var i = 0; i < randomRange; i++) {
      temp.push(i);
    }
    var randomArr = [];
    for (var i = 0; i < randomRange; i++) {
      var randomNum = Math.floor(Math.random() * temp.length);
      randomArr.push(temp[randomNum]);
      temp.splice(randomNum, 1);
    }
    return randomArr;
  }
  //產生亂數陣列

  var orderForA = makeRandomNum(a_team.length);
  var orderForB = makeRandomNum(b_team.length);

  var aTeamShuffled = [];
  for (i = 0; i < a_team.length; i++) {
    aTeamShuffled.push(a_team[orderForA[i]]);
  }

  var bTeamShuffled = [];
  for (i = 0; i < b_team.length; i++) {
    bTeamShuffled.push(b_team[orderForB[i]]);
  }

  // //A的商數餘數
  var aQuotient = Math.floor(aTeamShuffled.length / 6);
  var aRemainder = aTeamShuffled.length % 6;
  //B的商數餘數
  var bQuotient = Math.floor(bTeamShuffled.length / 6);
  var bRemainder = bTeamShuffled.length % 6;

  console.log("a_team人數 = " + a_team.length);

  //好像JS二維陣列要這樣創
  let endList = new Array(6);
  for (i = 0; i < 6; i++) {
    endList[i] = new Array(4);
  }
  //好像JS二維陣列要這樣創

  //Todo我沒有做全部aTeam或全部bTeam

  //case1
  //If 強者少於6
  if (aQuotient < 1) {
    console.log("強者少於六");

    //player1
    for (i = 0; i < aRemainder; i++) {
      //aTeam<6,distribute to each game player1
      endList[i][0] = aTeamShuffled[i];
    }
    for (i = 0; i < 6 - aRemainder; i++) {
      //aTeam<6,distribute to each game player1
      endList[i + aRemainder][0] = bTeamShuffled[i];
    }
    //player2
    for (i = 0; i < 6; i++) {
      //aTeam<6,distribute to each game player1
      endList[i][1] = bTeamShuffled[i + 6 - aRemainder];
    }
    //player3
    for (i = 0; i < 6; i++) {
      //aTeam<6,distribute to each game player1
      endList[i][2] = bTeamShuffled[i + 12 - aRemainder];
    }
    //player4
    for (i = 0; i < 6; i++) {
      //aTeam<6,distribute to each game player1
      endList[i][3] = bTeamShuffled[i + 18 - aRemainder];
    }
  }
  //If 強者少於

  //case2
  //If 強者介於六到十一
  if (aQuotient == 1) {
    console.log("強者介於六到十一");
    for (i = 0; i < 6; i++) {
      //aTeam>6,distribute to each game player1
      //bTeam>6,distribute to each game player2
      endList[i][0] = aTeamShuffled[i];
      endList[i][1] = bTeamShuffled[i];
    }

    //Put rest Ateam to player3
    for (i = 0; i < aRemainder; i++) {
      endList[i][2] = aTeamShuffled[i + 6];
    }

    //player3 vaccancy dominate by Bteam
    for (i = 0; i < 6 - aRemainder; i++) {
      endList[i + aRemainder][2] = bTeamShuffled[6 + i];
    }

    //player4
    for (i = 0; i < 6; i++) {
      endList[i][3] = bTeamShuffled[12 + i - aRemainder];
    }
  }
  //If 強者介於六到十一

  //case3
  //If 強者介於12到17，B隊人數介於六到十二
  if (aQuotient == 2) {
    console.log("強者介於12到17");
    for (i = 0; i < 6; i++) {
      endList[i][0] = aTeamShuffled[i];
      endList[i][1] = bTeamShuffled[i];
    }

    //Put rest Ateam to player3
    for (i = 0; i < 6; i++) {
      endList[i][2] = aTeamShuffled[i + 6];
    }

    //player4
    //
    for (i = 0; i < aRemainder; i++) {
      endList[i][3] = aTeamShuffled[12 + i];
    }
    //bTeam compensate rest
    for (i = aRemainder; i < 6; i++) {
      endList[i][3] = bTeamShuffled[6 + i - aRemainder];
    }
    //player4
  }
  //If 強者介於12到17

  //case4
  //If 強者介於18到23，B隊人數介於1到5
  if (aQuotient == 3) {
    console.log("強者介於18到23");
    for (i = 0; i < 6; i++) {
      endList[i][0] = aTeamShuffled[i];
      endList[i][1] = aTeamShuffled[i + 6];
      endList[i][2] = aTeamShuffled[i + 12];
    }

    //Put rest Ateam to player4
    for (i = 0; i < aRemainder; i++) {
      endList[i][3] = aTeamShuffled[i + 18];
    }
    //Bteam fill player4 vacancies
    for (i = aRemainder; i < 6; i++) {
      endList[i][3] = bTeamShuffled[i - aRemainder];
    }
  }
  //If 強者介於12到17
  // console.log(endList);

  //------------------------------------------------------------------------------------------

  var strReturn =
    "各位球友好，我是汪星人\n以下是我為大家排得賽程\n希望大家會喜歡\n";
  for (var i = 0; i < 6; i++) {
    strReturn += "\n" + "第" + (i + 1) + "組" + "\n";
    strReturn += endList[i];
  }

  res.json({ fulfillmentText: strReturn });
});
