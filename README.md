# 花の詩 - インタラクティブタイポグラフィ

## 概要

花をテーマにしたインタラクティブなタイポグラフィウェブサイトです。日本の花言葉（hanakotoba）と美しいアニメーションを組み合わせて、詩的な体験を提供します。

## 特徴

### 🌸 実装済み機能

1. **手書き風花名アニメーション**
   - SVGストロークアニメーションによる手書き風文字
   - スクロール時の「はらい」などの自然な動き
   - 小さな花アイコンのブルーム・回転アニメーション

2. **花言葉に基づく花の配置**
   - 花言葉の類似性に基づいたスクロール順序
   - 段階的な色の変遷とモーフィングアニメーション
   - スムーズなセクション間の移行

3. **花言葉のブルームアニメーション**
   - ホバー時の花言葉表示
   - 文字が花びらのように一つずつ現れるアニメーション
   - 浮遊・配置アニメーション

4. **スクロール連動色変化**
   - 花びらの色がスクロールに応じて滑らかに変化
   - 各花の特色に応じた色グラデーション

5. **ウェブ特有のインタラクション**
   - マウスホバーでの花のブルームエフェクト
   - 愛情系花言葉の花占いゲーム（花びらクリック）
   - カーソル追随の花びらエフェクト

### 🌺 対象の花

- **紫陽花** (hydrangea) - 変わりやすい心
- **ひまわり** (sunflower) - 憧れ
- **チューリップ** (tulip) - 愛の告白
- **コスモス** (cosmos) - 調和

## 技術仕様

### 使用技術
- **HTML5** - セマンティックなマークアップ
- **CSS3** - アニメーション、グラデーション、レスポンシブデザイン
- **JavaScript (ES6+)** - インタラクション制御
- **GSAP (GreenSock)** - 高度なアニメーション
  - ScrollTrigger - スクロール連動アニメーション
  - MorphSVG - SVGモーフィング (プレミアム機能)

## ファイル構造と依存関係

```
docs/
├── index.html          # メインHTMLファイル（外部SVGを参照）
├── style.css           # メインCSSファイル
├── script.js           # JavaScriptファイル（SVG読み込み管理）
└── images/             # SVGファイル置き場
    ├── hydrangea.svg   # 紫陽花のSVG（*.petalクラス必須）
    ├── sunflower.svg   # ひまわりのSVG（*.petalクラス必須）
    ├── tulip.svg       # チューリップのSVG（*.clickable-petalクラス必須）
    └── cosmos8.svg     # コスモスのSVG（*.clickable-petalクラス必須）
```

### 🔄 依存関係システム

**外部SVGファイルの自動読み込み**
- HTMLは`<object>`タグで`images/`フォルダのSVGファイルを参照
- SVGファイルを置き換えるだけで自動的にサイトに反映される
- JavaScriptがSVG読み込み完了を検知してインタラクションを有効化

**必須クラス名規則**
- `.petal` - すべての花びら要素に必要（色変化・ホバーエフェクト用）
- `.clickable-petal` - 花占いゲーム対応花びら（cosmos、tulip）
- `.center` - 花の中心部
- `.stem` - 茎
- `.leaf` - 葉

## カスタマイズ方法

### 🌸 新しいSVGファイルに置き換える手順

1. **SVGファイルの準備**
```xml
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <!-- 花びらには必ずpetalクラスを設定 -->
  <ellipse class="petal" cx="100" cy="70" rx="12" ry="18" fill="#3498db"/>
  
  <!-- 花占い対応の場合はclickable-petalクラスも追加 -->
  <ellipse class="petal clickable-petal" cx="120" cy="90" rx="12" ry="18" fill="#3498db"/>
  
  <!-- 中心部・茎・葉も適切なクラスを設定 -->
  <circle class="center" cx="100" cy="100" r="8" fill="#ffffff"/>
  <rect class="stem" x="98" y="108" width="4" height="65" fill="#27ae60"/>
  <ellipse class="leaf" cx="80" cy="135" rx="8" ry="15" fill="#2ecc71"/>
</svg>
```

2. **ファイルの置き換え**
```bash
# 既存のSVGファイルを新しいデザインで置き換え
cp your-custom-hydrangea.svg docs/images/hydrangea.svg
```

3. **ブラウザで確認**
- ファイルを置き換えた瞬間にサイトに反映される
- 色変化、ホバーエフェクト、花占いが自動的に動作

### 📊 SVGクラス別機能

| クラス名 | 機能 | 必須/任意 |
|---------|------|-----------|
| `.petal` | スクロール色変化、ホバーエフェクト | 必須 |
| `.clickable-petal` | 花占いゲーム | 花占い対応花のみ |
| `.center` | 花の中心装飾 | 任意 |
| `.stem` | 茎の装飾 | 任意 |
| `.leaf` | 葉の装飾 | 任意 |

### 🎨 色のカスタマイズ

SVGファイル内で直接色を指定するか、CSSカスタムプロパティを使用：

```css
.flower-section[data-flower="your-flower"] {
    --petal-color-1: #your-color-1;
    --petal-color-2: #your-color-2;
    --petal-color-3: #your-color-3;
}
```

## 機能詳細

### アニメーション機能

1. **ストロークアニメーション**
   - SVGパスの `stroke-dasharray` と `stroke-dashoffset` を使用
   - スクロール位置に応じてストロークが描画される

2. **花びらブルームエフェクト**
   - ホバー時の `scale` と `opacity` 変化
   - 各花びらの段階的アニメーション

3. **色変化システム**
   - HSL/RGB色空間での補間
   - スクロール進行度に応じた動的色変更

### インタラクション機能

1. **花占いゲーム**
   - クリック可能な花びら要素
   - 「すき・きらい」の交互メッセージ
   - 花びら削除アニメーション

2. **カーソルエフェクト**
   - マウス移動検知
   - ランダムな花びら生成・浮遊
   - パフォーマンス最適化

## カスタマイズ方法

### 花を追加する場合

1. **HTMLセクション追加**
```html
<section class="flower-section" data-flower="新しい花名">
    <!-- 花コンテナを追加 -->
</section>
```

2. **CSS色設定追加**
```css
.flower-section[data-flower="新しい花名"] {
    background: linear-gradient(/* 背景グラデーション */);
}
```

3. **JavaScript設定追加**
```javascript
const hanakotobaDatabase = {
    // 既存の花...
    '新しい花名': ['花言葉1', '花言葉2', '花言葉3']
};
```

4. **SVGファイル作成**
   - `images/新しい花名.svg` として保存
   - `.petal` クラスを花びら要素に設定

### アニメーション調整

```css
/* アニメーション速度調整 */
.stroke-path {
    animation: draw-stroke 3s ease-in-out forwards; /* 持続時間変更 */
}

/* 色変化速度調整 */
.color-transition {
    transition: fill 2s ease-in-out; /* より滑らかに */
}
```

## パフォーマンス最適化

- **throttle/debounce** でイベント処理を制限
- **CSS transform** を使用してレイアウトリフローを回避
- **will-change** プロパティでアニメーション最適化
- **requestAnimationFrame** でスムーズなアニメーション

## ブラウザサポート

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 今後の拡張予定

- [ ] 手書きSVGファイルの実装
- [ ] 音響エフェクトの追加
- [ ] 多言語対応
- [ ] モバイル最適化
- [ ] アクセシビリティ向上

## ライセンス

MIT License

## 開発者

パルタン星人 (@parutanseijin)

---

> **注意**: 現在使用しているSVGファイルはプレースホルダーです。`images/` フォルダ内のSVGファイルをカスタムデザインで置き換えることで、より美しい花のビジュアルを実現できます。