<?php

namespace app\api\controller;

use think\Db;

class Document extends Base {

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

		$list = Db::name('document')
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

	public function category(){
		$list = Db::name('category')
			->where('type', 'document')
			->field('id, title')
			->order('id desc')
			->select();

		response_success($list);
	}

	public function detail(){
		$id = I('id');

		$info = Db::name('document')
			->where('id', $id)
			->where('is_delete', 0)
			->find();

		response_success($info);
	}

    /**
     * [addComment 添加评论]
     */
    public function addComment(){
        $data['document_id'] = I('document_id');
        $data['speaker_id'] = I('speaker_id');
        $data['parent_id'] = I('parent_id', 0);
        $data['reply_user_id'] = I('reply_user_id', 0);
        $data['content'] = I('content');

        $data['add_time'] = time();

        if(M('document_comment')->insert($data)){
            response_success('', '操作成功');
        } else {
            response_error('', '操作失败');
        }
    }

    public function getComment(){
        $document_id = I('document_id');


        /*********** 获取评论 ************/
        $comments = M('document_comment')->alias('dc')
            ->join('users u1', 'dc.speaker_id=u1.user_id', 'left')
            ->join('users u2', 'dc.reply_user_id=u2.user_id', 'left')
            ->where('document_id', $document_id)
            ->field('u1.head_pic, u1.fullname, dc.id comment_id, speaker_id, dc.content, dc.add_time, u2.fullname reply_fullname, dc.parent_id')
            ->order('dc.id desc')
            ->select();
        
        $new_comments = array();
        if(is_array($comments) && !empty($comments)){
            foreach ($comments as $item) {
                $new_comments[$item['comment_id']] = $item;
            }
        }
        if(!empty($new_comments)){
            $new_comments = $this->_tree($new_comments);
        }

        response_success($new_comments);
    }

    /**
     * 生成目录树结构
     */
    private function _tree($data){

        $tree = array();
        foreach ($data as $item) {
               if(isset($data[$item['parent_id']])){
                  $data[$item['parent_id']]['sub'][] = &$data[$item['comment_id']];
               } else {
                  $tree[] = &$data[$item['comment_id']];
               }
        }

        return $tree;
    }
}