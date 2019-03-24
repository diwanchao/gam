<?php
namespace app\api\controller;

use \think\Request;
use \think\Db;
use \think\Session;
class Home extends Base
{
    /**
     * @SWG\Get(
     *   path="/api/home/info",
     *   tags={"Home"},
     *   summary="主界面接口",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function info()
    {

        $first_notice   = Db::name('notice')->order('create_time desc')->value('content');
        $data = [
            'notice'    => $first_notice,
            'game'      => [
                'k3'=>[
                    ['name'=>'吉林快3','time'=>date('Y-m-d H:i:s',time()),'status'=>1],
                    ['name'=>'辽宁快3','time'=>date('Y-m-d H:i:s',time()),'status'=>0],
                ],
                'ssc'=>[
                    ['name'=>'吉林时时彩','time'=>date('Y-m-d H:i:s',time()),'status'=>1],
                    ['name'=>'辽宁时时彩','time'=>date('Y-m-d H:i:s',time()),'status'=>0],
                ],
            ],
            'macau_time' => date('Y-m-d H:i:s',time())

        ];

        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }
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

        $data = [
            'notice'     => $first_notice,
            'macau_time' => time(),
            'game'       => [
                ['name' => '吉林快3', 'key' => 'jlk3', 'url'=>'/'],
                ['name' => '时时彩', 'key' => 'ssc', 'url'=>'/'],
            ],
        ];
        if ($game_key) 
        {
            $data['subGame'] = [
                ['name'=>'三军', 'key'=>'ssc','url'=>'/'],
                ['name'=>'和值', 'key'=>'ssc','url'=>'/'],
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
        $game_key  = Request::instance()->param('game_key');



        $user_data  = Db::name('menber')->field('id,user_name,password,blance')->where('id=?',[$this->USER_ID])->find();
        $bet        = Db::name('order')->field('time,content,odds,money')->where('user_id=? and game_key=?',[$this->USER_ID,$game_key])->order('time desc')->paginate(10,false,['var_page'=>'index']);
        $num        = Db::name('lottery_record')->field('lottery_date as date,lottery_num as content')->where('game_key=?',[$game_key])->select();

        $data = [
            'game_logo' => '/',
            'game_name' => '吉林快3',
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
        $game_key  = Request::instance()->param('game_key');
        $where = 'user_id=? and game_key=?';
        $where_param[] = $this->USER_ID;
        $where_param[] = $game_key;

        $data = Db::name('order')->field('time,content,odds,money')->where($where,$where_param)->order('time desc')->paginate(10,false,['var_page'=>'index']);
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
        $h = date('H',time());
        $i = date('i',time());
        $s = date('s',time());
        $k3_status = 0;


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







            $data = [
                'k3'=>[
                    ['name'=>'吉林快3','time'=>$k3_time,'status'=>$k3_status,'url'=>'/','key'=>'jlk3'],
                ],
                'ssc'=>[
                    ['name'=>'重庆时时彩','time'=>100000,'status'=>1,'url'=>'/','key'=>'jlssc'],
                ],
            ];
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }


}
