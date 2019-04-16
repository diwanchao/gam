<?php
namespace app\shell\controller;
use \think\Db;
use \think\Request;

class K3
{
    const BAOZI       = ['111','222','333','444','555','666'];
    const QUANSHUN    = ['123','234','345','456'];
    const REQUEST_URL = 'http://bc1.game171.com.cn/shell/k3/lottery';
    //get请求方式
    const METHOD_GET  = 'GET';
    //post请求方式
    const METHOD_POST = 'POST';


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
                    $this->exec(self::REQUEST_URL,self::METHOD_POST,['number'=>$value['expect']]);
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
                    $item = $sum>10 ? '大' : '小';
                    if ($content == $item) 
                        $win_info['status'] = 1;
                break;
            case '和值单双':
                    $sum = array_sum(str_split($game_result));
                    $item = ($sum%2)==0 ? '双' : '单';
                    if ($content == $item) 
                        $win_info['status'] = 1;
                break;
            case '和值小单双':
                    $sum    = array_sum(str_split($game_result));
                    if ($sum <=10) 
                    {
                        $item = ($sum%2)==0 ? '小双' : '小单';
                        if ($content == $item) 
                            $win_info['status'] = 1;
                    }
                break;
            case '和值大单双':
                    if ($sum >10) 
                    {
                        $item = ($sum%2)==0 ? '大双' : '大单';
                        if ($content == $item) 
                            $win_info['status'] = 1;
                    }
                break;
            case '豹子':
                    if (in_array($game_result, self::BAOZI)&&$content==$game_result) 
                        $win_info['status'] = 1;
                break;
            case '跨':
                    $item = str_split($game_result);
                    if (($item[2] - $item[0]) == $content)
                        $win_info['status'] = 1;
                break;
            case '半顺':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'black') 
                    {
                        $item = str_split($game_result);
                        if ($item[0]+1 == $item[1] || $item[1]+1 == $item[2])
                            $win_info['status'] = 1;
                    }
                break;
            case '全顺':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'black') 
                    {
                        if (in_array($game_result, self::QUANSHUN))
                            $win_info['status'] = 1;
                    }
            case '杂':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'black') 
                    {
                        $item = str_split($game_result);
                        if (($item[0]+1 != $item[1]) && ($item[1]+1 != $item[2]))
                            $win_info['status'] = 1;
                    }
                break;
            case '红单双':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'red') 
                    {
                        $sum = array_sum(str_split($game_result));
                        $item = ($sum%2)==0 ? '红双' : '红单';
                        if ($content == $item) 
                            $win_info['status'] = 1;
                    }
                break;
            case '红大小':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'red') 
                    {
                        $sum  = array_sum(str_split($game_result));
                        $item = $sum>10 ? '红大' : '红小';
                        if ($content == $item) 
                            $win_info['status'] = 1;
                    }
                break;
            case '黑单双':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'black') 
                    {
                        $sum = array_sum(str_split($game_result));
                        $item = ($sum%2)==0 ? '黑双' : '黑单';
                        if ($content == $item) 
                            $win_info['status'] = 1;
                    }
                break;
            case '黑大小':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'black') 
                    {
                        $sum  = array_sum(str_split($game_result));
                        $item = $sum>10 ? '黑大' : '黑小';
                        if ($content == $item) 
                            $win_info['status'] = 1;
                    }
                break;
            case '黑码':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'black') 
                        $win_info['status'] = 1;
                break;
            case '红码':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'red') 
                        $win_info['status'] = 1;
                break;
            case '4码红':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'red' && strpos($content,$game_result)) 
                        $win_info['status'] = 1;
                break;
            case '4码黑':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'black' && strrpos($content, $game_result)) 
                        $win_info['status'] = 1;
                break;
            case '5码黑':
                    $type = $this->red_or_black($game_result);
                    if ($type == 'black' && strrpos($content, $game_result)) 
                        $win_info['status'] = 1;
                break;
            case '三同号单选':
                    if ($content == $game_result) 
                        $win_info['status'] = 1;
                break;
            case '二同号复选':
                    if (strrpos($game_result, $content)) 
                        $win_info['status'] = 1;
                break;
            case '二同号单选':
                    if ($content == $game_result) 
                        $win_info['status'] = 1;
                break;
            case '三不同号':
                    if ($content == $game_result) 
                        $win_info['status'] = 1;
                break;
            case '二不同号':
                    if (strrpos($game_result, $content)) 
                        $win_info['status'] = 1;
                break;
            default:
                break;
        }
        return $win_info;
    }
    /**
     * 判断是红码还是黑码
     */

    private function red_or_black($game_result='')
    {
        $item   = str_split($game_result);
        $item1  = array_unique($item);
        if (count($item) == count($item1)) 
            return 'black';
        else
            return 'red';
    }

}
