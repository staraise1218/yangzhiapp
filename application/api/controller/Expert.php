<?php

namespace app\api\controller;
use think\Db;

class Expert extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

    /**
     * [index 我的 页面 需要的接口]
     * @return [type] [description]
     */
    public function index(){
        $page = I('page', 1);

        $list = Db::name('users')->alias('u')
            ->join('expert e', 'e.user_id=u.user_id', 'left')
            ->where('is_lock', 0)
            ->where('group_id', 2)
            ->limit(10)
            ->page($page)
            ->field('u.user_id, fullname, head_pic, description')
            ->select();

        response_success($list);
    }

    // 专家详情
    public function detail(){
        $expert_id = I('expert_id');

        // 专家详情
        $info = Db::name('users')->alias('u')
            ->join('expert e', 'e.user_id=u.user_id', 'left')
            ->where('is_lock', 0)
            ->where('u.user_id', $expert_id)
            ->field('u.user_id, fullname, head_pic, e.description, e.detail')
            ->find();

        if($info) $info['answerCount'] = 0;
        $result['info'] = $info;

        // 专家的问答
        $askList = Db::name('ask')->alias('a')
            ->join('users u', 'a.user_id=u.user_id', 'left')
            ->where('expert_id', $expert_id)
            ->field('u.head_pic, u.fullname, a.id ask_id, a.createtime, a.content')
            ->order('id desc')
            ->limit(2)
            ->select();

        $result['askList'] =$askList;

        response_success($result);
    }
}