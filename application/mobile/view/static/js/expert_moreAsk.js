var mAsk = {
  mUserInfo: {},
  expert_id: "",

  page: 1,
  isLoading: false,


  getList(isScroll) {
    let getPage
    if (isScroll) {
      getPage = mAsk.page + 1
    } else {
      getPage = 1
      mAsk.page = 1
    }
    let postData = {
      expert_id: mAsk.expert_id,
      page: getPage
    }
    console.log(postData)
    if (mAsk.isLoading) {
      return
    }
    mAsk.isLoading = true
    $(".weui-loadmore").show()
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/ask/askList",
      data: postData,
      success: function (res) {
        mAsk.isLoading = false
        $(".weui-loadmore").hide()
        console.log(res)
        if (isScroll) {
          if (res.data.length == 0) {

          } else {
            mAsk.page++
            mAsk.updateDom(res.data, isScroll)
          }
        } else {
          mAsk.updateDom(res.data, isScroll)
        }

        //重置pull
        $(".listWrap").pullToRefreshDone();
      },
      error: function (e) {
        mAsk.isLoading = false
        $(".weui-loadmore").hide()
        console.log(e)
      }
    })
  },
  updateDom(arr, isScroll) {
    if (isScroll) {

    } else {
      $(".askItemWrap").html("")
    }
    arr.forEach(function (obj) {
      let head_pic = "__STATIC__/images/tx.png"
      if (obj.head_pic && obj.head_pic !== "") {
        head_pic = Global.domain + obj.head_pic
      }
      let createtime = Global.stampToDate(obj.createtime)
      let $div = $(`
        <div class="askItem" data-askid="${obj.ask_id}">
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
    if ($(".askItem").length == 0) {
      $(".noList").show()
    }
  },
  initJqueryWeui() {
    //下拉刷新
    $(".listWrap").pullToRefresh(function () {
      mAsk.getList()
    });
    //滚动加载
    $(".listWrap").infinite().on("infinite", function () {
      mAsk.getList(true)
    });
  },
  eventBind() {
    //下拉刷新 滚动加载
    mAsk.initJqueryWeui()
    //点击item 去问答详情
    $(".askItemWrap").delegate(".askItem", "click", function (event) {
      event.stopPropagation();
      let ask_id = $(this).attr("data-askid")
      // window.location.href = "../ask/detail.html?ask_id=" + ask_id //测试
      window.location.href = Global.host + "/mobile/ask/detail?ask_id=" + ask_id
    })
  },
  init() {
    mAsk.mUserInfo = Global.getMUserInfo()
    // mAsk.mUserInfo.user_id = 1 //测试
    let option = Global.getPageParams()
    mAsk.expert_id = option.expert_id ? Number(option.expert_id) : ""
    // mAsk.expert_id = 2 //测试
    mAsk.getList()
    mAsk.eventBind()
  }
}
$(function () {
  mAsk.init()
})