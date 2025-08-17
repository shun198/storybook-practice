// https://github.com/modelcontextprotocol/typescript-sdk
// https://developers.play.jp/entry/2025/06/20/191042
// https://zenn.dev/takuya77088/articles/f7149723b3b2f2
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new McpServer({ name: "storybook-mcp", version: "1.0.0" });

// dist/server.jsから見たstoriesディレクトリのパス
const storiesDir = path.resolve(__dirname, "../../src/stories");

/**
 * storiesフォルダからコンポーネント一覧を取得する
 */
function loadStoryComponents(): { file: string; componentName: string }[] {
  if (!fs.existsSync(storiesDir)) {
    console.error(`Stories directory not found: ${storiesDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(storiesDir)
    .filter((f) => f.endsWith(".stories.ts") || f.endsWith(".stories.tsx"))
    .map((f) => ({
      file: f,
      componentName: f.replace(/\.stories\.tsx?$/, "")
    }));

  if (files.length === 0) {
    console.error(`No components found in: ${storiesDir}`);
    process.exit(1);
  }

  return files;
}

// ---- 初期化時にロード ----
const storyFiles = loadStoryComponents();

/**
 * storiesフォルダ内のコンポーネント一覧を返す
 */
server.registerTool(
  "getComponents",
  {
    title: "getComponents",
    description: "Get the list of Storybook story files under src/stories",
    inputSchema: {},
  },
  async () => {
    return {
      content: [
        {
          type: "resource",
          resource: {
            blob: JSON.stringify(storyFiles),
            uri: "local:storybook/components.json",
            text: "Components list JSON",
            mimeType: "application/json",
          },
        },
      ],
    };
  }
);

/**
 * コンポーネントのprops情報を返す
 */
server.registerTool(
  "getComponentProps",
  {
    title: "getComponentProps",
    description: "Get the props information for a specific component",
    inputSchema: {
      componentName: z.string().describe("The name of the component"),
    },
  },
  async ({ componentName }) => {
    const data = {
      component: componentName,
      props: {
        title: { type: "string", required: true },
        onClick: { type: "function", required: false },
      },
    };
    // https://modelcontextprotocol.io/specification/2025-06-18/server/resources#resource-contents
    return {
      content: [
        {
          type: "resource",
          resource: {
            blob: JSON.stringify(data),
            uri: `local:storybook/${componentName}.json`,
            text: `Props info for ${componentName}`,
            mimeType: "application/json",
          },
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
