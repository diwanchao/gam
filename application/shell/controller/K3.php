<?php
namespace app\shell\controller;
use \think\Db;
use \think\Request;

class K3
{
    public function jlk3()
    {
         $res = file_get_contents('http://e.apiplus.net/newly.do?token=t9dcef31ef8a211b1k&code=jlk3&format=json');
         $jlk3_data = json_decode($res,true);
         try {
        	if (!isset($jlk3_data['code']) || $jlk3_data['code'] !='jlk3') 
        		throw new \Exception("游戏编号异常");
        	if (!isset($jlk3_data['data'])) 
        		throw new \Exception("开奖结果为空");
        	$expect_arr = array_column($jlk3_data['data'], 'expect');
        	$old_data 	= Db::name('game_result')->field('number')->where('number','in', $expect_arr)->where('game_key', '=', $jlk3_data['code'])->fetchSql(false)->select();
        	$diff 		= array_diff($expect_arr,array_column($old_data, 'number'));
        	if ($diff) 
        	{
        		$game_data = array_column($jlk3_data['data'], null, 'expect');
        		foreach ($diff as $value) {
        			$item = [
        				'game_result' 	=> str_replace(",","",$game_data[$value]['opencode']),
 						'number' 		=> $game_data[$value]['expect'],
 						'time' 			=> $game_data[$value]['opentime'],
 						'game_key'		=> $jlk3_data['code']
        			];
        			Db::table('game_result')->insert($item);
        		}
        	}

	        echo 'ok';
         } catch (\Exception $e) {
     		echo $e->getMessage();    	
         }

    }
    /**
     * 开奖方法
     */
    public function lottery()
    {
        $number         = Request::instance()->param('number',20190415027); 

        $game_result    = Db::table('game_result')->where("number=? and game_key='jlk3'",[$number])->value('game_result');
        if (!$game_result) 
            exit();
        $data = Db::table('order')->where('number=? and status=0',[$number])->select();
        if (!$data) 
            exit();

        foreach ($data as $key => $value) {
            $update = ['status'=>1,'game_result'=>$game_result,'get'=>0-$value['money'],'handsel'=>0];

            $is_win = $this->result($value['play_name'],$value['content'],$game_result);
            if ($is_win['status'] == 1) {
                if ($value['play_name'] == '三军') 
                {
                    $handsel = ($value['odds'] -1)*$is_win['data']*$value['money'];
                }else{
                    $handsel = $value['odds']*$value['money'];
                }
                $update['handsel']  = $handsel;
                $update['get']      = $handsel - $value['money'];

            }
            //修改订单记录结果
            Db::table('order')->where('no','=',$value['no'])->update($update);
            Db::table('menber')->where('id', '=',$value['user_id'])->update(['blance' => Db::raw('blance+'.$update['handsel'])]);
        }




    }
    /**
     * 计算结果
     */

    public function result($play_name,$content,$game_result)
    {
        $win_info = ['status'=>0,'msg'=>''];
        switch ($play_name) {
            case '三军':
                    $item = str_replace($content, '', $game_result);
                    if (strlen($item) != 3) 
                        $win_info = ['status'=>1,'data'=>3-strlen($item)];

                break;
            case '和值':
                    $sum = array_sum(str_split($game_result));
                    if ($content == $sum) 
                        $win_info['status'] = 1;
                break;
            case '和值大小':
                    $sum = array_sum(str_split($game_result));
                    $item = $sum>9 ? '大' : '小';
                    if ($content == $item) 
                        $win_info['status'] = 1;
                break;
            case '和值单双':
                    $sum = array_sum(str_split($game_result));
                    $item = ($sum%9)==0 ? '双' : '单';
                    if ($content == $item) 
                        $win_info['status'] = 1;
                break;
            case '和值小单双':
                    $sum = array_sum(str_split($game_result));
                    if ($content == $sum) 
                        $win_info['status'] = 1;
                break;
            case '和值大单双':
                    $sum = array_sum(str_split($game_result));
                    if ($content == $sum) 
                        $win_info['status'] = 1;
                break;
            default:
                break;
        }
        return $win_info;
    }

}
