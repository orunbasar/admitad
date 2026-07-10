const https = require("https");
const querystring = require("querystring");

const data = querystring.stringify({
    grant_type: "client_credentials",
    client_id: process.env.ADMITAD_CLIENT_ID,
    client_secret: process.env.ADMITAD_CLIENT_SECRET
});

const req = https.request({
    hostname: "api.admitad.com",
    path: "/token/",
    method: "POST",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(data)
    }
}, res => {

    let body = "";

    res.on("data", c => body += c);

    res.on("end", () => {
        console.log("STATUS:", res.statusCode);
        console.log(body);
    });

});

req.write(data);
req.end();
