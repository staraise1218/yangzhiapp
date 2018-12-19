<?php

namespace app\mobile\controller;

use think\Controller;

class Document extends Controller{
    
    public function detal(){
    	return $this->fetch();
    }
    
    public function enroll(){
    	return $this->fetch();
    }
}