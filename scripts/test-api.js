
const https = require("https");

const CLIENT_ID = process.env.ADMITAD_CLIENT_ID;
const CLIENT_SECRET = process.env.ADMITAD_CLIENT_SECRET;

const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

const req = https.request(
  {
    hostname: "api.admitad.com",
    path: "/token/",
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded"
    }
  },
  (res) => {
    let body = "";

    res.on("data", (chunk) => (body += chunk));
    res.on("end", () => {
      console.log("STATUS:", res.statusCode);
      console.log(body);
    });
  }
);

req.write("grant_type=client_credentials");
req.end();
