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
      $(".titleTop").text(info.title)
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
      $(".description").text(info.description)
      //内容
      $(".articleContent").text(info.content)
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
          $(".askItemWrap").html("")
          arr.forEach(function (obj) {
            let head_pic = "__STATIC__/images/tx.png"
            if (obj.head_pic && obj.head_pic !== "") {
              head_pic = Global.domain + obj.head_pic
            }
            let add_time = Global.stampToDate(obj.add_time)
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
            $(".askItemWrap").append($div)
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
        }
      },
      error: function (e) {
        $(".submitComment").removeClass("eventsDisabled")
        console.log(e)
      }
    })
  },
  eventBind() {
    //点击收藏
    $(".isCollect").click(function () {
      if ($(this).hasClass("isCollect1")) { //已收藏》取消收藏
        // Global.messageWin("已收藏")
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