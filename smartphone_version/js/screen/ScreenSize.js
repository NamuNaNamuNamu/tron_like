// 画面は縦に長い長方形。縦 : 横 = 1.8 : 1
// - ゲーム画面が正方形 (1 : 1)
// - その上下にコントロールパネル (0.4 : 1) が 1 つずつ。

export class ScreenSize {
    static #ratio = {
        width: 1,
        height: 1.8
    };

    // ウィンドウに合わせた画面サイズを取得
    static get_size_to_fit_window() {
        const ADJUSTMENT = 0.96;
        const window_width = document.documentElement.clientWidth;
        const window_height = document.documentElement.clientHeight;

        let width;
        let height;

        // 縦にめいっぱい
        if (window_width / this.#ratio.width  > window_height / this.#ratio.height){
            width  = window_height / this.#ratio.height;
            height = window_height;
        }
        // 横にめいっぱい
        else {
            width  = window_width;
            height = window_width * this.#ratio.height;
        }

        width  *= ADJUSTMENT;
        height *= ADJUSTMENT;

        return {
            width: width,
            height: height
        }
    }
}