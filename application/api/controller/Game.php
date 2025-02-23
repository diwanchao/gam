<?php
namespace app\api\controller;

use \think\Request;
use \think\Db;
use \think\Cache;

class Game extends Base
{

    protected $play_map = [
            '三军'=>'三军',
            '合值'=>'和值',
            '合值大'=>'和值大小',
            '合值小'=>'和值大小',
            '合值单'=>'和值单双',
            '合值双'=>'和值单双',
            '合值大单'=>'和值大单双',
            '合值大双'=>'和值大单双',
            '合值小单'=>'和值小单双',
            '合值小双'=>'和值小单双',
            '豹子'=>'豹子',
            '半顺'=>'半顺',
            '全顺'=>'全顺',
            '杂'=>'杂',
            '跨度'=>'跨',
            '红单'=>'红单双',
            '红双'=>'红单双',
            '红大'=>'红大小',
            '红小'=>'红大小',
            '黑单'=>'黑单双',
            '黑双'=>'黑单双',
            '黑大'=>'黑大小',
            '黑小'=>'黑大小',
            '黑码'=>'黑码',
            '红码'=>'红码',
            '4码黑'=>'4码黑',
            '4码红'=>'4码红',
            '5码黑'=>'5码黑',
            '三同号单选'=>'三同号单选',
            '二同号复选'=>'二同号复选',
            '二同号单选'=>'二同号单选',
            '三不同号'=>'三不同号',
            '二不同号'=>'二不同号',
        ];






    /**
     * @SWG\Get(
     *   path="/api/game/resultList",
     *   tags={"Game"},
     *   summary="开奖结果",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function resultList()
    {
        $result_data= [];
        $weekarray  = array("日","一","二","三","四","五","六");

        $game_key   = Request::instance()->param('game_key'); 

        $count  = Db::name('game_result')->where('game_key=?',[$game_key])->select();
        $data   = Db::name('game_result')->order('number ASC')->where("game_key=? and DATE_FORMAT(time,'%Y-%m-%d')=?",[$game_key,date('Y-m-d',time())])->select();

        if ($data) 
        {
            if ($game_key=='jlk3') 
            {
                foreach ($data as $key => $value) 
                {
                    $sum                            = 0;
                    $result_data[$key]['no']        = substr($value['number'],-2);
                    $result_data[$key]['week']      = $weekarray[date("w",strtotime($value['time']))];
                    $result_data[$key]['time']      = date('Y-m-d',strtotime($value['time']));
                    $result_data[$key]['content']   = $value['game_result'];
                    $one = str_split($value['game_result']);
                    foreach ($one as $val) {
                        $sum +=$val;
                    }
                    $result_data[$key]['sum']       = $sum;
                    $result_data[$key]['oddEven']   = ($sum%2)==0 ? '双' : '单';
                    $result_data[$key]['bigSmall']  = $sum>9 ? '大' : '小';


                }
            }
            if ($game_key == 'ssc') 
            {
                foreach ($data as $key => $value) {
                    $result_data[$key]['no']        = substr($value['number'],-2);
                    $result_data[$key]['week']      = $weekarray[date("w",strtotime($value['time']))];
                    $result_data[$key]['time']      = date('Y-m-d',strtotime($value['time']));
                    $result_data[$key]['content']   = $value['game_result'];
                    $num_data = str_split($value['game_result']);
                    $result_data[$key]['tenThousand'] = $this->count_result_num($num_data[0]);
                    $result_data[$key]['thousand'] = $this->count_result_num($num_data[1]);
                    $result_data[$key]['hundred'] = $this->count_result_num($num_data[2]);
                    $result_data[$key]['ten'] = $this->count_result_num($num_data[3]);
                    $result_data[$key]['one'] = $this->count_result_num($num_data[4]);
                }
            }
        }
        $return=[
            'total' => $count ? count($count) : 0,
            'data'  => $result_data,

        ];
        return json(['msg' => 'succeed','code' => 200, 'data' => $return]);
    }

    function count_result_num($num)
    {
        $bigSmall   = $num>9 ? '大' : '小';
        $oddEven    = ($num%2)==0 ? '双' : '单';
        $PerfectNumber = $this->isPerfectNumber($num) ? '合' : '质';

        return $bigSmall.$oddEven.$PerfectNumber;

    }
    function isPerfectNumber($N) 
    { 

        $sum = 0; 

        for ($i = 1; $i < $N; $i++) 
        { 
            if ($N % $i == 0) 
            { 
                $sum = $sum + $i; 
            }    
        } 
        return $sum == $N; 
    } 

    /**
     * @SWG\Get(
     *   path="/api/game/userGameList",
     *   tags={"Game"},
     *   summary="当前用户可玩游戏列表",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */

    public function userGameList()
    {
        $user_id  = $this->USER_ID ?? 0;
        $data   = get_user_info_by_user_id($user_id);
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }
    /**
     * @SWG\Get(
     *   path="/api/game/gameInit",
     *   tags={"Game"},
     *   summary="游戏初始化",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function gameInit()
    {
        $data       = [];
        $game_key   = Request::instance()->param('game_key',''); 
        if ($game_key == 'jlk3') 
        {
            $info       = get_k3_info();
            $data = [
                'issue'      => get_k3_number(),
                'count_down' => $info['time'] ?? '-1',
                'close_time' => $info['close_time'] ?? '',
                'status'     => $info['status'] ?? 0,
                'dish'       => $this->get_part_by_user($this->USER_ID)

            ];
        }
        if ($game_key == 'ssc') 
        {
            $info       = get_ssc_info();
            $data = [
                'issue'      => get_ssc_number(),
                'count_down' => $info['time'] ?? '-1',
                'close_time' => $info['close_time'] ?? '',
                'status'     => $info['status'] ?? 0,
                'dish'       => $this->get_part_by_user($this->USER_ID)

            ];
        }


        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }
    /**
     * 根据用户id查询所开盘数
     */
    public function get_part_by_user($user_id)
    {
        $item       = [];
        $user_part  = Db::name('menber')->where('id=?',[$user_id])->value('part');
        foreach (json_decode($user_part,true) as $key => $value) 
        {
            if ($value == 'true') 
                $item[] = $key;
        }
        return $item;
    }


    /**
     * 最后开奖结果
     */
    public function lastNum()
    {
        $game_key   = Request::instance()->param('game_key',''); 
        $res        = Db::table('game_result')->where('game_key=?',[$game_key])->cache(true,60)->order('time desc')->find();

        $data = [
            'periods' => $res['number'] ?? '',
            'number'  => $res['game_result'] ?? '',
        ];
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }



    /**
     * @SWG\Post(
     *   path="/api/game/addBet",
     *   tags={"Game"},
     *   summary="投注",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="data",
     *     in="formData",
     *     description="不用管的参数",
     *     required=false,
     *     type="string",
     *   ),
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function addBet()
    {

        $game_key   = Request::instance()->param('game_key',''); 
        $part       = Request::instance()->param('level','');
        $number     = Request::instance()->param('nowPeriods','');
        $bet_data   = Request::instance()->param('data/a',''); 

        if (!$game_key || !$part || !$number)
            return json(['msg' => '投注失败,数据异常.请刷新页面重新投注','code' => 301, 'data' => [1]]);

        if ($game_key == 'jlk3' && !$bet_data) 
            return json(['msg' => '投注失败,数据异常.请刷新页面重新投注','code' => 301, 'data' => [2]]);

        if ($game_key == 'jlk3') 
        {
            $sum = 0;
            $set_count_blance = array_column($bet_data, 'value');
            foreach ($set_count_blance as $v) {
                $sum += $v;
            }
            $user_blance = Db::table('menber')->where('id', $this->USER_ID)->value('blance');
            if ($sum>$user_blance) 
                return json(['msg' => '投注失败,余额不足','code' => 301, 'data' => []]);


            foreach ($bet_data as $key => $value) {
                $play_key = $value['name'];

                if (!is_numeric($value['sub_name'])) {
                    $play_key = $value['name'].$value['sub_name'];
                }
                if ('豹、顺、杂' == $value['name'] || '过关' == $value['name']) 
                {
                    $play_key = $value['sub_name'];
                }
                if (!isset($this->play_map[$play_key])) 
                    continue;
                $break = Db::table('user_game_method')->where('game_key=? and user_id=? and methods=?',[$game_key,$this->USER_ID,$this->play_map[$play_key]])->value($part);
                $break = $break ?: 0;
                $data = [
                    'time'      => date('Y-m-d H:i:s',time()), 
                    'part'      => $part,
                    'number'    => $number,
                    'content'   => $value['sub_name'],
                    'money'     => $value['value'],
                    'break'     => $value['value']*($break/100),
                    'get'       => 0,
                    'game_key'  => $game_key,
                    'user_id'   => $this->USER_ID,
                    'odds'      => $value['odds'],
                    'play_name' =>$this->play_map[$play_key],
                    'play_key'  => in_array($value['key'], ['4mahei','4mahong','5mahei']) ? $value['key'] : $value['key'].$value['sub_key'],
                ];
                    Db::startTrans();
                try {
                    Db::table('order')->insert($data);
                    Db::table('menber')->where('id', $this->USER_ID)->update(['blance' => Db::raw('blance-'.$value['value'])]);
                    Db::commit();    
                } catch (Exception $e) {
                    Db::rollback();
                }
            }
        }
        if ($game_key == 'ssc') 
        {
            $user_blance = Db::table('menber')->where('id', $this->USER_ID)->value('blance');
            $game_item   = Request::instance()->param('game_item',''); 
            if ($game_item) 
            {
                $money      = Request::instance()->param('money',0); 
                $game_type  = Request::instance()->param('game_type',''); 
                $odds       = Request::instance()->param('odds','0'); 
                $content    = Request::instance()->param('number/a',[]); 

                sort($content);

                $method = $game_item == 'zxs' ? '组选三' : '组选六';

                if ($money>$user_blance) 
                    return json(['msg' => '投注失败,余额不足','code' => 301, 'data' => []]);
                $break = Db::table('user_game_method')->where('game_key=? and user_id=? and methods=?',[$game_key,$this->USER_ID,'组选三'])->value($part);
                $break = $break ?: 0;
                $data = [
                    'time'      => date('Y-m-d H:i:s',time()), 
                    'part'      => $part,
                    'number'    => $number,
                    'content'   => implode(',', $content),
                    'money'     => $money,
                    'break'     => $money*($break/100),
                    'get'       => 0,
                    'game_key'  => $game_key,
                    'user_id'   => $this->USER_ID,
                    'odds'      => $odds,
                    'play_name' => $game_item == 'zxs' ? '组选三['.$game_type.']':'组选六['.$game_type.']',
                    'play_key'  => $game_type,
                ];
                    Db::startTrans();
                try {
                    Db::table('order')->insert($data);
                    Db::table('menber')->where('id', $this->USER_ID)->update(['blance' => Db::raw('blance-'.$money)]);
                    Db::commit();    
                } catch (Exception $e) {
                    Db::rollback();
                }


            }else{
                $sum                = 0;
                $set_count_blance   = array_column($bet_data, 'value');
                foreach ($set_count_blance as $v) 
                    $sum += $v;
                
                if ($sum>$user_blance) 
                    return json(['msg' => '投注失败,余额不足','code' => 301, 'data' => []]);


                foreach ($bet_data as $key => $value) 
                {
                    $play_key = $value['sub_name'];

                    if (in_array($play_key,['龙','虎','和'])) 
                    {
                        $play_key = '龙虎';
                    }
                    $break = Db::table('user_game_method')->where('game_key=? and user_id=? and methods=?',[$game_key,$this->USER_ID,$play_key])->value($part);
                    $break = $break ?: 0;
                    $data = [
                        'time'      => date('Y-m-d H:i:s',time()), 
                        'part'      => $part,
                        'number'    => $number,
                        'content'   => $value['sub_name'],
                        'money'     => $value['value'],
                        'break'     => $value['value']*($break/100),
                        'get'       => 0,
                        'game_key'  => $game_key,
                        'user_id'   => $this->USER_ID,
                        'odds'      => $value['odds'],
                        'play_name' => in_array($value['sub_name'],['龙','虎','和']) ? '龙虎'.$value['name'] : $value['name'],
                        'play_key'  => $value['key'].$value['sub_key'],
                    ];
                        Db::startTrans();
                    try {
                        Db::table('order')->insert($data);
                        Db::table('menber')->where('id', $this->USER_ID)->update(['blance' => Db::raw('blance-'.$value['value'])]);
                        Db::commit();    
                    } catch (Exception $e) {
                        Db::rollback();
                    }

                }  
            } 
        }

        return json(['msg' => '投注成功','code' => 200, 'data' => []]);
    }

    public function openGame()
    {
        $number         = Request::instance()->param('number',0); 
        $game_result    = Request::instance()->param('game_result',0);

        if (!$number) 
        {
            exit();
        }
        if (!$game_result) 
        {
            exit();
        }
        $bet = Db::name('order')->where('number=? and status=0',[$number])->select();

        if (!$bet) 
        {
            exit();
        }

        foreach ($bet as $key => $value) {
            
        }


    }

    /**
     * 计算输赢
     */
    public function get_result($game_result,$content,$play_name)
    {
        $get = false;

        switch ($play_name) {
            case '二同号复选':
                
                break;
            
            default:
                # code...
                break;
        }



    }


    /**
     * 获取组三,组三赔率
     */
    public function getOdds()
    {
        $odds_arr = [
            'zxs' => [
                5=>14.8,
                6=>9.867,
                7=>7.048,
                8=>5.268,
                9=>4.111,
                10=>3.289,
            ],
            'zxl' => [
                4=>35.75,
                5=>14.3,
                6=>7.15,
                7=>4.086,
                8=>2.554,

            ]
        ];

        $game_item    = Request::instance()->param('game_item',''); //玩法
        $item         = Request::instance()->param('item',''); //选中内容

        $data = $odds_arr[$game_item][strlen(str_replace(',', '', $item))] ?? 0;
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }

}
