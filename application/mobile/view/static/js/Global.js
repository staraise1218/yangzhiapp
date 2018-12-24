var Global = (function () {
  var domain = "http://yangzhiapp.staraise.com.cn"
  var host = "http://yangzhiapp.staraise.com.cn/index.php"

  //获取页面传值参数
  function getPageParams() {
    var url = window.location.href
    var option = {}
    if (url.indexOf("?") > -1) {
      var arr = url.split("?")[1].split("&")
      arr.forEach(function (str) {
        var arrTemp = str.split("=")
        option[arrTemp[0]] = arrTemp[1]
      })
      // console.log(option) //页面参数
    }
    return option
  }
  //时间格式化
  function stampToDate(timestamp) {
    var date = new Date(timestamp.toString().length == 10 ? (timestamp * 1000) : (timestamp * 1)); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + ' ';
    let h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ':';
    let m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
    // s = date.getSeconds();
    return Y + M + D + h + m;
  }
  //上传多图片
  function mutiUpload($inputs, typeStr, callback) { //$数组
    if ($inputs.length > 0) {
      let formData = new FormData()
      formData.append("type", typeStr)
      $inputs.each(function () {
        let file = this.files[0]
        console.log(file)
        formData.append("file[]", file)
      })
      $.ajax({
        type: "POST",
        url: host + "/Api/Common/uploadMultiFile",
        data: formData,
        cache: false,//上传文件无需缓存
        processData: false,//用于对data参数进行序列化处理 这里必须false
        contentType: false, //必须
        traditional: true,
        success: function (res) {
          console.log(res)
          if (callback) {
            callback(res)
          }
        },
        error: function (e) {
          console.log(e)
        }
      })
    } else {
      if (callback) {
        callback()
      }
    }
  }
  //收藏
  function collect(ele, option, callback) { //ele点击的元素；option参数obj
    let postData = {
      user_id: option.user_id,
      table_id: option.table_id,	// 收藏的id
      table_name: option.table_name,	// 类型 1.document 在线文档 2.专家expert
    }
    console.log(postData)
    // return
    $(ele).addClass("eventsDisabled")
    $.ajax({
      type: "POST",
      url: host + "/Api/common/collect",
      data: postData,
      success: function (res) {
        $(ele).removeClass("eventsDisabled")
        console.log(res)
        if (callback) {
          callback(res)
        }
      },
      error: function (e) {
        $(ele).removeClass("eventsDisabled")
        console.log(e)
      }
    })
  }
  //取消收藏
  function cancelCollect(ele, option, callback) { //ele点击的元素  option参数obj
    let postData = {
      id: option.id, //收藏的id
      user_id: option.user_id,
    }
    console.log(postData)
    // return
    $(ele).addClass("eventsDisabled")
    $.ajax({
      type: "POST",
      url: host + "/Api/common/cancelCollect",
      data: postData,
      success: function (res) {
        $(ele).removeClass("eventsDisabled")
        console.log(res)
        if (callback) {
          callback(res)
        }
      },
      error: function (e) {
        $(ele).removeClass("eventsDisabled")
        console.log(e)
      }
    })
  }
  function messageWin(msg, callback) {
    if ($(".msgWrap").length == 0) {
      let $msgDiv = $(`
            <div class="msgWrap">
                <div class="msgMask"></div>
                <div class="msg">
                    <p class="msgText">${msg}</p>
                    <p class="msgCtrl">
                        <span class="closeMsg">确定</span>
                    </p>
                </div>
            </div>
      `);
      $msgDiv.find(".msgMask")[0].addEventListener("touchstart", function (e) {
        e.stopPropagation();
        e.preventDefault();
      }, false);
      $msgDiv.find(".closeMsg").click(function () {
        $msgDiv.remove();
        if (callback) {
          callback()
        }
      });
      $("body").append($msgDiv);
    }
  }
  function messageConfirWin(msg, callback) {
    if ($(".msgWrap").length == 0) {
      let $msgDiv = $(`
            <div class="msgWrap">
                <div class="msgMask"></div>
                <div class="msg">
                    <p class="msgText">${msg}</p>
                    <p class="msgCtrl">
                        <span class="gotoCallback">取消</span>
                        <span class="closeMsg">确定</span>
                    </p>
                </div>
            </div>
      `);
      $msgDiv.find(".msgMask")[0].addEventListener("touchstart", function (e) {
        e.stopPropagation();
        e.preventDefault();
      }, false);
      $msgDiv.find(".gotoCallback").click(function () {
        $msgDiv.remove();
      });
      $msgDiv.find(".closeMsg").click(function () {
        callback();
        $msgDiv.remove();
      });
      $("body").append($msgDiv);
    }
  }
  //以幻灯片的形式查看大图片 依赖jquery weui
  function showFullPic(img, $imgEleArr) { //img点击的图片 $imgEleArr jquery对象集合
    let srcArr = [];
    $imgEleArr.each(function (index) {
      $(this).attr("data-index", index);
      srcArr.push($(this).attr("src"));
    });
    console.log(srcArr)
    let swiper = $.photoBrowser({
      items: srcArr,
      initIndex: Number($(img).attr("data-index"))
    });
    swiper.open();
  }
  //生成可点击的星评
  function initStarsEvent($ul, callback) {
    $ul.find("li").click(function () {
      let index = $ul.find("li").index($(this))
      console.log(index)
      $ul.find("li").each(function (idx) {
        if (idx <= index) {
          $(this).addClass("stars1").removeClass("stars0")
        } else {
          $(this).addClass("stars0").removeClass("stars1")
        }
      })
      if (callback) {
        callback(index)
      }
    })
  }
  function getMUserInfo() {
    let info = {}
    if (localStorage.getItem("mUserInfo") && localStorage.getItem("mUserInfo") !== "" && localStorage.getItem("mUserInfo") !== null && localStorage.getItem("mUserInfo") !== "null") {
      Global.messageWin(localStorage.getItem("mUserInfo"))
      info = JSON.parse(localStorage.getItem("mUserInfo"))
    }
    return info
  }
  function isIOS() {
      let u = navigator.userAgent;
      let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      return isIOS;
  }
  function resizeImg(imgEle){
      console.log(imgEle.width,imgEle.height)
      if(imgEle.width>imgEle.height){
          imgEle.style.width="100%"
          imgEle.style.height="auto"
      }else{
          imgEle.style.width="auto"
          imgEle.style.height="100%"
      }
  }
  //绑定事件----------------------------------
  function eventBind() {
    // //点击头像
    // $("body").delegate(".headbox","click",function(){
    //   if($(this).attr){

    //   }
    // })
  }
  //--------------------------------------------------------
  return {
    domain,
    host,
    eventBind,
    getPageParams,
    stampToDate,
    mutiUpload,
    collect,
    cancelCollect,
    messageWin,
    messageConfirWin,
    showFullPic,
    initStarsEvent,
    getMUserInfo,
    isIOS,
    resizeImg
  }
})();

$(function () {
  Global.eventBind()
})