<?php

namespace app\mobile\controller;

use think\Controller;

class Product extends Controller{
    
    public function detail(){
    	return $this->fetch();
    }
}