<?php
namespace app\api\controller;

use \think\Request;
use \think\Db;
use \think\Session;
class Home extends Base
{
    /**
     * @SWG\Post(
     *   path="/api/home/headInfo",
     *   tags={"Home"},
     *   summary="头部信息接口",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="game_key",
     *     in="formData",
     *     description="游戏名",
     *     required=false,
     *     type="string",
     *   ),
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */

    public function headInfo()
    {
                //game_key
        $game_key       = Request::instance()->param('game_key','');
        $first_notice   = Db::name('notice')->order('create_time desc')->value('content');

        $user_id  = $this->USER_ID ?? 0;
        $sql        = "SELECT `name`,game_key as `key`,url FROM `game_info` WHERE id in(SELECT game_list FROM menber WHERE id={$user_id})";
        $game_data  = Db::query($sql);

        $data = [
            'notice'     => $first_notice ?: '',
            'macau_time' => time(),
            'game'       => $game_data ?? [],
        ];
        if ('jlk3' == $game_key) 
        {
            $data['subGame'] = [
                ['name'=>'(三军,和值,其他)', 'key'=>'jlk3','url'=>'/index/game/jlk3'],
                ['name'=>'(三同号单选,二同号复选,二同号复选,三不同号,二不同号)', 'key'=>'jlk3','url'=>'/index/game/jlk32'],
            ];
        }
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }
    /**
     * @SWG\Get(
     *   path="/api/home/leftInfo",
     *   tags={"Home"},
     *   summary="左侧信息",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function leftInfo()
    {
        $game_version   = get_k3_number();
        $game_key       = Request::instance()->param('game_key','');

        $user_data  = Db::name('menber')->field('user_name,blance')->where('id=?',[$this->USER_ID])->find();
        $bet        = Db::name('order')->field('time,content,odds,money,play_name')->where('user_id=? and game_key=? and number=?',[$this->USER_ID,$game_key,$game_version])->order('time desc')->paginate(10,false,['var_page'=>'index']);
        $num        = Db::name('game_result')->field('number as date,game_result as content')->where("game_key=? and DATE_FORMAT(time,'%Y-%m-%d')=?",[$game_key,date('Y-m-d',time())])->select();

        $data = [
            'game_logo' => '/',
            'game_name' => $game_key == 'jlk3' ? '吉林快3' : '重庆时时彩',
            'username'  => $user_data['user_name'] ?? '',
            'balance'   => $user_data['blance'] ?? 0,
            'bet'       => $bet,
            'num'       => [
                'data'=> $num ?: []
            ]

        ];

        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);

    }
    /**
     * @SWG\Get(
     *   path="/api/home/betPage",
     *   tags={"Bet"},
     *   summary="投注信息分页信息",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function betPage()
    {
        $game_key  = Request::instance()->param('game_key','');
        $where = 'user_id=? and game_key=? number=?';
        $where_param[] = $this->USER_ID ?? 0;
        $where_param[] = $game_key;
        $where_param[] = get_k3_number();

        $data = Db::name('order')->field('time,content,odds,money,play_name')->where($where,$where_param)->order('time desc')->paginate(10,false,['var_page'=>'index']);
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }
    /**
     * @SWG\Get(
     *   path="/api/home/gameInfo",
     *   tags={"Home"},
     *   summary="首页游戏信息",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function gameInfo()
    {
        $res        = [];
        $user_id    = $this->USER_ID ?? 0;
        $sql        = "SELECT `name`,game_key as `key`,url FROM `game_info` WHERE id in(SELECT game_list FROM menber WHERE id={$user_id})";
        $data       = Db::query($sql);
        if ($data) {
            foreach ($data as $key => $value) {
                if ($value['key'] == 'jlk3') 
                {
                    $now = $this->get_k3_info();
                    $res['k3'][] = array_merge($value,$now);
                }
            }
        }
/*
            $data = [
                'ssc'=>[
                    ['name'=>'重庆时时彩','time'=>100000,'status'=>1,'url'=>'/','key'=>'jlssc'],
                ],
            ];*/
        return json(['msg' => 'succeed','code' => 200, 'data' => $res]);
    }


    public function get_k3_info()
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

}
