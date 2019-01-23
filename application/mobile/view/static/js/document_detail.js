var ZaiDetail = {
  mUserInfo: {},
  id: "", //在线文档id
  info: {},

  getInfo(callback) {
    let postData = {
      id: ZaiDetail.id
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/document/detail",
      data: postData,
      success: function (res) {
        console.log(res)
        ZaiDetail.info = res.data
        if (callback) {
          callback()
        }
      },
      error: function (e) {
        console.log(e)
      }
    })
  },
  updateDom() {
    if (JSON.stringify(ZaiDetail.info) !== "{}") {
      let info = ZaiDetail.info
      //图片
      $(".picTextContainer .picTextItem img").attr("src", Global.domain + info.thumb)
      //标题
      $(".titleTop").html(info.title)
      //标签
      $(".tagWrap").html("")
      let tagArr = info.tag.split(",")
      tagArr.forEach(function (str) {
        let className = ($(".wordTip").length % 2 == 0) ? "wordTip1" : "wordTip2"
        let $span = $('<span class="wordTip ' + className + '">' + str + '</span>')
        $(".tagWrap").append($span)
      })
      //简介？
      //说明
      $(".description").html(info.description)
      //内容
      $(".articleContent").html(info.content)
      //2019.01.23
      //是否已购买
      if(info.is_buy&&Number(info.is_buy)==1){
        $(".isBuy0").hide()
        $(".isBuy1").show()
      }else{
        $(".isBuy0").show()
        $(".isBuy1").hide()
      }
      //是否收藏
      if (Number(info.is_collect) == 1) {
        $(".isCollect1").show()
        $(".isCollect0").hide()
      } else {
        $(".isCollect1").hide()
        $(".isCollect0").show()
      }
    }
  },
  getComments() {
    let postData = {
      document_id: ZaiDetail.id
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/document/getComment",
      data: postData,
      success: function (res) {
        console.log(res)
        let arr = res.data
        if (arr.length > 0) {
          $(".container2").show()
          $(".commentWrap").html("")
          arr.forEach(function (obj) {
            let head_pic = Global.filterHeadpic(obj.head_pic)
            if (obj.add_time && obj.add_time !== "") {
              var add_time = Global.stampToDate(obj.add_time)
            }
            let $div = $(`
              <div class="askItem">
                <div class="flexCenter flexBetween headpicWrap">
                  <div class="flexCenterIL headpic">
                    <div class="headbox">
                      <img src="${head_pic}" alt="头像">
                    </div>
                    <span class="headname">${obj.fullname}</span>
                  </div>
        
                  <span class="date">${add_time}</span>
                </div>
                <p class="articleText">${obj.content}</p>
              </div>
            `)
            $(".commentWrap").append($div)
          })
        }
      },
      error: function (e) {
        console.log(e)
      }
    })
  },
  submitComment() {
    //验证
    if ($("#commentInpt").val().trim() == "") {
      Global.messageWin("请输入评论")
      return
    }

    let postData = {
      document_id: ZaiDetail.id,
      speaker_id: Number(ZaiDetail.mUserInfo.user_id),
      parent_id: 0,
      // reply_user_id: "",
      content: $("#commentInpt").val().trim()
    }
    console.log(postData)
    $(".submitComment").addClass("eventsDisabled")
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/document/addComment",
      data: postData,
      success: function (res) {
        $(".submitComment").removeClass("eventsDisabled")
        console.log(res)
        if (res && Number(res.code) == 200) {
          $("#commentInpt").val("")
          ZaiDetail.getComments()
          document.getElementsByClassName("h100scroll")[0].scrollTop = 0
        }
      },
      error: function (e) {
        $(".submitComment").removeClass("eventsDisabled")
        console.log(e)
      }
    })
  },
  buy(){
    Global.messageConfirWin("确认购买？",function(){
      let postData = {
        document_id:ZaiDetail.id,
        user_id:Number(ZaiDetail.mUserInfo.user_id)
      }
      console.log(postData)
      $(".isBuy").addClass("eventsDisabled")
      $.ajax({
        type: "POST",
        url: Global.host + "/Api/document/submitOrder",
        data: postData,
        success: function (res) {
          $(".isBuy").removeClass("eventsDisabled")
          console.log(res)
          // if(res&&res.code==200){
          //   console.log("购买成功")
          //   Global.messageWin("下单成功")

          //   $(".isBuy0").hide()
          //   $(".isBuy1").show()
          // }
          console.log("购买成功")
          Global.messageWin(res.msg)

          $(".isBuy0").hide()
          $(".isBuy1").show()
        },
        error: function (e) {
          $(".isBuy").removeClass("eventsDisabled")
          console.log(e)
        }
      })
    })
  },
  eventBind() {
    //点击购买
    $(".isBuy").click(function(){
      if($(this).hasClass("isBuy1")){ //已经购买了
        Global.messageWin("您已购买")
      }else{
        ZaiDetail.buy()
      }
    })
    //点击收藏
    $(".isCollect").click(function () {
      let self = this
      if ($(this).hasClass("isCollect1")) { //已收藏》取消收藏
        Global.messageWin("已收藏")
        // Global.messageConfirWin("确认取消收藏？", function () {
        //   Global.cancelCollect(self, {
        //     id: ZaiDetail.id, //收藏的id
        //     user_id: Number(ZaiDetail.mUserInfo.user_id)
        //   }, function (res) {
        //     if (res && Number(res.code) == 200) {
        //       $(".isCollect1").hide()
        //       $(".isCollect0").show()
        //     }
        //   })
        // })
      } else { //未收藏》收藏
        Global.collect(this, {
          user_id: Number(ZaiDetail.mUserInfo.user_id),
          table_id: ZaiDetail.id,	// 收藏的id
          table_name: "document",	// 类型 1.document 在线文档 2.专家expert
        }, function (res) {
          console.log(res)
          if (res && Number(res.code) == 200) {
            $(".isCollect1").show()
            $(".isCollect0").hide()
          }
        })
      }
    })
    //点击发送评论
    $(".submitComment").click(function () {
      ZaiDetail.submitComment()
    })
    //2019.0.1.03
    //页面跳起
    if(Global.isIOS()){
      $("#commentInpt").bind("focus",function(){
        $("body").css({
          "position":"relative",
          "top":"0.64rem",
          "left":"0"
        })
      }).bind("blur",function(){
        $("body").css({
          "position":"static"
        })
      })
    }
  },
  init() {
    ZaiDetail.mUserInfo = Global.getMUserInfo()
    // ZaiDetail.mUserInfo.user_id = 1 //测试
    let option = Global.getPageParams()
    ZaiDetail.id = option.id ? Number(option.id) : ""
    // ZaiDetail.id = 1 //测试
    ZaiDetail.getInfo(function () {
      ZaiDetail.updateDom()
    })
    ZaiDetail.getComments()
    ZaiDetail.eventBind()
  }
}
$(function () {
  ZaiDetail.init()
})
window.onload=function(){
  Global.changeTitleG()
}