var ZaiDetail = { //需要id（视频id）
  mUserInfo: {},
  id: "", //视频id
  info: {},

  getInfo(callback) {
    let postData = {
      id: ZaiDetail.id,
      user_id: Number(ZaiDetail.mUserInfo.user_id)
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/video/detail",
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
      console.log(info)
      //视频
      $(".video").attr("src", Global.domain + info.video)
      $(".video").attr("poster", Global.domain + info.thumb)
      //视频 end
      //时长
      $(".timelong").text(info.timelong)
      //标题
      $(".videoTitle").text(info.title)
      //星评？
      //已购买
      $(".boughtCount").text(info.buyed_count)
      //价格
      $(".priceCount").text(info.price)
      //内容
      $(".articleText1").text(info.content)
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
      video_id: ZaiDetail.id
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/video/getComment",
      data: postData,
      success: function (res) {
        console.log(res)
        let arr = res.data
        if (arr.length > 0) {
          $(".container2").show()
          $(".askItemWrap").html("")
          arr.forEach(function (obj) {
            let head_pic = Global.domain + "/application/mobile/view/static/images/tx.png"
            if (obj.head_pic && obj.head_pic !== "") {
              head_pic = Global.domain + obj.head_pic
            }
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
      video_id: ZaiDetail.id,
      speaker_id: Number(ZaiDetail.mUserInfo.user_id),
      parent_id: 0,
      // reply_user_id: "",
      content: $("#commentInpt").val().trim()
    }
    console.log(postData)
    $(".submitComment").addClass("eventsDisabled")
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/video/addComment",
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
        Global.messageWin("操作失败")
      }
    })
  },
  eventBind() {
    //点击收藏
    $(".isCollect").click(function () {
      let self = this
      if ($(this).hasClass("isCollect1")) { //已收藏》取消收藏
        // Global.messageWin("已收藏")
        Global.messageConfirWin("确认取消收藏？", function () {
          Global.cancelCollect(self, {
            id: ZaiDetail.id, //收藏的id
            user_id: Number(ZaiDetail.mUserInfo.user_id)
          }, function (res) {
            if (res && Number(res.code) == 200) {
              // alert("取消收藏")

              $(".isCollect1").hide()
              $(".isCollect0").show()
            }
          })
        })
      } else { //未收藏》收藏
        Global.collect(this, {
          user_id: Number(ZaiDetail.mUserInfo.user_id),
          table_id: ZaiDetail.id,	// 收藏的id
          table_name: "video",	// 类型 1.document 在线文档 2.专家expert
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