<?php
namespace app\index\controller;
use app\index\controller\Base;


class Game extends Base
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
    public function ssczxs()
    {
        return $this->fetch('game/jlssc-zxs');
    }
    public function ssczxl()
    {
        return $this->fetch('game/jlssc-zxl');
    }
}
