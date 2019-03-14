<?php
namespace app\api\controller;

use \think\Request;

class Login extends Base
{
    /**
     * @SWG\Post(
     *   path="/api/login",
     *   tags={"Login"},
     *   summary="登录接口",
     *   operationId="updatePetWithForm",
     *   consumes={"application/x-www-form-urlencoded"},
     *   produces={"application/json"},
     *   @SWG\Parameter(
     *     name="user_name",
     *     in="formData",
     *     description="用户名",
     *     required=true,
     *     type="string",
     *   ),
     *   @SWG\Parameter(
     *     name="user_pwd",
     *     in="formData",
     *     description="密码",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Parameter(
     *     name="code",
     *     in="formData",
     *     description="验证码",
     *     required=true,
     *     type="string"
     *   ),
     *   @SWG\Response(response="201",description="字段不全"),
     *   security={{
     *     "petstore_auth": {"write:pets", "read:pets"}
     *   }}
     * )
     */
    public function index()
    {
        $data = Request::instance()->param();
        try {
        	if (!($data['user_name']??'')) 
        		throw new \Exception("用户名不能为空", 1);
        	if (!($data['user_pwd']??'')) 
        		throw new \Exception("密码不能为空", 1);
        	if (!($data['code']??'')) 
        		throw new \Exception("验证码不能为空", 1);
        	if (!captcha_check($data['code'])) 
        		throw new \Exception("验证码不正确", 1);




        	$user_info = [
        		'user_name' => $data['user_name'],
        		'balance' 	=> 100
        	];

        } catch (\Exception $e) {
			return json(['msg' => $e->getMessage(), 'code' => 201, 'data' => []]);        	
        }
        return json(['msg' => 'succeed','code' => 200, 'data' =>['user'=>$user_info]]);
    }

}
