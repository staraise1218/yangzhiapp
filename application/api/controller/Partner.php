<?php

namespace app\api\controller;

use think\Db;

class Partner extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		$page = I('page', 1);
	
		// 合作企业
		$partner = Db::name('partner')
			->order('id desc')
			->limit(10)
			->page($page)
			->order('id desc')
			->select();

		$result['partner'] = $partner;

		response_success($result);
	}

}