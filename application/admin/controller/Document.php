<?php

namespace app\admin\controller;

use think\Page;
use think\Paginator;

class Document extends Base {

    public function index(){
        $page = I('page', 1);
        
        $where = "is_delete = 0";
        $keywords = trim(I('keywords'));
        $keywords && $where.=" and title like '%$keywords%' ";
       
        $list = M('document')
            ->where($where)
            ->order('id desc')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/document/index')]);


        $this->assign('list',$list);// 赋值数据集
        
        return $this->fetch();
    }

    public function add(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            $data['createtime'] = time();
            if(M('document')->insert($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }

        
        return $this->fetch();
    }

    public function edit(){
        if($this->request->isPost()){
            $data = I('post.');
            if(trim($data['title']) == '') $this->ajaxReturn(['status' => 0, 'msg' => '参数错误', 'result' => ['title' =>'标题不能为空']]);

            $id = $data['id'];

            if(M('document')->where('id', $id)->save($data)){
                $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
            } else {
                $this->ajaxReturn(['status' => -1, 'msg' => '操作失败']);
            }
        }
        $id = I('id');
        $info = M('document')->where('id', $id)->find();

        $this->assign('info', $info);
        $this->assign('categoryList', $categoryList);
        return $this->fetch();
    }

    public function del(){
        $id = I('id');

        if(false !== M('document')->where('id', $id)->update(array('is_delete'=>1))){
            $this->ajaxReturn(['status' => 1, 'msg' => '操作成功']);
        } else {
            $this->ajaxReturn(['status' => 0, 'msg' => '操作失败']);
        }
    }

    // 文档订单
    public function orderList(){
        $page = I('page', 1);

        $list = M('document_order')->alias('do')
            ->join('document d', 'do.document_id=d.id')
            ->join('users u', 'do.user_id=u.user_id')
            ->order('do.id desc')
            ->paginate(20, false, ['page'=>$page, 'path'=>U('admin/document/orderList')]);

        $this->assign('list',$list);
        
        return $this->fetch();
    }
}