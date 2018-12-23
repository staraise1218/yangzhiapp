<?php

namespace app\mobile\controller;

use think\Controller;

class Video extends Controller{
    
    public function detail(){
    	return $this->fetch();
    }
}