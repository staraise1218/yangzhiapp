<?php

namespace app\mobile\controller;

use think\Controller;

class Document extends Controller{
    
    public function detail(){
    	return $this->fetch();
    }
}