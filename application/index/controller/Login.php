<?php
namespace app\index\controller;
use think\Controller;

class Login extends Controller
{
    public function checkLogin()
    {
         echo "1";
         
    }
    /**
     * @SWG\Get(path="/index/login/getAuthCode",
     *   tags={"store"},
     *   description="获取验证码",
     *   operationId="getInventory",
     *   produces={"application/json"},
     *   parameters={},
     *   @SWG\Response(
     *     response=200,
     *     description="successful operation",
     *     @SWG\Schema(
     *       type="object",
     *       additionalProperties={
     *         "type":"integer",
     *         "format":"int32"
     *       }
     *     )
     *   ),
     *   security={{
     *     "api_key":{}
     *   }}
     * )
     */
    public function getAuthCode()
    {
    	$captcha = new \think\captcha\Captcha((array)\think\Config::get('captcha'));
		return $captcha->entry();
    }
    public function captcha_check()
    {
    	$captcha = $_GET['code'];
    	$res = captcha_check($captcha);
    	var_dump($res);
    }

}
