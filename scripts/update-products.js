const https = require("https");
const csv = require("csv-parser");
const fs = require("fs");

const url = process.env.ADMITAD_FEED_URL;

if (!url) {
    console.error("ADMITAD_FEED_URL is not задан.");
    process.exit(1);
}

const products = [];
let finished = false;

https.get(url, (res) => {

    if (res.statusCode !== 200) {
        console.error("HTTP:", res.statusCode);
        process.exit(1);
    }

    const parser = csv();

    parser.on("data", (row) => {

        if (finished) return;

        const rawPrice = row.sale_price || row.price || "";

        const price = parseFloat(
            String(rawPrice).replace(/[^\d.]/g, "")
        );

        if (isNaN(price)) return;
        if (price < 10 || price > 25) return;

        products.push({
            title: row.title,
            description: row.description,
            image: row.image_link,
            link: row.link,
            price: rawPrice,
            category: row.product_type || "AliExpress",
            store: "AliExpress"
        });

        if (products.length % 10 === 0) {
            console.log(`Найдено ${products.length} товаров`);
        }

        if (products.length >= 50) {

            finished = true;

            fs.writeFileSync(
                "products.json",
                JSON.stringify(products, null, 2)
            );

            console.log("Сохранено 50 товаров.");

            parser.destroy();
            res.destroy();
        }
    });

    parser.on("end", () => {

        if (!finished) {

            fs.writeFileSync(
                "products.json",
                JSON.stringify(products, null, 2)
            );

            console.log(`Файл закончился. Найдено ${products.length} товаров.`);
        }
    });

    parser.on("error", err => {
        console.error(err);
        process.exit(1);
    });

    res.pipe(parser);

}).on("error", err => {
    console.error(err);
    process.exit(1);
});
