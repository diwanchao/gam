<?php
namespace app\index\controller;
use app\index\controller\Base;
use think\Controller;

class Result extends Base
{
    public function index()
    {
         return $this->fetch();
    }
}
