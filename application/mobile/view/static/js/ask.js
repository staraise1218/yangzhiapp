var Ask={
  user_id:"",
  expert_id:"",
  
  //验证一下
  validAsk(){
    if($(".mTextarea").val().trim()==""){
      alert("请输入内容")
      return false
    }
    return true
  },
  //
  //提交问题
  submitAsk(){

    let postData={
      user_id:Ask.user_id,
      expert_id:Ask.expert_id,
      content:"",
      images:"",
    }
    console.log(postData)
    $(".submitAsk").addClass("eventsDisabled")
    $.ajax({
      type:"POST",
      url:Global.host+"/Api/ask/ask",
      data:postData,
      success:function(res){
        $(".submitAsk").removeClass("eventsDisabled")
        console.log(res)
      },
      error:function(e){
        console.log(e)
      }
    })
  },
  eventBind(){
    //点击图片加号
    $(".addpicBtn").click(function(){
      
    })
    //点击提问
    $(".submitAsk").click(function(){
      Ask.submitAsk()
    })
  },
  init(){
    var option=Global.getPageParams()
    Ask.expert_id=Number(option.expert_id)
    Ask.eventBind()
  }
}
$(function(){
  Ask.init()
})