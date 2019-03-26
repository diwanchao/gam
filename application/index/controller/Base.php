<?php
namespace app\index\controller;
use think\Controller;
use \think\Session;

class Base extends Controller
{
	function __construct() 
	{
		parent::__construct();

        if (!Session::get('is_login')) 
            $this->redirect('login/index');

    }

}
         