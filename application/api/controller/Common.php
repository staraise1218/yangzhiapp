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
     * @param [type] $[type] [<类型 动态视频:dynamic_video 动态图片: dynamic_image, 邀约图片：invite_image>]
     * @return [type] [description]
     */
    public function uploadFile(){
        $type = I('type');

        if( ! in_array($type, array('head_pic'))) response_error('', '不被允许的类型');
        if(empty($_FILES)) response_error('文件不能为空');

        /************* 上传路径 ***************/        
        $uploadPath = UPLOAD_PATH.'files';
        if($type == 'head_pic') $uploadPath = UPLOAD_PATH.'head_pic';
        
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
        $type = I('type');

        if( ! in_array($type, array('ask_images', 'feedback_images'))) response_error('', '不被允许的类型');
        if(empty($_FILES)) response_error('文件不能为空');

        /************* 上传路径 ***************/        
        if($type == 'ask_images') $uploadPath = UPLOAD_PATH.'photo/ask';

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
}