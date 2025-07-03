import { Canvas } from "./canvas.js";

export async function game() {
    // canvas の用意
    let canvas = new Canvas();
    // ボタンの用意
    let buttons = await make_buttons(canvas);

    // 最後の画像の読み込みが完了したら、ボタンを描画する。
    // TODO: 描画処理はメインループ中で行うように要修正
    for (let key in buttons.upper) {
        buttons.upper[key].draw(canvas.context);
    }

    for (let key in buttons.lower) {
        buttons.lower[key].draw(canvas.context);
    }
}

async function make_buttons(canvas) {
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

    // 必要な画像の Image オブジェクトの用意
    // 画像を読みこみ終えるまで待つ。
    async function generate_img_object(path){
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = path;

            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("画像の読み込み失敗。パス: " + imp_path));
        });
    }

    let triangle_imgs;
    try {
        const BASE_PATH = "./img/";
        triangle_imgs = {
            red: {
                up: await generate_img_object(BASE_PATH + "triangle/red/up.png"),
                down: await generate_img_object(BASE_PATH + "triangle/red/down.png"),
                left: await generate_img_object(BASE_PATH + "triangle/red/left.png"),
                right: await generate_img_object(BASE_PATH + "triangle/red/right.png")
            },
            white: {
                up: await generate_img_object(BASE_PATH + "triangle/white/up.png"),
                down: await generate_img_object(BASE_PATH + "triangle/white/down.png"),
                left: await generate_img_object(BASE_PATH + "triangle/white/left.png"),
                right: await generate_img_object(BASE_PATH + "triangle/white/right.png")
            }
        };
    } catch (error) {
        console.error(error);
    }

    // 読み込み終えたら、ボタンを実際に作成。
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