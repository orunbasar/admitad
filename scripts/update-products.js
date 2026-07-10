const https = require("https");
const csv = require("csv-parser");
const fs = require("fs");

const url = process.env.ADMITAD_FEED_URL;

console.log("Старт...");
console.log(url.substring(0, 80) + "...");

https.get(url, (res) => {

    console.log("HTTP:", res.statusCode);
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    let bytes = 0;

    res.on("data", chunk => {
        bytes += chunk.length;

        if (bytes < 1024 * 1024) {
            console.log("Получено", bytes, "байт");
        }
    });

    const parser = csv();

    parser.on("headers", headers => {
        console.log("HEADERS:");
        console.log(headers);
    });

    parser.on("data", row => {
        console.log("Первая строка получена");
        process.exit(0);
    });

    parser.on("error", console.error);

    res.pipe(parser);

}).on("error", console.error);
