const { build } = require("esbuild");

// Pull version from environment variable
const VERSION = process.env.VERSION || "0.0.0";

build({
    entryPoints: ["src/main.ts"],
    bundle: true,
    format: "esm",
    outfile: "scripts/main.js",
    define: {
        EXTERNAL_VERSION: `"${VERSION}"`
    },
    external: [
        "@minecraft/server",
        "@minecraft/server-ui"
    ],
}).catch(() => process.exit(1));
