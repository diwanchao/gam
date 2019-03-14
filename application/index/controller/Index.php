<?php
namespace app\index\controller;
use think\Controller;

class Index extends Controller
{
	public function index(){
/*        $path = ROOT_PATH.'application\index'; //你想要哪个文件夹下面的注释生成对应的API文档
        $swagger = \Swagger\scan($path);

        $swagger_json_path = ROOT_PATH.'public\swagger.json';
        $res = file_put_contents($swagger_json_path, $swagger);*/
        $cmd = 'php '.ROOT_PATH.'vendor\zircote\swagger-php\bin\swagger '.ROOT_PATH.'application\api -o '.ROOT_PATH.'public';

        $res = shell_exec($cmd);
        $this->redirect('http://'.$_SERVER['HTTP_HOST'].'/swagger-ui/dist/index.html');
    }
}
