var Jianjie = { //id (expert_id)
  mUserInfo: {},
  export_id: "",
  info: {},
  askList: [],

  //获取数据
  getInfo(callback) {
    let postData = {
      expert_id: Jianjie.export_id
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/expert/detail",
      data: postData,
      success: function (res) {
        console.log(res)
        if (res) {
          Jianjie.info = res.data.info
          Jianjie.askList = res.data.askList
          if (callback) {
            callback()
          }
        }
      },
      error: function (e) {
        console.log(e)
      }
    })
  },
  //更新dom
  updateDom() {
    if (JSON.stringify(Jianjie.info) !== "{}") {
      let info = Jianjie.info
      //头像
      if (info.head_pic && info.head_pic !== "") {
        let head_pic = Global.filterHeadpic(info.head_pic)
        $(".container1 .headbox>img").attr("src", head_pic)
      }
      //姓名
      $(".container1 .headname").html(info.fullname)
      //星评
      let score = Number(info.comment_score)
      $(".stars li").each(function (index) {
        if (index < score) {
          this.className = "stars1"
        } else {
          this.className = "stars0"
        }
      })
      //评论数
      if (info.answerCount && Number(info.answerCount) !== 0) {
        $(".commentCountText").html(info.answerCount)
      }
      //简介1
      $(".articleText1").html(info.description)
      //简介2
      if (info.detail && info.detail !== "") {
        $(".jianjie2").html(info.detail)
      } else {
        $(".jianjie2").html("暂无信息")
      }
      //问答列表
      $(".askItemWrap").html("")
      if (Jianjie.askList.length > 0) {
        $(".askList").show()
        Jianjie.askList.forEach(function (obj) {
          let head_pic = Global.filterHeadpic(obj.head_pic)
          if (obj.createtime && obj.createtime !== "") {
            var createTime = Global.stampToDate(obj.createtime).substr(0, 10)
          }
          let $div = $(`
            <div class="askItem" data-askid="${obj.ask_id}">
              <div class="flexCenter flexBetween headpicWrap">
                <div class="flexCenterIL headpic">
                  <div class="headbox">
                    <img src="${head_pic}" alt="头像">
                  </div>
                  <span class="headname">${obj.fullname}</span>
                </div>
  
                <span class="date">${createTime}</span>
              </div>
              <p class="articleText">${obj.content}</p>
            </div>
          `)
          $(".askItemWrap").append($div)
        })
      }
      //用户评价？

      //是否收藏
      if (info.is_collect && Number(info.is_collect) == 1) { //收藏了
        $(".collect1").show()
        $(".collect0").hide()
      } else { //没收藏
        $(".collect1").hide()
        $(".collect0").show()
      }
    }
  },
  eventBind() {
    //关注
    //加关注
    $(".attend.jiaAt").click(function () { })
    //取消关注
    $(".attend.cancelAt").click(function () {
      Global.messageConfirWin("确定要取消关注吗？", function () { })
    })
    //关注 end
    //点击查看更多问答
    $(".moreAsk").click(function () {
      // window.location.href = "moreAsk.html?expert_id=" + Jianjie.export_id //测试
      window.location.href = Global.host + "/mobile/expert/moreAsk?expert_id=" + Jianjie.export_id
    })
    //点击查看更多评价
    $(".moreComment").click(function () {
      // window.location.href = "moreAsk.html" //测试
    })
    //点击问答列表item 去问答详情
    $(".askItemWrap").delegate(".askItem", "click", function () {
      let ask_id = $(this).attr("data-askid")
      // window.location.href = "../ask/detail.html?ask_id=" + ask_id //测试
      window.location.href = Global.host + "/mobile/ask/detail?id=" + ask_id
    })
    //点击提问
    $(".gotoAsk").click(function () {
      // window.location.href = "ask.html?expert_id=" + Jianjie.export_id //测试
      window.location.href = Global.host + "/mobile/expert/ask?expert_id=" + Jianjie.export_id
    })
    //点击收藏
    $(".collection").click(function () {
      Global.collect(this, {
        user_id: Number(Jianjie.mUserInfo.user_id),
        table_id: Jianjie.export_id,	// 收藏的id
        table_name: "expert"
      }, function (res) {
        console.log(res)
        if (Number(res.code) == 200) {
          let msg = ""
          if (res.data !== "") {
            msg = res.data
          }
          if (res.msg !== "") {
            msg = res.msg
          }
          console.log(msg)
          // Global.messageWin(msg)
          $(".collect1").show()
          $(".collect0").hide()
        }
      })
    })
  },
  init() {
    Global.changeTitleG()
    Jianjie.mUserInfo = Global.getMUserInfo()
    // Jianjie.mUserInfo.user_id = 1 //测试
    let option = Global.getPageParams()
    Jianjie.export_id = option.id ? Number(option.id) : ""
    // Jianjie.export_id = 2 //测试
    Jianjie.getInfo(function () {
      Jianjie.updateDom()
    })
    Jianjie.eventBind()
  }
}
$(function () {
  Jianjie.init()
})