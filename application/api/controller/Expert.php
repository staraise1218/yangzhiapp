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
     * type hot热度 recommend 推荐 
     */
    public function index(){
        $page = I('page', 1);
        $type = I('type', 'hot');

        $where['is_lock'] = 0;
        $where['group_id'] = 2;
        $order = 'user_id desc';


        if($type == 'recommend') $where['is_recommend'] = 1;
        if($type == 'hot') $order = 'questionNum desc, user_id desc';

        $list = Db::name('users')->alias('u')
            ->join('expert e', 'e.user_id=u.user_id', 'left')
            ->where($where)
            ->limit(10)
            ->page($page)
            ->order($order)
            ->field('u.user_id, fullname, head_pic, description')
            ->select();

        response_success($list);
    }

    // 专家详情
    public function detail(){
        $expert_id = I('expert_id');
        $user_id = I('user_id');

        // 专家详情
        $info = Db::name('users')->alias('u')
            ->join('expert e', 'e.user_id=u.user_id', 'left')
            ->where('is_lock', 0)
            ->where('u.user_id', $expert_id)
            ->field('u.user_id, fullname, head_pic, e.description, e.detail')
            ->find();

        if($info) $info['answerCount'] = 0;

        // 判断是否收藏
        $is_collect = Db::name('user_collect')
            ->where('table_id', $expert_id)
            ->where('user_id', $user_id)
            ->where('table_name', 'document')
            ->count();
        $info['is_collect'] = $is_collect ? 1 : 0;


        
        // 专家的问答
        $askList = Db::name('ask')->alias('a')
            ->join('users u', 'a.user_id=u.user_id', 'left')
            ->where('expert_id', $expert_id)
            ->field('u.head_pic, u.fullname, a.id ask_id, a.createtime, a.content')
            ->order('id desc')
            ->limit(2)
            ->select();

        

        // 专家评分
        $comment_score = Db::name('ask_comment')->where('expert_id', $expert_id)->avg('score');
        $info['comment_score'] = $comment_score;

        $result['info'] = $info;
        $result['askList'] =$askList;
        response_success($result);
    }
}