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
		$page = I('page', 1);

		if($page <= 0) $page = 1;

		$where['is_delete'] = 0;
		if($keyword) $where['title'] = array('like', "%$keyword%");
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
		$list = Db::name('pig_category')
			->field('id, name, parent_id')
			->order('id desc')
			->select();

		$data = array();
		if(is_array($list) && !empty($list)){
			foreach ($list as $item) {
				$data[$item['id']] = $item;
			}
		}

		$data = $this->_tree($data);

		response_success($data);
	}

	public function detail(){
		$id = I('id');

		$info = Db::name('pig')
			->where('id', $id)
			->where('is_delete', 0)
			->find();

		
		$info['content'] = $info['content'] ? htmlspecialchars_decode($info['content']) : '';

		response_success($info);
	}

    /**
     * 生成目录树结构
     */
    private function _tree($data){

        $tree = array();
        foreach ($data as $item) {
               if(isset($data[$item['parent_id']])){
                  $data[$item['parent_id']]['sub'][] = &$data[$item['id']];
               } else {
                  $tree[] = &$data[$item['id']];
               }
        }

        return $tree;
    }

}