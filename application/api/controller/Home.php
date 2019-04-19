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


        $game_key       = Request::instance()->param('game_key','');
        $first_notice   = Db::name('notice')->order('create_time desc')->value('content');
        $user_id        = $this->USER_ID ?? 0;
        $game_data      = get_user_info_by_user_id($user_id);

        $data = [
            'notice'     => $first_notice ?: '',
            'macau_time' => time(),
            'game'       => $game_data ?? [],
        ];
        if ('jlk3' == $game_key) 
        {
            $data['subGame'] = [
                ['name'=>'(三军,和值,其他)', 'key'=>'jlk3','url'=>'/index/game/jlk3'],
                ['name'=>'(三同号单选,二同号复选,二同号单选,三不同号,二不同号)', 'key'=>'jlk3','url'=>'/index/game/jlk32'],
            ];
        }
        if ('ssc' == $game_key) 
        {
            $data['subGame'] = [
                ['name'=>'龙虎和', 'key'=>'ssc','url'=>'/index/game/jlssc'],
                ['name'=>'组选三', 'key'=>'ssc','url'=>'/index/game/ssczxs'],
                ['name'=>'组选六', 'key'=>'ssc','url'=>'/index/game/ssczxl'],
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
        $game_key       = Request::instance()->param('game_key','');
        $game_version   = $game_key == 'jlk3' ? get_k3_number() : get_ssc_number();

        $user_data  = Db::name('menber')->field('user_name,blance')->where('id=?',[$this->USER_ID])->find();
        $bet        = Db::name('order')->field("DATE_FORMAT(time,'%Y-%m-%d') as time,content,odds,money,play_name")->where('user_id=? and game_key=? and number=?',[$this->USER_ID,$game_key,$game_version])->order('time desc')->fetchSql(0)->paginate(10,false,['var_page'=>'index']);
        //->select();
        //var_dump($bet);die();
        $num        = Db::name('game_result')->field('number as date,game_result as content')->where("game_key=? and DATE_FORMAT(time,'%Y-%m-%d')=?",[$game_key,date('Y-m-d',time())])->order('number ASC')->select();

        $data = [
            'game_logo' => '/',
            'game_name' => $game_key == 'jlk3' ? '吉林快3' : '重庆时时彩',
            'username'  => $user_data['user_name'] ?? '',
            'balance'   => floor($user_data['blance']) ?? 0,
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
        $game_key   = Request::instance()->param('game_key','');
        $where      = 'user_id=? and game_key=? and number=?';
        $where_param[] = $this->USER_ID ?? 0;
        $where_param[] = $game_key;
        $where_param[] = $game_key == 'jlk3' ? get_k3_number() : get_ssc_number();

        $data = Db::name('order')->field("DATE_FORMAT(time,'%Y-%m-%d') as time,content,odds,money,play_name")->where($where,$where_param)->order('time desc')->paginate(10,false,['var_page'=>'index']);
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
        $data       = get_user_info_by_user_id($user_id);
        if ($data) {
            foreach ($data as $key => $value) {
                if ($value['game_key'] == 'jlk3') 
                {
                    $now = get_k3_info();
                    $res['k3'][] = array_merge($value,$now);
                }
                if ($value['game_key'] == 'ssc') 
                {
                    $now = get_ssc_info();
                    $res['ssc'][] = array_merge($value,$now);
                }
            }
        }
        return json(['msg' => 'succeed','code' => 200, 'data' => $res]);
    }
}
