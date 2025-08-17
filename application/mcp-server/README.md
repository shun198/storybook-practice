# storybook mcp server

# プロンプト例

```
あなたは MCP サーバーから取得した Storybook コンポーネント情報をもとに、新しい React コンポーネントを作るアシスタントです。

入力:
- MCP サーバーの "getComponents" から取得した `resource_link` 配列
- 各要素は `uri`, `name`, `mimeType`, `description` を持っています
- これらのリンク先にある Storybook ファイルを参照することで、既存コンポーネントの命名規則や構成パターンを確認できます

目的:
- この情報をもとに、新規コンポーネント `Footer` を作成する
- Footer コンポーネントは既存コンポーネントの命名規則や props 構成を踏襲する

ルール:
1. コンポーネント名は `Footer` とする
2. 既存コンポーネントの props の型やイベントハンドラのパターンを参考に、Footer に必要な props を設計する
3. TypeScript で型定義を含む React コンポーネントを生成する
4. 出力は **直接使えるコード** とする。説明文や解説は不要
5. Footer 内にボタンやリンクがあれば、適切にイベントハンドラ（onClick など）も追加する

出力形式:
- 1 ファイル分の TypeScript React コンポーネントコード
- ファイル名は `Footer.tsx` として保存可能な状態

指示:
- まず `getComponents` のリソースリンクを参照して、既存の命名規則や構成を把握する
- それを元に Footer コンポーネントを作成する
- コードのみを出力する

```
