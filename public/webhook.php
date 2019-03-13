<?php
//git webhook 自动部署脚本
//项目存放物理路径,第一次clone时,必须保证该目录为空
//如果已经clone过,则直接拉去代码





$output = shell_exec("cd /www/wwwroot/bc1.game171.com.cn;sudo git pull 2<&1");
var_dump($output);






 ?>