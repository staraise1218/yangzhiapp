var Sign = { //会议id
  mUserInfo: {},
  user_id: "",
  meeting_id: "",

  //验证
  validForm() {
    //是否为空
    let isEmpty = false
    $(".formWrap input[name]").each(function () {
      if (this.value.trim() == "") {
        isEmpty = true
      }
    })
    if (isEmpty) {
      Global.messageWin("报名信息请填写完整")
      return false
    }
    //手机和固定电话
    let reg2 = /^\d{3}-\d{8}$|^\d{4}-\d{7}$|^\d{11}$|^1[3-9]\d{9}$/;
    let value2 = $("input[name='phone']").val()
    if (!reg2.test(value2)) {
      Global.messageWin("电话格式不正确")
      return false
    }
    //邮箱
    let reg1 = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
    let value1 = $("input[name='email']").val()
    if (!reg1.test(value1)) {
      Global.messageWin("邮箱格式不正确")
      return false
    }
    return true
  },
  //报名
  submit() {
    //验证
    if (!Sign.validForm()) {
      return
    }
    //验证 end

    let postData = {}
    //获取表单数据
    $(".formWrap input[name]").each(function () {
      if ($(this).attr("name") !== "") {
        let key = $(this).attr("name")
        let value = this.value
        postData[key] = value
      }
    })
    //user_id和会议id
    postData.user_id = Number(Sign.mUserInfo.user_id)
    postData.meeting_id = Sign.meeting_id
    console.log(postData)
    // return
    $(".submit").addClass("eventsDisabled")
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/meeting/enroll",
      data: postData,
      success: function (res) {
        $(".submit").removeClass("eventsDisabled")
        console.log(res)
        if(res&&Number(res.code)==200){
          // $(".done").show()
          Global.messageWin("报名成功")
          // window.history.back(-1)
        }
      },
      error: function (e) {
        console.log(e)
        Global.messageWin("操作失败")
      }
    })
  },
  eventBind() {
    //点击报名
    $(".submit").click(function () {
      Sign.submit()
    })
  },
  init() {
    Sign.mUserInfo = Global.getMUserInfo()
    // Sign.mUserInfo.user_id = 1 //测试
    let option = Global.getPageParams()
    Sign.meeting_id = option.meeting_id ? Number(option.meeting_id) : ""
    Sign.eventBind()
  }
}
$(function () {
  Sign.init()
})