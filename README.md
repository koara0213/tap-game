# タップゲーム 🎮

Vue.js を使用したシンプルなタップゲームです。

## ゲーム説明

- **基本ルール**：画面に現れたアイテムをタップしてスコアを獲得
- **通常アイテム（🍎🍊）**：1点
- **スペシャルアイテム（⭐💎🎁）**：5～10点
- **100点達成**：音が鳴ります🎉

## 機能

- ✅ リアルタイムスコア表示
- ✅ ランダムにアイテムが出現（5秒で消える）
- ✅ タップアニメーション
- ✅ 100点達成時の効果音
- ✅ ゆるキャラのアニメーション
- ✅ リセット機能

## ローカルで遊ぶ方法

1. `index.html` をブラウザで直接開く
2. または、簡易サーバーで起動：
```bash
# Python 3の場合
python -m http.server 8000

# Node.jsのhttp-serverを使う場合
npx http-server
```

その後、`http://localhost:8000` にアクセス

## GitHub Pages で公開

1. GitHub にリポジトリを作成
2. このフォルダの内容を push
3. Settings → Pages で以下を設定：
   - Source: Deploy from a branch
   - Branch: main (root ディレクトリを選択)
4. 完了後、自動的に `https://username.github.io/tap-game` で公開されます

## ファイル構成

```
tap-game/
├── index.html     # メインのゲーム画面
├── game.js        # Vue.js のゲームロジック
├── style.css      # スタイルとアニメーション
├── assets/        # 画像・音ファイル用
│   ├── images/
│   └── sounds/
└── README.md      # このファイル
```

## 技術スタック

- **Vue.js 3** (CDN経由)
- **JavaScript** (Vanilla)
- **CSS3** (アニメーション対応)
- **Web Audio API** (効果音生成)

## 対応ブラウザ

- Chrome / Firefox / Safari (デスクトップ・モバイル)
- iPhone Safari ✅

## カスタマイズ例

`game.js` で以下を調整可能：

```javascript
// スコア閾値を変更
scoreThreshold: 100,

// アイテム出現速度を変更
setInterval(() => { ... }, 1000); // 1000ms → ここを編集

// ポイント値を変更
{ emoji: '⭐', points: 10 },
```

## 今後の拡張案

- 🎯 レベルシステム（難易度上昇）
- 🎵 背景音楽追加
- 🏆 ローカルストレージでスコア保存
- 🌈 テーマ選択機能
- 🎨 カスタムキャラクター

---

楽しいゲームをお楽しみください！ 🎮
