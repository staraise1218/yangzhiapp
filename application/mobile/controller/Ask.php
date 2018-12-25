<?php

namespace app\mobile\controller;

use think\Controller;

class Ask extends Controller{
    
    public function about(){
    	return $this->fetch();
    }

    public function detail(){
    	return $this->fetch();
    }

    public function comment(){
    	return $this->fetch();
    }
}