<?php

namespace app\api\controller;

use think\Db;

class Document extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		$page = I('page');
		$keyword = I('keyword');
		$cat_id = I('cat_id');

		$where['is_delete'] = 0;
		if($keyword) $where['title'] = array('like', "%$keyword%");
		if($cat_id) $where['cat_id'] = $cat_id;

		$list = Db::name('document')
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
			->where('type', 'document')
			->field('id, title')
			->order('id desc')
			->select();

		response_success($list);
	}

	public function detail(){
		$id = I('id');
		$user_id = I('user_id');

		$info = Db::name('document')
			->where('id', $id)
			->where('is_delete', 0)
			->find();

		// 判断是否收藏
		$is_collect = Db::name('user_collect')
			->where('table_id', $id)
			->where('user_id', $user_id)
			->where('table_name', 'document')
			->count();
		$info['is_collect'] = $is_collect ? 1 : 0;
		$info['content'] = $info['content'] ? htmlspecialchars_decode($info['content']) : '';

		response_success($info);
	}

    /**
     * [addComment 添加评论]
     */
    public function addComment(){
        $data['document_id'] = I('document_id');
        $data['speaker_id'] = I('speaker_id');
        $data['parent_id'] = I('parent_id', 0);
        $data['reply_user_id'] = I('reply_user_id', 0);
        $data['content'] = I('content');

        $data['add_time'] = time();

        if(M('document_comment')->insert($data)){
            response_success('', '操作成功');
        } else {
            response_error('', '操作失败');
        }
    }

    public function getComment(){
        $document_id = I('document_id');


        /*********** 获取评论 ************/
        $comments = M('document_comment')->alias('dc')
            ->join('users u', 'dc.speaker_id=u.user_id', 'left')
            ->where('dc.document_id', $document_id)
            ->field('u.head_pic, u.fullname, dc.id comment_id, speaker_id, dc.content, dc.add_time')
            ->order('dc.id desc')
            ->select();
        

        response_success($comments);
    }

    public function submitOrder(){
        $document_id = I('document_id');
        $user_id = I('user_id');

        // 检测数据是否存在
        $document = Db::name('document')
            ->where('id', $document_id)
            ->find();
        if(empty($document)) response_error('', '数据不存在');

        // 检测是否已购买
        $count = Db::name('document_order')
            ->where('user_id', $user_id)
            ->where('document_id', $document_id)
            ->count();
        if($count) response_error('', '您已购买');

        $order_sn = $this->generateOrderSn();
        $data = array(
            'document_id' => $document_id,
            'price' => $document['price'],
            'user_id' => $user_id,
            'order_sn' => $order_sn,
            'createtime' => time(),
        );

        if(Db::name('document_order')->insert($data)){
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
}