var ZhuDetail = { //猪场id pig_id
  id: "",
  info: {},

  getInfo(callback) {
    let postData = {
      id: ZhuDetail.id
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/pig/detail",
      data: postData,
      success: function (res) {
        console.log(res)
        ZhuDetail.info = res.data
        if (callback) {
          callback()
        }
      },
      error: function (e) {
        console.log(e)
      }
    })
  },
  updateDom: function () {
    if (JSON.stringify(ZhuDetail.info) !== "{}") {
      let info = ZhuDetail.info
      //标题
      $(".container1 .title").text(info.title)
      //简介
      $(".container1 .articleText").text(info.description)
      //详情
      $(".articleContent").text(info.content)
      //图片
      if (info.thumb && info.thumb !== "") {
        $(".pigImg").attr("src", Global.domain + info.thumb)
        $(".pigImg").show()
      }

      //分享 剪切板
      ZhuDetail.initshare()
    }
  },
  initshare() {
    let shareStr = $(".container1 .title").text() + "-养殖app " + window.location.href
    $(".share").attr("data-clipboard-text", shareStr)
    var clipboard = new ClipboardJS('.share');

    clipboard.on('success', function (e) {
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);
      //生成分享弹框
      let $msgDiv = $(`
            <div class="msgWrap">
                <div class="msgMask"></div>
                <div class="msg">
                    <div class="">
                      <h4>分享内容已生成</h4>
                      <p>${shareStr}</p>
                      <p>内容已复制成功</p>
                    </div>
                    <p class="msgCtrl">
                        <span class="closeMsg">去粘贴</span>
                    </p>
                </div>
            </div>
      `);
      $msgDiv.find(".msgMask")[0].addEventListener("touchstart", function (e) {
        e.stopPropagation();
        e.preventDefault();
      }, false);
      $msgDiv.find(".closeMsg").click(function () {
        $msgDiv.remove();
        if (callback) {
          callback()
        }
      });
      $("body").append($msgDiv);

      e.clearSelection();
    });

    clipboard.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  },
  eventBind() {
    // //点击分享?
    // $(".share").click(function () {

    // })
    //点击收藏
    $(".collection").click(function () {
      Global.collect(this, {
        user_id: Number(ZhuDetail.mUserInfo.user_id),
        table_id: ZhuDetail.id,
      }, function (res) {
        console.log(res)
      })
    })
  },
  init() {
    ZhuDetail.mUserInfo = Global.getMUserInfo()
    // ZhuDetail.mUserInfo.user_id = 1 //测试
    let option = Global.getPageParams()
    ZhuDetail.id = option.id ? Number(option.id) : ""
    // ZhuDetail.id = 1 //测试
    ZhuDetail.getInfo(function () {
      ZhuDetail.updateDom()
    })
    ZhuDetail.eventBind()
  }
}
$(function () {
  ZhuDetail.init()
})