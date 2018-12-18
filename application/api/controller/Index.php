<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\GeographyLogic;

class Index extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		// 获取最新资讯
		$info = DB::name('article')
			->where('cat_id', 1)
			->where('is_open', 1)
			->order('article_id desc')
			->field('article_id, title')
			->find();
		$result['info'] = $info;

		response_success($result);
	}

}