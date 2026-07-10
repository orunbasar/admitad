const https = require("https");
const csv = require("csv-parser");

https.get(process.env.ADMITAD_FEED_URL, res => {

    const parser = csv({
        separator: "\t"
    });

    parser.on("headers", headers => {
        console.log(headers);
    });

    parser.on("data", row => {
        console.log(JSON.stringify(row, null, 2));
        process.exit(0);
    });

    res.pipe(parser);

});
