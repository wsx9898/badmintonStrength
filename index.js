"use strict";
const config = require("config"),
  //express比較像nodeJS架一個網站
  express = require("express"),
  request = require("request");
// const { response } = require("express");

var app = express();
var port = process.env.PORT || process.env.port || 5000;
app.set("port", port);

app.use(express.json());
app.listen(app.get("port"), function () {
  console.log("[app.listen]Node app is running on port", app.get("port"));
});

module.exports = app;

const MOVIE_API_KEY = config.get("MovieDB_API_Key");

//function(request, respond)
app.post("/webhook", function (req, res) {
  //1.DialogFlow會來呼叫這一支程式
  //2.DialogFlow要給我需要查詢的電影名稱
  let data = req.body;
  let queryMovieName = data.queryResult.parameters.MovieName;
  let propertiesObject = {
    query: queryMovieName,
    api_key: MOVIE_API_KEY,
    language: "zh-TW",
  };
  //3.要去TMDB拿到對應的資料
  request(
    {
      uri: "https://api.themoviedb.org/3/search/movie?",
      json: true,
      qs: propertiesObject,
    },
    function (error, response, body) {
      //確認有成功去到TMDB拿資料
      if (!error && response.statusCode == 200) {
        //確認裡面有資料
        if (body.results.length != 0) {
          //確認第一筆資料裡面
          let thisFulfillmentMessages = []; //所有要回傳的資訊
          //1.電影名稱是否與查詢完全相符
          let movieTitleObject = {};
          if (body.results[0].title == queryMovieName) {
            //看第63頁
            movieTitleObject.text = { text: [body.results[0].title] };
          } else {
            movieTitleObject.text = {
              text: ["系統內最相關的電影是" + body.results[0].title],
            };
          }
          thisFulfillmentMessages.push(movieTitleObject);
          //2.有沒有電影簡介
          if (body.results[0].overview) {
            let movieOverViewObject = {};
            movieOverViewObject.text = { text: [body.results[0].overview] };
            thisFulfillmentMessages.push(movieOverViewObject);
          }
          //3.有沒有電影海報
          if (body.results[0].poster_path) {
            let movieImageObject = {};
            movieImageObject.image = {
              imageUri:
                "https://image.tmdb.org/t/p/original" +
                body.results[0].poster_path,
            };
            thisFulfillmentMessages.push(movieImageObject);
          }
          //4.把電影資料送回去DialogFlow
          //把整包訊息傳回去
          res.json({ fulfillmentMessages: thisFulfillmentMessages });
        } else {
          //dialogFlow有自己的規格要求需要一組{fulfillmentText:"XXXXXXX"}
          res.json({ fulfillmentText: "很抱歉，系統裡面沒有這部電影" }); //給錯的東西dialogFlow會當作沒收到東西
          //，直接用default resoponse回覆
        }
      } else {
        console.log("[TMDB] Failed:" + error);
      }
      //確認裡面有資料
      //確認第一筆資料
    }
  );

  //4.把電影資料送回去給DialogFlow
});
