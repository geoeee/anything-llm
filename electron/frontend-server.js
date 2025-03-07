import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
let __dirname = dirname(__filename);
console.log("[web]dir", __dirname);

if (__dirname.indexOf("app.asar") >= 0) {
  __dirname = path.join(__dirname, "..");
  console.log("[web]change root path to", __dirname);
}

const app = express();
const port = 3000;

console.log("[web static path]", path.join(__dirname, "../frontend/dist"));
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
