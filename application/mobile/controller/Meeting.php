<?php

namespace app\mobile\controller;

use think\Controller;
class Meeting extends Controller{
    
    public function enroll(){
    	return $this->fetch();
    }
    
}