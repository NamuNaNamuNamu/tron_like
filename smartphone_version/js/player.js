//////////////////////////////////////////
// playerクラス (playerについてのクラス) //
/////////////////////////////////////////

const GRID_WIDTH = 80; // グリッドの横の数
const GRID_HEIGHT = 80; // グリッドの縦の数

export class Player{
    constructor(x, y, direction, name){
        this.x = x; // x座標 (grid基準)
        this.y = y; // y座標 (grid基準)
        this.direction = direction; // 進行方向 ("up", "left", "down", "right")
        this.name = name;
        this.speed = 1; // 動くスピード
        this.is_clashed = false; // クラッシュしたかどうか
        this.road_traveled = [[this.x, this.y]]; // 通った道を格納しておく配列 例) [[24, 35],[24, 36]]
    }
    // メイン処理
    processing(keys){
        this.dash(keys);
        this.move(keys);
    }

    // サブ処理
    dash(keys){
        // 未実装
    }

    move(keys){
        //// 複数キー押されていたら、元々進んでいた方向に進む
        let count = 0;
        for(let i = 0; i < keys.length; i++){
            if(keys[i]){
                count++;
            }
        }
        //// 押されていたキーが1つであれば、そのキーの方向に変える (ただし、自分の進行方向と逆には行かせない)
        if(count == 1){
            // 上キー
            if(keys[0] && !(this.direction == "down")) this.direction = "up";
            // 左キー
            if(keys[1] && !(this.direction == "right")) this.direction = "left";
            // 下キー
            if(keys[2] && !(this.direction == "up")) this.direction = "down";
            // 右キー
            if(keys[3] && !(this.direction == "left")) this.direction = "right";
        }
        //// 実際に進む
        switch(this.direction){
            case "up":
                this.y = this.y - this.speed;
                break;
            case "left":
                this.x = this.x - this.speed;
                break;
            case "down":
                this.y = this.y + this.speed;
                break;
            case "right":
                this.x = this.x + this.speed;
                break;
        }
        //// 壁を作成
        this.road_traveled.push([this.x, this.y]);
    }

    clash_check(opponent){
        // 壁に当たった時の処理
        let walls = this.road_traveled.slice(0, -1).concat(opponent.road_traveled); // slice は 配列を部分的に取り出す(引数1 のインデックスから 引数2のインデックスの1つ手前まで)。concat は 2つの配列を連結させる
        for(let wall of walls){
            if(this.x == wall[0] && this.y == wall[1]) this.is_clashed = true;
        }
        // 画面外に出た場合の処理
        if(this.x < 0 || this.x >= GRID_WIDTH || this.y < 0 || this.y >= GRID_HEIGHT) this.is_clashed = true;
    }

    // 描画処理
    draw(canvas){
        const controller_ratio = 0.4; // 横幅を 1 としたときの controller 部分の縦幅
        let square = canvas.get_width() / GRID_WIDTH; // グリッド1マスの1辺
        // 壁の描画
        for(let wall of this.road_traveled){
            if(this.name == "player1") canvas.context.fillStyle = "rgb(200, 30, 30)";
            if(this.name == "player2") canvas.context.fillStyle = "rgb(30, 30, 200)"; 
            canvas.context.fillRect(wall[0] * square, canvas.get_width() * controller_ratio + wall[1] * square, square, square);
        }
        // プレイヤーの描画
        if(this.name == "player1") canvas.context.fillStyle = "rgb(100, 30, 30)";
        if(this.name == "player2") canvas.context.fillStyle = "rgb(30, 30, 100)";
        canvas.context.fillRect(this.x * square, canvas.get_width() * controller_ratio + this.y * square, square, square);
    }
}