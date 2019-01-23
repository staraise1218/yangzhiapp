<?php

namespace app\api\controller;

use think\Db;

class Product extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		$page = I('page');
		$keyword = I('keyword');

		$where['is_delete'] = 0;
		if($keyword) $where['title'] = array('like', "%$keyword%");

		$list = Db::name('product')
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

	public function detail(){
		$id = I('id');
		$user_id = I('user_id');

		$info = Db::name('product')
			->where('id', $id)
			->where('is_delete', 0)
			->find();
p($info);
		$info['content'] = $info['content'] ? htmlspecialchars_decode($info['content']) : '';

		response_success($info);
	}

    public function submitOrder(){
        $product_id = I('product_id');
        $user_id = I('user_id');

        // 检测数据是否存在
        $product = Db::name('product')
            ->where('id', $product_id)
            ->find();
        if(empty($product)) response_error('', '数据不存在');

        // 检测是否已购买
        $count = Db::name('product_order')
            ->where('user_id', $user_id)
            ->where('product_id', $product_id)
            ->count();
        if($count) response_error('', '您已购买');

        $order_sn = $this->generateOrderSn();
        $data = array(
            'product_id' => $product_id,
            'price' => $product['price'],
            'user_id' => $user_id,
            'order_sn' => $order_sn,
            'createtime' => time(),
        );

        if(Db::name('product_order')->insert($data)){
            $resultData = array(
                'order_sn' => $order_sn,
            );
            response_success($resultData, '下单成功');
        } else {
            response_error('', '下单失败');
        }
    }
}