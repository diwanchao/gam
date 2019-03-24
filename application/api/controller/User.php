<?php
namespace app\api\controller;

use \think\Request;
use \think\Db;

class User extends Base
{
    /**
     * @SWG\Get(
     *   path="/api/user/",
     *   tags={"User"},
     *   summary="会员列表",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function index()
    {
        //game_key
        $param      = Request::instance()->param();
        $game_key   = $param['game_key'] ?? '';

        if (!$game_key) 
            return json(['msg' => 'game_key not empty','code' => 201, 'data' => []]);

        $where  = 'user_id=? and game_key=?';
        $data   = Db::name('user_game_method')->where($where,[$this->USER_ID,$game_key])->select();
        $data   = ['data'  => $data];
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);
    }
    /**
     * @SWG\Post(
     *   path="/api/user/getList",
     *   tags={"User"},
     *   summary="投注记录",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="game_key",
     *     in="formData",
     *     description="游戏编号",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Parameter(
     *     name="index",
     *     in="formData",
     *     description="页码数",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function getList()
    {
        $game_key  = Request::instance()->param('game_key');
        $where = 'user_id=? and game_key=?';
        $where_param[] = $this->USER_ID;
        $where_param[] = $game_key;

        $data   = Db::name('order')->where($where,$where_param)->order('time desc')->paginate(10,false,['var_page'=>'index']);

        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);

    }
    /**
     * @SWG\Post(
     *   path="/api/user/settlementList",
     *   tags={"User"},
     *   summary="结算账户记录",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="game_key",
     *     in="formData",
     *     description="游戏编号",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Parameter(
     *     name="index",
     *     in="formData",
     *     description="页码数",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function settlementList()
    {
        $sum_total  = $sum_single = $sum_money = $sum_school = $sum_break = $sum_get = 0;
        $weekarray  = array("日","一","二","三","四","五","六");

        $game_key   = Request::instance()->param('game_key'); 
        $where      = $game_key ? "where game_key='{$game_key}'" : 'where 1=1';

        $sql = "SELECT DATE_FORMAT(time,'%Y-%m-%d') AS date,COUNT(no) AS single,SUM(money) AS money,SUM(handsel) AS school,SUM(break) AS break,SUM(get) AS get FROM `order` {$where} GROUP BY date ORDER BY date ASC limit 7";
        $data = Db::query($sql);
        
        foreach ($data as $key => $value) {
            $sum_total ++;
            $sum_single += $value['single'];
            $sum_money  += $value['money'];
            $sum_school += $value['school'];
            $sum_break  += $value['break'];
            $sum_get    += $value['get'];
            $data[$key]['date'] = $value['date'].' 星期'.$weekarray[date("w",strtotime($value['date']))];
        }

        $return_data = [
            'total'     => $sum_total,
            'single'    => $sum_single,
            'money'     => $sum_money,
            'school'    => $sum_school,
            'break'     => $sum_break,
            'get'       => $sum_get,
            'data'      => $data

        ];
        return json(['msg' => 'succeed','code' => 200, 'data' => $return_data]);
    }
    /**
     * @SWG\Post(
     *   path="/api/user/settlementDetail",
     *   tags={"User"},
     *   summary="结算账户明细",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="game_key",
     *     in="formData",
     *     description="游戏编号",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Parameter(
     *     name="index",
     *     in="formData",
     *     description="页码数",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="index",
     *     in="formData",
     *     description="时间",
     *     required=false,
     *     type="string"
     *   ),
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */


    public function settlementDetail()
    {
        //game_key
        //index
        //date 时间 字符串


        $data = [
            'total'=>23,
            'money'=>123,
            'school'=>11,
            'break'=>11,
            'get'=>11,
            'data'=>[
                ['no'=>1,'time'=>date('Y-m-d H:i:s',time()),'number'=>'112','part'=>'龙湖畔','content'=>'和值大小','name'=>'吉林快3','periods'=>'2910231','value'=>'小','reate'=>'1.98','result'=>'3,2,4','money'=>'100','school'=>'0','break'=>'200','get'=>'3000'],
                ['no'=>1,'time'=>date('Y-m-d H:i:s',time()),'number'=>'112','part'=>'龙湖畔','content'=>'和值大小','name'=>'吉林快3','periods'=>'2910231','value'=>'小','reate'=>'1.98','result'=>'3,2,4','money'=>'100','school'=>'0','break'=>'200','get'=>'3000']
            ]

        ];
        return json(['msg' => 'succeed','code' => 200, 'data' => $data]);

    }


}
