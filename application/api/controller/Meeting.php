<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use app\api\logic\GeographyLogic;

class Meeting extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		$keyword = I('keyword');

		if($keyword) $where['keyword'] = array('title', array('like', "'%$keyword%'"));

		$where['is_delete'] = 0;
		$list = Db::name('meeting')
			->where($where)
			->limit(10)
			->page($page)
			->field('id, title, address, createtime')
			->order('id desc')
			->select();

		if(is_array($list) && !empty($list)){
			foreach ($list as &$item) {
				$item['enrolled'] = 0;
			}
		}

		response_success($list);
	}

	public function detail(){
		$id = I('id');

		$info = Db::name('meeting')
			->where('id', $id)
			->where('is_delete', 0)
			->find();

		if($info){
			$info['enrolled'] = 0;
			$info['collected'] = 0;
		}

		response_success($info);
	}

}