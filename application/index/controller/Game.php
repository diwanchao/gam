<?php
namespace app\index\controller;
use app\index\controller\Base;


class Game extends Controller
{
    public function jlk3()
    {
        return $this->fetch();
    }
    public function jlssc(){
    	return $this->fetch();
    }
    public function jlk32()
    {
    	return $this->fetch('game/jlk3-2');
    }

}
