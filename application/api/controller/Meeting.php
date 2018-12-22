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
		$user_id = I('user_id');
		$keyword = I('keyword');
		$page = I('page', 1);

		
		if($keyword) $where['title'] = array('like', "%$keyword%");

		$where['is_delete'] = 0;
		$where['is_open'] = 1;
		$list = Db::name('meeting')
			->where($where)
			->limit(10)
			->page($page)
			->field('id, title, address, createtime')
			->order('id desc')
			->select();

		if(is_array($list) && !empty($list)){
			foreach ($list as &$item) {
				$is_enroll = Db::name('meeting_enroll')->where(array('user_id'=>$user_id, 'meeting_id'=>$item['id']));
				$item['enrolled'] = $is_enroll ? 1 : 0;
			}
		}

		response_success($list);
	}

	public function detail(){
		$id = I('id');
		$user_id = I('user_id');

		$info = Db::name('meeting')
			->where('id', $id)
			->where('is_delete', 0)
			->find();

		if($info){
			
			// 查看是否已经报名
			$enrolled = Db::name('meeting_enroll')
				->where('user_id', $user_id)
				->where('meeting_id', $id)
				->count();
			$info['enrolled'] = $enrolled > 0 ? 1 : 0;
			$info['collected'] = 0;
		}

		response_success($info);
	}
	// 会议报名
    public function enroll(){
    	$user_id = I('user_id');
    	$meeting_id = I('meeting_id');
		$company_name = I('company_name');
		$company_address = I('company_address');
		$fullname = I('fullname');
		$phone = I('phone');
		$email = I('email');
		$position = I('position');
		$profession = I('profession');

		$data = array(
			'user_id' => $user_id,
			'meeting_id' => $meeting_id,
			'company_name' => $company_name,
			'company_address' => $company_address,
			'fullname' => $fullname,
			'phone' => $phone,
			'email' => $email,
			'position' => $position,
			'profession' => $profession,
		);
		$data['add_time'] = time();

		if(Db::name('meeting_enroll')->insert($data)){
			response_success('', '报名成功');
		} else {
			response_error('', '报名失败');
		}
    }
}