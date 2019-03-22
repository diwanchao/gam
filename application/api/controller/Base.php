<?php
namespace app\api\controller;
use think\Controller;
use \think\Session;

class Base extends Controller
{
	public $USER_ID;

	function __construct() 
	{
        if (Session::get('is_login')) 
        {
        	$this->USER_ID = Session::get('user_id');	
        }else{
        	return json(['msg' => 'fail','code' => 304, 'data' => []]);die();
        }
    }

}
