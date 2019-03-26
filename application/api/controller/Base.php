<?php
namespace app\api\controller;
use think\Controller;
use \think\Session;
use think\Cache;

class Base extends Controller
{
	public $USER_ID;

	function __construct() 
	{
        parent::__construct();
        
        if (Session::get('is_login')) 
        {
        	$this->USER_ID = Session::get('user_id');	
        }else{
        	return json(['msg' => 'fail','code' => 304, 'data' => []]);die();
        }
        $options = [
            'type'      => 'redis',//指定类型
            'password'  => '',
            'prefix'    => '',
            'host'      => '127.0.0.1',
            'port'      => 6379,
            'timeout'   => 0,
        ];
        //Cache::init($options);//初始化
    }

}
         