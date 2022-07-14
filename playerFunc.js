module.exports = {
  makeRandomNum: function (randomRange) {
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
  },
};
