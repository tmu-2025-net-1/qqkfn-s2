// デバッグ用JavaScript - 要素の状態を監視・表示

class DebugMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        this.updateDebugInfo();
        this.setupEventListeners();
        this.monitorOverflow();
        this.logElementHierarchy();
    }
    
    updateDebugInfo() {
        // ビューポートサイズ
        const viewportSize = document.getElementById('viewport-size');
        if (viewportSize) {
            viewportSize.textContent = `${window.innerWidth}x${window.innerHeight}`;
        }
        
        // スクロール位置
        const scrollPos = document.getElementById('scroll-pos');
        if (scrollPos) {
            scrollPos.textContent = `${Math.round(window.scrollY)}px`;
        }
        
        // SVG読み込み状態
        this.updateSVGStatus();
        
        // Overflow設定の監視
        this.updateOverflowStatus();
        
        // 1秒ごとに更新
        setTimeout(() => this.updateDebugInfo(), 1000);
    }
    
    updateSVGStatus() {
        const svgStatus = document.getElementById('svg-status');
        if (!svgStatus) return;
        
        const svgElements = document.querySelectorAll('.flower-svg');
        const loadedCount = document.querySelectorAll('.flower-svg-loaded').length;
        svgStatus.textContent = `${loadedCount}/${svgElements.length} 読み込み完了`;
        
        if (loadedCount === svgElements.length) {
            svgStatus.parentElement.classList.add('active');
        }
    }
    
    updateOverflowStatus() {
        const overflowStatus = document.getElementById('overflow-status');
        if (!overflowStatus) return;
        
        const problematicElements = [];
        
        // 主要な要素のoverflow設定をチェック
        const elementsToCheck = [
            { selector: 'body', name: 'Body' },
            { selector: '.main-container', name: 'MainContainer' },
            { selector: '.flower-section', name: 'FlowerSection' },
            { selector: '.flower-container', name: 'FlowerContainer' },
            { selector: '.flower-svg-container', name: 'SVGContainer' },
            { selector: '.flower-svg', name: 'SVGElement' }
        ];
        
        elementsToCheck.forEach(item => {
            const elements = document.querySelectorAll(item.selector);
            elements.forEach((element, index) => {
                const computedStyle = window.getComputedStyle(element);
                const overflowX = computedStyle.overflowX;
                const overflowY = computedStyle.overflowY;
                
                if (overflowX === 'hidden' || overflowY === 'hidden') {
                    problematicElements.push(`${item.name}[${index}]: ${overflowX}/${overflowY}`);
                }
            });
        });
        
        if (problematicElements.length > 0) {
            overflowStatus.textContent = problematicElements.join(', ');
            overflowStatus.parentElement.style.color = '#ff6666';
        } else {
            overflowStatus.textContent = 'すべてvisible';
            overflowStatus.parentElement.style.color = '#66ff66';
        }
    }
    
    setupEventListeners() {
        // スクロールイベント
        window.addEventListener('scroll', () => {
            const scrollPos = document.getElementById('scroll-pos');
            if (scrollPos) {
                scrollPos.textContent = `${Math.round(window.scrollY)}px`;
            }
        });
        
        // リサイズイベント
        window.addEventListener('resize', () => {
            const viewportSize = document.getElementById('viewport-size');
            if (viewportSize) {
                viewportSize.textContent = `${window.innerWidth}x${window.innerHeight}`;
            }
        });
        
        // アクティブセクションの監視
        this.monitorActiveSection();
    }
    
    monitorActiveSection() {
        const observer = new MutationObserver(() => {
            const activeSection = document.querySelector('.flower-section.active');
            const activeSectionSpan = document.getElementById('active-section');
            
            if (activeSectionSpan) {
                if (activeSection) {
                    const sectionName = activeSection.dataset.flower || 'unknown';
                    activeSectionSpan.textContent = sectionName;
                    activeSectionSpan.parentElement.classList.add('active');
                } else {
                    activeSectionSpan.textContent = 'なし';
                    activeSectionSpan.parentElement.classList.remove('active');
                }
            }
        });
        
        // すべてのflower-sectionを監視
        document.querySelectorAll('.flower-section').forEach(section => {
            observer.observe(section, { 
                attributes: true, 
                attributeFilter: ['class'] 
            });
        });
    }
    
    monitorOverflow() {
        // 定期的にoverflow設定をチェックして問題があればコンソールに出力
        setInterval(() => {
            this.checkOverflowIssues();
        }, 5000);
    }
    
    checkOverflowIssues() {
        const issues = [];
        
        // SVG内の花びらの位置をチェック
        document.querySelectorAll('.flower-svg-loaded').forEach((svgElement, index) => {
            const svgDoc = svgElement.contentDocument;
            if (!svgDoc) return;
            
            const svg = svgDoc.querySelector('svg');
            const petals = svgDoc.querySelectorAll('.petal');
            
            if (svg && petals.length > 0) {
                const viewBox = svg.getAttribute('viewBox');
                const [x, y, width, height] = viewBox.split(' ').map(Number);
                
                petals.forEach((petal, petalIndex) => {
                    const bbox = petal.getBBox();
                    
                    // viewBox範囲外に出ている花びらをチェック
                    if (bbox.x < x || bbox.y < y || 
                        bbox.x + bbox.width > x + width || 
                        bbox.y + bbox.height > y + height) {
                        issues.push(`SVG[${index}] Petal[${petalIndex}]: viewBox範囲外 (${bbox.x}, ${bbox.y}, ${bbox.width}, ${bbox.height})`);
                    }
                });
            }
        });
        
        if (issues.length > 0) {
            console.warn('🚨 Overflow問題を検出:', issues);
        }
    }
    
    logElementHierarchy() {
        console.log('🌸 要素階層とoverflow設定:');
        
        const logElement = (element, depth = 0) => {
            const indent = '  '.repeat(depth);
            const tagName = element.tagName.toLowerCase();
            const className = element.className ? `.${element.className.replace(/ /g, '.')}` : '';
            const id = element.id ? `#${element.id}` : '';
            
            const computedStyle = window.getComputedStyle(element);
            const overflowX = computedStyle.overflowX;
            const overflowY = computedStyle.overflowY;
            
            console.log(`${indent}${tagName}${id}${className} - overflow: ${overflowX}/${overflowY}`);
            
            // 子要素も再帰的にログ出力（深度制限）
            if (depth < 3 && element.children.length > 0) {
                Array.from(element.children).forEach(child => {
                    if (child.classList.contains('flower-section') || 
                        child.classList.contains('flower-container') || 
                        child.classList.contains('flower-svg-container') || 
                        child.classList.contains('flower-svg')) {
                        logElement(child, depth + 1);
                    }
                });
            }
        };
        
        logElement(document.body);
    }
}

// DOMContentLoaded後にデバッグモニターを開始
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐛 デバッグモニター開始');
    const debugMonitor = new DebugMonitor();
});

// SVGの詳細情報をコンソールに出力する関数
window.debugSVG = function(svgIndex = 0) {
    const svgElements = document.querySelectorAll('.flower-svg');
    const svgElement = svgElements[svgIndex];
    
    if (!svgElement) {
        console.error(`SVG[${svgIndex}]が見つかりません`);
        return;
    }
    
    const svgDoc = svgElement.contentDocument;
    if (!svgDoc) {
        console.error(`SVG[${svgIndex}]のcontentDocumentが取得できません`);
        return;
    }
    
    const svg = svgDoc.querySelector('svg');
    const petals = svgDoc.querySelectorAll('.petal');
    
    console.log(`🌸 SVG[${svgIndex}] 詳細情報:`);
    console.log(`viewBox: ${svg.getAttribute('viewBox')}`);
    console.log(`花びら数: ${petals.length}`);
    
    petals.forEach((petal, index) => {
        const bbox = petal.getBBox();
        const transform = petal.getAttribute('transform') || 'none';
        console.log(`  花びら[${index}]: bbox(${bbox.x}, ${bbox.y}, ${bbox.width}, ${bbox.height}) transform: ${transform}`);
    });
};

// すべてのSVGをデバッグする関数
window.debugAllSVGs = function() {
    const svgElements = document.querySelectorAll('.flower-svg');
    svgElements.forEach((_, index) => {
        debugSVG(index);
    });
};
