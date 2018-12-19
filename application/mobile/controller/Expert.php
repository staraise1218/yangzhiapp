<?php

namespace app\mobile\controller;

use think\Controller;

class Expert extends Controller{
    
    public function detail(){
    	return $this->fetch();
    }

    public function ask(){
    	return $this->fetch();
    }

    public function moreAsk(){
    	return $this->fetch();
    }
}