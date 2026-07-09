const https = require("https");
const csv = require("csv-parser");
const fs = require("fs");

const url = process.env.ADMITAD_FEED_URL;

const products = [];

https.get(url, (res) => {

    const parser = csv();

    parser.on("data", (row) => {

        const price = parseFloat(
            String(row.sale_price || row.price)
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

        if (products.length >= 50) {
            console.log("Нашли 50 товаров.");

            fs.writeFileSync(
                "products.json",
                JSON.stringify(products, null, 2)
            );

            // ВАЖНО: сразу закрываем соединение
            res.destroy();
            parser.destroy();
        }
    });

    parser.on("close", () => {
        console.log("Готово.");
    });

    res.pipe(parser);

});
