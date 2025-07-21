////////////////////////////////////////
// gameクラス (ゲームについてのクラス) ///
///////////////////////////////////////

import { Player } from "./player.js" 

const FPS = 30; // Frame Per Second
const GRID_WIDTH = 80; // グリッドの横の数
const GRID_HEIGHT = 80; // グリッドの縦の数

export class Game{
    constructor(canvas, key){
        this.canvas = canvas;
        this.key = key;
    }

    // ゲームタイトル画面
    start(){
        let cool_time = FPS / 10; // 画面遷移を受け付けないクールタイム (1秒間)
        let main_loop_id = setInterval(function(game){
        //---------------------------------------------- メインループ --------------------------------------------------------------------//
            // キャンバスをまっさらに
            game.canvas.initialize()
            // 画面遷移クールタイム減少
            cool_time--;
            // ゲームタイトルを描画
            game.canvas.context.font = game.canvas.get_width() / 10 + "px serif";
            game.canvas.context.fillStyle = "rgb(0, 0, 0)";
            game.canvas.context.textAlign = "center"; //文字を中央揃えに
            game.canvas.context.fillText("トロン風ゲーム", game.canvas.get_width() / 2, game.canvas.get_height() / 2);
            game.canvas.context.font = game.canvas.get_width() / 20 + "px serif";
            game.canvas.context.fillText("画面タップ で始める", game.canvas.get_width() / 2, game.canvas.get_height() / 2 + game.canvas.get_width() * 0.1);
            
            // スペースキーに対する受け付け
            if(game.key.is_space_pressed && cool_time <= 0){
                clearInterval(main_loop_id); // メインループをいったん解除 (また play()関数 内で再開)
                game.key.released(" ");
                game.play(); // プレイ画面に遷移
            }
        //-------------------------------------------------------------------------------------------------------------------------------//
        }, 1000 / FPS, this);  // this は game のこと。setIntervalに引数として渡す。
    }

    // ゲームのプレイ画面を描画
    play(){
        let cool_time = FPS; // 画面遷移を受け付けないクールタイム (1秒間)
        let player1 = new Player(Math.floor(GRID_WIDTH * (1 / 10)), Math.floor(GRID_HEIGHT * (1 / 2)), "right", "player1");
        let player2 = new Player(Math.floor(GRID_WIDTH * (9 / 10)), Math.floor(GRID_HEIGHT * (1 / 2)), "left", "player2");
        let main_loop_id = setInterval(function(game){
        //---------------------------------------------- メインループ --------------------------------------------------------------------//
            // キャンバスをまっさらに
            game.canvas.initialize()
            // ボタンに関する処理
            game.canvas.update_buttons_state();
            game.canvas.draw_buttons();
            // 画面遷移クールタイム減少
            cool_time--;
            // グリッド ( ステージ ) の描画
            draw_grid(game.canvas);
            // 1.5秒後にスタート
            if(cool_time > 0){
                // "Ready..." を描画
                game.canvas.context.font = game.canvas.get_width() / 15 + "px serif";
                game.canvas.context.fillStyle = "rgb(0, 0, 0)";
                game.canvas.context.textAlign = "center";
                game.canvas.context.fillText("Ready...", game.canvas.get_width() / 2, game.canvas.get_height() / 2);
            }
            else if(cool_time > -(FPS / 2)){
                // "Go!" を描画
                game.canvas.context.font = game.canvas.get_width() / 15 * (1 - cool_time / FPS * 6)+ "px serif";
                game.canvas.context.fillStyle = "rgb(0, 0, 0)";
                game.canvas.context.textAlign = "center";
                game.canvas.context.fillText("Go!", game.canvas.get_width() / 2, game.canvas.get_height() / 2);
            }
            // メイン処理
            else{
                // プレイヤー 1 の処理 & 描画
                let keys = [game.key.is_w_pressed, game.key.is_a_pressed, game.key.is_s_pressed, game.key.is_d_pressed];
                player1.processing(keys); // キー入力に基づいて処理
                player1.draw(game.canvas); // 描画
                // プレイヤー 2 の処理 & 描画
                keys = [game.key.is_arrow_up_pressed, game.key.is_arrow_left_pressed, game.key.is_arrow_down_pressed, game.key.is_arrow_right_pressed];
                player2.processing(keys); // キー入力に基づいて処理
                player2.draw(game.canvas); // 描画
                // 各プレイヤーがクラッシュしたかどうかチェック
                player1.clash_check(player2); // 相手の通った道に基づいて処理
                player2.clash_check(player1); // 相手の通った道に基づいて処理
            }
            // ゲーム終了判定
            if(player1.is_clashed || player2.is_clashed){
                // 表示するメッセージの作成
                let message = "";
                if(player1.is_clashed) message = "プレイヤー2 の勝ち";
                if(player2.is_clashed) message = "プレイヤー1 の勝ち";
                if(player1.is_clashed && player2.is_clashed) message = "引き分け";
                // プレイヤーの移動をとめる
                player1.speed = 0;
                player2.speed = 0;
                // 壁の生成をストップ (正しくは, 削除し続ける)
                player1.road_traveled.pop();
                player2.road_traveled.pop();
                // メッセージを出す
                game.canvas.context.font = game.canvas.get_width() / 10 + "px serif";
                game.canvas.context.fillStyle = "rgb(0, 0, 0)";
                game.canvas.context.textAlign = "center"; //文字を中央揃えに
                game.canvas.context.fillText(message, game.canvas.get_width() / 2, game.canvas.get_height() / 2);
                game.canvas.context.font = game.canvas.get_width() / 20 + "px serif";
                game.canvas.context.fillText("画面タップ でタイトルに戻る", game.canvas.get_width() / 2, game.canvas.get_height() / 2 + game.canvas.get_width() * 0.1);
            }
            // スペースキーに対する受け付け
            if(game.key.is_space_pressed && cool_time <= 0){
                clearInterval(main_loop_id);
                game.key.released(" ");
                game.start(); // タイトル画面に遷移
            }
        //-------------------------------------------------------------------------------------------------------------------------------//
        }, 1000 / FPS, this);
    }
}

// グリッドを描く関数
function draw_grid(canvas){
    const controller_ratio = 0.4; // 横幅を 1 としたときの controller 部分の縦幅

    let square = canvas.get_width() / GRID_WIDTH; // グリッド1マスの1辺)
    for(let i = 0; i < GRID_HEIGHT; i++){
        for(let j = 0; j < GRID_WIDTH; j++){
            canvas.context.strokeStyle = "rgb(150, 150, 200)";
            canvas.context.strokeRect(j * square, canvas.get_width() * controller_ratio + i * square, square, square);
        }
    }
}