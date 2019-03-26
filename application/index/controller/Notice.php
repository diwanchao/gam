<?php
namespace app\index\controller;
use app\index\controller\Base;

class Notice extends Controller
{
    public function index()
    {
         return $this->fetch();
    }
}
