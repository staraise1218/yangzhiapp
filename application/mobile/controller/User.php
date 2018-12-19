<?php

namespace app\mobile\controller;

use think\Controller;

class User extends Controller{
    
    public function about(){
    	return $this->fetch();
    }
}