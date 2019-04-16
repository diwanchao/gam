<?php
namespace app\shell\controller;
use \think\Db;
use \think\Request;


class Ssc
{
    const REQUEST_URL = 'http://bc1.game171.com.cn/shell/ssc/lottery';
    //get请求方式
    const METHOD_GET  = 'GET';
    //post请求方式
    const METHOD_POST = 'POST';

    public function qcssc()
    {
         $res = file_get_contents('http://e.apiplus.net/newly.do?token=t9dcef31ef8a211b1k&code=cqssc&format=json');
         $cqssc_data = json_decode($res,true);
         try {
        	if (!isset($cqssc_data['code']) || $cqssc_data['code'] !='cqssc') 
        		throw new \Exception("游戏编号异常");
        	if (!isset($cqssc_data['data'])) 
        		throw new \Exception("开奖结果为空");
        	$expect_arr = array_column($cqssc_data['data'], 'expect');
        	$old_data 	= Db::name('game_result')->field('number')->where('number','in', $expect_arr)->where('game_key', '=', 'ssc')->fetchSql(false)->select();
        	$diff 		= array_diff($expect_arr,array_column($old_data, 'number'));
        	if ($diff) 
        	{
        		$game_data = array_column($cqssc_data['data'], null, 'expect');
        		foreach ($diff as $value) {
        			$item = [
        				'game_result' 	=> str_replace(",","",$game_data[$value]['opencode']),
 						'number' 		=> $game_data[$value]['expect'],
 						'time' 			=> $game_data[$value]['opentime'],
 						'game_key'		=> 'ssc'
        			];
        			Db::table('game_result')->insert($item);
                    $this->exec(self::REQUEST_URL,self::METHOD_POST,['number'=>$item['number']]);
        		}
        	}

	        echo 'ok';
         } catch (\Exception $e) {
     		echo $e->getMessage();    	
         }
    }
    public  function exec($url = self::REQUEST_URL, $method = self::METHOD_GET, $params = array(), $ip = null, $connectTimeout = 1)
    {

        $urlInfo = parse_url($url);

        $host = $urlInfo['host'];
        $port = isset($urlInfo['port']) ? $urlInfo['port'] : 80;
        $path = isset($urlInfo['path']) ? $urlInfo['path'] : '/';
        !$ip && $ip = $host;

        $method = strtoupper(trim($method)) !== self::METHOD_POST ? self::METHOD_GET : self::METHOD_POST;
        $params = http_build_query($params);

        if($method === self::METHOD_GET && strlen($params) > 0){
            $path .= '?' . $params;
        }

        $fp = fsockopen($ip, $port, $errorCode, $errorInfo, $connectTimeout);
        
        if($fp === false){
            throw new Exception('Connect failed , error code: ' . $errorCode . ', error info: ' . $errorInfo);
        }
        else{
                
            $http  = "$method $path HTTP/1.1\r\n";
            $http .= "Host: $host\r\n";
            $http .= "Content-type: application/x-www-form-urlencoded\r\n";
            $method === self::METHOD_POST && $http .= "Content-Length: " . strlen($params) . "\r\n";
            $http .= "\r\n";
            $method === self::METHOD_POST && $http .= $params . "\r\n\r\n";

            if(fwrite($fp, $http) === false || fclose($fp) === false){
                throw new Exception('Request failed.');
            }
        }
    }
    /**
     * 开奖方法
     */
    public function lottery()
    {
        $number         = Request::instance()->param('number',''); 

        $game_result    = Db::table('game_result')->where("number=? and game_key='ssc'",[$number])->value('game_result');
        if (!$game_result) 
            exit();
        $data = Db::table('order')->where('number=? and status=0',[$number])->select();
        if (!$data) 
            exit();

        foreach ($data as $key => $value) {
            $update = ['status'=>1,'game_result'=>$game_result,'get'=>0-$value['money'],'handsel'=>0];

            $is_win = $this->result($value['play_name'],$value['content'],$game_result);
            if ($is_win['status'] == 1) {
                $handsel = $value['odds']*$value['money'];
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
        $win_info   = ['status'=>0,'msg'=>''];
        $longhu_arr = ['龙虎1v2','龙虎1v3','龙虎1v4','龙虎1v5','龙虎2v3','龙虎2v4','龙虎2v5','龙虎3v4','龙虎3v5','龙虎4v5'];


        if (in_array($play_name, $longhu_arr)) 
        {
            $play_name  = explode('v', str_replace('龙虎','',$play_name));
            $item       = str_split($game_result);
            $result     = $item[$play_name[0]-1] == $item[$play_name[1]-1] ? '和' : $item[$play_name[0]-1] > $item[$play_name[1]-1] ? '龙' : '虎';
            if ($result == $content) 
                $win_info['status'] = 1;
        }else{
            switch ($play_name) {
                case '组选三[前三位]':
                        $content    = str_split($content);
                        $item_num   = str_split(substr($game_result, 0,3));
                        $unique_arr = array_merge(array_flip(array_flip($item_num)));
                        if (count($unique_arr) == 2 && in_array($unique_arr[0], $content) && in_array($unique_arr[1], $content)) 
                            $win_info['status'] = 1;

                    break;
                case '组选三[中三位]':
                        $content    = str_split($content);
                        $item_num   = str_split(substr($game_result, 1,3));
                        $unique_arr = array_merge(array_flip(array_flip($item_num)));
                        if (count($unique_arr) == 2 && in_array($unique_arr[0], $content) && in_array($unique_arr[1], $content)) 
                            $win_info['status'] = 1;
                    break;
                case '组选三[后三位]':
                        $content    = str_split($content);
                        $item_num   = str_split(substr($game_result, 2,3));
                        $unique_arr = array_merge(array_flip(array_flip($item_num)));
                        if (count($unique_arr) == 2 && in_array($unique_arr[0], $content) && in_array($unique_arr[1], $content)) 
                            $win_info['status'] = 1;
                    break;
                case '组选六[前三位]':
                        $content    = str_split($content);
                        $item_num   = str_split(substr($game_result, 0,3));
                        $unique_arr = array_merge(array_flip(array_flip($item_num)));
                        if (count($unique_arr) == 3 && in_array($unique_arr[0], $content) && in_array($unique_arr[1], $content) && in_array($unique_arr[2], $content)) 
                            $win_info['status'] = 1;
                    break;
                case '组选六[中三位]':
                        $content    = str_split($content);
                        $item_num   = str_split(substr($game_result, 1,3));
                        $unique_arr = array_merge(array_flip(array_flip($item_num)));
                        if (count($unique_arr) == 3 && in_array($unique_arr[0], $content) && in_array($unique_arr[1], $content) && in_array($unique_arr[2], $content)) 
                            $win_info['status'] = 1;
                    break;
                case '组选六[后三位]':
                        $content    = str_split($content);
                        $item_num   = str_split(substr($game_result, 2,3));
                        $unique_arr = array_merge(array_flip(array_flip($item_num)));
                        if (count($unique_arr) == 3 && in_array($unique_arr[0], $content) && in_array($unique_arr[1], $content) && in_array($unique_arr[2], $content)) 
                            $win_info['status'] = 1;
                    break;
                default:
                    $win_info = ['status'=>0,'msg'=>''];
                    break;
            }
        }
        return $win_info;
    }


}
