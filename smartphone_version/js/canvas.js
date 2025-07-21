//////////////////
// canvasクラス //
/////////////////

import { is_overlapping } from "./utils/is_overlapping.js";

export class Canvas{
    #buttons
    #key
    // 指は画面上部に1本。画面下部に1本のみ存在。置かれている指を代入 (x, y 座標) する。
    #fingers = {
        upper: null,
        lower: null,
    }

    constructor(){
        this.canvas = document.getElementById("main_canvas");
        this.context = this.canvas.getContext("2d");
        this.resize()
    }

    // キャンバスのリサイズ
    // 画面めいっぱいに以下のサイズ比の canvas を描画しなおす
    // 全体として、縦に長い長方形画面。縦 : 横 = 1.8 : 1
    // - ゲーム画面が正方形 (1 : 1)
    // - その上下にコントロールパネル (0.4 : 1) が 1 つずつ。
    resize(){
        const aspect_ratio = 1.8; // 横幅を 1 としたときの縦幅
        const ADJUSTMENT = 0.96;

        // 縦にめいっぱい
        if (document.documentElement.clientWidth * aspect_ratio  > document.documentElement.clientHeight){
            this.canvas.width = document.documentElement.clientHeight / aspect_ratio * ADJUSTMENT;
            this.canvas.height = document.documentElement.clientHeight * ADJUSTMENT;
        }
        // 横にめいっぱい
        else {
            this.canvas.width = document.documentElement.clientWidth * ADJUSTMENT;
            this.canvas.height = document.documentElement.clientWidth * aspect_ratio * ADJUSTMENT;
        }
        
        this.initialize();
    }

    // キャンバスの初期化 (画面をまっさらに)
    initialize(){
        const controller_ratio = 0.4; // 横幅を 1 としたときの controller 部分の縦幅

        // キャンバスの背景をクリア
        this.context.clearRect(0, 0, this.get_width(), this.get_height());

        // コントローラーの背景染め
        this.context.fillStyle = "rgb(160, 160, 180)";
        this.context.fillRect(0, 0, this.get_width(), this.get_width() * controller_ratio);

        // ゲーム画面の背景染め
        this.context.fillStyle = "rgb(200, 200, 220)";
        this.context.fillRect(0, this.get_width() * controller_ratio, this.get_width(), this.get_width());

        // コントローラーの背景染め
        this.context.fillStyle = "rgb(160, 160, 180)";
        this.context.fillRect(0, this.get_width() + this.get_width() * controller_ratio, this.get_width(), this.get_width());
    }

    // 以下の、キャンバスに対するユーザーによる入力を受け取り始める
    // - タップされた
    // - スライドされた
    // - 指が離された
    start_receiving_input() {
        this.canvas.addEventListener("touchstart", (event) => {
            event.preventDefault();

            // canvas の左上角の x, y 座標
            // 
            // canvas.getBoundingClientRect() => 現在、スマホ画面で見えている範囲の四角形
            // window.pageXOffset => 現在、スマホ画面で見えている範囲の左端が、ページの左端から x 軸方向にどれだけずれているか
            const canvas_top_left = {
                x: this.canvas.getBoundingClientRect().left + window.pageXOffset,
                y: this.canvas.getBoundingClientRect().top + window.pageYOffset
            }
            
            // そのときタップされた指全ての canvas 上の x, y 座標を取得する。
            let touches = new Array(100);
            for (let i = 0; i < event.changedTouches.length; i++) {
                touches[i] = {x: 0, y: 0};
                touches[i].x = event.changedTouches[i].pageX - canvas_top_left.x;
                touches[i].y = event.changedTouches[i].pageY - canvas_top_left.y;

                if (touches[i].y < this.get_height() / 2) {
                    if (this.#fingers.upper !== null) continue;
                    this.#fingers.upper = touches[i];
                } else {
                    if (this.#fingers.lower !== null) continue;
                    this.#fingers.lower = touches[i];
                }

                // ゲーム画面タップに対する反応
                if (this.game_screen_is_overlapping(touches[i].x, touches[i].y)) {
                    this.#key.pressed(" ");
                }
            }

            this.update_key_from_finger();
        }, false);

        this.canvas.addEventListener("touchend", (event) => {
            event.preventDefault();

            // canvas の左上角の x, y 座標
            // 
            // canvas.getBoundingClientRect() => 現在、スマホ画面で見えている範囲の四角形
            // window.pageXOffset => 現在、スマホ画面で見えている範囲の左端が、ページの左端から x 軸方向にどれだけずれているか
            const canvas_top_left = {
                x: this.canvas.getBoundingClientRect().left + window.pageXOffset,
                y: this.canvas.getBoundingClientRect().top + window.pageYOffset
            }
            
            // そのときタップされた指全ての canvas 上の x, y 座標を取得する。
            let touches = new Array(100);
            for (let i = 0; i < event.changedTouches.length; i++) {
                touches[i] = {x: 0, y: 0};
                touches[i].x = event.changedTouches[i].pageX - canvas_top_left.x;
                touches[i].y = event.changedTouches[i].pageY - canvas_top_left.y;

                if (touches[i].y < this.get_height() / 2) {
                    this.#fingers.upper = null;
                } else {
                    this.#fingers.lower = null;
                }
            }

            this.update_key_from_finger();
        }, false);
    }

    set_buttons(buttons) {
        this.#buttons = buttons;
    }

    set_key(key) {
        this.#key = key;
    }

    update_key_from_finger() {
        if (this.#fingers.lower === null) {
            this.#key.released("w");
            this.#key.released("a");
            this.#key.released("s");
            this.#key.released("d");
        } else {
            if (is_overlapping({x: this.#fingers.lower.x, y: this.#fingers.lower.y, width: 0, height: 0}, this.get_controller_hit_box().lower.up)) this.#key.pressed("w");
            if (is_overlapping({x: this.#fingers.lower.x, y: this.#fingers.lower.y, width: 0, height: 0}, this.get_controller_hit_box().lower.left)) this.#key.pressed("a");
            if (is_overlapping({x: this.#fingers.lower.x, y: this.#fingers.lower.y, width: 0, height: 0}, this.get_controller_hit_box().lower.down)) this.#key.pressed("s");
            if (is_overlapping({x: this.#fingers.lower.x, y: this.#fingers.lower.y, width: 0, height: 0}, this.get_controller_hit_box().lower.right)) this.#key.pressed("d");
        }

        if (this.#fingers.upper === null) {
            this.#key.released("ArrowUp");
            this.#key.released("ArrowLeft");
            this.#key.released("ArrowDown");
            this.#key.released("ArrowRight");
        } else {
            if (is_overlapping({x: this.#fingers.upper.x, y: this.#fingers.upper.y, width: 0, height: 0}, this.get_controller_hit_box().upper.up)) this.#key.pressed("ArrowUp");
            if (is_overlapping({x: this.#fingers.upper.x, y: this.#fingers.upper.y, width: 0, height: 0}, this.get_controller_hit_box().upper.left)) this.#key.pressed("ArrowLeft");
            if (is_overlapping({x: this.#fingers.upper.x, y: this.#fingers.upper.y, width: 0, height: 0}, this.get_controller_hit_box().upper.down)) this.#key.pressed("ArrowDown");
            if (is_overlapping({x: this.#fingers.upper.x, y: this.#fingers.upper.y, width: 0, height: 0}, this.get_controller_hit_box().upper.right)) this.#key.pressed("ArrowRight");
        }
    }

    game_screen_is_overlapping(x, y) {
        const controller_ratio = 0.4; // 横幅を 1 としたときの controller 部分の縦幅

        // ボタンに重なっていなければ false
        if(!(0 < x && x < this.get_width())) return false;
        if(!(this.get_width() * controller_ratio < y && y < this.get_width() * controller_ratio + this.get_width())) return false;

        // 重なっていれば true
        return true;
    }

    update_buttons_state() {
        if (this.#key.is_w_pressed) {this.#buttons.lower.up.change_color_to_red();} else {this.#buttons.lower.up.change_color_to_white();}
        if (this.#key.is_a_pressed) {this.#buttons.lower.left.change_color_to_red();} else {this.#buttons.lower.left.change_color_to_white();}
        if (this.#key.is_s_pressed) {this.#buttons.lower.down.change_color_to_red();} else {this.#buttons.lower.down.change_color_to_white();}
        if (this.#key.is_d_pressed) {this.#buttons.lower.right.change_color_to_red();} else {this.#buttons.lower.right.change_color_to_white();}

        if (this.#key.is_arrow_up_pressed)    {this.#buttons.upper.up.change_color_to_red();} else {this.#buttons.upper.up.change_color_to_white();}
        if (this.#key.is_arrow_left_pressed)  {this.#buttons.upper.left.change_color_to_red();} else {this.#buttons.upper.left.change_color_to_white();}
        if (this.#key.is_arrow_down_pressed)  {this.#buttons.upper.down.change_color_to_red();} else {this.#buttons.upper.down.change_color_to_white();}
        if (this.#key.is_arrow_right_pressed) {this.#buttons.upper.right.change_color_to_red();} else {this.#buttons.upper.right.change_color_to_white();}
    }

    draw_buttons() {
        for (let key in this.#buttons.upper) {
            this.#buttons.upper[key].draw(this.context);
        }
    
        for (let key in this.#buttons.lower) {
            this.#buttons.lower[key].draw(this.context);
        }
    }

    get_fingers() {
        return this.#fingers;
    }

    get_width(){
        return this.canvas.width;
    }

    get_height(){
        return this.canvas.height;
    }

    // 水平方向の中心の x 座標を取得
    get_horizontal_center() {
        return this.get_width() * 0.5;
    }

    // 垂直方向のそれぞれ以下の中心の y 座標を取得
    // - canvas 全体の中心
    // - 上のコントロールパネルの中心
    // - 下のコントロールパネルの中心
    get_vertical_center() {
        return {
            total: this.get_height() * 0.5,
            upper: this.get_width() * 0.2,
            lower: this.get_width() * 1.6
        };
    }

    // 押したらボタンを押したことになる canvas の範囲
    // TODO: 名前をどうにかしたい。
    get_controller_hit_box() {
        const controller_ratio = 0.4; // 横幅を 1 としたときの controller 部分の縦幅
        const up_down_width = this.get_width() * 1.0;
        const left_right_width = this.get_width() * 0.5;
        const height = this.get_width() * controller_ratio / 3;
        const adjustment = this.get_width() * 0.001; // 左右のボタンが重ならないようにするための補正値

        return {
            upper: {
                up: {
                    x: this.get_width() * 0 + up_down_width * 0.5,
                    y: this.get_width() * 0 + height * 0.5,
                    width: up_down_width,
                    height: height
                },
                down: {
                    x: this.get_width() * 0 + up_down_width * 0.5,
                    y: this.get_width() * controller_ratio * (2 / 3) + height * 0.5,
                    width: up_down_width,
                    height: height
                },
                left: {
                    x: this.get_width() * 0 + left_right_width * 0.5,
                    y: this.get_width() * controller_ratio * (1 / 3) + height * 0.5,
                    width: left_right_width - adjustment,
                    height: height
                },
                right: {
                    x: this.get_width() * 0.5 + left_right_width * 0.5,
                    y: this.get_width() * controller_ratio * (1 / 3) + height * 0.5,
                    width: left_right_width - adjustment,
                    height: height
                }
            },
            lower: {
                up: {
                    x: this.get_width() * 0 + up_down_width * 0.5,
                    y: this.get_width() * (1.0 + controller_ratio) + height * 0.5,
                    width: up_down_width,
                    height: height
                },
                down: {
                    x: this.get_width() * 0 + up_down_width * 0.5,
                    y: this.get_width() * (1.0 + controller_ratio + controller_ratio * (2 / 3)) + height * 0.5,
                    width: up_down_width,
                    height: height
                },
                left: {
                    x: this.get_width() * 0 + left_right_width * 0.5,
                    y: this.get_width() * (1.0 + controller_ratio + controller_ratio * (1 / 3)) + height * 0.5,
                    width: left_right_width - adjustment,
                    height: height
                },
                right: {
                    x: this.get_width() * 0.5 + left_right_width * 0.5,
                    y: this.get_width() * (1.0 + controller_ratio + controller_ratio * (1 / 3)) + height * 0.5,
                    width: left_right_width - adjustment,
                    height: height
                }
            }
        };
    }
}