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
    sunflower: ['憧れ', '熱愛', 'あなただけを見つめる', '情熱'],
    nemophila: ['可憐', '清々しい心', '成功', '初恋'],
    northpole: ['誠実', '冬の足音', '清潔', '純粋']
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
        // 背景色データ
        const backgroundColors = {
            default: 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)',
            hydrangea: 'linear-gradient(135deg, rgba(107, 115, 255, 0.3) 0%, rgba(155, 89, 182, 0.4) 100%)',
            cosmos: 'linear-gradient(135deg, rgba(255, 107, 157, 0.3) 0%, rgba(231, 76, 60, 0.4) 100%)',
            tulip: 'linear-gradient(135deg, rgba(255, 149, 0, 0.3) 0%, rgba(230, 126, 34, 0.4) 100%)',
            sunflower: 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(241, 196, 15, 0.4) 100%)',
            nemophila: 'linear-gradient(135deg, rgba(52, 152, 219, 0.3) 0%, rgba(52, 152, 219, 0.4) 100%)',
            northpole: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0%, rgba(236, 240, 241, 0.5) 100%)'
        };

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
                    if (self.isActive) {
                        this.activateSection(section, index);
                        // 背景色を滑らかに変更
                        document.body.style.background = backgroundColors[section.dataset.flower] || backgroundColors.default;
                    } else {
                        this.deactivateSection(section);
                        // 前後のセクションの状態に基づいて背景色を決定
                        const prevSection = this.sections[index - 1];
                        const nextSection = this.sections[index + 1];
                        if (self.direction === -1 && prevSection && prevSection.classList.contains('active')) {
                            // 上にスクロールして前のセクションがアクティブな場合
                            document.body.style.background = backgroundColors[prevSection.dataset.flower] || backgroundColors.default;
                        } else if (self.direction === 1 && !nextSection) {
                            // 最後のセクションを下にスクロールして離れた場合
                             document.body.style.background = backgroundColors.default;
                        }
                    }
                }
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
        // 紫陽花セクションの花言葉のランダム配置を設定
        const hydrangeaSection = document.querySelector('.flower-section[data-flower="hydrangea"]');
        if (!hydrangeaSection) return;
        
        const hanakotobaWords = hydrangeaSection.querySelectorAll('.hanakotoba-word');
        if (!hanakotobaWords.length) return;
        
        // 各花言葉を個別にランダム配置
        hanakotobaWords.forEach((wordElement, index) => {
            this.positionHanakotobaWordRandomly(wordElement, index);
        });
        
        // ウィンドウリサイズ時に再配置
        window.addEventListener('resize', () => {
            setTimeout(() => {
                hanakotobaWords.forEach((wordElement, index) => {
                    this.positionHanakotobaWordRandomly(wordElement, index);
                });
            }, 100);
        });
    }
    
    positionHanakotobaWordRandomly(wordElement, index) {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // レスポンシブに対応した配置範囲の計算（詩とは異なる位置、各単語も重ならないように配置）
        let leftRange, topRange, maxHeight;
        
        if (windowWidth <= 480) {
            // スマートフォン - 縦に並べる
            leftRange = { min: 5, max: 25 };
            topRange = { 
                min: 20 + (index * 25), 
                max: 35 + (index * 25) 
            };
            maxHeight = Math.min(200, windowHeight * 0.45);
        } else if (windowWidth <= 768) {
            // タブレット - 少し広がりを持たせる
            leftRange = { min: 8, max: 35 };
            topRange = { 
                min: 15 + (index * 20), 
                max: 30 + (index * 20) 
            };
            maxHeight = Math.min(250, windowHeight * 0.5);
        } else if (windowWidth <= 1024) {
            // 小さなデスクトップ - より自由な配置
            leftRange = { min: 10, max: 40 };
            topRange = { 
                min: 10 + (index * 18), 
                max: 25 + (index * 18) 
            };
            maxHeight = Math.min(280, windowHeight * 0.6);
        } else {
            // デスクトップ - 最も自由な配置
            leftRange = { min: 12, max: 45 };
            topRange = { 
                min: 8 + (index * 15), 
                max: 20 + (index * 15) 
            };
            maxHeight = Math.min(300, windowHeight * 0.6);
        }
        
        // ランダムな位置を計算（詩とは逆側、各単語は重ならないよう調整）
        const randomLeft = leftRange.min + Math.random() * (leftRange.max - leftRange.min);
        const randomTop = Math.min(topRange.min + Math.random() * (topRange.max - topRange.min), 80); // 80%を超えないよう制限
        
        // 要素の高さを動的に調整
        const adjustedHeight = Math.min(maxHeight, windowHeight * 0.4);
        
        // CSS変数を使用して位置を設定
        wordElement.style.left = `${randomLeft}%`;
        wordElement.style.top = `${randomTop}%`;
        wordElement.style.height = `${adjustedHeight}px`;
        
        // 花言葉の文字サイズも調整
        if (windowWidth <= 360) {
            wordElement.style.fontSize = '11px';
        } else if (windowWidth <= 480) {
            wordElement.style.fontSize = '12px';
        } else if (windowWidth <= 768) {
            wordElement.style.fontSize = '14px';
        } else {
            wordElement.style.fontSize = '16px';
        }
        
        // デバッグ用ログ（開発時にコメントアウト可能）
        console.log(`🌺 花言葉${index + 1}の配置: left: ${randomLeft.toFixed(1)}%, top: ${randomTop.toFixed(1)}%, height: ${adjustedHeight}px`);
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
            sunflower: ['#f1c40f', '#f39c12', '#FFD700'],
            nemophila: ['#3498db', '#2980b9', '#87CEEB'],
            northpole: ['#ffffff', '#ecf0f1', '#f8f9fa']
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
        
        // すべてのSVGが読み込まれた後に追加設定
        Promise.all(this.svgLoadPromises).then(() => {
            console.log('✨ すべてのSVGファイルが読み込まれました');
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
            
            container.addEventListener('mouseenter', () => this.onFlowerHover(container));
            container.addEventListener('mouseleave', () => this.onFlowerLeave(container));
        });
    }
    
    onFlowerHover(container) {
        const objectElement = container.querySelector('.flower-svg');
        
        // SVGが読み込まれている場合のみ実行（軽微なエフェクトのみ）
        if (objectElement.classList.contains('flower-svg-loaded')) {
            const svgDoc = objectElement.contentDocument;
            const petals = svgDoc.querySelectorAll('.petal');
            
            petals.forEach((petal, index) => {
                gsap.to(petal, {
                    scale: 1.02,
                    opacity: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
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
        
        // SVGが読み込まれている場合のみ実行
        if (objectElement.classList.contains('flower-svg-loaded')) {
            const svgDoc = objectElement.contentDocument;
            const petals = svgDoc.querySelectorAll('.petal');
            
            petals.forEach(petal => {
                gsap.to(petal, {
                    scale: 1,
                    duration: 0.2,
                    ease: "power2.out"
                });
            });
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
   メイン実行
============================================ */

document.addEventListener('DOMContentLoaded', () => {
    console.log('🌸 花の詩 - インタラクティブタイポグラフィ 初期化中...');
    
    // 各システムを初期化
    const cursorPetals = new CursorPetals();
    const scrollAnimations = new ScrollAnimations();
    const flowerInteractions = new FlowerInteractions();
    const particleSystem = new ParticleSystem();
    
    console.log('✨ 初期化完了！');
    
    // スクロールインジケーターを追加
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.innerHTML = '↓ スクロールして花を探索 ↓';
    document.body.appendChild(scrollIndicator);
    
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
});
