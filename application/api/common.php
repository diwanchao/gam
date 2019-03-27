<?php 
use \think\Db;

	function get_k3_number()
	{
		$h = date('H',time());
		$i = date('i',time());
		$h =8;
		if (8 == $h) 
		{
			if ($i<40) {
				return ['periods' => date('Ymd',time()).'01','close_time'=>date('Y-m-d 08:40:00',time()),'count_down'=>strtotime(date('Y-m-d 08:40:00',time()))-time(),'status'=>0];
				
			}else if ($i>58) {
				return ['periods' => date('Ymd',time()).'02','close_time'=>date('Y-m-d 09:00:00',time()),'count_down'=>strtotime(date('Y-m-d 09:00:00',time()))-time(),'status'=>0];
			}
			return ['periods' => date('Ymd',time()).'01','close_time'=>date('Y-m-d 08:58:00',time()),'count_down'=>strtotime(date('Y-m-d 08:58:00',time()))-time(),'status'=>1];
		}


    	$res = Db::table('game_result')->where('game_key=jlk3')->cache(true,60)->order('time desc')->find();



        $time_map = [
            '8' =>['01'],
            '9'=>['02','03','04'],
            '10'=>['05','06','07'],
            '11'=>['08','09','10'],
            '12'=>['11','12','13'],
            '13'=>['14','15','16'],
            '14'=>['17','18','19'],
            '15'=>['20','21','22'],
            '16'=>['23','24','25'],
            '17'=>['26','27','28'],
            '18'=>['29','30','31'],
            '19'=>['31','33','34'],
            '20'=>['35','36','37'],
            '21'=>['38','39','40'],
        ];





		return '20190324-12';
	}












 ?>