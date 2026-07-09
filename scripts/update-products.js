const https = require("https");

const url = process.env.ADMITAD_FEED_URL;

https.get(url, (res) => {
    let data = "";

    res.on("data", chunk => {
        data += chunk.toString();

        if (data.length > 5000) {
            console.log(data.substring(0, 5000));
            res.destroy();   // сразу закрываем соединение
        }
    });

    res.on("close", () => {
        process.exit(0);
    });
});
