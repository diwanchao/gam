<?php
namespace app\index\controller;
use think\Controller;

class Result extends Controller
{
    public function index()
    {
         return $this->fetch();
    }
}
