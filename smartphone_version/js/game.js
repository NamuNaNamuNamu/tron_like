import { Canvas } from "./canvas.js";

export function game() {
    // 写真の読み込み
    let imgs = prepare_images();

    // canvas の用意
    let canvas = new Canvas();
    // ボタンの用意
    let buttons = make_buttons(canvas, imgs.triangle);

    // 最後の画像の読み込みが完了したら、ボタンを描画する。これを入れないと画像が描画されない。
    imgs.triangle.white.right.addEventListener("load", function(){
        for (let key in buttons.upper) {
            buttons.upper[key].draw(canvas.context);
        }

        for (let key in buttons.lower) {
            buttons.lower[key].draw(canvas.context);
        }
    }, false);
}

function prepare_images(){
    const BASE_PATH = "./img/";
    
    // 画像をロードして、辞書型データ形式で返却
    return {
        triangle: {
            red: {
                up: generate_img_object(BASE_PATH + "triangle/red/up.png"),
                down: generate_img_object(BASE_PATH + "triangle/red/down.png"),
                left: generate_img_object(BASE_PATH + "triangle/red/left.png"),
                right: generate_img_object(BASE_PATH + "triangle/red/right.png")
            },
            white: {
                up: generate_img_object(BASE_PATH + "triangle/white/up.png"),
                down: generate_img_object(BASE_PATH + "triangle/white/down.png"),
                left: generate_img_object(BASE_PATH + "triangle/white/left.png"),
                right: generate_img_object(BASE_PATH + "triangle/white/right.png")
            }
        }
    }

    function generate_img_object(img_path){
        let img = new Image();
        img.src = img_path;
        return img;
    }
}

function make_buttons(canvas, triangle_imgs) {
    class Button{
        constructor(x, y, width, height, img){
            this.x = x;             // ボタンの横幅
            this.y = y;             // ボタンの縦幅
            this.width = width;     // ボタンの x 座標 (中心)
            this.height = height;   // ボタンの y 座標 (中心)
            this.img = img;
        }

        // ボタン写真の描画
        draw(context){
            context.drawImage(
                this.img,  // imgs は ボタンの画像
                this.x - this.width * 0.5,  // dx (canvas の描画開始位置 x)
                this.y - this.height * 0.5,  // dy (canvas の描画開始位置 y)
                this.width,  // d_width (canvas の描画サイズ 横幅)
                this.height,  // d_height (canvas の描画サイズ 縦幅)
            );
        }

        is_clicked(finger_x, finger_y){
            // ボタンに触れていなければ false
            if(!(this.x - this.width * 0.5 <= finger_x && finger_x <= this.x + this.width * 0.5)) return false;
            if(!(this.y - this.height * 0.5 <= finger_y && finger_y <= this.y + this.height * 0.5)) return false;

            // 触れていれば true
            return true;
        }
    }

    const BUTTON_SIZE = canvas.get_width() * 0.13; // ボタンの一辺の長さ
    let buttons = {
        upper: {
            up: new Button(canvas.get_horizontal_center(), canvas.get_vertical_center().upper - BUTTON_SIZE, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.white.up),
            down: new Button(canvas.get_horizontal_center(), canvas.get_vertical_center().upper + BUTTON_SIZE, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.white.down),
            left: new Button(canvas.get_horizontal_center() - BUTTON_SIZE, canvas.get_vertical_center().upper, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.white.left),
            right: new Button(canvas.get_horizontal_center() + BUTTON_SIZE, canvas.get_vertical_center().upper, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.white.right),
        },
        lower: {
            up: new Button(canvas.get_horizontal_center(), canvas.get_vertical_center().lower - BUTTON_SIZE, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.white.up),
            down: new Button(canvas.get_horizontal_center(), canvas.get_vertical_center().lower + BUTTON_SIZE, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.white.down),
            left: new Button(canvas.get_horizontal_center() - BUTTON_SIZE, canvas.get_vertical_center().lower, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.white.left),
            right: new Button(canvas.get_horizontal_center() + BUTTON_SIZE, canvas.get_vertical_center().lower, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.white.right),
        }
    };

    return buttons;
}