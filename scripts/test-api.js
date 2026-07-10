const https = require("https");

const CLIENT_ID = process.env.ADMITAD_CLIENT_ID;
const CLIENT_SECRET = process.env.ADMITAD_CLIENT_SECRET;

const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

const data = "grant_type=client_credentials";

const req = https.request({
    hostname: "api.admitad.com",
    path: "/token/",
    method: "POST",
    headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(data)
    }
}, (res) => {

    let body = "";

    res.on("data", chunk => body += chunk);

    res.on("end", () => {
        console.log("STATUS:", res.statusCode);
        console.log(body);
    });

});

req.on("error", console.error);

req.write(data);
req.end();
