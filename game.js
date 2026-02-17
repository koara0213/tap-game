const { createApp } = Vue;

createApp({
    data() {
        return {
            score: 0,
            tapItems: [],
            scoreThreshold: 100,
            soundPlayed: false,
            gameActive: true
        };
    },
    mounted() {
        this.initGame();
        // 定期的に新しいアイテムを生成
        setInterval(() => {
            if (this.gameActive) {
                this.spawnNewItem();
            }
        }, 1000);
    },
    methods: {
        initGame() {
            this.score = 0;
            this.tapItems = [];
            this.soundPlayed = false;
            this.gameActive = true;
            // 初期アイテムを生成
            for (let i = 0; i < 3; i++) {
                this.spawnNewItem();
            }
        },
        spawnNewItem() {
            const items = [
                { emoji: '🍎', points: 1 },
                { emoji: '🍊', points: 1 },
                { emoji: '⭐', points: 10 },
                { emoji: '💎', points: 10 },
                { emoji: '🎁', points: 5 }
            ];

            const randomItem = items[Math.floor(Math.random() * items.length)];
            const x = Math.random() * 80; // 左右のランダム位置（80%まで）
            const y = Math.random() * 60; // 上下のランダム位置（60%まで）

            const newItem = {
                ...randomItem,
                x: x,
                y: y,
                type: randomItem.points === 1 ? 'normal' : 'special',
                isAnimating: false,
                id: Date.now() + Math.random()
            };

            this.tapItems.push(newItem);

            // 5秒後に自動削除
            setTimeout(() => {
                const index = this.tapItems.findIndex(item => item.id === newItem.id);
                if (index !== -1) {
                    this.tapItems.splice(index, 1);
                }
            }, 5000);
        },
        tapItem(index) {
            const item = this.tapItems[index];
            this.score += item.points;

            // アニメーション効果
            item.isAnimating = true;

            // 100点を超えたら効果音を再生
            if (this.score > this.scoreThreshold && !this.soundPlayed) {
                this.playCelebrationSound();
                this.soundPlayed = true;
            }

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
        resetGame() {
            if (confirm('ゲームをリセットしますか？')) {
                this.initGame();
            }
        }
    }
}).mount('#app');
