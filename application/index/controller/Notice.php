<?php
namespace app\index\controller;
use think\Controller;

class Notice extends Controller
{
    public function index()
    {
         return $this->fetch();
    }
}
