<?php
namespace app\api\controller;

use \think\Request;
use \think\Db;
use \think\Session;


class User extends Base
{


    function __construct() 
    {
        parent::__construct();
    }




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
        $week       = [];
        $new_data   = [];
        $sum_total  = $sum_single = $sum_money = $sum_school = $sum_break = $sum_get = 0;
        $weekarray  = array("日","一","二","三","四","五","六");
        //获取一周日期
        for ($i=1; $i <= 7; $i++) { 
            $week[] = date('Y-m-d' ,strtotime( '+' . $i-7 .' days', time()));
        }

        $game_key   = Request::instance()->param('game_key'); 
        $where      = $game_key ? "where game_key='{$game_key}'" : 'where 1=1';
        $where      .= " and user_id='{$this->USER_ID}' and `time`>='{$week[0]}' and `time`<='{$week[6]}'";

        $sql = "SELECT DATE_FORMAT(time,'%Y-%m-%d') AS date,COUNT(no) AS single,SUM(money) AS money,SUM(handsel) AS school,SUM(break) AS break,SUM(get) AS get FROM `order` {$where} GROUP BY date ORDER BY date ASC";
        $data = Db::query($sql);
        $data = array_column($data, null,'date');
        
        foreach ($week as $key => $value) {
            $sum_total ++;
            if (isset($data[$value])) 
            {
                $sum_single += $data[$value]['single'];
                $sum_money  += $data[$value]['money'];
                $sum_school += $data[$value]['school'];
                $sum_break  += $data[$value]['break'];
                $sum_get    += $data[$value]['get'];

                $new_data[$key] = $data[$value];
            }else{
                $new_data[$key] = ['date'=>$value,'single'=>0,'money'=>0,'school'=>0,'break'=>0,'get'=>0];
            }
            $new_data[$key]['date'] = $value.' 星期'.$weekarray[date("w",strtotime($value))];
        }
        $return_data = [
            'total'     => $sum_total,
            'single'    => $sum_single,
            'money'     => $sum_money,
            'school'    => $sum_school,
            'break'     => $sum_break,
            'get'       => $sum_get,
            'data'      => $new_data

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
        //date 时间 字符串
        $game_key   = Request::instance()->param('game_key'); 
        $date       = Request::instance()->param('date');
    
        $where      = $game_key ? "game_key='{$game_key}'" : '1=1';
        $where      .= " and user_id='{$this->USER_ID}' and DATE_FORMAT(time,'%Y-%m-%d')='{$date}'";

        $res = Db::name('order')->where($where)->order('time desc')->paginate(10,false,['var_page'=>'index']);

        var_dump($res);die();
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
    /**
     * @SWG\Post(
     *   path="/api/user/changePassword",
     *   tags={"User"},
     *   summary="修改密码",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="old_pwd",
     *     in="formData",
     *     description="旧密码",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Parameter(
     *     name="new_pwd",
     *     in="formData",
     *     description="新密码",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="repeat_pwd",
     *     in="formData",
     *     description="重复密码",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function changePassword()
    {
        $old_pwd  = Request::instance()->param('old_pwd');
        $new_pwd  = Request::instance()->param('new_pwd');
        $repeat_pwd  = Request::instance()->param('repeat_pwd');
        try {
            if (!$old_pwd) 
                throw new \Exception("旧密码不能为空", 1);
            if (!$new_pwd) 
                throw new \Exception("新密码不能为空", 1);
            if (!$repeat_pwd) 
                throw new \Exception("确认密码不能为空", 1);
            if ($new_pwd!=$repeat_pwd) 
                throw new \Exception("两次输入密码不一致", 1);


            $user_data = Db::name('menber')->field('password')->where('id=?',[$this->USER_ID])->find();
            if (!$user_data) 
                throw new \Exception("用户不存在", 1);
            if ($user_data['password'] != md5($old_pwd)) 
                throw new \Exception("旧密码错误", 1);
            $update_res = Db::name('menber')->where('id', $this->USER_ID)->update(['password' => md5($new_pwd)]);
            if (!$update_res) 
                throw new \Exception("修改密码失败", 1);

            Session::set('is_login',0);

        } catch (\Exception $e) {
            return json(['msg' => $e->getMessage(), 'code' => 201, 'data' => []]);          
        }
        return json(['msg' => '修改成功','code' => 200, 'data' =>[]]);

    }


}
