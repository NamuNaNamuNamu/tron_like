//////////////////
// canvasクラス //
/////////////////

export class Canvas{
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

    get_width(){
        return this.canvas.width;
    }

    get_height(){
        return this.canvas.height;
    }
}