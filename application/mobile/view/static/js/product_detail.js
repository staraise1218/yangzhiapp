var Pro={
  id:"", //产品id
  mUserInfo:{},
  productInfo:{},

  getData(){
    let postData = {
      id:Pro.id,
      user_id:Number(Pro.mUserInfo.user_id)
    }
    console.log(postData)
    $.ajax({
      type: "POST",
      url: Global.host + "/Api/product/detail",
      data: postData,
      success: function (res) {
        console.log(res)
        Pro.productInfo=res.data
        Pro.updateDom()
      },
      error: function (e) {
        console.log(e)
      }
    })
  },
  updateDom(){
    let info=Pro.productInfo
    //图片
    let src=Global.domain+info.thumb
    $(".thumbImg").attr("src",src)
    //tag
    if(info.tag&&info.tag!==""){
      let tagArr=info.tag.split(",")
      $(".tagWrap").html("")
      tagArr.forEach(function(str,index){
        let $span=$('<span class="wordTip">'+str+'</span>')
        let className=(index%2 ==0) ?"wordTip1":"wordTip2"
        $span.addClass(className)
        $(".tagWrap").append($span)
      })
    }
    //放普通数据
    $("[data-myname]").each(function(){
      let key=$(this).attr("data-myname")
      if(info[key]){
        let value=info[key]
        $(this).text(value)
      }
    })
  },
  buy(){
    Global.messageConfirWin("确认购买？",function(){
      let postData = {
        product_id:Pro.id,
        user_id:Number(Pro.mUserInfo.user_id)
      }
      console.log(postData)
      Global.disableEle($(".buyBtn")[0])
      $.ajax({
        type: "POST",
        url: Global.host + "/Api/product/submitOrder",
        data: postData,
        success: function (res) {
          Global.ableEle($(".buyBtn")[0])
          console.log(res)
          if(res&&res.code==200){
            console.log("购买成功")
            Global.messageWin("下单成功")
          }
        },
        error: function (e) {
          Global.ableEle($(".buyBtn")[0])
          console.log(e)
        }
      })
    })
  },
  eventsBind(){
    //点击购买
    $(".buyBtn").click(function(){
      Pro.buy()
    })
  },
  init(){
    let option=Global.getPageParams()
    Pro.id=option.id?Number(option.id):""
    // Pro.id=2 //测试用
    Pro.mUserInfo=Global.getMUserInfo()
    // Pro.mUserInfo.user_id=1 //测试用

    Pro.getData()
    Pro.eventsBind()
  }
}
$(function(){
  Pro.init()
})