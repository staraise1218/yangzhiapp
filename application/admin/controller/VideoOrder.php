<?php

namespace app\admin\controller;

use think\Page;
use think\Paginator;

class VideoOrder extends Base {

    public function index(){
        $page = I('page', 1);
       
        $list = M('video_order')->alias('vo')
            ->join('video v', 'vo.video_id=v.id')
            ->join('users u', 'vo.user_id=u.user_id')
            ->order('vo.id desc')
            ->field('vo.id order_id, vo.order_sn, vo.price, vo.createtime, vo.paystatus, vo.paytime, u.fullname, u.mobile, v.title')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/videoOrder/index')]);


        $this->assign('list',$list);// 赋值数据集
        
        return $this->fetch();
    }

    public function changepaytatus(){
        $paystatus = I('paystatus');
        $id = I('id');

        $updatedata = array(
            'paystatus' => $paystatus,
        );

        if($paystatus == 1){
            $updatedata['paytime'] = time();
        } else {
            $updatedata['paytime'] = null;
        }

        M('video_order')->where('id', $id)->update($updatedata);
    }
}