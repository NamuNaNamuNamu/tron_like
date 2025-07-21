import { Canvas } from "./canvas.js";
import { Key } from "./key.js";
import { Game } from "./game.js";

export async function setup() {
    // canvas の用意
    let canvas = new Canvas();
    // ボタンの用意
    let buttons = await make_buttons(canvas);
    canvas.set_buttons(buttons);
    let key = new Key(buttons);
    canvas.set_key(key);
    // 実際にタップ等の入力を受け付ける。ボタンやキーに反映。
    canvas.start_receiving_input();
    console.log(buttons);
    // ゲームをつかさどるオブジェクト
    let game = new Game(canvas, key);
    // ゲームを開始 (タイトル画面を表示)
    game.start();
}

async function make_buttons(canvas) {
    class Button{
        constructor(x, y, width, height, imgs){
            this.x = x;             // ボタンの横幅
            this.y = y;             // ボタンの縦幅
            this.width = width;     // ボタンの x 座標 (中心)
            this.height = height;   // ボタンの y 座標 (中心)
            this.imgs = imgs;
            this.img = this.imgs.white;
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

        is_overlapping(x, y){
            // ボタンに重なっていなければ false
            if(!(this.x - this.width * 0.5 <= x && x <= this.x + this.width * 0.5)) return false;
            if(!(this.y - this.height * 0.5 <= y && y <= this.y + this.height * 0.5)) return false;

            // 重なっていれば true
            return true;
        }

        change_color_to_red() {
            this.img = this.imgs.red;
        }

        change_color_to_white() {
            this.img = this.imgs.white;
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
            up: {
                red:   await generate_img_object(BASE_PATH + "triangle/red/up.png"),
                white: await generate_img_object(BASE_PATH + "triangle/white/up.png")
            },
            down: {
                red:   await generate_img_object(BASE_PATH + "triangle/red/down.png"),
                white: await generate_img_object(BASE_PATH + "triangle/white/down.png")
            },
            left: {
                red:   await generate_img_object(BASE_PATH + "triangle/red/left.png"),
                white: await generate_img_object(BASE_PATH + "triangle/white/left.png")
            },
            right: {
                red:   await generate_img_object(BASE_PATH + "triangle/red/right.png"),
                white: await generate_img_object(BASE_PATH + "triangle/white/right.png")
            }
        };
    } catch (error) {
        console.error(error);
    }

    // 読み込み終えたら、ボタンを実際に作成。
    const BUTTON_SIZE = canvas.get_width() * 0.13; // ボタンの一辺の長さ
    let buttons = {
        upper: {
            up: new Button(canvas.get_horizontal_center(), canvas.get_vertical_center().upper - BUTTON_SIZE, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.up),
            down: new Button(canvas.get_horizontal_center(), canvas.get_vertical_center().upper + BUTTON_SIZE, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.down),
            left: new Button(canvas.get_horizontal_center() - BUTTON_SIZE, canvas.get_vertical_center().upper, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.left),
            right: new Button(canvas.get_horizontal_center() + BUTTON_SIZE, canvas.get_vertical_center().upper, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.right),
        },
        lower: {
            up: new Button(canvas.get_horizontal_center(), canvas.get_vertical_center().lower - BUTTON_SIZE, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.up),
            down: new Button(canvas.get_horizontal_center(), canvas.get_vertical_center().lower + BUTTON_SIZE, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.down),
            left: new Button(canvas.get_horizontal_center() - BUTTON_SIZE, canvas.get_vertical_center().lower, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.left),
            right: new Button(canvas.get_horizontal_center() + BUTTON_SIZE, canvas.get_vertical_center().lower, BUTTON_SIZE, BUTTON_SIZE, triangle_imgs.right),
        }
    };

    return buttons;
}