import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/** We've to build the ServerApp before importing it **/
import renderApp from "./dist/server/ServerApp.js"; // eslint-disable-line import/no-unresolved
/** *** **/

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3001;

/** Reads the generated html and splits it to send in parts to the client **/
const html = fs
  .readFileSync(path.resolve(__dirname, "./dist/client/index.html"))
  .toString();

const parts = html.split("not rendered");
/** *** **/

/** Create express server **/
const app = express();

app.use(
  "/assets",
  express.static(path.resolve(__dirname, "./dist/client/assets"))
);

app.use((req, res) => {
  res.write(parts[0]);

  const stream = renderApp(req.url, {
    onShellReady() {
      // If SEO is imporant, you can do nothing here if the visitor is Google Crawler
      // stream.pipe(res) should not exist here
      // you've to send the complete html in the onAllReady function

      stream.pipe(res);
    },
    onShellError() {
      // error handling here
    },
    onAllReady() {
      // If it is the crawler:
      // stream.pipe(res);

      // last thing to write
      res.write(parts[1]);
      res.end();
    },
    onError(err) {
      console.log(err);
    },
  });
});

console.log(`Listening on port ${PORT}`);
app.listen(PORT);
