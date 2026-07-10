const https = require("https");
const csv = require("csv-parser");
const fs = require("fs");

const url = process.env.ADMITAD_FEED_URL;

if (!url) {
    console.error("ADMITAD_FEED_URL не задан");
    process.exit(1);
}

const products = [];

console.log("Начинаем загрузку...");

https.get(url, (res) => {

    if (res.statusCode !== 200) {
        console.error("HTTP ERROR:", res.statusCode);
        process.exit(1);
    }

    const parser = csv({
        separator: "\t"
    });

    parser.on("data", (row) => {

        const salePrice = parseFloat(
            String(row.sale_price || "").replace(/[^\d.]/g, "")
        );

        const price = parseFloat(
            String(row.price || "").replace(/[^\d.]/g, "")
        );

        const finalPrice = !isNaN(salePrice)
            ? salePrice
            : price;

        if (isNaN(finalPrice)) return;

        products.push({
            id: row.id,
            title: row.title,
            description: row.description,
            image: row.image_link,
            link: `https://aliexpress.com/item/${row.id}.html`,
            price: finalPrice,
            oldPrice: row.price,
            category: row.product_type,
            store: "AliExpress"
        });

        console.log(`Добавлено: ${products.length}`);

        if (products.length >= 50) {

            fs.writeFileSync(
                "products.json",
                JSON.stringify(products, null, 2)
            );

            console.log("Сохранено 50 товаров.");

            parser.destroy();
            res.destroy();
        }

    });

    parser.on("close", () => {

        if (!fs.existsSync("products.json")) {

            fs.writeFileSync(
                "products.json",
                JSON.stringify(products, null, 2)
            );

            console.log(`Готово. Найдено ${products.length} товаров.`);
        }

    });

    parser.on("error", console.error);

    res.pipe(parser);

}).on("error", console.error);
