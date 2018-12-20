<?php

namespace app\api\controller;

use think\Db;

class Video extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		$keyword = I('keyword');
		$cat_id = I('cat_id');

		$where['is_delete'] = 0;
		if($keyword) $where['keyword'] = array('title', array('like', "'%$keyword%'"));
		if($cat_id) $where['cat_id'] = $cat_id;

		$list = Db::name('video')
			->where($where)
			->limit(10)
			->page($page)
			->field('id, title, thumb, tag, description')
			->order('id desc')
			->select();
		if(is_array($list) && !empty($list)){
			foreach ($list as &$item) {
				$item['tag'] = explode(',', rtrim($item['tag'], ','));
			}
		}

		response_success($list);
	}

	public function category(){
		$list = Db::name('category')
			->where('type', 'video')
			->field('id, title')
			->order('id desc')
			->select();

		response_success($list);
	}

	public function detail(){
		$id = I('id');
        $user_id = I('user_id');

		$info = Db::name('video')
			->where('id', $id)
			->where('is_delete', 0)
			->find();

        // 查看是否收藏
        $count = Db::name('user_collect')
            ->where('user_id', $user_id)
            ->where('table_id', $id)
            ->where('table_name', 'video')
            ->count();

        $info['is_collect'] = $count ? 1 : 0;
        $info['buyed_count'] = 0;

		response_success($info);
	}

    /**
     * [addComment 添加评论]
     */
    public function addComment(){
        $data['video_id'] = I('video_id');
        $data['speaker_id'] = I('speaker_id');
        $data['parent_id'] = I('parent_id', 0);
        $data['reply_user_id'] = I('reply_user_id', 0);
        $data['content'] = I('content');

        $data['add_time'] = time();

        if(M('video_comment')->insert($data)){
            response_success('', '操作成功');
        } else {
            response_error('', '操作失败');
        }
    }

    public function getComment(){
        $video_id = I('video_id');


        /*********** 获取评论 ************/
        $comments = M('video_comment')->alias('vc')
            ->join('users u1', 'dc.speaker_id=u1.user_id', 'left')
            ->join('users u2', 'dc.reply_user_id=u2.user_id', 'left')
            ->where('video_id', $video_id)
            ->field('u1.head_pic, u1.fullname, dc.id comment_id, speaker_id, dc.content, dc.add_time, u2.fullname reply_fullname, dc.parent_id')
            ->order('dc.id desc')
            ->select();
        
        $new_comments = array();
        if(is_array($comments) && !empty($comments)){
            foreach ($comments as $item) {
                $new_comments[$item['comment_id']] = $item;
            }
        }
        if(!empty($new_comments)){
            $new_comments = $this->_tree($new_comments);
        }

        response_success($new_comments);
    }

    public function submitOrder(){
        $video_id = I('video_id');
        $user_id = I('user_id');

        // 检测数据是否存在
        $video = Db::name('video')
            ->where('id', $video_id)
            ->find();
        if(empty($video)) response_error('', '数据不存在');

        // 检测是否已购买
        $count = Db::name('video_order')
            ->where('user_id', $user_id)
            ->where('video_id', $video_id)
            ->count();
        if($count) response_error('', '您已购买');

        $order_sn = $this->generateOrderSn();
        $data = array(
            'video_id' => $video_id,
            'price' => $video['price'],
            'user_id' => $user_id,
            'order_sn' => $order_sn,
            'createtime' => time(),
        );

        if(Db::name('video_order')->insert($data)){
            $resultData = array(
                'order_sn' => $order_sn,
            );
            response_success($resultData, '下单成功');
        } else {
            response_error('', '下单失败');
        }
    }

   public function generateOrderSn(){
        $order_sn = date('YmdHis').mt_rand(1000, 9999);

        $count = Db::name('video_order')->where('order_sn', $order_sn)->count();
        if($count) $this->generateOrderSn();

        return $order_sn;
    }

    /**
     * 生成目录树结构
     */
    private function _tree($data){

        $tree = array();
        foreach ($data as $item) {
               if(isset($data[$item['parent_id']])){
                  $data[$item['parent_id']]['sub'][] = &$data[$item['comment_id']];
               } else {
                  $tree[] = &$data[$item['comment_id']];
               }
        }

        return $tree;
    }
}