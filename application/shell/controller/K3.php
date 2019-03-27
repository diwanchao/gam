<?php
namespace app\shell\controller;
use \think\Db;

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
}
