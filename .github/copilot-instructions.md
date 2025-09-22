
# Copilot Instructions for AI Agents

## 概要
このリポジトリは、シンプルなWebベースのシューティングゲーム（`game/`）とその説明ページ（`docs/`）で構成されています。主な目的は、HTML/CSS/JavaScriptのみで動作する軽量なゲームと、その利用方法の提供です。

## ディレクトリ構成
- `game/` : ゲーム本体（`index.html`, `main.js`, `style.css`）。
- `docs/` : ゲーム説明ページ（`index.html`, `style.css`）。

## ゲームのアーキテクチャ
- ゲームロジックは `main.js` に集約。Canvas API を用いて描画。
- プレイヤー・敵・弾などの座標・状態はグローバル変数で管理。
- ゲームループは `requestAnimationFrame` で実装。
- 入力は `keydown` イベントで処理。
- 弾の描画は `tama` 変数で管理（例: `for (let i = 0; i < tama; i++) {...}`）。

## 開発・デバッグ方法
- ゲームは `game/index.html` をブラウザで直接開いて動作確認。
- ドキュメントは `docs/index.html` で確認。
- ビルド・テスト自動化はなし。依存パッケージ不要。
- 変更は即座に反映されるため、リロードで確認。

## コーディング規約・パターン
- ファイル分割は最小限。各ディレクトリに `index.html`・`style.css`・（ゲームのみ）`main.js`。
- JavaScriptは1ファイル（`main.js`）に集約。外部ライブラリ未使用。
- 命名規則はシンプル（例: `x`, `y`, `z1`, `tama` など）。
- 画面サイズ・座標は固定値（例: 480x640）。

## 重要なファイル例
- `game/main.js` : ゲームロジックの中心。Canvas描画・入力処理・ループ管理。
- `game/index.html` : ゲーム画面のHTML。
- `game/style.css` : ゲーム画面のスタイル。
- `docs/index.html` : ゲーム説明ページ。
- `docs/style.css` : 説明ページのスタイル。

## AIエージェントへの指針
- 機能追加・修正は既存の構造・命名規則を踏襲。
- JavaScriptや外部ライブラリ導入時は `README.md` や `docs/index.html` に必ず記載。
- 変更時はファイル冒頭に簡潔なコメントや説明を追加。
- ディレクトリ構成・ファイル命名は現状維持を推奨。

---
このガイドは2025年9月時点の構成に基づいています。大きな構造変更時は本ファイルも更新してください。
