var Ask = {
  mUserInfo: {},
  user_id: "",
  expert_id: "",
  isAgain: false, //是否为追问

  //验证一下
  validAsk() {
    if ($(".mTextarea").val().trim() == "") {
      Global.messageWin("请输入提问内容")
      return false
    }
    return true
  },
  //提交问题
  submitAsk() {
    //验证
    if (!Ask.validAsk()) {
      return
    }

    //上传多图片
    let $inputs = $(".addedPic .picWrap:visible").find("input[type='file']")
    Global.mutiUpload($inputs, "ask_images", function (fileRes) {
      console.log(fileRes)
      //ajax提交问题
      let imagesJsonStr = ""
      if (fileRes) {
        let imagesArr = fileRes.data.filepath
        imagesJsonStr = JSON.stringify(imagesArr)
      }
      let postData = {
        user_id: Number(Ask.mUserInfo.user_id),
        expert_id: Ask.expert_id,
        content: $(".mTextarea").val(),
        images: imagesJsonStr
      }
      console.log(postData)
      // return
      $(".submitAsk").addClass("eventsDisabled")
      $.ajax({
        type: "POST",
        url: Global.host + "/Api/ask/ask",
        data: postData,
        success: function (res) {
          $(".submitAsk").removeClass("eventsDisabled")
          console.log(res)
          if (res && Number(res.code) == 200) {
            // alert("操作成功")
            Global.messageWin("操作成功", function () {
              window.history.back(-1)
            })
          }
        },
        error: function (e) {
          $(".submitAsk").removeClass("eventsDisabled")
          console.log(e)
        }
      })
    })
  },
  //对问答进行追问
  submitAskAgain() {
    //验证
    if (!Ask.validAsk()) {
      return
    }

    let postData = {
      ask_id: Ask.ask_id,
      user_id: Number(Ask.mUserInfo.user_id),
      content: $(".mTextarea").val(),
    }
    console.log(postData)
    // return
    $(".submitAsk").addClass("eventsDisabled")
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/ask/ask",
      data: postData,
      success: function (res) {
        $(".submitAsk").removeClass("eventsDisabled")
        console.log(res)
        if (res && Number(res.code) == 200) {
          // alert("操作成功")
          Global.messageWin("操作成功", function () {
            window.history.back(-1)
          })
        }
      },
      error: function (e) {
        $(".submitAsk").removeClass("eventsDisabled")
        console.log(e)
      }
    })
  },
  //点击加号加图片
  addPic() {
    let $div = $(`
      <div class="picWrap" style="display:none;">
        <img class="img100" src="" alt="图片">
        <span class="delPic"></span>
        <input type="file" style="display: none;">
      </div>
    `)
    $(".addedPic").append($div)
    let input = $div.find("input[type='file']")[0]
    input.click()
  },
  inpuImgChange(self) { //input
    var fileList = self.files
    console.log(fileList)
    if (fileList.length > 0) {
      $(self).closest(".picWrap").show()
      var file = fileList[0]
      console.log(file)
      var reader = new FileReader()
      reader.onload = function (e) {
        console.log(e)
        $(self).siblings("img")[0].src = e.target.result
      }
      reader.readAsDataURL(file)
    } else {
      $(self).closest(".picWrap").remove()
    }
  },
  eventBind() {
    //添加图片
    //点击图片加号
    $(".addpicBtn").click(function () {
      Ask.addPic()
    })
    $(".addedPic").delegate("input[type='file']", "change", function () {
      Ask.inpuImgChange(this)
    })
    //点击×
    $(".addedPic").delegate(".delPic", "click", function (event) {
      event.stopPropagation();
      $(this).closest(".picWrap").remove()
    })
    //添加图片 end
    //点击已添加的图片 查看大图
    $(".addedPic").delegate("img", "click", function () {
      let $imgs = $(".addedPic .picWrap:visible img")
      Global.showFullPic(this, $imgs)
    })
    //点击提问/追问
    $(".submitAsk").click(function () {
      if (Ask.isAgain) {
        Ask.submitAskAgain()
      } else {
        Ask.submitAsk()
      }
    })
  },
  init() {
    Ask.mUserInfo = Global.getMUserInfo()
    Ask.mUserInfo.user_id = 1 //测试
    var option = Global.getPageParams()
    if (option.isAgain) { //是追问页面
      Ask.isAgain = true
      $(".submitAsk").text("追问")
    } else { //提问页面
      $(".addpicWrap").show()
    }
    Ask.ask_id = option.ask_id ? Number(option.ask_id) : ""
    Ask.expert_id = option.expert_id ? Number(option.expert_id) : ""
    Ask.eventBind()
  }
}
$(function () {
  Ask.init()
})