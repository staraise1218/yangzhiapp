var Askd = { //需要ask_id
  mUserInfo: {},
  ask_id: "", //问题id
  data: {},

  //获取问题详情info
  getInfo(callback) {
    let postData = {
      id: Askd.ask_id
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/ask/detail",
      data: postData,
      success: function (res) {
        console.log(res)
        Askd.data = res.data
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
    if (JSON.stringify(Askd.data) !== "{}") {
      //提问者的info
      let info = Askd.data.info
      //头像
      if (info.head_pic && info.head_pic !== "") {
        $(".container1 .headbox>img").attr("src", Global.domain + info.head_pic)
      }
      //名字
      $(".container1 .headname").text(info.fullname)
      //问题时间
      $(".mainDate").text(Global.stampToDate(info.createtime))
      //问题title
      $(".askContent>h4").text(info.content)
      //图片
      if (info.images && info.images !== "") {
        $(".container1 .imgWrap").html("")
        info.images.forEach(function (src, index) {
          let $img = $('<img src="' + Global.domain + src + '" alt="图片">')
          $(".container1 .imgWrap").append($img)
        })
      }

      //追问列表
      let answerList = Askd.data.answerList
      if (answerList.length > 0) {
        $(".container3").show()
        $(".askItemWrap").html("")
        answerList.forEach(function (obj) {
          let head_pic = "__STATIC__/images/tx.png"
          if (obj.head_pic && obj.head_pic !== "") {
            head_pic = Global.domain + obj.head_pic
          }
          let createtime = Global.stampToDate(obj.createtime)
          let $div = $(`
          <div class="askItem">
            <div class="flexCenter flexBetween headpicWrap">
              <div class="flexCenterIL headpic">
                <div class="headbox">
                  <img src="${head_pic}" alt="头像">
                </div>
                <span class="headname">${obj.fullname}</span>
                <span class="isZhuanjia" style="display:none;"></span>
              </div>

              <span class="date">${createtime}</span>
            </div>
            <p class="articleText">${obj.content}</p>
          </div>
        `)
          $(".askItemWrap").append($div)
        })
      }
      //是否可以评论
      if (Number(info.user_id) == Number(Askd.mUserInfo.user_id)) {
        $(".gotoComment").show()
      }
    }
  },
  eventBind() {
    //点击详情图片
    $(".imgWrap").delegate("img", "click", function () {
      Global.showFullPic(this, $(".imgWrap img"))
    })
    //点击追问
    $(".askAgain").click(function () {
      // window.location.href = "../expert/ask.html?isAgain=1&ask_id=" + Askd.ask_id //测试
      window.location.href = Global.host + "/mobile/expert/ask?isAgain=1&ask_id=" + Askd.ask_id
    })
    //点击评论
    $(".gotoComment").click(function () {
      // window.location.href = "comment.html?ask_id=" + Askd.ask_id + "&expert_id=" + Askd.data.info.expert_id //测试
      window.location.href = Global.host + "/ask/comment?ask_id=" + Askd.ask_id + "&expert_id=" + Askd.data.info.expert_id
    })
  },
  init() {
    Askd.mUserInfo = Global.getMUserInfo()
    // Askd.mUserInfo.user_id = 1 //测试
    let option = Global.getPageParams()
    Askd.ask_id = option.ask_id ? Number(option.ask_id) : ""
    // Askd.ask_id = 1 //测试
    Askd.getInfo(function () {
      Askd.updateDom()
    })
    Askd.eventBind()
  }
}
$(function () {
  Askd.init()
})