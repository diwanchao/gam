<?php
namespace app\index\controller;
use app\index\controller\Base;

class Result extends Base
{
    public function index()
    {
         return $this->fetch();
    }
}
