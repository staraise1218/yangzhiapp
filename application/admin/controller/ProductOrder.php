<?php

namespace app\admin\controller;

use think\Page;
use think\Paginator;

class ProductOrder extends Base {

    public function index(){
        $page = I('page', 1);
       
        $list = M('product_order')->alias('po')
            ->join('product d', 'po.product_id=d.id')
            ->join('users u', 'po.user_id=u.user_id')
            ->order('po.id desc')
            ->field('po.id order_id, po.order_sn, po.price, po.createtime, po.paystatus, po.paytime, u.fullname, u.mobile, d.title')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/productOrder/index')]);


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

        M('product_order')->where('id', $id)->update($updatedata);
    }
}