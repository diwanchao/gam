<?php
namespace app\index\controller;
use app\index\controller\Base;

class Account extends Base
{
    public function index()
    {
         return $this->fetch();
    }
    public function detail()
    {
         return $this->fetch();
    }
}
