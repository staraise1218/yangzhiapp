<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\SmsLogic;
use app\api\logic\FileLogic;
use think\Image;

class User extends Base {

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
        $user_id = I('user_id');

        /************** 是否有未读消息 *************/
        $message_read = Db::name('message')->alias('m')
            ->join('user_message um', 'um.message_id=m.message_id', 'left')
            ->where(function ($query) use ($user_id){
                $query->where(array('user_id'=>$user_id, 'type'=>'0', 'status'=>'0'));
            })
            ->whereOr(function($query) use ($user_id){
                $query->where('type', '1')->where('status', null);
            })
            ->count();
        $result['message_read'] = $message_read ? 1 : 0;

        /************** 是否有未读评论 *************/
        $comment_read = Db::name('dynamics_comment')->where(array('reply_user_id'=>$user_id, 'is_read'=>0))->count();
        $result['comment_read'] = $comment_read ? 1 : 0;

         /************** 最近来访 5 个头像 *************/
         $visitor = Db::name('user_visitor')->alias('uv')
            ->join('users u', 'uv.user_id=u.user_id','left')
            ->where('to_user_id', $user_id)
            ->limit(5)
            ->order('id desc')
            ->field('head_pic, uv.is_read')
            ->select();
        $result['visitor'] = $visitor;

        response_success($result);
    }

    /**
     * [getUserInfo 获取用户基本资料]
     * @param  [type] $user_id [description]
     * @return [type]          [description]
     */
    public function getUserInfo($user_id){
    	$userInfo = M('users')->where("user_id", $user_id)->find();
        unset($userInfo['password']);
       
        response_success($userInfo);
    }

    /**
     * [changeInfo 编辑个人资料]
     * @return [type] [description]
     */
    public function changeInfo(){
        $user_id = I('user_id');
        $field = I('field');
        $fieldValue = I('fieldValue');

        if(M('users')->where('user_id', $user_id)->setField($field, $fieldValue) !== false){
            response_success('', '操作成功');
        } else {
            response_error('', '操作失败');
        }
    }

    // 意见反馈
    public function feedback(){
        $data['user_id'] = I('user_id');
        $data['content'] = I('content');
        $data['image'] = I('image');

        $data['createtime'] = time();

        if(M('feedback')->insert($data)){
            response_success('', '操作成功');
        } else {
            response_error('', '操作失败');
        }
    }

    // 我购买的视频
    public function myVideo(){
        $user_id = I('user_id');
        $page = I('page', 1);

        $list = Db::name('video_order')->alias('vo')
            ->join('video v', 'vo.video_id=v.id', 'left')
            ->where('vo.user_id', $user_id)
            ->where('paystatus', 1)
            ->field('v.title, v.description, v.thumb, v.tag')
            ->page($page)
            ->limit(10)
            ->select();

        if(is_array($list) && !empty($list)){
            foreach ($list as &$item) {
                if($item['tag']) $item['tag'] = explode(',', rtrim($item['tag'] , ','));
            }
        }
        response_success($list);
    }

    // 我的收藏
    // type document, video, expert
    public function myCollect(){
        $user_id = I('user_id');
        $type = I('type', 'document');
        $page = I('page', 1);

        $result = array();
        if($type == 'document') $result = $this->myCollectDocument($user_id, $page);
        if($type == 'video') $result = $this->myCollectVideo($user_id, $page);
        if($type == 'expert') $result = $this->myCollectExpert($user_id, $page);

        response_success ($result);
    }

    // 我收藏的文档
    private function myCollectDocument($user_id, $page){
        $list = Db::name('user_collect')->alias('uc')
            ->join('document d', 'uc.table_id=d.id', 'left')
            ->where('uc.user_id', $user_id)
            ->where('uc.table_name', 'document')
            ->field('d.id, d.title, d.thumb, d.tag, d.description')
            ->page($page)
            ->limit(10)
            ->select();

        if(is_array($list) && !empty($list)){
            foreach ($list as &$item) {
                if($item['tag']) $item['tag'] = explode(',', rtrim($item['tag'] , ','));
            }
        }
        return $list;
    }

    // 我收藏的文档
    private function myCollectVideo($user_id, $page){
        $list = Db::name('user_collect')->alias('uc')
            ->join('video v', 'uc.table_id=v.id', 'left')
            ->where('uc.user_id', $user_id)
            ->where('uc.table_name', 'video')
            ->field('v.id, v.title, v.thumb, v.tag, v.description')
            ->page($page)
            ->limit(10)
            ->select();

        if(is_array($list) && !empty($list)){
            foreach ($list as &$item) {
                if($item['tag']) $item['tag'] = explode(',', rtrim($item['tag'] , ','));
            }
        }
        return $list;
    }

    // 我收藏的文档
    private function myCollectExpert($user_id, $page){
        $list = Db::name('user_collect')->alias('uc')
            ->join('users u', 'uc.table_id=u.user_id', 'left')
            ->join('expert e', 'uc.table_id=e.user_id', 'left')
            ->where('uc.user_id', $user_id)
            ->where('uc.table_name', 'expert')
            ->field('u.user_id, fullname, head_pic, description')
            ->page($page)
            ->limit(10)
            ->select();

        if(is_array($list) && !empty($list)){
            foreach ($list as &$item) {
                if($item['tag']) $item['tag'] = explode(',', rtrim($item['tag'] , ','));
            }
        }
        return $list;
    }

    // 我的问答
    public function myAsk(){
        $user_id = I('user_id');
        $page = I('page', 1);

        $list = Db::name('ask')->alias('a')
            ->join('users u', 'a.expert_id=u.user_id')
            ->where('a.user_id', $user_id)
            ->field('a.user_id ask_id, a.expert_id, a.title, a.content, a.createtime, u.fullname')
            ->page($page)
            ->limit(10)
            ->order('a.id desc')
            ->select();

        response_success($list);
    }

    // 问答评价
    public function askComment(){
        $ask_id = I('ask_id');
        $expert_id = I('expert_id');
        $content = I('content');
        $score = I('score');

        $data = array(
            'ask_id' => $ask_id,
            'expert_id' => $expert_id,
            'content' => $content,
            'score' => $score,
            'add_time' => time(),
        );

        if(Db::name('ask_comment')->insert($data)){
            response_success('', '操作成功');
        } else {
            response_error('', '操作失败');
        }
    }

    // 我的消息
    public function message(){
        $user_id = I('user_id/d');
        $page = I('page/d', 1);

        $limit_start = ($page-1)*20;

        $message = Db::name('message')->alias('m')
            ->join('user_message um', 'um.message_id=m.message_id', 'left')
            ->where('user_id', $user_id)
            ->whereOr('m.type', 1)
            ->field('m.message_id, message, m.category, data, send_time, status')
            ->order('message_id desc')
            ->limit($limit_start, 20)
            ->select();

        if(!empty($message)){
            $now_date = strtotime(date('Y-m-d')); // 今日凌晨
            $mid_date = strtotime(date('Y-m-d 12:00:00')) ;// 今日中午

            foreach ($message as &$item) {
                if($item['send_time'] < $now_date) $item['send_time'] = date('Y-m-d', $item['send_time']);
                if($item['send_time'] > $now_date && $item['send_time'] < $mid_date) $item['send_time'] = '上午'.date('H:i', $item['send_time']);
                if($item['send_time'] > $mid_date) $item['send_time'] = '下午'.date('H:i', $item['send_time']);

                if($item['data']) $item['data'] = unserialize($item['data']);
            }
        }

        response_success($message);
    }
}