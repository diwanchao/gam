<?php
namespace app\api\controller;

use \think\Request;
use \think\Db;
use \think\Cache;

class Game extends Base
{
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
        }

        $return=[
            'total' => $count ? count($count) : 0,
            'data'  => $result_data,

        ];

        return json(['msg' => 'succeed','code' => 200, 'data' => $return]);

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
        $sql    = "SELECT `name`,game_key FROM `game_info` WHERE id in(SELECT game_list FROM menber WHERE id={$user_id})";
        $data   = Db::query($sql);
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
                'dish'       => ['A','B','C','D']

            ];
        }


        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
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
        $play_map = [
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

        $game_key   = Request::instance()->param('game_key',''); 
        $part       = Request::instance()->param('level','');
        $number     = Request::instance()->param('nowPeriods','');
        $bet_data   = Request::instance()->param('data/a',''); 

        if (!$game_key || !$part || !$number || !$bet_data) {
            return json(['msg' => '投注失败,数据异常.请刷新页面重新投注','code' => 301, 'data' => []]);
        }

        if ($game_key == 'jlk3') 
        {
            foreach ($bet_data as $key => $value) {
                $play_key = $value['name'];

                if (!is_numeric($value['sub_name'])) {
                    $play_key = $value['name'].$value['sub_name'];
                }
                if ('豹、顺、杂' == $value['name'] || '过关' == $value['name']) 
                {
                    $play_key = $value['sub_name'];
                }
                if (!isset($play_map[$play_key])) 
                    continue;
                $break = Db::table('user_game_method')->where('game_key=? and user_id=? and methods=?',[$game_key,$this->USER_ID,$play_map[$play_key]])->value($part);
                $break = $break ?: 0;
                $data = [
                    'time' => date('Y-m-d H:i:s',time()), 
                    'part' => $part,
                    'number'=>$number,
                    'content'=>$value['sub_name'],
                    'money'=>$value['value'],
                    'break'=>$value['value']*($break/100),
                    'get'=>0,
                    'game_key'=>$game_key,
                    'user_id'=>$this->USER_ID,
                    'odds'=>$value['odds'],
                    'play_name'=>$play_map[$play_key]
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


        return json(['msg' => '投注成功','code' => 200, 'data' => []]);
    }


}
