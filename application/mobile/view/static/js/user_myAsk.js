var Mask = {
  mUserInfo: {},
  page: 1,
  isLoading: false,

  getList(isScroll) {
    let getPage
    if (isScroll) {
      getPage = Mask.page + 1
    } else {
      getPage = 1
      Mask.page = 1
    }
    let postData = {
      user_id: Number(Mask.mUserInfo.user_id),
      page: getPage
    }
    console.log(postData)
    if (Mask.isLoading) {
      return
    }
    Mask.isLoading = true
    if (isScroll) {
      $(".weui-loadmore").show()
    }
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/user/myAsk",
      data: postData,
      success: function (res) {
        Mask.isLoading = false
        $(".weui-loadmore").hide()
        console.log(res)
        if (isScroll) {
          if (res.data.length == 0) {

          } else {
            Mask.page++
            Mask.updateDom(res.data, isScroll)
          }
        } else {
          Mask.updateDom(res.data, isScroll)
        }

        //重置pull
        $(".listWrap").pullToRefreshDone();
      },
      error: function (e) {
        Mask.isLoading = false
        $(".weui-loadmore").hide()
        console.log(e)
      }
    })
  },
  updateDom(arr, isScroll) {
    if (isScroll) {

    } else {
      $(".myAskWrap").html("")
    }
    arr.forEach(function (obj) {
      if (obj.createtime && obj.createtime !== "") {
        var createtime = Global.stampToDate(obj.createtime)
      }
      let $div = $(`
        <div class="myAskItem" data-askid="${obj.ask_id}" data-expertid="${obj.expert_id}">
          <div class="flexCenter flexBetween myAskItem_top">
            <h4 class="textOmit">${obj.title}</h4>
            <div class="flexCenter nameWrap"><span class="icon_m icon_expert"></span><span class="expertName textOmit">${obj.fullname}</span></div>
          </div>
          <p class="askContent limitLine5">${obj.content}</p>
          <div class="flexCenter flexBetween">
            <div class="date datetime">${createtime}</div>
            <div class="flexCenter">
              <div class="flexCenter goAsk" style="margin-right:0.1rem;"><span class="icon_m icon_ask"></span>追问</div>
              <div class="flexCenter goComment"><span class="icon_m icon_comment"></span>评价</div>
            </div>
          </div>
        </div>
      `)
      $(".myAskWrap").append($div)
    })
    if ($(".myAskItem").length == 0) {
      $(".noList").show()
    }
  },
  initJqueryWeui() {
    //下拉刷新
    $(".listWrap").pullToRefresh(function () {
      Mask.getList()
    });
    //滚动加载
    $(".listWrap").infinite().on("infinite", function () {
      Mask.getList(true)
    });
  },
  eventBind() {
    //初始化下拉刷新 滚动加载
    Mask.initJqueryWeui()
    //点击item
    $(".myAskWrap").delegate(".myAskItem", "click", function (event) {
      event.stopPropagation();
      let ask_id = $(this).closest(".myAskItem").attr("data-askid")
      let expert_id = $(this).closest(".myAskItem").attr("data-expertid")
      window.location.href = Global.host + "/mobile/ask/detail?id=" + ask_id
    })
    //点击 追问
    $(".myAskWrap").delegate(".goAsk", "click", function (event) {
      event.stopPropagation();
      let ask_id = $(this).closest(".myAskItem").attr("data-askid")
      let expert_id = $(this).closest(".myAskItem").attr("data-expertid")
      window.location.href = Global.host + "/mobile/expert/ask?ask_id=" + ask_id + "&expert_id=" + expert_id + "&isAgain=1"
    })
    //点击 评价
    $(".myAskWrap").delegate(".goComment", "click", function (event) {
      event.stopPropagation();
      let ask_id = $(this).closest(".myAskItem").attr("data-askid")
      let expert_id = $(this).closest(".myAskItem").attr("data-expertid")
      window.location.href = Global.host + "/mobile/ask/comment?id=" + ask_id + "&expert_id=" + expert_id
    })
  },
  init() {
    // Global.changeTitleG()
    Mask.mUserInfo = Global.getMUserInfo()
    // Mask.mUserInfo.user_id = 1 //测试
    Mask.getList()
    Mask.eventBind()
  }
}
$(function () {
  Mask.init()
})