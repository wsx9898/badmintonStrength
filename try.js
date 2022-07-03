var nameListString =
  "1.亭維 2.彥皓 3.柏維 4.淑樺 5.可樂 6.阿斌 7.哲萱 8.思寧 " +
  "9.小范 10.阿偉 11.岳鋒 12.阿倫 13.Avan 14.証凱 15.Sean 16.祐" +
  " 17.主恩 18.小鈺 19.阿偉友1 20.阿偉友2 21.Antelope 22.小戴 23.豪兒 24.昌讓";

var nameListString2 =
  "亭維4 彥皓5 柏維3 淑樺2 可樂5 阿斌3 哲萱3 思寧2 " +
  "小范3 阿偉5 岳鋒5 阿倫5 Avan3 証凱4 Sean5 祐3" +
  " 主恩5 小鈺2 阿胖1 阿瘦2 阿肥3 小戴3 豪兒3 昌讓3";

var nameArr = nameListString2.split(" ");
var randomArr = makeRandomNum();

Number(nameArr[0].slice(-1));

for (i = 0; i < 24; i++) {
  if (i % 4 == 0) {
    // console.log("第" + (i / 4 + 1) + "組");
  }
  // console.log(nameArr[randomArr[i]]);
}

//已經改成這個效能比較好的
function makeRandomNum() {
  var temp = [];
  for (var i = 0; i < 24; i++) {
    temp.push(i);
  }
  var randomArr = [];
  for (var i = 0; i < 24; i++) {
    randomNum = Math.floor(Math.random() * temp.length);
    randomArr.push(temp[randomNum]);
    temp.splice(randomNum, 1);
  }
  return randomArr;
}
