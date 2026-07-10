const https = require("https");
const csv = require("csv-parser");
const fs = require("fs");

const url = process.env.ADMITAD_FEED_URL;

const products = [];

https.get(url, (res) => {

    if (res.statusCode !== 200) {
        console.error("HTTP", res.statusCode);
        process.exit(1);
    }

    const parser = csv();

    parser.on("data", (row) => {

        const price = parseFloat(
            String(row.sale_price || row.price || "")
                .replace(/[^\d.]/g, "")
        );

        if (isNaN(price)) return;
        if (price < 10 || price > 25) return;

        products.push({
            title: row.title,
            description: row.description,
            image: row.image_link,
            link: row.link,
            price: row.sale_price || row.price,
            category: row.product_type || "AliExpress",
            store: "AliExpress"
        });

        if (products.length === 50) {

            console.log("Нашли 50 товаров.");

            fs.writeFileSync(
                "products.json",
                JSON.stringify(products, null, 2)
            );

            parser.end();
            res.destroy();
        }

    });

    parser.on("end", () => {
        console.log("Готово");
        process.exit(0);
    });

    parser.on("error", (err) => {
        console.error(err);
        process.exit(1);
    });

    res.pipe(parser);

}).on("error", console.error);
