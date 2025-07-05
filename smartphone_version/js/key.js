/////////////////////////////////////
// keyクラス (キー入力をつかさどる) //
////////////////////////////////////

export class Key{
    constructor(){
        // WASDキー
        this.is_w_pressed = false;
        this.is_a_pressed = false;
        this.is_s_pressed = false;
        this.is_d_pressed = false;
        // 矢印キー
        this.is_arrow_up_pressed = false;
        this.is_arrow_left_pressed = false;
        this.is_arrow_down_pressed = false;
        this.is_arrow_right_pressed = false;
        // スペースキー
        this.is_space_pressed = false;
    }

    // キーが押されたとき
    pressed(k){
        if(k == "w") this.is_w_pressed = true;
        if(k == "a") this.is_a_pressed = true;
        if(k == "s") this.is_s_pressed = true;
        if(k == "d") this.is_d_pressed = true;
        if(k == "ArrowUp") this.is_arrow_up_pressed = true;
        if(k == "ArrowLeft") this.is_arrow_left_pressed = true;
        if(k == "ArrowDown") this.is_arrow_down_pressed = true;
        if(k == "ArrowRight") this.is_arrow_right_pressed = true;
        if(k == " ") this.is_space_pressed = true;
    }

    // キーが離されたとき
    released(k){
        if(k == "w") this.is_w_pressed = false;
        if(k == "a") this.is_a_pressed = false;
        if(k == "s") this.is_s_pressed = false;
        if(k == "d") this.is_d_pressed = false;
        if(k == "ArrowUp") this.is_arrow_up_pressed = false;
        if(k == "ArrowLeft") this.is_arrow_left_pressed = false;
        if(k == "ArrowDown") this.is_arrow_down_pressed = false;
        if(k == "ArrowRight") this.is_arrow_right_pressed = false;
        if(k == " ") this.is_space_pressed = false;
    }
}