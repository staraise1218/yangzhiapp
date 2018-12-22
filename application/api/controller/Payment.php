<?php

namespace app\api\controller;
use think\Db;
use think\Config;
use app\api\logic\AlipayLogic;

class Payment extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	// 选择支付方式去支付
	public function topay(){
		$order_sn = I('order_sn');
		$paymentMethod = I('paymentMethod');

		/********* 判断订单信息 **************/
		$order = Db::name('video_order')->where('order_sn', $order_sn)->find();
		if(empty($order)) response_error('', '该订单不存在');
		if($order['paystatus'] == 1) response_error('', '该订单已支付');

		$total_amount = '0.01';

		/************** 获取订单签名字符串 **************/
		if($paymentMethod == 'alipay'){
			$notify_url = 'http://meiliyue.caapa.org/index.php/api/vip/callback?paymentMethod=alipay';
			$AlipayLogic = new AlipayLogic($notify_url);
			$orderStr = $AlipayLogic->generateOrderStr($order_sn, $total_amount, '购买视频', '购买视频');
			return $orderStr;
		}
	}

	// 购买vip后的支付回调接口
	public function Callback(){
		$paymentMethod = input('post.paymentMethod');
		$order_sn = input('post.out_trade_no');
		$trade_status = input('post.trade_status');

		if($paymentMethod == 'alipay'){
			$AlipayLogic = new AlipayLogic();
			//验签失败

			/*$param = $_POST;
			$param['fund_bill_list'] = html_entity_decode($param['fund_bill_list']);
			$_POST = $param;
			if( ! $AlipayLogic->checkSign()) die('error');*/
		}
		
		
		
		$order = Db::name('video_order')->where('order_sn', $order_sn)->find();
		if(empty($order)) goto finish;
		if($order['paystatus'] == 1) goto finish;
		// 回调后的业务流程
		if($trade_status == 'TRADE_SUCCESS'){
			$this->callbackLogic($order_sn);
		}

		finish:
		echo 'success';
	}

	public function IOSCallback(){
		$user_id = I('user_id');
		$level = I('level');

		// 计算到期日期
		$user = Db::name('users')->where('user_id', $user_id)->field('vip_expire_date')->find();
		$old_date = $user['vip_expire_date'] ? $user['vip_expire_date'] : date('Y-m-d');
		$enum = Config::load(APP_PATH.'enum.php', ture);
		$vip_config = $enum['vip'];
		$num = $vip_config[$level]['num'];
		$unit = $vip_config[$level]['unit'];
		$expire_date = date('Y-m-d', strtotime('+'.$num.$unit, strtotime($old_date)));

		Db::name('users')->where('user_id', $user_id)->update(array('level'=>$level, 'vip_expire_date'=>$expire_date));

		switch ($level) {
			case '1':
				$amount = '0.01';
				break;
			
			case '2':
				$amount = '0.01';
				break;
			
			case '3':
				$amount = '0.01';
				break;
			
			case '4':
				$amount = '0.01';
				break;
		}
		// ios没走下单接口，这里支付成功记录一下
		$order_sn = $this->generateOrderno();
		$data = array(
			'order_sn' => $order_sn,
			'user_id' => $user_id,
			'level' => $level,
			'createtime' => time(),
			'amount' => $amount,
		);
		Db::name('video_order')->insert($data);

		response_success();
	}

	private function callbackLogic($order_sn){

		Db::name('video_order')->where('order_sn', $order_sn)->update(array('paystatus'=>'1', 'paytime'=>time()));
		// 计算到期日期
		
	}

	private function generateOrderno(){
		$order_sn = date('YmdHis').mt_rand(1000, 9999);

		$count = Db::name('video_order')->where('order_sn', $order_sn)->count();

		if($count) $this->generateOrderno();
		return $order_sn;
	}
}