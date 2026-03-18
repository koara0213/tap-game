const { createApp } = Vue;

createApp({
    data() {
        return {
            score: 0,               // 現在の得点
            tapItems: [],           // タップできるアイテムのリスト
            scoreThreshold: 100,    // 効果音を再生する得点の閾値
            soundPlayed: false,     // 効果音が再生されたかどうかのフラグ
            gameActive: true,        // ゲームがアクティブかどうかのフラグ
            images: {
                background: 'assets/background.jpg',
                apple: 'assets/apple.png',
                orange: 'assets/orange.png',
                star: 'assets/star.png',
                gem: 'assets/diamond.png',
                gift: 'assets/gift.png',
                bomb: 'assets/bomb.png'
            }
        };
    },
    mounted() {
        this.initGame();            // ゲームを初期化

        // 定期的に新しいアイテムを生成
        // 1秒ごとに spawnNewItem を呼ぶなどしてアイテムを追加
        setInterval(() => {
            if (this.gameActive) {
                this.spawnNewItem();
            }
        }, 1000);
    },
    methods: {              // Vue コンポーネントのメソッド群
        initGame() {        // ゲームの初期化
            this.score = 0;                 // 得点をリセット
            this.tapItems = [];             // タップアイテムのリストを空にする
            this.soundPlayed = false;       // 効果音再生フラグをリセット
            this.gameActive = true;         // ゲームをアクティブにする

            // 初期アイテムを生成
            for (let i = 0; i < 3; i++) {
                this.spawnNewItem();        // 最初に3つのアイテムを生成
            }
        },
        spawnNewItem() {                    // 新しいタップアイテムを生成　点数の低いものを出現率高めとする。
            const items = [
                { emoji: '🍎', points: 1, image: this.images.apple },
                { emoji: '🍎', points: 1, image: this.images.apple },   // 2回
                { emoji: '🍊', points: 1, image: this.images.orange },
                { emoji: '🍊', points: 1, image: this.images.orange },  // 2回
                { emoji: '⭐', points: 10, image: this.images.star },
                { emoji: '💎', points: 100, image: this.images.diamond },
                { emoji: '🎁', points: 5, image: this.images.gift },
                { emoji: '💣', points: -50, image: this.images.bomb },
                { emoji: '💣', points: -50, image: this.images.bomb },
                { emoji: '💣', points: -50, image: this.images.bomb },
                { emoji: '💣', points: -50, image: this.images.bomb }
            ];

            const randomItem = items[Math.floor(Math.random() * items.length)];
            // 配列からランダムにひとつ選ぶ。
            const x = Math.random() * 80; // 左右のランダム位置（80%まで）
            const y = Math.random() * 60; // 上下のランダム位置（60%まで）
            // アイテムの位置をランダムに設定。画面の80%と60%の範囲内で配置。

            const newItem = {
                ...randomItem,              // ランダムに選ばれたアイテムのプロパティを展開
                x: x,                       // アイテムのX座標
                y: y,                       // アイテムのY座標         
                type: randomItem.points === 1 ? 'normal' : 'special',
                isAnimating: false,
                id: Date.now() + Math.random(),
                animationType: this.getAnimationType(randomItem.emoji)  
            };

            this.tapItems.push(newItem);
            // リストに追加し、Vueが再描写する。

            // 5秒後に自動削除
            setTimeout(() => {
                const index = this.tapItems.findIndex(item => item.id === newItem.id);
                if (index !== -1) {
                    this.tapItems.splice(index, 1);
                }
            }, 5000);
        },
        getAnimationType(emoji) {
            switch(emoji){
                case '🍎': return 'fall';
                case '🍊': return 'slide';
                case '⭐': return 'fade';
                case '💎': return 'spiral';
                case '🎁': return 'bounce';
                case '💣': return 'default';
                default: return 'default';
            }
        },
        
        tapItem(index) {        // アイテムをタップしたときの処理
            const item = this.tapItems[index];
            this.score += item.points;
            // 得点を加算（負の値なら減点になる）。

            // アニメーション効果
            item.isAnimating = true;

            // タップするとすぐにアイテムを削除
            this.tapItems.splice(index, 1);

            // ボムなどの負のポイントの時は「残念な音」を再生
            if (item.points < 0) {
                this.playNegativeSound();
            }

            // 100点を超えたら効果音を再生
            if (this.score > this.scoreThreshold && !this.soundPlayed) {
                this.playCelebrationSound();
                this.soundPlayed = true;
            }
            // 閾値を超え、まだ音を鳴らしていなければ
            // お祝いの音を再生し、フラグを立てる。

            // アイテムを削除
            setTimeout(() => {
                const currentIndex = this.tapItems.findIndex(t => t.id === item.id);
                if (currentIndex !== -1) {
                    this.tapItems.splice(currentIndex, 1);
                }
            }, 300);

            // 新しいアイテムを生成
            this.spawnNewItem();
        },
        playCelebrationSound() {
            // Web Audio APIを使ってシンプルな音を生成
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            // 音のパラメータ
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.2);
            
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        },

        playNegativeSound() {
            // Web Audio APIを使ってシンプルな「残念な音」を生成
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.type = 'sawtooth';
            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            const now = audioContext.currentTime;
            const duration = 1.2; // 再生時間を長く

            // 低めの周波数で短く下がる音（残念サウンド）
            oscillator.frequency.setValueAtTime(330, now);
            oscillator.frequency.exponentialRampToValueAtTime(80, now + duration * 0.9);
            
            gain.gain.setValueAtTime(0.6, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

            oscillator.start(now);
            oscillator.stop(now + duration);
        },

        resetGame() {
            // リセットボタンなどから呼ばれ、ゲームをリセットする処理
            if (confirm('ゲームをリセットしますか？')) {
                this.initGame();
            }
        }
    }
}).mount('#app');
// Vueアプリケーションを#app要素にマウントする。
