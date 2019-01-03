var iosFileArr = []
var Ask = { //需要ask_id  expert_id   [isAgain]
  mUserInfo: {},
  user_id: "",
  expert_id: "",
  isAgain: false, //是否为追问

  //验证一下
  validAsk() {
    if (Ask.isAgain) { //是追问
      if ($(".mTextarea").val().trim() == "") {
        Global.messageWin("追问内容请输入完整")
        return false
      }
    } else {
      if ($(".mTextarea1").val().trim() == "" || $(".mTextarea").val().trim() == "") {
        Global.messageWin("提问标题和内容请输入完整")
        return false
      }
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
    // if (Global.isIOS()) {
    //   Global.mutiUploadIOS(iosFileArr, "ask_images", function (fileRes) {
    //     callback(fileRes)
    //   })
    // } else {
    //   let $inputs = $(".addedPic .picWrap:visible").find("input[type='file']")
    //   Global.mutiUpload($inputs, "ask_images", function (fileRes) {
    //     callback(fileRes)
    //   })
    // }

    //ajax提交问题
    let imagesArr = []
    $(".addedPic .picWrap").each(function () {
      let src = $(this).find("img").attr("data-src")
      imagesArr.push(src)
    })
    let postData = {
      user_id: Number(Ask.mUserInfo.user_id),
      expert_id: Ask.expert_id,

      title: $(".mTextarea1").val().trim(),
      content: $(".mTextarea").val().trim(),
      images: JSON.stringify(imagesArr)
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
            // window.history.back(-1)
            // alert(Global.host + "/mobile/expert/detail?id=" + Ask.expert_id)
            window.location.href = Global.host + "/mobile/expert/detail?id=" + Ask.expert_id
          })
        }
      },
      error: function (e) {
        $(".submitAsk").removeClass("eventsDisabled")
        console.log(e)
      }
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
    // Global.messageWin(JSON.stringify(postData))
    // return
    $(".submitAsk").addClass("eventsDisabled")
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/ask/answer",
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
        <img src="" alt="图片" onload="Global.resizeImg(this)">
        <span class="delPic"></span>
        <input type="file" style="display: none;" accept="image/*">
      </div>
    `)
    $(".addedPic").append($div)
    let input = $div.find("input[type='file']")[0]
    input.click()
  },
  addPicIOS() {
    let $input = $(`
      <input class="iosInputFile" type="file" style="display: none;" accept="image/*">
    `)
    $(".iosInputWrap").append($input)
    $input[0].click()
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
  inpuImgChangeIOS(self) { //input
    var fileList = self.files
    console.log(fileList)
    if (fileList.length > 0) {
      let fileList2 = fileList
      if (fileList.length > 3) {
        fileList2 = [fileList[0], fileList[1], fileList[2]]
        Global.messageWin("最多选择3张图片")
      }
      for (let i = 0; i < fileList2.length; i++) {
        let file = fileList2[i]
        let stamp = Math.round(Math.random() * 10000) //img file的唯一标识
        console.log(stamp)
        let $div = $(`
          <div class="picWrap" data-rd="${stamp}">
            <img src="" alt="图片" onload="Global.resizeImg(this)">
            <span class="delPic"></span>
          </div>
        `)
        $(".addedPic").append($div)

        let reader = new FileReader()
        reader.onload = function (e) {
          console.log(e)
          $div.find("img")[0].src = e.target.result
          iosFileArr.push({
            file: file,
            rd: Number($div.attr("data-rd"))
          })
          console.log(iosFileArr)
        }
        reader.readAsDataURL(file)
      }
    }
  },
  delImgIOS(ele) {
    let rd = Number($(ele).closest(".picWrap").attr("data-rd"))
    let index = ""
    iosFileArr.forEach(function (obj, idx) {
      if (obj.rd == rd) {
        index = idx
      }
    })
    iosFileArr.splice(index, 1)
    $(ele).closest(".picWrap").remove()
    console.log(iosFileArr)
  },
  eventBind() {
    //textarea1
    $(".mTextarea1").on("input", function () {
      let length = this.value.length
      $(".count1").text(length)
    });
    //textarea
    $(".mTextarea").on("input", function () {
      let length = this.value.length
      $(".count").text(length)
    });
    //添加图片
    //点击图片加号
    $(".addpicBtn").click(function () {
      if ($(".picWrap").length >= 3) {
        Global.messageWin("最多选择3张图片")
        return
      }
      if (Global.isIOS()) {
        // Ask.addPicIOS()
        uploadImgApp("2", "askImgCallback", 3) //参数1 type:1单图片 2多张图片，类型string；参数2 callback:上传完图片后，调用的h5 js方法的名称，类型string ;参数3 limitNum 限制最多选择几张图片 ,类型number
      } else {
        // Ask.addPic()
        window.Android.uploadImgApp("2", "askImgCallback", 3)
      }
    })
    $(".addedPic").delegate("input[type='file']", "change", function () {
      Ask.inpuImgChange(this)
    })
    $(".iosInputWrap").delegate("input[type='file']", "change", function () {
      Ask.inpuImgChangeIOS(this)
    })
    //点击×
    $(".addedPic").delegate(".delPic", "click", function (event) {
      event.stopPropagation();
      if (Global.isIOS()) {
        Ask.delImgIOS(this)
      } else {
        $(this).closest(".picWrap").remove()
      }
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
    // Global.changeTitleG()
    Ask.mUserInfo = Global.getMUserInfo()
    var option = Global.getPageParams()
    if (option.isAgain) { //是追问页面
      Ask.isAgain = true
      $(".submitAsk").text("追问")
    } else { //提问页面
      $(".topTitle").show()
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