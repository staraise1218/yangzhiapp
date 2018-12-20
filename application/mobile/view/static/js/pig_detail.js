var ZhuDetail = { //猪场id pig_id
  id: "",
  info: {},

  getInfo(callback) {
    let postData = {
      id: ZhuDetail.id
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/pig/detail",
      data: postData,
      success: function (res) {
        console.log(res)
        ZhuDetail.info = res.data
        if (callback) {
          callback()
        }
      },
      error: function (e) {
        console.log(e)
      }
    })
  },
  updateDom: function () {
    if (JSON.stringify(ZhuDetail.info) !== "{}") {
      let info = ZhuDetail.info
      //标题
      $(".container1 .title").text(info.title)
      //简介
      $(".container1 .articleText").text(info.description)
      //详情
      $(".articleContent").text(info.content)
      //图片
      if (info.thumb && info.thumb !== "") {
        $(".pigImg").attr("src", Global.domain + info.thumb)
        $(".pigImg").show()
      }
    }
  },
  eventBind() {
    //点击分享?
    $(".share").click(function () {

    })
    //点击收藏
    $(".collection").click(function () {
      Global.collect(this, {
        user_id: Number(ZhuDetail.mUserInfo.user_id),
        table_id: ZhuDetail.id,
      }, function (res) {
        console.log(res)
      })
    })
  },
  init() {
    ZhuDetail.mUserInfo = Global.getMUserInfo()
    ZhuDetail.mUserInfo.user_id = 1 //测试
    let option = Global.getPageParams()
    ZhuDetail.id = option.id ? Number(option.id) : ""
    ZhuDetail.id = 1 //测试
    ZhuDetail.getInfo(function () {
      ZhuDetail.updateDom()
    })
    ZhuDetail.eventBind()
  }
}
$(function () {
  ZhuDetail.init()
})