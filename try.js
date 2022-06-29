var nameListString =
  "1.亭維 2.彥皓 3.柏維 4.淑樺 5.可樂 6.阿斌 7.哲萱 8.思寧 " +
  "9.小范 10.阿偉 11.岳鋒 12.阿倫 13.Avan 14.証凱 15.Sean 16.祐" +
  " 17.主恩 18.小鈺 19.阿偉友1 20.阿偉友2 21.Antelope 22.小戴 23.豪兒 24.昌讓";

var nameArr = nameListString.split(" ");
var randomArr = makeRandomNum();

for (i = 0; i < 24; i++) {
  if (i % 4 == 0) {
    console.log("第" + (i / 4 + 1) + "組");
  }
  console.log(nameArr[randomArr[i]]);
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
