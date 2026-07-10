const https = require("https");

console.log("CLIENT_ID:", process.env.ADMITAD_CLIENT_ID ? "FOUND" : "MISSING");
console.log("CLIENT_SECRET:", process.env.ADMITAD_CLIENT_SECRET ? "FOUND" : "MISSING");

const CLIENT_ID = process.env.ADMITAD_CLIENT_ID;
const CLIENT_SECRET = process.env.ADMITAD_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Secrets are missing");
  process.exit(1);
}

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

    res.on("data", chunk => body += chunk);
    res.on("end", () => {
      console.log("STATUS:", res.statusCode);
      console.log(body);
    });
  }
);

req.on("error", console.error);

req.write("grant_type=client_credentials");
req.end();
