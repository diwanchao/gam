<?php
namespace app\index\controller;
use think\Controller;

class Data extends Controller
{
    public function index()
    {
         return $this->fetch();
    }
}
