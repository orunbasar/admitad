const https = require("https");

const url = process.env.ADMITAD_FEED_URL;

console.log("URL:", url);

https.get(url, (res) => {

    console.log("STATUS:", res.statusCode);
    console.log("HEADERS:", res.headers);

    let bytes = 0;

    res.on("data", chunk => {
        bytes += chunk.length;

        if (bytes <= 500) {
            console.log(chunk.toString());
        }
    });

    res.on("end", () => {
        console.log("Получено байт:", bytes);
    });

}).on("error", err => {
    console.error(err);
});
