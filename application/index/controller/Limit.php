<?php
namespace app\index\controller;
use app\index\controller\Base;


class Limit extends Base
{
    public function index()
    {
         return $this->fetch();
    }
}
