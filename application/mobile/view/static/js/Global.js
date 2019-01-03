var Global = (function () {
  var domain = "http://yangzhiapp.staraise.com.cn"
  var host = "http://yangzhiapp.staraise.com.cn/index.php"

  //图片路径
  // Global.domain + "/application/mobile/view/static/images/tx.png"
  // 或者 "__STATIC__/images/tx.png" ?

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
  //上传多图片 IOS
  function mutiUploadIOS(fileArr, typeStr, callback) { //$数组
    if (fileArr.length > 0) {
      let formData = new FormData()
      formData.append("type", typeStr)
      fileArr.forEach(function (obj) {
        let file = obj.file
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
      // Global.messageWin(localStorage.getItem("mUserInfo"))
      // alert(localStorage.getItem("mUserInfo"))
      info = JSON.parse(localStorage.getItem("mUserInfo"))
    } else {
      Global.messageWin("无local")
    }
    return info
  }
  function isIOS() {
    let u = navigator.userAgent;
    let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    return isIOS;
  }
  function resizeImg(imgEle) {
    console.log(imgEle.width, imgEle.height)
    if (imgEle.width > imgEle.height) {
      imgEle.style.width = "100%"
      imgEle.style.height = "auto"
    } else {
      imgEle.style.width = "auto"
      imgEle.style.height = "100%"
    }
  }
  //global事件----------------------------------
  function init() {
    //阻止ios body 滚动
    if (Global.isIOS()) {
      document.body.ontouchmove = function (e) {
        e.preventDefault();
      };
      iosTrouchFn(document.getElementsByClassName("h100scroll")[0]);
    }
    function iosTrouchFn(el) {
      //el需要滑动的元素
      el.addEventListener('touchmove', function (e) {
        e.isSCROLL = true;
      })
      document.body.addEventListener('touchmove', function (e) {
        if (!e.isSCROLL) {
          e.preventDefault(); //阻止默认事件(上下滑动)
        } else {
          //需要滑动的区域
          var top = el.scrollTop; //对象最顶端和窗口最顶端之间的距离 
          var scrollH = el.scrollHeight; //含滚动内容的元素大小
          var offsetH = el.offsetHeight; //网页可见区域高
          var cScroll = top + offsetH; //当前滚动的距离

          //被滑动到最上方和最下方的时候
          if (top == 0) {
            top = 1; //0～1之间的小数会被当成0
          } else if (cScroll === scrollH) {
            el.scrollTop = top - 0.1;
          }
        }
      }, { passive: false }) //passive防止阻止默认事件不生效
    }
  }
  //处理 头像路径
  function filterHeadpic(str) {
    let strtemp = ""
    if (str && str !== "") {
      if (str.indexOf("http:") > -1) { //绝对路径
        strtemp = str
      } else { //相对路径
        strtemp = Global.domain + str
      }
    } else {
      strtemp = Global.domain + "/application/mobile/view/static/images/tx.png" //默认头像
    }
    return strtemp
  }
  //让原生改变导航栏标题
  function changeTitleG(){
    // let titleStr=$("title").text()
    // console.log(titleStr)
    // if(Global.isIOS()){
    //   changeTitle(titleStr) //titleStr 标题， 类型：字符串
    // }else{
    //   window.Android.changeTitle(titleStr)
    // }
  }
  //--------------------------------------------------------
  return {
    domain,
    host,

    init,
    getPageParams,
    stampToDate,
    mutiUpload,
    mutiUploadIOS,
    collect,
    cancelCollect,
    messageWin,
    messageConfirWin,
    showFullPic,
    initStarsEvent,
    getMUserInfo,
    isIOS,
    resizeImg,
    filterHeadpic,
    changeTitleG,
  }
})();

$(function () {
  Global.init()
})

//------------------------------------------------------------------------------
//提问页面, app上传图片回调
function askImgCallback(res) { //目前ios 是数组
  // {
  //   "filepath":[
  //     "...",
  //     "..."
  //   ]
  // }
  console.log(res)
  let filepathArr = res
  filepathArr.forEach(function (file) {
    let src = Global.domain + file
    let $div = $(`
      <div class="picWrap">
        <img src="${src}" data-src="${file}" alt="图片" onload="Global.resizeImg(this)">
        <span class="delPic"></span>
      </div>
    `)
    $(".addedPic").append($div)
  })
}