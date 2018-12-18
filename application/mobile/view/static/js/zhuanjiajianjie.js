var Jianjie={
  user_id:"",
  info:{},
  askList:[],

  getInfo(callback){
    let postData={
      expert_id:Jianjie.user_id
    }
    console.log(postData)
    $.ajax({
      type:"POST",
      url:Global.host+"/Api/expert/detail",
      data:postData,
      success:function(res){
        console.log(res)
        if(res){
          Jianjie.info=res.data.info
          if(callback){
            callback()
          }
        }
      },
      error:function(e){
        console.log(e)
      }
    })
  },
  updateDom(){
    if(JSON.stringify(Jianjie.info)!=="{}"){
      let info=Jianjie.info
      //头像
      $(".container1 .headbox>img").attr("src",info.head_pic)
      //姓名
      $(".container1 .headname").text(info.fullname)
      //评论数
      $(".commentCountText").text(info.answerCount)
      //简介1
      $(".articleText1").text(info.description)
      //简介2
      $(".jianjie2").text(info.detail)
      //问答列表
      $(".askItemWrap").html("")
      Jianjie.askList.forEach(function(obj){
        let createTime=Global.stampToDate(obj.createTime).substr(0,10)
        let $div=$(`
          <div class="askItem">
            <div class="flexCenter flexBetween headpicWrap">
              <div class="flexCenterIL headpic">
                <div class="headbox">
                  <img src="${obj.head_pic}" alt="头像">
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
      //用户评价？

    }
  },
  eventBind(){
    //点击提问
    $(".gotoAsk").click(function(){
      window.location.href="ask.html?expert_id="+Jianjie.user_id
    })
  },
  init(){
    var option=Global.getPageParams()
    Jianjie.user_id=Number(option.user_id)
    Jianjie.getInfo(function(){
      Jianjie.updateDom()
    })
    Jianjie.eventBind()
  }
}
$(function(){
  Jianjie.init()
})