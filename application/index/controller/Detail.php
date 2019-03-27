<?php
namespace app\index\controller;
use app\index\controller\Base;

class Detail extends Base
{
    public function index()
    {
         return $this->fetch();
    }
}
