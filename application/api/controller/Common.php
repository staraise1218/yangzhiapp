<?php

namespace app\api\controller;

use think\Db;
use app\api\logic\FileLogic;
use think\Log;

class Common extends Base {

	public function __construct(){
		// 设置所有方法的默认请求方式
		$this->method = 'POST';

		parent::__construct();
	}

    /**
     * [fileUpload 上传单文件]
     * @param   $[file] [<文件名>]
     * @param [type] $[type] [<类型 
     * @return [type] [description]
     */
    public function uploadFile(){

        if(empty($_FILES)) response_error('文件不能为空');

        /************* 上传路径 ***************/        
        $uploadPath = UPLOAD_PATH.'singleImage';
        
        $FileLogic = new FileLogic();
        $result = $FileLogic->uploadSingleFile('file', $uploadPath);
        if($result['status'] == '1'){
            $filepath = $result['fullPath'];
            response_success(array('filepath'=>$filepath));
        } else {
            response_error('', '文件上传失败');
        }
    }

    // 多文件上传
    // type ask_images
    public function uploadMultiFile(){

        if(empty($_FILES)) response_error('文件不能为空');

        /************* 上传路径 ***************/        
        $uploadPath = UPLOAD_PATH.'multiImages';

        $FileLogic = new FileLogic();
        $result = $FileLogic->uploadMultiFile('file', $uploadPath);
        if($result['status'] == '1'){
            $filepath = $result['image'];

            response_success(array('filepath'=>$filepath));
        } else {
            response_error('', '文件上传失败');
        }

    }

    public function writeLog(){
        $content = I('content');

        Log::write($content, 'shantui', true);
        response_success();
    }

    /**
     * [collect 收藏]
     * @param table_name [document 在线文档]
     * @return [type] [description]
     */
    public function collect(){
        $data['user_id'] = I('user_id');
        $data['table_id'] = I('table_id');
        $data['table_name'] = I('table_name');

        if(M('user_collect')->where($data)->count()) response_success('已收藏');

        if( false !== M('user_collect')->insert($data)){
            response_success('', '收藏成功');
        } else {
            response_error('', '收藏失败');
        }
    }

    // 取消收藏
    public function cancelCollect(){
        $id = I('id');
        $user_id = I('user_id');

        if(false !== M('user_collect')
            ->where('id', $id)
            ->where('user_id',$user_id)
            ->delete()){
            response_success('', '取消成功');
        } else {
            response_error('', '取消失败');
        }
    }
}