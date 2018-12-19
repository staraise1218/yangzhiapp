<?php

namespace app\mobile\controller;

use think\Controller;

class Pig extends Controller{
    
    public function detail(){
    	return $this->fetch();
    }
}