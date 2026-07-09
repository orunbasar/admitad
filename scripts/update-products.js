const https = require("https");
const csv = require("csv-parser");

https.get(process.env.ADMITAD_FEED_URL, (res) => {
  res
    .pipe(csv())
    .on("headers", (headers) => {
      console.log(headers);
      process.exit(0);
    });
});
