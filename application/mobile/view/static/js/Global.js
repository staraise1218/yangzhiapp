var Global = (function () {
  //获取页面传值参数
  function getPageParams() {
    var url = window.location.href
    console.log(url)
    var option = {}
    if (url.indexOf("?") > -1) {
      var arr = url.split("?")[1].split("&")
      arr.forEach(function (str) {
        var arrTemp = str.split("=")
        option[arrTemp[0]] = arrTemp[1]
      })
      console.log(option) //页面参数
    }
    return option
  }
  function stampToDate(timestamp) {
    var date = new Date(timestamp.toString().length == 10 ? (timestamp * 1000) : (timestamp * 1)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + ' ';
    h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    // s = date.getSeconds();
    return Y + M + D + h + m;
  }
  //--------------------------------------------------------
  return {
    getPageParams,
    stampToDate
  }
})();
