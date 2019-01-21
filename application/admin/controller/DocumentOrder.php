<?php

namespace app\admin\controller;

use think\Page;
use think\Paginator;

class DocumentOrder extends Base {

    public function index(){
        $page = I('page', 1);
       
        $list = M('document_order')->alias('do')
            ->join('document d', 'do.document_id=d.id')
            ->join('users u', 'do.user_id=u.user_id')
            ->order('do.id desc')
            ->field('do.id order_id, do.order_sn, do.price, do.createtime, do.paystatus, do.paytime, u.fullname, u.mobile, d.title')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/documentOrder/index')]);


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

        M('document_order')->where('id', $id)->update($updatedata);
    }
}