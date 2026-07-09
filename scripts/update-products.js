const https = require("https");
const csv = require("csv-parser");

const url = process.env.ADMITAD_FEED_URL;

if (!url) {
  throw new Error("ADMITAD_FEED_URL не задан");
}

https.get(url, (res) => {
  res
    .pipe(csv())
    .on("headers", (headers) => {
      console.log("HEADERS:");
      console.log(headers);
      process.exit(0);
    });
});
