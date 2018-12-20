var meDetail = { //会议id
  mUserInfo: {},
  id: "",
  info: {},

  getInfo(callback) {
    let postData = {
      id: meDetail.id,
      user_id: Number(meDetail.mUserInfo.user_id),
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/meeting/detail",
      data: postData,
      success: function (res) {
        console.log(res)
        meDetail.info = res.data
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
    if (JSON.stringify(meDetail.info) !== "{}") {
      let info = meDetail.info
      //标题
      $(".container1 .title").text(info.title)
      //日期
      $(".createdate").text(Global.stampToDate(info.createtime))
      //地址
      $(".address").text(info.address)
      //简介说明
      $(".description").text(info.description)
      //内容
      $(".articleContent").text(info.content)
    }
  },
  eventBind() {
    //点击报名
    $(".gotoSign").click(function () {
      window.location.href = "enroll.html?meeting_id=" + meDetail.id //测试
      // window.location.href = Global.host + "/mobile/meeting/enroll?meeting_id=" + meDetail.id
    })
    //点击收藏
    $(".collection").click(function () {
      Global.collect(this, {
        user_id: Number(meDetail.mUserInfo.user_id),
        table_id: meDetail.id,
        table_name: "",
      }, function (res) {
        console.log(res)
        if (Number(res.code) == 200) {
          // alert("收藏成功")
          Global.messageWin("收藏成功")
        }
      })
    })
  },
  init() {
    meDetail.mUserInfo = Global.getMUserInfo()
    meDetail.mUserInfo.user_id = 1 //测试
    let option = Global.getPageParams()
    meDetail.id = option.id ? Number(option.id) : ""
    meDetail.id = 1 //测试
    meDetail.getInfo(function () {
      meDetail.updateDom()
    })
    meDetail.eventBind()
  }
}
$(function () {
  meDetail.init()
})