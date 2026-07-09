
const fs = require("fs");

const products = [
  {
    title: "Тестовый товар",
    category: "Тест",
    store: "Admitad",
    price: "19.99 USD",
    image: "https://picsum.photos/600/400",
    description: "Если вы видите этот товар, GitHub Actions работают.",
    link: "https://google.com"
  }
];

fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

console.log("products.json обновлен");
