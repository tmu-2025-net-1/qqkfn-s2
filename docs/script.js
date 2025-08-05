// 花の詩 - インタラクティブタイポグラフィ JavaScript

/* ============================================
   初期化とセットアップ
============================================ */

// GSAP ScrollTriggerプラグインを登録
gsap.registerPlugin(ScrollTrigger);

// 花言葉データベース
const hanakotobaDatabase = {
    hydrangea: ['変わりやすい心', '移り気', '家族の結びつき', '辛抱強い愛情'],
    cosmos: ['調和', '謙虚', '美しさ', '乙女の真心'],
    tulip: ['愛の告白', '思いやり', '博愛', '正直'],
    sunflower: ['憧れ', '熱愛', 'あなただけを見つめる', '情熱']
};

// 花占いメッセージ
const fortuneMessages = [
    'すき ', 'きらい', 'すき ', 'きらい', 'すき ', 'きらい', 'すき ', 'きらい'
];

/* ============================================
   カーソル追随花びらエフェクト
============================================ */

class CursorPetals {
    constructor() {
        this.container = document.getElementById('cursor-petals');
        this.petals = [];
        this.isMouseMoving = false;
        this.lastMouseMove = 0;
        this.orbitContainer = null;
        
        this.init();
        this.createOrbitSystem();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
    
    createOrbitSystem() {
        // 常時回転するパーティクル軌道システムを作成
        this.orbitContainer = document.createElement('div');
        this.orbitContainer.className = 'cursor-orbit';
        
        // 4つの軌道パーティクルを作成
        for (let i = 0; i < 4; i++) {
            const particle = document.createElement('div');
            particle.className = 'orbit-particle';
            this.orbitContainer.appendChild(particle);
        }
        
        document.body.appendChild(this.orbitContainer);
        
        // マウス移動に合わせて軌道システムを移動
        document.addEventListener('mousemove', (e) => {
            if (this.orbitContainer) {
                this.orbitContainer.style.left = e.clientX + 'px';
                this.orbitContainer.style.top = e.clientY + 'px';
            }
        });
    }
    
    onMouseMove(e) {
        this.isMouseMoving = true;
        this.lastMouseMove = Date.now();
        
        // ランダムに花びらを生成（確率を下げてパフォーマンス向上）
        if (Math.random() > 0.8) {
            // 通常の花びらと回転する花びらをランダムに生成
            if (Math.random() > 0.6) {
                this.createSpinningPetal(e.clientX, e.clientY);
            } else {
                this.createPetal(e.clientX, e.clientY);
            }
        }
        
        // マウス停止検知
        setTimeout(() => {
            if (Date.now() - this.lastMouseMove >= 100) {
                this.isMouseMoving = false;
            }
        }, 100);
    }
    
    createPetal(x, y) {
        const petal = document.createElement('div');
        petal.className = 'cursor-petal';
        
        // ランダムな色とサイズ
        const colors = ['#ff6b9d', '#ff8fab', '#ffb3c6', '#ffc1d3'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const randomSize = Math.random() * 8 + 5;
        
        petal.style.left = (x - randomSize/2) + 'px';
        petal.style.top = (y - randomSize/2) + 'px';
        petal.style.width = randomSize + 'px';
        petal.style.height = randomSize + 'px';
        petal.style.background = `radial-gradient(circle, ${randomColor}, transparent)`;
        
        // ランダムな方向とスピード
        const randomX = (Math.random() - 0.5) * 100;
        const randomY = Math.random() * 100 + 50;
        
        petal.style.setProperty('--drift-x', randomX + 'px');
        petal.style.setProperty('--drift-y', randomY + 'px');
        
        this.container.appendChild(petal);
        
        // アニメーション完了後に削除
        setTimeout(() => {
            if (petal.parentNode) {
                petal.parentNode.removeChild(petal);
            }
        }, 3000);
    }
}

/* ============================================
   スクロール制御とアニメーション
============================================ */

class ScrollAnimations {
    constructor() {
        this.sections = document.querySelectorAll('.flower-section');
        this.currentSection = 0;
        
        this.init();
    }
    
    init() {
        this.setupScrollTriggers();
        this.setupTextAnimations();
        this.setupColorTransitions();
        this.setupPoemRandomPosition(); // 詩のランダム配置を初期化
        this.setupHanakotobaRandomPosition(); // 花言葉のランダム配置を初期化
        
        // ScrollTriggerの状態をログ出力（再利用可能 - デバッグ時にコメントを外す）
        // setTimeout(() => {
        //     console.log('🔍 ScrollTrigger 初期状態チェック:');
        //     ScrollTrigger.getAll().forEach((trigger, index) => {
        //         console.log(`Trigger ${index}:`, {
        //             id: trigger.vars.id,
        //             isActive: trigger.isActive,
        //             progress: trigger.progress,
        //             start: trigger.start,
        //             end: trigger.end
        //         });
        //     });
        // }, 1000);
    }
    
    setupScrollTriggers() {
        this.sections.forEach((section, index) => {
            // デバッグ用の状態表示要素を追加（再利用可能 - デバッグ時にコメントを外す）
            // this.addDebugIndicator(section, index);
            
            // セクション全体のアニメーション
            ScrollTrigger.create({
                trigger: section,
                start: "top center", // ビューポートの中央にセクションの上端が来た時に開始
                end: "bottom center", // ビューポートの中央をセクションの下端が通過した時に終了
                toggleClass: {targets: section, className: "active"}, // 範囲内にある間 'active' クラスを付与
                id: `section-${index}-${section.dataset.flower}`, // デバッグ用ID
                onToggle: (self) => {
                    // 詳細ログ出力（再利用可能 - デバッグ時にコメントを外す）
                    // console.log(`🎯 ScrollTrigger Toggle - セクション ${index + 1} (${section.dataset.flower}):`, {
                    //     isActive: self.isActive,
                    //     progress: self.progress,
                    //     direction: self.direction,
                    //     start: self.start,
                    //     end: self.end
                    // });
                    
                    if (self.isActive) {
                        this.activateSection(section, index);
                    } else {
                        this.deactivateSection(section);
                    }
                    
                    // デバッグインジケーターを更新（再利用可能 - デバッグ時にコメントを外す）
                    // this.updateDebugIndicator(section, self.isActive);
                }
                // 詳細イベントログ（再利用可能 - デバッグ時にコメントを外す）
                // onEnter: () => {
                //     console.log(`⬇️ ScrollTrigger Enter - セクション ${index + 1} (${section.dataset.flower})`);
                // },
                // onLeave: () => {
                //     console.log(`⬆️ ScrollTrigger Leave - セクション ${index + 1} (${section.dataset.flower})`);
                // },
                // onEnterBack: () => {
                //     console.log(`⬆️ ScrollTrigger EnterBack - セクション ${index + 1} (${section.dataset.flower})`);
                // },
                // onLeaveBack: () => {
                //     console.log(`⬇️ ScrollTrigger LeaveBack - セクション ${index + 1} (${section.dataset.flower})`);
                // }
            });
            
            // 花の名前のストロークアニメーション
            const strokePath = section.querySelector('.stroke-path');
            if (strokePath) {
                gsap.set(strokePath, {strokeDasharray: 200, strokeDashoffset: 200});
                
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 70%",
                    onEnter: () => {
                        gsap.to(strokePath, {
                            strokeDashoffset: 0,
                            duration: 2,
                            ease: "power2.inOut"
                        });
                    }
                });
            }
            
            // 花のアイコンアニメーション
            const flowerIcon = section.querySelector('.flower-icon');
            if (flowerIcon) {
                gsap.set(flowerIcon, {scale: 0, rotation: 0, opacity: 0});
                
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 60%",
                    onEnter: () => {
                        gsap.to(flowerIcon, {
                            scale: 1,
                            rotation: 360,
                            opacity: 1,
                            duration: 1.5,
                            ease: "back.out(1.7)",
                            delay: 1
                        });
                    }
                });
            }
        });
    }
    
    setupTextAnimations() {
        this.sections.forEach(section => {
            const meaningTexts = section.querySelectorAll('.meaning-text');
            
            meaningTexts.forEach((text, index) => {
                gsap.set(text, {y: 20, opacity: 0});
                
                ScrollTrigger.create({
                    trigger: section,
                    start: "top 50%",
                    onEnter: () => {
                        gsap.to(text, {
                            y: 0,
                            opacity: 1,
                            duration: 0.8,
                            ease: "power2.out",
                            delay: index * 0.2
                        });
                    }
                });
            });
        });
    }
    
    setupColorTransitions() {
        this.sections.forEach((section, index) => {
            const objectElement = section.querySelector('.flower-svg');
            
            ScrollTrigger.create({
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;
                    this.updateFlowerColors(objectElement, progress, section.dataset.flower);
                }
            });
        });
        
        // すべての花セクション：スクロールのたびに花言葉をランダム再配置
        const flowerSections = document.querySelectorAll('.flower-section');
        flowerSections.forEach(section => {
            const flowerType = section.getAttribute('data-flower');
            ScrollTrigger.create({
                trigger: section,
                start: "top center",
                end: "bottom center",
                onEnter: () => {
                    this.randomizeHanakotobaForSection(section);
                },
                onEnterBack: () => {
                    this.randomizeHanakotobaForSection(section);
                }
            });
        });
    }
    
    randomizeHanakotobaForSection(section) {
        // 指定されたセクションの花言葉をランダムに再配置
        if (!section) return;
        
        const flowerType = section.getAttribute('data-flower');
        const hanakotobaWords = section.querySelectorAll('.hanakotoba-word, .hanakotoba-vertical');
        
        hanakotobaWords.forEach((wordElement, index) => {
            // 少し遅延を加えて順次変更
            setTimeout(() => {
                this.positionHanakotobaWordRandomly(wordElement, index);
            }, index * 100);
        });
        
        console.log(`🌸 ${flowerType}の花言葉をランダムに再配置しました`);
    }
    
    setupPoemRandomPosition() {
        // 紫陽花セクションの詩のランダム配置を設定
        const hydrangeaSection = document.querySelector('.flower-section[data-flower="hydrangea"]');
        if (!hydrangeaSection) return;
        
        const poemContainer = hydrangeaSection.querySelector('.poem-text-vertical');
        if (!poemContainer) return;
        
        // ウィンドウサイズに応じて配置を調整
        this.positionPoemRandomly(poemContainer);
        
        // ウィンドウリサイズ時に再配置
        window.addEventListener('resize', () => {
            setTimeout(() => {
                this.positionPoemRandomly(poemContainer);
            }, 100);
        });
    }
    
    positionPoemRandomly(poemElement) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // レスポンシブに対応した配置範囲の計算
        let rightRange, topRange, maxHeight;
        
        if (windowWidth <= 480) {
            // スマートフォン
            rightRange = { min: 2, max: 15 };
            topRange = { min: 20, max: 40 };
            maxHeight = Math.min(400, windowHeight * 0.7);
        } else if (windowWidth <= 768) {
            // タブレット
            rightRange = { min: 5, max: 25 };
            topRange = { min: 15, max: 35 };
            maxHeight = Math.min(500, windowHeight * 0.8);
        } else if (windowWidth <= 1024) {
            // 小さなデスクトップ/大きなタブレット
            rightRange = { min: 8, max: 30 };
            topRange = { min: 10, max: 30 };
            maxHeight = Math.min(600, windowHeight * 0.85);
        } else {
            // デスクトップ
            rightRange = { min: 10, max: 35 };
            topRange = { min: 5, max: 25 };
            maxHeight = Math.min(800, windowHeight * 0.9);
        }
        
        // ランダムな位置を計算（セーフゾーン内）
        const randomRight = rightRange.min + Math.random() * (rightRange.max - rightRange.min);
        const randomTop = topRange.min + Math.random() * (topRange.max - topRange.min);
        
        // 要素の高さを動的に調整
        const adjustedHeight = Math.min(maxHeight, windowHeight * 0.7);
        
        // CSS変数を使用して位置を設定
        poemElement.style.right = `${randomRight}%`;
        poemElement.style.top = `${randomTop}%`;
        poemElement.style.height = `${adjustedHeight}px`;
        
        // 詩の文字サイズも調整
        if (windowWidth <= 360) {
            poemElement.style.fontSize = '12px';
        } else if (windowWidth <= 480) {
            poemElement.style.fontSize = '14px';
        } else if (windowWidth <= 768) {
            poemElement.style.fontSize = '16px';
        } else {
            poemElement.style.fontSize = '18px';
        }
        
        // デバッグ用ログ（開発時にコメントアウト可能）
        console.log(`🌸 詩の配置: right: ${randomRight.toFixed(1)}%, top: ${randomTop.toFixed(1)}%, height: ${adjustedHeight}px`);
    }
    
    setupHanakotobaRandomPosition() {
        // すべての花セクションの花言葉のランダム配置を設定
        const flowerSections = document.querySelectorAll('.flower-section');
        
        flowerSections.forEach(section => {
            const hanakotobaWords = section.querySelectorAll('.hanakotoba-word');
            if (!hanakotobaWords.length) return;
            
            // 各花言葉を個別にランダム配置
            hanakotobaWords.forEach((wordElement, index) => {
                this.positionHanakotobaWordRandomly(wordElement, index);
            });
        });
        
        // ウィンドウリサイズ時に再配置
        window.addEventListener('resize', () => {
            setTimeout(() => {
                flowerSections.forEach(section => {
                    const hanakotobaWords = section.querySelectorAll('.hanakotoba-word');
                    hanakotobaWords.forEach((wordElement, index) => {
                        this.positionHanakotobaWordRandomly(wordElement, index);
                    });
                });
            }, 100);
        });
    }
    
    positionHanakotobaWordRandomly(wordElement, index) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // レスポンシブに対応した配置範囲の計算（詩とは異なる位置、各単語も重ならないように配置）
        let leftRange, topRange, maxHeight;
        
        // 最初の花言葉（「変わりやすい心」）をより上に配置
        const isFirstWord = index === 0;
        const topOffset = isFirstWord ? -10 : 0; // 最初の花言葉を10%上に
        
        if (windowWidth <= 480) {
            // スマートフォン - 縦に並べる
            leftRange = { min: 5, max: 25 };
            topRange = { 
                min: Math.max(5, 20 + (index * 25) + topOffset), 
                max: Math.max(20, 35 + (index * 25) + topOffset) 
            };
            maxHeight = Math.min(200, windowHeight * 0.45);
        } else if (windowWidth <= 768) {
            // タブレット - 少し広がりを持たせる
            leftRange = { min: 8, max: 35 };
            topRange = { 
                min: Math.max(5, 15 + (index * 20) + topOffset), 
                max: Math.max(20, 30 + (index * 20) + topOffset) 
            };
            maxHeight = Math.min(250, windowHeight * 0.5);
        } else if (windowWidth <= 1024) {
            // 小さなデスクトップ - より自由な配置
            leftRange = { min: 10, max: 40 };
            topRange = { 
                min: Math.max(3, 10 + (index * 18) + topOffset), 
                max: Math.max(18, 25 + (index * 18) + topOffset) 
            };
            maxHeight = Math.min(280, windowHeight * 0.6);
        } else {
            // デスクトップ - 最も自由な配置
            leftRange = { min: 12, max: 45 };
            topRange = { 
                min: Math.max(2, 8 + (index * 15) + topOffset), 
                max: Math.max(15, 20 + (index * 15) + topOffset) 
            };
            maxHeight = Math.min(300, windowHeight * 0.6);
        }
        
        // ランダムな位置を計算（詩とは逆側、各単語は重ならないよう調整）
        const randomLeft = leftRange.min + Math.random() * (leftRange.max - leftRange.min);
        const randomTop = Math.min(topRange.min + Math.random() * (topRange.max - topRange.min), 80); // 80%を超えないよう制限
        
        // 要素の高さを動的に調整
        const adjustedHeight = Math.min(maxHeight, windowHeight * 0.4);
        
        // ランダムなフォントサイズ (18px〜30px)
        const randomFontSize = 18 + Math.random() * (30 - 18);
        
        // ランダムな透明度 (50%〜80%)
        const randomOpacity = 0.5 + Math.random() * (0.8 - 0.5);
        
        // CSS変数を使用して位置とスタイルを設定
        wordElement.style.left = `${randomLeft}%`;
        wordElement.style.top = `${randomTop}%`;
        wordElement.style.height = `${adjustedHeight}px`;
        wordElement.style.fontSize = `${randomFontSize}px`;
        wordElement.style.opacity = randomOpacity;
        
        // random-styleクラスを追加してトランジション効果を適用
        wordElement.classList.add('random-style');
        
        // レスポンシブ時のベースフォントサイズも維持（ランダムサイズに上書きされる）
        if (windowWidth <= 360) {
            // 最小サイズは保持しつつランダム化
            const minSize = 11;
            const adjustedRandomSize = Math.max(minSize, randomFontSize * 0.7);
            wordElement.style.fontSize = `${adjustedRandomSize}px`;
        } else if (windowWidth <= 480) {
            const minSize = 12;
            const adjustedRandomSize = Math.max(minSize, randomFontSize * 0.8);
            wordElement.style.fontSize = `${adjustedRandomSize}px`;
        } else if (windowWidth <= 768) {
            const minSize = 14;
            const adjustedRandomSize = Math.max(minSize, randomFontSize * 0.9);
            wordElement.style.fontSize = `${adjustedRandomSize}px`;
        }
        
        // デバッグ用ログ（開発時にコメントアウト可能）
        console.log(`🌺 花言葉${index + 1}の配置: left: ${randomLeft.toFixed(1)}%, top: ${randomTop.toFixed(1)}%, fontSize: ${randomFontSize.toFixed(1)}px, opacity: ${randomOpacity.toFixed(2)}`);
    }
    
    updateFlowerColors(objectElement, progress, flowerType) {
        // SVGが読み込まれていない場合は何もしない
        if (!objectElement.classList.contains('flower-svg-loaded')) {
            return;
        }
        
        const svgDoc = objectElement.contentDocument;
        if (!svgDoc) return;
        
        const petals = svgDoc.querySelectorAll('.petal');
        
        petals.forEach(petal => {
            this.updatePetalColor(petal, progress, flowerType);
        });
    }
    
    updatePetalColor(petal, progress, flowerType) {
        const colorMaps = {
            hydrangea: ['#9b59b6', '#8e44ad', '#6B73FF'],
            cosmos: ['#e74c3c', '#c0392b', '#FF6B9D'],
            tulip: ['#e67e22', '#d35400', '#FF9500'],
            sunflower: ['#f1c40f', '#f39c12', '#FFD700']
        };
        
        const colors = colorMaps[flowerType] || colorMaps.hydrangea;
        const colorIndex = Math.floor(progress * (colors.length - 1));
        const nextColorIndex = Math.min(colorIndex + 1, colors.length - 1);
        const localProgress = (progress * (colors.length - 1)) % 1;
        
        // 色の補間
        const currentColor = this.hexToRgb(colors[colorIndex]);
        const nextColor = this.hexToRgb(colors[nextColorIndex]);
        
        const interpolatedColor = {
            r: Math.round(currentColor.r + (nextColor.r - currentColor.r) * localProgress),
            g: Math.round(currentColor.g + (nextColor.g - currentColor.g) * localProgress),
            b: Math.round(currentColor.b + (nextColor.b - currentColor.b) * localProgress)
        };
        
        petal.setAttribute('fill', `rgb(${interpolatedColor.r}, ${interpolatedColor.g}, ${interpolatedColor.b})`);
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    
    activateSection(section, index) {
        section.classList.add('active');
        this.currentSection = index;
        
        // 花言葉の順次アニメーションを開始
        this.animateHanakotobaSequentially(section, true);
        
        // 基本ログ（再利用可能 - デバッグ時にコメントを外す）
        // console.log(`✨ セクション ${index + 1} (${section.dataset.flower}) がアクティブになりました`);
        
        // 詳細スタイル情報ログ（再利用可能 - 問題調査時にコメントを外す）
        // const computedStyle = window.getComputedStyle(section);
        // console.log(`🎨 セクションの計算済みスタイル:`, {
        //     opacity: computedStyle.opacity,
        //     backgroundColor: computedStyle.backgroundColor,
        //     transform: computedStyle.transform,
        //     filter: computedStyle.filter,
        //     zIndex: computedStyle.zIndex
        // });
        
        // 花のコンテナの状態も確認（再利用可能 - 問題調査時にコメントを外す）
        // const container = section.querySelector('.flower-container');
        // const containerStyle = window.getComputedStyle(container);
        // console.log(`🌸 花コンテナの計算済みスタイル:`, {
        //     opacity: containerStyle.opacity,
        //     transform: containerStyle.transform,
        //     filter: containerStyle.filter
        // });
        
        // 花言葉テキストの状態も確認（再利用可能 - 問題調査時にコメントを外す）
        // const meaningTexts = section.querySelectorAll('.meaning-text');
        // meaningTexts.forEach((text, textIndex) => {
        //     const textStyle = window.getComputedStyle(text);
        //     console.log(`📝 花言葉テキスト ${textIndex + 1} スタイル:`, {
        //         opacity: textStyle.opacity,
        //         color: textStyle.color,
        //         transform: textStyle.transform
        //     });
        // });
        
        // リアルタイム状態表示を更新（再利用可能 - デバッグ時にコメントを外す）
        // this.updateActiveStatusDisplay(index, section.dataset.flower);
    }
    
    deactivateSection(section) {
        section.classList.remove('active');
        
        // 花言葉の順次非表示アニメーションを開始
        this.animateHanakotobaSequentially(section, false);
        
        // console.log(`💤 セクション (${section.dataset.flower}) が非アクティブになりました`);
    }

    // デバッグ用のインジケーターを各セクションに追加（再利用可能 - デバッグ時にコメントを外す）
    // addDebugIndicator(section, index) {
    //     const indicator = document.createElement('div');
    //     indicator.className = 'debug-indicator';
    //     indicator.innerHTML = `
    //         <div class="debug-info">
    //             <span class="section-name">${section.dataset.flower}</span>
    //             <span class="section-number">#${index + 1}</span>
    //             <span class="status">INACTIVE</span>
    //         </div>
    //     `;
    //     indicator.style.cssText = `
    //         position: absolute;
    //         top: 10px;
    //         right: 10px;
    //         background: rgba(0, 0, 0, 0.8);
    //         color: white;
    //         padding: 5px 10px;
    //         border-radius: 5px;
    //         font-size: 12px;
    //         font-family: monospace;
    //         z-index: 100;
    //         border: 2px solid #666;
    //     `;
    //     section.style.position = 'relative';
    //     section.appendChild(indicator);
    // }

    // デバッグインジケーターの状態を更新（再利用可能 - デバッグ時にコメントを外す）
    // updateDebugIndicator(section, isActive) {
    //     const indicator = section.querySelector('.debug-indicator');
    //     const status = indicator.querySelector('.status');
    //     
    //     if (isActive) {
    //         status.textContent = 'ACTIVE';
    //         status.style.color = '#00ff00';
    //         indicator.style.borderColor = '#00ff00';
    //         indicator.style.boxShadow = '0 0 10px rgba(0, 255, 0, 0.5)';
    //     } else {
    //         status.textContent = 'INACTIVE';
    //         status.style.color = '#ff6666';
    //         indicator.style.borderColor = '#666';
    //         indicator.style.boxShadow = 'none';
    //     }
    // }

    // リアルタイム状態表示（画面右上に表示）（再利用可能 - デバッグ時にコメントを外す）
    // updateActiveStatusDisplay(index, flowerName) {
    //     let statusDisplay = document.getElementById('active-status-display');
    //     if (!statusDisplay) {
    //         statusDisplay = document.createElement('div');
    //         statusDisplay.id = 'active-status-display';
    //         statusDisplay.style.cssText = `
    //             position: fixed;
    //             top: 20px;
    //             right: 20px;
    //             background: rgba(0, 0, 0, 0.9);
    //             color: #00ff00;
    //             padding: 10px 15px;
    //             border-radius: 8px;
    //             font-family: monospace;
    //             font-size: 14px;
    //             z-index: 1000;
    //             border: 2px solid #00ff00;
    //             box-shadow: 0 0 15px rgba(0, 255, 0, 0.3);
    //         `;
    //         document.body.appendChild(statusDisplay);
    //     }
    //     
    //     statusDisplay.innerHTML = `
    //         <div>🌸 ACTIVE SECTION</div>
    //         <div>📍 ${flowerName} (#${index + 1})</div>
    //         <div>⏱️ ${new Date().toLocaleTimeString()}</div>
    //     `;
    // }

    // 花言葉の順次アニメーション
    animateHanakotobaSequentially(section, isVisible) {
        const hanakotobaWords = section.querySelectorAll('.hanakotoba-word, .hanakotoba-vertical');
        const meaningLines = section.querySelectorAll('.meaning-line');
        
        if (isVisible) {
            // 順次表示
            hanakotobaWords.forEach((word, index) => {
                setTimeout(() => {
                    word.classList.remove('hidden');
                    word.classList.add('visible');
                }, index * 300); // 300ms間隔で順次表示
            });
            
            // 花言葉の各行も順次表示
            meaningLines.forEach((line, index) => {
                setTimeout(() => {
                    line.classList.remove('hidden');
                    line.classList.add('visible');
                }, (hanakotobaWords.length * 300) + (index * 200)); // 花言葉の後に表示
            });
        } else {
            // 順次非表示（逆順）
            const allElements = [...hanakotobaWords, ...meaningLines];
            allElements.reverse().forEach((element, index) => {
                setTimeout(() => {
                    element.classList.remove('visible');
                    element.classList.add('hidden');
                }, index * 150); // 150ms間隔で順次非表示
            });
        }
    }
}

/* ============================================
   花のインタラクション
============================================ */

class FlowerInteractions {
    constructor() {
        this.svgLoadPromises = [];
        this.resetTimers = new Map(); // 花びらリセット用タイマー管理
        this.init();
    }
    
    init() {
        this.setupSVGLoading();
        this.setupHoverEffects();
        this.setupFortuneGame();
    }
    
    setupSVGLoading() {
        const objectElements = document.querySelectorAll('.flower-svg');
        const nameElements = document.querySelectorAll('.name-svg'); // タイポグラフィSVG要素も追加
        
        // 花のSVGの読み込み処理
        objectElements.forEach((obj, index) => {
            const promise = new Promise((resolve) => {
                obj.addEventListener('load', () => {
                    this.onSVGLoaded(obj);
                    resolve(obj);
                });
                
                // フォールバック: 既に読み込まれている場合
                if (obj.contentDocument) {
                    this.onSVGLoaded(obj);
                    resolve(obj);
                }
            });
            
            this.svgLoadPromises.push(promise);
        });
        
        // タイポグラフィSVGの読み込み処理
        nameElements.forEach((nameObj, index) => {
            const promise = new Promise((resolve) => {
                nameObj.addEventListener('load', () => {
                    this.onNameSVGLoaded(nameObj);
                    resolve(nameObj);
                });
                
                // フォールバック: 既に読み込まれている場合
                if (nameObj.contentDocument) {
                    this.onNameSVGLoaded(nameObj);
                    resolve(nameObj);
                }
            });
            
            this.svgLoadPromises.push(promise);
        });
        
        // すべてのSVGが読み込まれた後に追加設定
        Promise.all(this.svgLoadPromises).then(() => {
            console.log('✨ すべてのSVGファイル（花 + タイポグラフィ）が読み込まれました');
        });
    }
    
    onSVGLoaded(objectElement) {
        const svgDoc = objectElement.contentDocument;
        if (svgDoc) {
            // SVG内の要素にアクセス可能になった印を付ける
            objectElement.classList.add('flower-svg-loaded');
            
            // SVG内の要素に直接アクセスしてイベントを設定
            this.setupSVGInteractions(svgDoc, objectElement);
        }
    }
    
    onNameSVGLoaded(nameElement) {
        const svgDoc = nameElement.contentDocument;
        if (svgDoc) {
            // タイポグラフィSVG内の要素にアクセス可能になった印を付ける
            nameElement.classList.add('name-svg-loaded');
            
            // タイポグラフィSVG内の要素に直接アクセスしてイベントを設定
            this.setupNameSVGInteractions(svgDoc, nameElement);
            
            console.log('🌸 タイポグラフィSVGが読み込まれました:', nameElement);
        }
    }
    
    setupSVGInteractions(svgDoc, objectElement) {
        const petals = svgDoc.querySelectorAll('.petal');
        const clickablePetals = svgDoc.querySelectorAll('.clickable-petal');
        
        // 軽微なホバーエフェクト（スケールのみ）
        petals.forEach((petal, index) => {
            petal.addEventListener('mouseenter', () => {
                gsap.to(petal, {
                    scale: 1.05,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
            
            petal.addEventListener('mouseleave', () => {
                gsap.to(petal, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
        });
        
        // クリック可能な花びらの設定
        clickablePetals.forEach(petal => {
            petal.style.cursor = 'pointer';
            petal.addEventListener('click', () => {
                this.onPetalClick(petal, objectElement);
            });
        });
    }
    
    setupNameSVGInteractions(svgDoc, nameElement) {
        // 花の種類を取得
        const container = nameElement.closest('.flower-container');
        const section = container ? container.closest('.flower-section') : null;
        const flowerType = section ? section.dataset.flower : null;
        
        // コスモスまたはチューリップタイポグラフィの花びら要素を取得
        const petal1 = svgDoc.querySelector('.petal, #petal');
        const petal2 = svgDoc.querySelector('.petal-2, #petal-2');
        
        // 花びらにクリックイベントを設定
        if (petal1) {
            petal1.style.cursor = 'pointer';
            petal1.addEventListener('click', (e) => {
                e.stopPropagation(); // イベントの伝播を停止
                this.onTypoPetalClick(petal1, nameElement, 'petal1', flowerType);
            });
        }
        
        if (petal2) {
            petal2.style.cursor = 'pointer';
            petal2.addEventListener('click', (e) => {
                e.stopPropagation(); // イベントの伝播を停止
                this.onTypoPetalClick(petal2, nameElement, 'petal2', flowerType);
            });
        }
        
        console.log(`🌸 ${flowerType}タイポグラフィの花びらにクリックイベントを設定しました`, { petal1: !!petal1, petal2: !!petal2 });
    }
    
    onPetalClick(petal, objectElement) {
        if (petal.classList.contains('removed')) return;
        
        const container = objectElement.closest('.flower-container');
        const resultDiv = container.querySelector('.fortune-result');
        
        // 花びらの現在位置を取得（SVG座標系からページ座標系に変換）
        const svgDoc = objectElement.contentDocument;
        const svg = svgDoc.querySelector('svg');
        const petalBounds = petal.getBBox();
        const svgRect = objectElement.getBoundingClientRect();
        const svgViewBox = svg.viewBox.baseVal;
        
        // 座標変換：SVG座標 → ページ座標
        const scaleX = svgRect.width / svgViewBox.width;
        const scaleY = svgRect.height / svgViewBox.height;
        const pageX = svgRect.left + (petalBounds.x + petalBounds.width / 2 - svgViewBox.x) * scaleX;
        const pageY = svgRect.top + (petalBounds.y + petalBounds.height / 2 - svgViewBox.y) * scaleY;
        
        // 元のSVG要素を複製してページ上に配置
        const flyingSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const flyingPetal = petal.cloneNode(true);
        
        // SVGコンテナを設定
        flyingSVG.setAttribute('viewBox', `${petalBounds.x - 5} ${petalBounds.y - 5} ${petalBounds.width + 10} ${petalBounds.height + 10}`);
        flyingSVG.style.cssText = `
            position: fixed;
            left: ${pageX}px;
            top: ${pageY}px;
            width: ${petalBounds.width * scaleX}px;
            height: ${petalBounds.height * scaleY}px;
            transform: translateX(-50%) translateY(-50%);
            z-index: 10000;
            pointer-events: none;
            opacity: 0.9;
            overflow: visible;
        `;
        
        // 必要なグラデーション定義も複製
        const originalDefs = svg.querySelector('defs');
        if (originalDefs) {
            const flyingDefs = originalDefs.cloneNode(true);
            flyingSVG.appendChild(flyingDefs);
        }
        
        // 花びらを飛行用SVGに追加
        flyingSVG.appendChild(flyingPetal);
        document.body.appendChild(flyingSVG);
        
        // 元の花びらを即座に非表示にする
        petal.classList.add('removed');
        petal.style.opacity = '0';
        
        // 飛行するSVGをアニメーション
        const randomX = Math.random() * 200 - 100;
        const fallDistance = window.innerHeight + 100;
        const fallDuration = Math.random() * 3 + 2;
        
        gsap.to(flyingSVG, {
            y: fallDistance,
            x: randomX,
            rotation: Math.random() * 360 + 180,
            scale: 0.3,
            opacity: 0,
            duration: fallDuration,
            ease: "none",
            onComplete: () => {
                if (flyingSVG.parentNode) {
                    flyingSVG.parentNode.removeChild(flyingSVG);
                }
            }
        });
        
        // 揺れながら落ちるアニメーション
        const swayAnimation = () => {
            if (flyingSVG.parentNode) {
                gsap.to(flyingSVG, {
                    x: `+=${Math.sin(Date.now() * 0.002) * 5}`,
                    duration: 0.1,
                    ease: "none"
                });
                requestAnimationFrame(swayAnimation);
            }
        };
        swayAnimation();
        
        // 5秒後に花びらを復活させる
        this.scheduleReset(container, 5000);
        
        // 花占い結果の更新
        this.updateFortuneResult(container);
    }
    
    updateFortuneResult(container) {
        const objectElement = container.querySelector('.flower-svg');
        const svgDoc = objectElement.contentDocument;
        const remainingPetals = svgDoc.querySelectorAll('.clickable-petal:not(.removed)');
        const removedPetals = svgDoc.querySelectorAll('.clickable-petal.removed');
        const resultDiv = container.querySelector('.fortune-result');
        
        const petalCount = removedPetals.length;
        const messageIndex = (petalCount - 1) % fortuneMessages.length;
        
        resultDiv.textContent = fortuneMessages[messageIndex];
        resultDiv.classList.add('show');
        
        // 最後の花びらの場合
        if (remainingPetals.length === 0) {
            setTimeout(() => {
                resultDiv.textContent += ' - 占い完了！';
                gsap.to(resultDiv, {
                    scale: 1.1,
                    color: '#ffeb3b',
                    duration: 0.3,
                    yoyo: true,
                    repeat: 1
                });
            }, 500);
        }
    }
    
    scheduleReset(container, delay) {
        const containerId = container.dataset.flowerId || Math.random().toString(36);
        container.dataset.flowerId = containerId;
        
        // 既存のタイマーがあればクリア
        if (this.resetTimers.has(containerId)) {
            clearTimeout(this.resetTimers.get(containerId));
        }
        
        // 新しいタイマーをセット
        const timer = setTimeout(() => {
            this.resetPetals(container);
            this.resetTimers.delete(containerId);
        }, delay);
        
        this.resetTimers.set(containerId, timer);
    }
    
    resetPetals(container) {
        const objectElement = container.querySelector('.flower-svg');
        const resultDiv = container.querySelector('.fortune-result');
        
        if (!objectElement.classList.contains('flower-svg-loaded')) return;
        
        const svgDoc = objectElement.contentDocument;
        const removedPetals = svgDoc.querySelectorAll('.clickable-petal.removed');
        
        removedPetals.forEach((petal, index) => {
            // クラスとスタイルを完全にリセット
            petal.classList.remove('removed');
            petal.style.display = '';
            petal.style.opacity = '';
            petal.style.position = '';
            petal.style.zIndex = '';
            petal.style.pointerEvents = '';
            
            // 元の位置とスタイルに戻すアニメーション
            gsap.set(petal, { 
                x: 0, 
                y: 0, 
                rotation: 0,
                scale: 1,
                opacity: 0
            });
            
            gsap.to(petal, {
                opacity: 1,
                duration: 0.5,
                delay: index * 0.1,
                ease: "back.out(1.7)"
            });
        });
        
        // 結果表示をクリア
        resultDiv.textContent = '';
        resultDiv.classList.remove('show');
        
        // リセット完了のフィードバック
        const resetMessage = document.createElement('div');
        resetMessage.textContent = '🌸 花びらが復活しました！';
        resetMessage.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #ff6b9d;
            font-size: 14px;
            font-weight: bold;
            opacity: 0;
            pointer-events: none;
            z-index: 10;
        `;
        container.style.position = 'relative';
        container.appendChild(resetMessage);
        
        gsap.to(resetMessage, {
            opacity: 1,
            y: -20,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(resetMessage, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            if (resetMessage.parentNode) {
                                resetMessage.parentNode.removeChild(resetMessage);
                            }
                        }
                    });
                }, 2000);
            }
        });
    }
    
    setupHoverEffects() {
        const flowerContainers = document.querySelectorAll('.flower-container');
        
        flowerContainers.forEach(container => {
            const objectElement = container.querySelector('.flower-svg');
            const nameElement = container.querySelector('.name-svg'); // タイポグラフィSVG要素
            
            container.addEventListener('mouseenter', () => this.onFlowerHover(container));
            container.addEventListener('mouseleave', () => this.onFlowerLeave(container));
        });
    }
    
    onFlowerHover(container) {
        const objectElement = container.querySelector('.flower-svg');
        const nameElement = container.querySelector('.name-svg'); // タイポグラフィSVG要素
        const section = container.closest('.flower-section');
        const flowerType = section ? section.dataset.flower : null;
        
        // SVGが読み込まれている場合のみ実行（軽微なエフェクトのみ）
        if (objectElement.classList.contains('flower-svg-loaded')) {
            const svgDoc = objectElement.contentDocument;
            const petals = svgDoc.querySelectorAll('.petal');
            
            // コスモス専用の回転エフェクト
            if (flowerType === 'cosmos') {
                this.startCosmosRotation(svgDoc);
            } else {
                // 他の花の通常のエフェクト
                petals.forEach((petal, index) => {
                    gsap.to(petal, {
                        scale: 1.02,
                        opacity: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                });
            }
        }
        
        // コスモスタイポグラフィの花びら揺れアニメーション
        if (flowerType === 'cosmos' && nameElement && nameElement.classList.contains('name-svg-loaded')) {
            this.startCosmosTypoAnimation(nameElement);
        }
        
        // チューリップタイポグラフィの花びら揺れアニメーション
        if (flowerType === 'tulip' && nameElement && nameElement.classList.contains('name-svg-loaded')) {
            this.startTulipTypoAnimation(nameElement);
        }
        
        // 花言葉の浮遊アニメーション
        const meaningTexts = container.querySelectorAll('.meaning-text');
        meaningTexts.forEach(text => {
            gsap.to(text, {
                y: -3,
                duration: 1.5,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1
            });
        });
    }
    
    onFlowerLeave(container) {
        const objectElement = container.querySelector('.flower-svg');
        const nameElement = container.querySelector('.name-svg'); // タイポグラフィSVG要素
        const section = container.closest('.flower-section');
        const flowerType = section ? section.dataset.flower : null;
        
        // SVGが読み込まれている場合のみ実行
        if (objectElement.classList.contains('flower-svg-loaded')) {
            const svgDoc = objectElement.contentDocument;
            const petals = svgDoc.querySelectorAll('.petal');
            
            // コスモス専用の回転停止エフェクト
            if (flowerType === 'cosmos') {
                this.stopCosmosRotation(svgDoc);
            } else {
                // 他の花の通常のエフェクト
                petals.forEach(petal => {
                    gsap.to(petal, {
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                });
            }
        }
        
        // コスモスタイポグラフィの花びら揺れアニメーション停止
        if (flowerType === 'cosmos' && nameElement && nameElement.classList.contains('name-svg-loaded')) {
            this.stopCosmosTypoAnimation(nameElement);
        }
        
        // チューリップタイポグラフィの花びら揺れアニメーション停止
        if (flowerType === 'tulip' && nameElement && nameElement.classList.contains('name-svg-loaded')) {
            this.stopTulipTypoAnimation(nameElement);
        }
        
        // 花言葉のアニメーション停止
        const meaningTexts = container.querySelectorAll('.meaning-text');
        meaningTexts.forEach(text => {
            gsap.killTweensOf(text);
            gsap.to(text, {y: 0, duration: 0.3});
        });
    }
    
    setupFortuneGame() {
        const fortuneBtns = document.querySelectorAll('.fortune-btn');
        
        fortuneBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.startFortune(e));
        });
    }
    
    startCosmosRotation(svgDoc) {
        // 花全体のコンテナグループを取得（茎を除く）
        const flowerContainer = this.getCosmosFlowerContainer(svgDoc);
        
        if (flowerContainer) {
            // 花全体を一つのオブジェクトとして自転させる
            gsap.to(flowerContainer, {
                rotation: 360,
                duration: 4, // 4秒で一回転（ゆっくりとした自転）
                ease: "none",
                repeat: -1, // 無限リピート
                transformOrigin: "center center" // 中心を軸にして回転
            });
            
            console.log('🌸 コスモスの花全体が自転を開始しました');
        } else {
            // フォールバック：個別の花要素を同時に回転
            const flowerPetals = svgDoc.querySelectorAll('path:not(.cls-8), ellipse, circle');
            const centerX = 52.25;
            const centerY = 54.63;
            
            flowerPetals.forEach((petal) => {
                gsap.to(petal, {
                    rotation: 360,
                    duration: 4,
                    ease: "none",
                    repeat: -1,
                    transformOrigin: `${centerX}px ${centerY}px`
                });
            });
            
            console.log('🌸 コスモスの花びら（フォールバック）が自転を開始しました');
        }
    }
    
    stopCosmosRotation(svgDoc) {
        // 花全体のコンテナグループを取得
        const flowerContainer = this.getCosmosFlowerContainer(svgDoc);
        
        if (flowerContainer) {
            // 花全体のアニメーションを停止
            gsap.killTweensOf(flowerContainer);
            gsap.to(flowerContainer, {
                rotation: 0,
                duration: 0.8,
                ease: "power2.out"
            });
            
            console.log('🌸 コスモスの花全体の自転が停止しました');
        } else {
            // フォールバック：個別要素のアニメーションを停止
            const flowerPetals = svgDoc.querySelectorAll('path:not(.cls-8), ellipse, circle');
            
            flowerPetals.forEach(petal => {
                gsap.killTweensOf(petal);
                gsap.to(petal, {
                    rotation: 0,
                    duration: 0.8,
                    ease: "power2.out"
                });
            });
            
            console.log('🌸 コスモスの花びら（フォールバック）の自転が停止しました');
        }
    }
    
    getCosmosFlowerContainer(svgDoc) {
        // コスモスの花全体を包含するグループを特定
        // 1. まず、花びら要素（path）を含む親グループを探す
        const flowerPaths = svgDoc.querySelectorAll('path:not(.cls-8)'); // 茎以外のpath要素
        
        if (flowerPaths.length > 0) {
            // 最初の花びらの親要素をたどって共通の親グループを見つける
            let commonParent = flowerPaths[0].parentElement;
            
            // すべての花びらが同じ親を持つかチェック
            for (let i = 1; i < flowerPaths.length; i++) {
                if (flowerPaths[i].parentElement !== commonParent) {
                    // 異なる親を持つ場合、より上位の共通親を探す
                    commonParent = this.findCommonParent(flowerPaths[0], flowerPaths[i]);
                    break;
                }
            }
            
            // 茎を含まないことを確認
            if (commonParent && !commonParent.querySelector('.cls-8')) {
                return commonParent;
            }
        }
        
        // 2. フォールバック：メインのgroupから茎以外を探す
        const mainGroups = svgDoc.querySelectorAll('g');
        for (let group of mainGroups) {
            const hasFlowerPetals = group.querySelectorAll('path:not(.cls-8), ellipse, circle').length > 0;
            const hasStem = group.querySelector('.cls-8');
            
            if (hasFlowerPetals && !hasStem) {
                return group;
            }
        }
        
        return null; // 適切なコンテナが見つからない場合
    }
    
    findCommonParent(element1, element2) {
        // 2つの要素の共通の親要素を見つける
        const parents1 = [];
        let current = element1;
        
        // element1の全ての親要素を収集
        while (current.parentElement) {
            parents1.push(current.parentElement);
            current = current.parentElement;
        }
        
        // element2の親要素をたどって最初に見つかった共通親を返す
        current = element2;
        while (current.parentElement) {
            if (parents1.includes(current.parentElement)) {
                return current.parentElement;
            }
            current = current.parentElement;
        }
        
        return null;
    }
    
    startFortune(e) {
        const container = e.target.closest('.flower-container');
        const objectElement = container.querySelector('.flower-svg');
        const resultDiv = container.querySelector('.fortune-result');
        
        if (!objectElement.classList.contains('flower-svg-loaded')) {
            resultDiv.textContent = 'SVGファイルを読み込み中...';
            resultDiv.classList.add('show');
            return;
        }
        
        const svgDoc = objectElement.contentDocument;
        const clickablePetals = svgDoc.querySelectorAll('.clickable-petal:not(.removed)');
        
        if (clickablePetals.length === 0) {
            resultDiv.textContent = '花びらがもうありません...';
            resultDiv.classList.add('show');
            return;
        }
        
        resultDiv.textContent = '花びらをクリックして占いをしてください';
        resultDiv.classList.add('show');
    }
    
    startCosmosTypoAnimation(nameElement) {
        // cosmostypo.svgの花びら要素を取得
        let svgDoc = null;
        
        // objectタグの場合
        if (nameElement.tagName === 'OBJECT') {
            svgDoc = nameElement.contentDocument;
        } else if (nameElement.tagName === 'svg' || nameElement.querySelector('svg')) {
            // インラインSVGの場合
            svgDoc = nameElement.tagName === 'svg' ? nameElement : nameElement.querySelector('svg');
        }
        
        if (!svgDoc) return;
        
        // petal と petal-2 要素を取得（クラス名またはid属性で）
        const petal1 = svgDoc.querySelector('.petal, #petal');
        const petal2 = svgDoc.querySelector('.petal-2, #petal-2');
        
        if (petal1) {
            // 花びら1の揺れアニメーション（紫陽花を参考にした自然な揺れ）
            gsap.to(petal1, {
                rotation: "+=3",
                duration: 0.8,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
                transformOrigin: "center bottom" // 花びらの根元を軸にして揺れる
            });
            
            // 軽微なスケール変化も追加（呼吸するような効果）
            gsap.to(petal1, {
                scale: 1.02,
                duration: 1.2,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1
            });
        }
        
        if (petal2) {
            // 花びら2の揺れアニメーション（少し異なるタイミングで）
            gsap.to(petal2, {
                rotation: "-=4",
                duration: 1.0,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
                delay: 0.2, // 少し遅延させて自然な動きに
                transformOrigin: "center bottom"
            });
            
            gsap.to(petal2, {
                scale: 1.03,
                duration: 1.4,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
                delay: 0.1
            });
        }
        
        console.log('🌸 コスモスタイポグラフィの花びらが揺れ始めました', { petal1: !!petal1, petal2: !!petal2 });
    }
    
    stopCosmosTypoAnimation(nameElement) {
        // cosmostypo.svgの花びら要素を取得
        let svgDoc = null;
        
        // objectタグの場合
        if (nameElement.tagName === 'OBJECT') {
            svgDoc = nameElement.contentDocument;
        } else if (nameElement.tagName === 'svg' || nameElement.querySelector('svg')) {
            // インラインSVGの場合
            svgDoc = nameElement.tagName === 'svg' ? nameElement : nameElement.querySelector('svg');
        }
        
        if (!svgDoc) return;
        
        // petal と petal-2 要素を取得
        const petal1 = svgDoc.querySelector('.petal, #petal');
        const petal2 = svgDoc.querySelector('.petal-2, #petal-2');
        
        if (petal1) {
            // 花びら1のアニメーション停止
            gsap.killTweensOf(petal1);
            gsap.to(petal1, {
                rotation: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.out"
            });
        }
        
        if (petal2) {
            // 花びら2のアニメーション停止
            gsap.killTweensOf(petal2);
            gsap.to(petal2, {
                rotation: 0,
                scale: 1,
                duration: 0.6,
                ease: "power2.out"
            });
        }
        
        console.log('🌸 コスモスタイポグラフィの花びらの揺れが停止しました');
    }
    
    startTulipTypoAnimation(nameElement) {
        // tyurippu.svgの花びら要素を取得
        let svgDoc = null;
        
        // objectタグの場合
        if (nameElement.tagName === 'OBJECT') {
            svgDoc = nameElement.contentDocument;
        } else if (nameElement.tagName === 'svg' || nameElement.querySelector('svg')) {
            // インラインSVGの場合
            svgDoc = nameElement.tagName === 'svg' ? nameElement : nameElement.querySelector('svg');
        }
        
        if (!svgDoc) return;
        
        // petal と petal-2 要素を取得（クラス名またはid属性で）
        const petal1 = svgDoc.querySelector('.petal, #petal');
        const petal2 = svgDoc.querySelector('.petal-2, #petal-2');
        
        if (petal1) {
            // 花びら1の揺れアニメーション（チューリップらしい優雅な動き）
            gsap.to(petal1, {
                rotation: "+=4",
                duration: 1.0,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
                transformOrigin: "center bottom" // 花びらの根元を軸にして揺れる
            });
            
            // 軽微なスケール変化も追加（花が開くような効果）
            gsap.to(petal1, {
                scale: 1.03,
                duration: 1.5,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1
            });
        }
        
        if (petal2) {
            // 花びら2の揺れアニメーション（少し異なるタイミングで）
            gsap.to(petal2, {
                rotation: "-=3",
                duration: 1.2,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
                delay: 0.3, // 少し遅延させて自然な動きに
                transformOrigin: "center bottom"
            });
            
            gsap.to(petal2, {
                scale: 1.04,
                duration: 1.6,
                ease: "power1.inOut",
                yoyo: true,
                repeat: -1,
                delay: 0.2
            });
        }
        
        console.log('🌸 チューリップタイポグラフィの花びらが揺れ始めました', { petal1: !!petal1, petal2: !!petal2 });
    }
    
    stopTulipTypoAnimation(nameElement) {
        // tyurippu.svgの花びら要素を取得
        let svgDoc = null;
        
        // objectタグの場合
        if (nameElement.tagName === 'OBJECT') {
            svgDoc = nameElement.contentDocument;
        } else if (nameElement.tagName === 'svg' || nameElement.querySelector('svg')) {
            // インラインSVGの場合
            svgDoc = nameElement.tagName === 'svg' ? nameElement : nameElement.querySelector('svg');
        }
        
        if (!svgDoc) return;
        
        // petal と petal-2 要素を取得
        const petal1 = svgDoc.querySelector('.petal, #petal');
        const petal2 = svgDoc.querySelector('.petal-2, #petal-2');
        
        if (petal1) {
            // 花びら1のアニメーション停止
            gsap.killTweensOf(petal1);
            gsap.to(petal1, {
                rotation: 0,
                scale: 1,
                duration: 0.7,
                ease: "power2.out"
            });
        }
        
        if (petal2) {
            // 花びら2のアニメーション停止
            gsap.killTweensOf(petal2);
            gsap.to(petal2, {
                rotation: 0,
                scale: 1,
                duration: 0.7,
                ease: "power2.out"
            });
        }
        
        console.log('🌸 チューリップタイポグラフィの花びらの揺れが停止しました');
    }
    
    onTypoPetalClick(petal, nameElement, petalType, flowerType = 'cosmos') {
        // 既に削除されている場合は何もしない
        if (petal.classList.contains('typo-removed')) return;
        
        console.log(`🌸 ${flowerType}の${petalType} がクリックされました`);
        
        // 花びらの現在位置を取得（SVG座標系からページ座標系に変換）
        const svgDoc = nameElement.contentDocument || nameElement;
        const svg = svgDoc.querySelector ? svgDoc.querySelector('svg') : svgDoc;
        
        // nameElementの位置とサイズを取得
        const nameRect = nameElement.getBoundingClientRect();
        
        // 花びらの大まかな位置を計算（SVGの中央付近）
        const pageX = nameRect.left + nameRect.width * 0.7; // 右寄りの位置
        const pageY = nameRect.top + nameRect.height * 0.3; // 上寄りの位置
        
        // 元のSVG要素を複製してページ上に配置
        const flyingSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        const flyingPetal = petal.cloneNode(true);
        
        // SVGコンテナを設定（小さめのサイズ）
        flyingSVG.setAttribute('viewBox', '0 0 100 100');
        flyingSVG.style.cssText = `
            position: fixed;
            left: ${pageX}px;
            top: ${pageY}px;
            width: 30px;
            height: 30px;
            transform: translateX(-50%) translateY(-50%);
            z-index: 10000;
            pointer-events: none;
            opacity: 0.9;
            overflow: visible;
        `;
        
        // 元のSVGからすべての定義（defs）を複製
        if (svg && svg.querySelector) {
            const originalDefs = svg.querySelector('defs');
            if (originalDefs) {
                const flyingDefs = originalDefs.cloneNode(true);
                flyingSVG.appendChild(flyingDefs);
            }
        }
        
        // 花びらを飛行用SVGに追加し、色を明示的に設定
        flyingPetal.removeAttribute('class'); // 元のクラスを削除
        flyingPetal.setAttribute('transform', 'translate(50, 50) scale(0.8)'); // 中央に配置してサイズ調整
        
        // 花の種類に応じたデフォルト色を設定
        const flowerColors = {
            cosmos: '#FF6B9D',
            tulip: '#FF9500'
        };
        
        // 花びらの色を明示的に設定
        const originalFill = petal.getAttribute('fill') || petal.style.fill;
        if (originalFill && originalFill !== 'none') {
            flyingPetal.setAttribute('fill', originalFill);
        } else {
            // デフォルトの花色を設定
            flyingPetal.setAttribute('fill', flowerColors[flowerType] || flowerColors.cosmos);
        }
        
        // strokeも保持
        const originalStroke = petal.getAttribute('stroke') || petal.style.stroke;
        if (originalStroke && originalStroke !== 'none') {
            flyingPetal.setAttribute('stroke', originalStroke);
            const originalStrokeWidth = petal.getAttribute('stroke-width') || petal.style.strokeWidth;
            if (originalStrokeWidth) {
                flyingPetal.setAttribute('stroke-width', originalStrokeWidth);
            }
        }
        
        // グラデーションがある場合の処理
        const computedStyle = window.getComputedStyle(petal);
        if (computedStyle.fill && computedStyle.fill.includes('url(')) {
            flyingPetal.setAttribute('fill', computedStyle.fill);
        }
        
        flyingSVG.appendChild(flyingPetal);
        document.body.appendChild(flyingSVG);
        
        // 元の花びらを即座に非表示にする
        petal.classList.add('typo-removed');
        petal.style.opacity = '0';
        
        // 飛行するSVGをアニメーション（チューリップの落ち方を参考）
        const randomX = Math.random() * 200 - 100; // 左右のランダムな動き
        const fallDistance = window.innerHeight + 100;
        const fallDuration = Math.random() * 3 + 2; // 2-5秒のランダム
        
        gsap.to(flyingSVG, {
            y: fallDistance,
            x: randomX,
            rotation: Math.random() * 720 + 360, // 1-2回転
            scale: 0.2,
            opacity: 0,
            duration: fallDuration,
            ease: "power2.in", // 重力を感じさせるイージング
            onComplete: () => {
                if (flyingSVG.parentNode) {
                    flyingSVG.parentNode.removeChild(flyingSVG);
                }
            }
        });
        
        // 風の影響で左右に揺れるアニメーション
        const swayAnimation = () => {
            if (flyingSVG.parentNode) {
                gsap.to(flyingSVG, {
                    x: `+=${Math.sin(Date.now() * 0.003) * 8}`, // より大きな揺れ
                    duration: 0.1,
                    ease: "none"
                });
                requestAnimationFrame(swayAnimation);
            }
        };
        swayAnimation();
        
        // 5秒後に花びらを復活させる
        setTimeout(() => {
            this.resetTypoPetal(petal, petalType, flowerType);
        }, 5000);
        
        // 花言葉占い風のメッセージを表示
        this.showTypoPetalMessage(nameElement, petalType, flowerType);
    }
    
    resetTypoPetal(petal, petalType, flowerType = 'cosmos') {
        // 花びらを元の状態に戻す
        petal.classList.remove('typo-removed');
        
        // フェードインアニメーション
        gsap.set(petal, { opacity: 0, scale: 0.5 });
        gsap.to(petal, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)"
        });
        
        console.log(`🌸 ${flowerType}の${petalType} が復活しました`);
    }
    
    showTypoPetalMessage(nameElement, petalType, flowerType = 'cosmos') {
        // メッセージを表示する要素を作成
        const container = nameElement.closest('.flower-container');
        if (!container) return;
        
        const message = document.createElement('div');
        const messages = {
            cosmos: {
                petal1: '調和の花びらが舞い散った...',
                petal2: '謙虚な心が風に踊る...'
            },
            tulip: {
                petal1: '愛の花びらが舞い散った...',
                petal2: '思いやりの心が風に踊る...'
            }
        };
        
        const flowerMessages = messages[flowerType] || messages.cosmos;
        message.textContent = flowerMessages[petalType] || `${flowerType}の花びらが舞い散った...`;
        message.style.cssText = `
            position: absolute;
            top: 70%;
            left: 50%;
            transform: translateX(-50%);
            color: ${flowerType === 'tulip' ? '#FF9500' : '#FF6B9D'};
            font-size: 14px;
            font-weight: bold;
            opacity: 0;
            pointer-events: none;
            z-index: 10;
            text-align: center;
            white-space: nowrap;
        `;
        
        container.style.position = 'relative';
        container.appendChild(message);
        
        // フェードイン・アウトアニメーション
        gsap.to(message, {
            opacity: 1,
            y: -10,
            duration: 0.5,
            ease: "power2.out",
            onComplete: () => {
                setTimeout(() => {
                    gsap.to(message, {
                        opacity: 0,
                        y: -20,
                        duration: 1,
                        onComplete: () => {
                            if (message.parentNode) {
                                message.parentNode.removeChild(message);
                            }
                        }
                    });
                }, 2000);
            }
        });
    }
}

/* ============================================
   パーティクルシステム
============================================ */

class ParticleSystem {
    constructor() {
        this.particles = [];
        this.init();
    }
    
    init() {
        this.createParticles();
        this.animate();
    }
    
    createParticles() {
        for (let i = 0; i < 20; i++) {
            this.createParticle();
        }
    }
    
    createParticle() {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1';
        
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        gsap.to(particle, {
            y: window.innerHeight + 100,
            x: `+=${Math.random() * 200 - 100}`,
            duration: Math.random() * 10 + 5,
            ease: "none",
            repeat: -1,
            onRepeat: () => {
                particle.style.left = Math.random() * window.innerWidth + 'px';
                particle.style.top = '-10px';
            }
        });
        
        this.particles.push(particle);
    }
    
    animate() {
        // パーティクルの動きをわずかに変化させる
        this.particles.forEach(particle => {
            gsap.to(particle, {
                x: `+=${Math.sin(Date.now() * 0.001) * 2}`,
                duration: 0.1,
                ease: "none"
            });
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

/* ============================================
   紫陽花クリック時の花びら落下システム
============================================ */

class HydrangeaClickSystem {
    constructor() {
        this.generatedPetals = [];
        this.isHydrangeaActive = false;
        this.init();
    }
    
    init() {
        this.setupHydrangeaClickHandler();
        this.setupSectionObserver();
    }
    
    setupHydrangeaClickHandler() {
        // 紫陽花のSVGにクリックイベントを追加
        const hydrangeaSection = document.querySelector('.flower-section[data-flower="hydrangea"]');
        if (!hydrangeaSection) return;
        
        const hydrangeaSvg = hydrangeaSection.querySelector('.flower-svg, .flower-svg-fallback');
        if (!hydrangeaSvg) return;
        
        hydrangeaSvg.addEventListener('click', (e) => {
            this.generateClickPetal(e);
        });
        
        // SVGオブジェクトの場合の処理
        const svgObject = hydrangeaSection.querySelector('.flower-svg');
        if (svgObject && svgObject.tagName === 'OBJECT') {
            svgObject.addEventListener('load', () => {
                try {
                    const svgDoc = svgObject.contentDocument;
                    if (svgDoc) {
                        svgDoc.addEventListener('click', (e) => {
                            this.generateClickPetal(e);
                        });
                    }
                } catch (error) {
                    console.log('SVG content access limited, using fallback click handler');
                }
            });
        }
    }
    
    setupSectionObserver() {
        // 紫陽花セクションの状態を監視
        const hydrangeaSection = document.querySelector('.flower-section[data-flower="hydrangea"]');
        if (!hydrangeaSection) return;
        
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const isActive = hydrangeaSection.classList.contains('active');
                    this.isHydrangeaActive = isActive;
                    
                    // セクションが非アクティブになったら花びらをフェードアウト
                    if (!isActive) {
                        this.fadeOutAllPetals();
                    }
                }
            });
        });
        
        observer.observe(hydrangeaSection, { attributes: true });
    }
    
    generateClickPetal(event) {
        if (!this.isHydrangeaActive) return;
        
        // 紫陽花の花の中央位置を取得
        const hydrangeaSection = document.querySelector('.flower-section[data-flower="hydrangea"]');
        const flowerSvg = hydrangeaSection.querySelector('.flower-svg, .flower-svg-fallback');
        
        if (!flowerSvg) return;
        
        const rect = flowerSvg.getBoundingClientRect();
        // 花の中央位置を計算
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // 複数の花びらを生成（1-3個のランダム）
        const petalCount = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < petalCount; i++) {
            setTimeout(() => {
                this.createFallingPetal(x, y, i);
            }, i * 150); // 少しずつタイミングをずらす
        }
    }
    
    createFallingPetal(x, y, index) {
        const petal = document.createElement('img');
        petal.src = 'images/hydrangea-petals.svg';
        petal.alt = '落下する紫陽花の花びら';
        petal.className = 'click-generated-petal';
        
        // 花の中央付近の暗い部分から出現するように位置を調整
        // より小さな範囲でランダムにずらす（花の中心部に集中）
        const offsetX = (Math.random() - 0.5) * 30; // ±15px（より狭い範囲）
        const offsetY = (Math.random() - 0.5) * 20; // ±10px（より狭い範囲）
        
        petal.style.left = (x + offsetX) + 'px';
        petal.style.top = (y + offsetY) + 'px';
        
        // シンプルなランダム要素でスムーズなアニメーションを実現
        const initialRotation = Math.random() * 360;
        const animationDuration = 3.5 + Math.random() * 1; // 3.5-4.5秒のランダム
        const horizontalDrift = (Math.random() - 0.5) * 60; // ±30pxの風の影響
        const rotationAmount = 180 + Math.random() * 360; // 180-540度の回転
        
        petal.style.transform = `rotate(${initialRotation}deg)`;
        petal.style.animationDuration = `${animationDuration}s`;
        
        // シンプルなCSS変数設定
        petal.style.setProperty('--drift-x', horizontalDrift + 'px');
        petal.style.setProperty('--rotation-speed', rotationAmount + 'deg');
        
        // 花びらをDOMに追加
        document.body.appendChild(petal);
        this.generatedPetals.push(petal);
        
        // アニメーション終了後に削除
        setTimeout(() => {
            this.removePetal(petal);
        }, animationDuration * 1000 + 500);
    }
    
    removePetal(petal) {
        if (petal && petal.parentNode) {
            petal.parentNode.removeChild(petal);
            const index = this.generatedPetals.indexOf(petal);
            if (index > -1) {
                this.generatedPetals.splice(index, 1);
            }
        }
    }
    
    fadeOutAllPetals() {
        this.generatedPetals.forEach(petal => {
            if (petal && petal.parentNode) {
                petal.classList.add('fade-out-petal');
                // フェードアウト後に削除
                setTimeout(() => {
                    this.removePetal(petal);
                }, 2000);
            }
        });
    }
}

/* ============================================
   メイン実行
============================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌸 花の詩 - インタラクティブタイポグラフィ 初期化中...');
    
    // 各システムを初期化
    const cursorPetals = new CursorPetals();
    const scrollAnimations = new ScrollAnimations();
    const flowerInteractions = new FlowerInteractions();
    const particleSystem = new ParticleSystem();
    const hydrangeaClickSystem = new HydrangeaClickSystem(); // 紫陽花クリックシステムを追加
    
    console.log('✨ 初期化完了！');
    
    // スクロールインジケーターを追加
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '↓ スクロールして花を探索 ↓';
    document.body.appendChild(scrollIndicator);
    
    // 詩のテキストのスクロールブラーエフェクト
    const poemContainers = document.querySelectorAll('.poem-text-container');
    let scrollBlurTimer;
    
    function updatePoemBlur() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        
        poemContainers.forEach(container => {
            const section = container.closest('.flower-section');
            if (!section) return;
            
            const sectionRect = section.getBoundingClientRect();
            const sectionTop = sectionRect.top;
            const sectionBottom = sectionRect.bottom;
            
            // セクションが画面内にある場合のブラー計算
            if (sectionTop < windowHeight && sectionBottom > 0) {
                // セクションの中心からの距離を計算
                const sectionCenter = sectionTop + sectionRect.height / 2;
                const windowCenter = windowHeight / 2;
                const distanceFromCenter = Math.abs(sectionCenter - windowCenter);
                const maxDistance = windowHeight / 2;
                
                // 距離に基づいてブラー値を計算（0-5px）
                const blurAmount = Math.min(5, (distanceFromCenter / maxDistance) * 5);
                const opacityAmount = Math.max(0.3, 1 - (distanceFromCenter / maxDistance) * 0.7);
                
                container.style.filter = `blur(${blurAmount}px)`;
                container.style.opacity = opacityAmount;
                
                // ブラー値が2px以上の場合はクラスを追加
                if (blurAmount >= 2) {
                    container.classList.add('scroll-blur');
                } else {
                    container.classList.remove('scroll-blur');
                }
            }
        });
    }
    
    // スクロールイベントリスナー（スロットリング付き）
    window.addEventListener('scroll', () => {
        clearTimeout(scrollBlurTimer);
        scrollBlurTimer = setTimeout(updatePoemBlur, 10);
    });
    
    // 初期状態を設定
    updatePoemBlur();
    
    // インジケーターをスクロール時に非表示
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
});

/* ============================================
   ユーティリティ関数
============================================ */

// パフォーマンス最適化用のリサイズハンドラー
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// ページ読み込み完了時の追加設定
window.addEventListener('load', () => {
    // 初期アニメーションを実行（staggerを削除して同時実行）
    gsap.from('.flower-section', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
    });
    
    // あじさいのアニメーションを初期化
    initializeAjisaiAnimation();
});

/* ============================================
   あじさい自転アニメーション制御
============================================ */

function initializeAjisaiAnimation() {
    // 数秒待ってからSVGの処理を開始（ページ読み込み完了を確実にするため）
    setTimeout(() => {
        processAjisaiSvg();
    }, 500);
}

function processAjisaiSvg() {
    // objectタグでajisai.svgを使用している要素を探す
    const objectElements = document.querySelectorAll('object[data*="ajisai.svg"]');
    
    objectElements.forEach(objectElement => {
        // objectが読み込まれるのを待つ
        const checkSvgLoaded = () => {
            try {
                const svgDoc = objectElement.contentDocument;
                if (svgDoc && svgDoc.documentElement.tagName.toLowerCase() === 'svg') {
                    applyAjisaiAnimation(svgDoc.documentElement);
                    return true;
                }
            } catch (e) {
                // アクセス権限がない場合、SVGを直接読み込んで置き換える
                loadAndReplaceSvg(objectElement);
                return true;
            }
            return false;
        };
        
        // SVGが既に読み込まれているかチェック
        if (!checkSvgLoaded()) {
            // まだ読み込まれていない場合、loadイベントを待つ
            objectElement.addEventListener('load', checkSvgLoaded);
            
            // タイムアウト後にフォールバック処理
            setTimeout(() => {
                if (!checkSvgLoaded()) {
                    loadAndReplaceSvg(objectElement);
                }
            }, 2000);
        }
    });
    
    // 既に埋め込まれているSVGもチェック
    checkInlineSvgs();
}

function loadAndReplaceSvg(objectElement) {
    const svgUrl = objectElement.getAttribute('data');
    
    fetch(svgUrl)
        .then(response => response.text())
        .then(svgText => {
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
            const svgElement = svgDoc.documentElement.cloneNode(true);
            
            // 元のobject要素のクラスとスタイルをSVGに適用
            if (objectElement.className) {
                svgElement.setAttribute('class', objectElement.className);
            }
            if (objectElement.style.cssText) {
                svgElement.style.cssText = objectElement.style.cssText;
            }
            
            // object要素をSVGに置き換え
            objectElement.parentNode.replaceChild(svgElement, objectElement);
            
            // アニメーションを適用
            applyAjisaiAnimation(svgElement);
        })
        .catch(error => {
            console.warn('ajisai.svgの読み込みに失敗しました:', error);
        });
}

function checkInlineSvgs() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
        // ajisai.svgの特徴的な要素があるかチェック
        if (svg.querySelector('ellipse.cls-5') || svg.querySelector('ellipse.cls-21') || 
            svg.querySelector('ellipse.cls-4') || svg.querySelector('ellipse.cls-14')) {
            applyAjisaiAnimation(svg);
        }
    });
}

function applyAjisaiAnimation(svgElement) {
    console.log('あじさい花全体の自転アニメーションを適用中...', svgElement);
    
    // 花全体を包含するグループを特定（209-305行目に該当する最後のメイングループ）
    const flowerGroups = svgElement.querySelectorAll('g > g');
    
    if (flowerGroups.length >= 2) {
        // 最後の2つのグループ（外側と内側の花びら）の親グループを取得
        const lastGroup = flowerGroups[flowerGroups.length - 1];
        const secondLastGroup = flowerGroups[flowerGroups.length - 2];
        
        // 共通の親グループを見つける
        let flowerContainer = lastGroup.parentElement;
        
        // 花全体のコンテナにアニメーションクラスを適用
        if (flowerContainer && flowerContainer.tagName.toLowerCase() === 'g') {
            flowerContainer.classList.add('ajisai-flower-rotate');
            console.log('花全体のコンテナにアニメーションクラスを適用');
        }
    } else {
        // 代替方法：SVG内の最後のメイングループを取得
        const mainGroups = svgElement.querySelectorAll(':scope > g');
        if (mainGroups.length > 0) {
            const lastMainGroup = mainGroups[mainGroups.length - 1];
            lastMainGroup.classList.add('ajisai-flower-rotate');
            console.log('メイングループ（代替方法）にアニメーションクラスを適用');
        }
    }
    
    // GSAPによる代替アニメーション（CSSアニメーションのサポート）
    applyGsapAnimation(svgElement);
}

function applyGsapAnimation(svgElement) {
    // 花全体のコンテナを特定
    let flowerContainer = null;
    
    // まず最後のメイングループを試す
    const mainGroups = svgElement.querySelectorAll(':scope > g');
    if (mainGroups.length > 0) {
        flowerContainer = mainGroups[mainGroups.length - 1];
    }
    
    console.log('GSAP花全体アニメーションを適用中...', flowerContainer);
    
    if (flowerContainer) {
        // 花全体を10秒で時計回りに回転
        gsap.to(flowerContainer, {
            rotation: 360,
            duration: 10,
            repeat: -1,
            ease: "none",
            transformOrigin: "center center",
            svgOrigin: "67 9.5" // SVG座標系での中心点
        });
        console.log('花全体にGSAPアニメーションを適用');
    } else {
        // フォールバック：すべての楕円要素をグループとして回転
        const allEllipses = svgElement.querySelectorAll('ellipse');
        if (allEllipses.length > 0) {
            gsap.to(allEllipses, {
                rotation: 360,
                duration: 10,
                repeat: -1,
                ease: "none",
                transformOrigin: "center center",
                svgOrigin: "67 9.5"
            });
            console.log('全楕円要素にGSAPアニメーションを適用（フォールバック）');
        }
    }
}
