<?php
namespace app\index\controller;
use think\Controller;

class Account extends Controller
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
