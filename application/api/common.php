<?php 
use \think\Db;

	function get_k3_number()
	{
        $openstamp 	= strtotime(date('Y-m-d 08:40:00',time()));
        $closestamp = strtotime(date('Y-m-d 21:40:00',time()));
        $period 	= 20*60;
        $now 		= time(); 

        if ($now>$closestamp) 
        {
        	return date('Ymd',strtotime('+1 day')).'001';
        }
        if ($now<$openstamp) 
        {
        	return date('Ymd',$now).'001';
        }
	    $num = ceil((($now-$openstamp)/$period))+1;
	    $num = ($num<10) ? '00'.$num : '0'.$num;

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
                        $close_time = date('Y-m-d H:18:00',time());
                        break;
                    case $i>=18&&$i<20:
                        $k3_status=0;
                        $k3_time = strtotime(date('Y-m-d H:20:00',time())) - time();
                        $close_time = date('Y-m-d H:20:00',time());
                        break;
                    case $i>=20&&$i<38:
                        $k3_status=1;
                        $k3_time = strtotime(date('Y-m-d H:38:00',time())) - time();
                        $close_time = date('Y-m-d H:38:00',time());
                        break;
                    case $i>=38&&$i<40:
                        $k3_status=0;
                        $k3_time = strtotime(date('Y-m-d H:40:00',time())) - time();
                        $close_time = date('Y-m-d H:40:00',time());
                        break;                
                    case $i>=40&&$i<58:
                        $k3_status=1;
                        $k3_time = strtotime(date('Y-m-d H:58:00',time())) - time();
                        $close_time = date('Y-m-d H:58:00',time());
                        break;                
                    case $i>=58&&$i<60:
                        $k3_status=0;
                        $k3_time = strtotime(date('Y-m-d H:00:00',strtotime('+1 hours'))) - time();
                        $close_time = date('Y-m-d H:00:00',strtotime('+1 hours'));
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

            return ['status'=>$k3_status,'time'=>$k3_time,'close_time'=>$close_time];
    }



    /**
     * 根据user_id查询游戏信息
     */
    function get_user_info_by_user_id($user_id=0)
    {
        $item       = [];
        $user_game  = Db::name('menber')->where('id=?',[$user_id])->value('game_list');
        foreach (json_decode($user_game,true) as $key => $value) 
        {
            if ($value == 'true') 
                $item[] = $key;
        }
        $where['game_key']  = ['in',$item];
        $game_data          = Db::name('game_info')->field(' `name`,game_key,url') ->where($where)->select();

        return $game_data;
    }



 ?>