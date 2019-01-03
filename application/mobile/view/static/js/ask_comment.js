var Com = { //id(ask_id)  expert_id
  mUserInfo: {},
  ask_id: "", //要评论的问答id
  expert_id: "",

  valid() {
    if ($(".mTextarea").val().trim() == "") {
      Global.messageWin("请输入评论内容")
      return false
    }
    return true
  },
  submit() {
    //验证
    if (!Com.valid()) {
      return
    }

    let postData = {
      ask_id: Com.ask_id,
      expert_id: Com.expert_id,
      content: $(".mTextarea").val().trim(),
      score: $(".starsCount").text()
    }
    console.log(postData)
    $(".submit").addClass("eventsDisabled")
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/user/askComment",
      data: postData,
      success: function (res) {
        $(".submit").removeClass("eventsDisabled")
        console.log(res)
        if (res && Number(res.code) == 200) {
          Global.messageWin("评论成功", function () {
            window.history.back(-1)
          })
        }
      },
      error: function (e) {
        $(".submit").removeClass("eventsDisabled")
        console.log(e)
      }
    })
  },
  eventBind() {
    //textarea
    $(".mTextarea").on("input", function () {
      let length = this.value.length
      $(".count").text(length)
    });
    //生成可点击的星评
    Global.initStarsEvent($("ul.stars"), function (idx) {
      $(".starsCount").text(Number(idx) + 1)
    })
    //点击提交
    $(".submit").click(function () {
      Com.submit()
    })
  },
  init() {
    Global.changeTitleG()
    Com.mUserInfo = Global.getMUserInfo()
    // Com.mUserInfo.user_id = 1 //测试
    let option = Global.getPageParams()
    Com.ask_id = option.id ? Number(option.id) : ""
    Com.expert_id = option.expert_id ? Number(option.expert_id) : ""
    Com.eventBind()
  }
}
$(function () {
  Com.init()
})