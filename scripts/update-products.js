const https = require("https");
const csv = require("csv-parser");

const url = process.env.ADMITAD_FEED_URL;

console.log("Старт...");
console.log(url);

https.get(url, (res) => {
    console.log("HTTP:", res.statusCode);
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    const parser = csv();

    let first = true;

    parser.on("headers", (headers) => {
        console.log("HEADERS:");
        console.log(headers);
    });

    parser.on("data", (row) => {

        if (first) {
            first = false;

            console.log("ПЕРВАЯ СТРОКА:");
            console.log(JSON.stringify(row, null, 2));

            process.exit(0);
        }

    });

    parser.on("error", (err) => {
        console.error("CSV ERROR:");
        console.error(err);
    });

    res.on("error", (err) => {
        console.error("HTTP ERROR:");
        console.error(err);
    });

    res.pipe(parser);

}).on("error", (err) => {
    console.error(err);
});
