<?php

namespace app\api\controller;
use think\Db;

class Ask extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}


    // 专家的问答列表
    public function askList(){
        $expert_id = I('expert_id');
        $page = I('page', 1);

        $list = Db::name('ask')->alias('a')
            ->join('users u', 'a.user_id=u.user_id', 'left')
            ->where('expert_id', $expert_id)
            ->order('a.id desc')
            ->field('a.id ask_id, a.title, a.createtime, a.content, u.fullname, u.head_pic')
            ->limit(10)
            ->page($page)
            ->select();

        if(is_array($list) && !empty($list)){
            foreach ($list as &$item) {
                if(!empty($item['images'])) $item['images'] = json_decode($item['images']);
            }
        }

        response_success($list);
    }

    // 提问
    public function ask(){
        $user_id = I('user_id');
        $expert_id = I('expert_id');
        $title = I('title');
        $content = I('content');
        $images = I('images');

        $data = array(
            'user_id' => $user_id,
            'expert_id' => $expert_id,
            'title' => $title,
            'content' => $content,
            'images' => json_encode(json_decode(html_entity_decode($images), true)),
            'createtime' => time(),
        );

        if(Db::name('ask')->insert($data)){
            response_success('', '操作成功');

            // 专家问题数量加1
            Db::name('users')->where('user_id', $user_id)->setInc('questionNum');
        } else {
            response_error('', '操作失敗');
        }
    }
    // 回答/追问
    public function answer(){
        $ask_id = I('ask_id');
        $user_id = I('user_id');
        $content = I('content');

        $data = array(
            'ask_id' => $ask_id,
            'user_id' => $user_id,
            'content' => $content,
            'createtime' => time(),
        );

        if(Db::name('ask_answer')->insert($data)){
            response_success('', '操作成功');
        } else {
            response_error('', '操作失败');
        }
    }

    public function detail(){
        $id = I('id');

        $info = Db::name('ask')->alias('a')
            ->join('users u', 'a.user_id=u.user_id', 'left')
            ->where('id', $id)
            ->field('u.user_id, u.head_pic, u.fullname, a.expert_id, a.title, a.content, a.images, a.createtime')
            ->find();

        if($info && $info['images'] != '') $info['images'] = json_decode($info['images']);

        $result['info'] = $info;

        // 获取回答列表
        $answerList = Db::name('ask_answer')->alias('aa')
            ->join('users u', 'aa.user_id=u.user_id', 'left')
            ->where('ask_id', $id)
            ->field('u.head_pic, u.fullname, aa.content, aa.createtime')
            ->order('aa.id desc')
            ->select();

        $result['answerList'] = $answerList;

        response_success($result);
    }
}