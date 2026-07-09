const https = require("https");
const csv = require("csv-parser");
const fs = require("fs");

const url = process.env.ADMITAD_FEED_URL;

if (!url) {
    throw new Error("ADMITAD_FEED_URL отсутствует");
}

const products = [];

https.get(url, (res) => {

    res
        .pipe(csv())

        .on("data", (row) => {

            if (products.length >= 50)
                return;

            const price = parseFloat(
                String(row.sale_price || row.price)
                    .replace(/[^\d.]/g, "")
            );

            if (isNaN(price))
                return;

            if (price < 10 || price > 25)
                return;

            products.push({

                title: row.title,

                category: row.product_type || "AliExpress",

                store: "AliExpress",

                price: row.sale_price || row.price,

                image: row.image_link,

                description: row.description,

                link: row.link

            });

        })

        .on("end", () => {

            fs.writeFileSync(
                "products.json",
                JSON.stringify(products, null, 2)
            );

            console.log("Сохранено товаров:", products.length);

        });

});
