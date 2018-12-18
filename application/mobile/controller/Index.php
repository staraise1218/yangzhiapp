<?php

namespace app\mobile\controller;

use think\Controller;
class Index extends Controller{
    
    public function index(){      

       $this->redirect(U('admin/Index/index'));
    }
    
}