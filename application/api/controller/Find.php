<?php

namespace app\api\controller;

use think\Db;

class Find extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

	public function index(){
		$user_id = I('user_id');

		// 专家
		$expertList = Db::name('users')->alias('u')
            ->join('expert e', 'e.user_id=u.user_id', 'left')
            ->where('is_lock', 0)
            ->where('group_id', 2)
            ->limit(2)
            ->order('user_id desc')
            ->field('u.user_id, fullname, head_pic, description')
            ->select();
        $result['expertList'] = $expertList;

        // 会议培训
        $meetingList = Db::name('meeting')
			->where('is_delete', 0)
			->where('is_open', 1)
			->limit(2)
			->field('id, title, address, createtime')
			->order('id desc')
			->select();
        $result['meetingList'] = $meetingList;
        // 猪场风云
        $pigList = Db::name('pig')
			->where('is_delete', 0)
			->limit(2)
			->field('id, title, thumb, description')
			->order('id desc')
			->select();
		$result['pigList'] =$pigList;

		// 在线资讯
		$documentList = Db::name('document')
			->where('is_delete', 0)
			->limit(2)
			->field('id, title, thumb, tag, description, "document" as type')
			->order('id desc')
			->select();
		if(is_array($documentList) && !empty($documentList)){
			foreach ($documentList as &$item) {
				$item['tag'] = explode(',', rtrim($item['tag'], ','));
			}
		}

		$videoList = Db::name('video')
			->where('is_delete', 0)
			->limit(2)
			->field('id, title, thumb, tag, price, description, "video" as type')
			->order('id desc')
			->select();
		if(is_array($videoList) && !empty($videoList)){
			foreach ($videoList as &$item) {
				$item['tag'] = explode(',', rtrim($item['tag'], ','));
			}
		}

		$result['zixunList'] = array_merge($documentList, $videoList);
		

		response_success($result);
	}
}