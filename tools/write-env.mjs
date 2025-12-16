import fs from "fs";

const raw = (process.env.API_BASE_URL || "http://localhost:8080").replace(
  /\/+$/,
  ""
);

// If the env var does NOT already include /api/v1, append it.
const apiBaseUrl = raw.endsWith("/api/v1") ? raw : `${raw}/api/v1`;

const content = `export const environment = {
  production: true,
  apiBaseUrl: '${apiBaseUrl}'
};
`;

fs.writeFileSync("src/environments/environment.ts", content, "utf8");
console.log("[write-env] apiBaseUrl =", apiBaseUrl);
