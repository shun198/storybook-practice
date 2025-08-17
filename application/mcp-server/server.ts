// https://github.com/modelcontextprotocol/typescript-sdk
// https://developers.play.jp/entry/2025/06/20/191042
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = new McpServer({ name: "storybook-mcp", version: "1.0.0" });

/**
 * storiesフォルダ内のコンポーネント一覧を返す
 */
server.tool(
  "getComponents",
  "Get the list of Storybook story files under src/stories",
  async () => {
    const storiesDir = path.resolve(__dirname, "../src/stories");
    if (!fs.existsSync(storiesDir)) {
      return {
        content: [
          { type: "text", text: "No stories directory found." }
        ]
      };
    }

    const files = fs
      .readdirSync(storiesDir)
      .filter((f) => f.endsWith(".stories.tsx"))
      .map((f) => ({
        file: f,
        componentName: f.replace(".stories.tsx", "")
      }));

    return {
      content: [
        {
          type: "resource",
          resource: {
            blob: JSON.stringify(files),
            uri: "local:storybook/components.json",
            text: "Components list JSON",
          },
        },
      ],
    };
  }
);

/**
 * コンポーネントのprops情報を返す
 */
server.tool(
  "getComponentProps",
  "Get the props information for a specific component",
  {
    componentName: z.string().describe("The name of the component"),
  },
  async ({ componentName }) => {
    const data = {
      component: componentName,
      props: {
        title: { type: "string", required: true },
        onClick: { type: "function", required: false },
      },
    };

    return {
      content: [
        {
          type: "resource",
          resource: {
            blob: JSON.stringify(data),
            uri: `local:storybook/${componentName}.json`,
            text: `Props info for ${componentName}`,
          },
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
