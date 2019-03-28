<?php 
use \think\Db;

	function get_k3_number()
	{
/*		$h = date('H',time());
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
        ];*/
        $openstamp 	= strtotime(date('Y-m-d 08:40:00',time()));
        $closestamp = strtotime(date('Y-m-d 21:40:00',time()));
        $period 	= 20*60;
        $now 		= time(); 

        if ($now>$closestamp) 
        {
        	return date('Ymd',strtotime('+1 day')).'01';
        }
        if ($now<$openstamp) 
        {
        	return date('Ymd',$now).'01';
        }
	    $num = ceil((($now-$openstamp)/$period))+1;
	    $num = ($num<10) ? '0'.$num : $num;

	    return date('Ymd').$num;

	}




    function get_k3_info()
    {
            $h = date('H',time());
            $i = date('i',time());
            $s = date('s',time());
            $k3_status  = 0;
            $k3_time    = strtotime(date('Y-m-d H:i:s',strtotime("+1 day")));

            if ($h>=8&&$h<=21) {
                switch ($i) {
                    case $i>=0&&$i<18:
                        $k3_status=1;
                        $k3_time = strtotime(date('Y-m-d H:18:00',time())) - time();
                        break;
                    case $i>=18&&$i<20:
                        $k3_status=0;
                        $k3_time = strtotime(date('Y-m-d H:20:00',time())) - time();
                        break;
                    case $i>=20&&$i<38:
                        $k3_status=1;
                        $k3_time = strtotime(date('Y-m-d H:38:00',time())) - time();
                        break;
                    case $i>=38&&$i<40:
                        $k3_status=0;
                        $k3_time = strtotime(date('Y-m-d H:40:00',time())) - time();
                        break;                
                    case $i>=40&&$i<58:
                        $k3_status=1;
                        $k3_time = strtotime(date('Y-m-d H:58:00',time())) - time();
                        break;                
                    case $i>=58&&$i<60:
                        $k3_status=0;
                        $k3_time = strtotime(date('Y-m-d H:00:00',time())) + 3600 - time();
                        break;                
                    
                    default:
                        # code...
                        break;
                }
            }
            if (time()<strtotime(date('Y-m-d 08:40:00',time()))) 
            {
                $k3_status  = 0;
                $k3_time    = strtotime(date('Y-m-d 08:40:00',time())) - time();
            }
            if (time()>strtotime(date('Y-m-d 21:40:00',time()))) 
            {
                $k3_status  = 0;
                $k3_time    = strtotime(date('Y-m-d 08:40:00',strtotime("+1 day"))) - time();
            }

            return ['status'=>$k3_status,'time'=>$k3_time];
    }







 ?>