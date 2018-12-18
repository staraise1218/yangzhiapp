var Sign = {
  user_id: "",
  meeting_id: "",

  //验证
  validForm() {
    return true
  },
  //报名
  submit() {
    //验证
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
    postData.user_id = Sign.user_id
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

        alert("报名成功")
      },
      error: function (e) {
        console.log(e)
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
    let option = Global.getPageParams()
    Sign.user_id = option.user_id ? Number(option.user_id) : ""
    Sign.meeting_id = option.meeting_id ? Number(option.meeting_id) : ""
    Sign.eventBind()
  }
}
$(function () {
  Sign.init()
})