<?php

namespace app\mobile\controller;

use think\Controller;
class Meeting extends Controller{
    
    public function detail(){
    	return $this->fetch();
    }
    
    public function enroll(){
    	return $this->fetch();
    }
}