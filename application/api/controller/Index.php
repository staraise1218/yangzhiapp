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
		// 获取banner
		$bannerList = Db::name('ad')
			->where('pid', 1)
			->where('enabled', 1)
			->field('ad_name, ad_link, ad_code')
			->order('orderby desc, ad_id desc')
			->select();

		$result['bannerList'] = $bannerList;
		// 获取最新资讯
		$info = DB::name('article')
			->where('cat_id', 1)
			->where('is_open', 1)
			->order('article_id desc')
			->field('article_id, title')
			->find();
		$result['info'] = $info;

		// 产品展示
		$prodcut = Db::name('document')->field('id, title, thumb, tag, description, createtime, "document" as type')
			->union(function($query){
				$query->name('video')->field('id, title, thumb, tag, description, createtime, "video" as type');
			})
			->where('is_delete', 0)
			->where('is_recommend', 1)
			->order('createtime desc')
			->limit(2)
			->select();
		if(is_array($prodcut) && !empty($prodcut)){
			foreach ($prodcut as &$item) {
				$item['tag'] = $item['tag'] ? explode(',', $item['tag']) : array();
			}
		}

		$result['prodcut'] = $prodcut;

		// 合作企业
		$partner = Db::name('partner')
			->order('id desc')
			->limit(2)
			->order('id desc')
			->select();

		$result['partner'] = $partner;

		response_success($result);
	}

}