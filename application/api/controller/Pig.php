<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\GeographyLogic;

class Pig extends Base {

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

		$list = Db::name('pig')
			->where($where)
			->limit(10)
			->page($page)
			->field('id, title, thumb, description')
			->order('id desc')
			->select();

		response_success($list);
	}

	public function category(){
		$list = Db::name('category')
			->where('type', 'pig')
			->field('id, title')
			->order('id desc')
			->select();

		response_success($list);
	}

	public function detail(){
		$id = I('id');

		$info = Db::name('pig')
			->where('id', $id)
			->where('is_delete', 0)
			->find();

		response_success($info);
	}

}