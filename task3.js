// const fs = require("fs");
// const productsData = require("./products.json");

// // Step 1
// const products = productsData.products;

// // Step 2
// const filteredProducts = products.map(product => ({
//     id: product.id,
//     title: product.title,
//     category: product.category,
//     rating: product.rating,
//     discountPercentage: product.discountPercentage
// }));

// // Step 3
// const renamedProducts = filteredProducts.map(product => ({
//     productId: product.id,
//     name: product.title,
//     category: product.category,
//     discount: product.discountPercentage,
//     rating: product.rating
// }));

// // Step 4
// const marketingProducts = renamedProducts.map(product => ({
//     ...product,
//     marketingTag: product.rating >= 4 ? "PROMOTE" : "REVIEW"
// }));

// // Step 5
// const sortedProducts = marketingProducts.sort(
//     (a, b) => b.discount - a.discount
// );

// console.log(sortedProducts);

// // Step 6
// fs.writeFileSync(
//     "marketing-products.json",
//     JSON.stringify(sortedProducts, null, 2)
// );

// console.log("marketing-products.json created successfully!");

const fs = require("fs");
const productsData = require("./products.json");

function processProducts() {

    // ===========================
    // STEP 1 - Fetch all products
    // ===========================

    const products = productsData.products;

    console.log("========== STEP 1 ==========");
    console.log("Total Products:", products.length);
    console.log(products);


    // ======================================
    // STEP 2 - Keep required fields only
    // ======================================

    const filteredProducts = products.map(product => ({
        id: product.id,
        title: product.title,
        category: product.category,
        rating: product.rating,
        discountPercentage: product.discountPercentage
    }));

    console.log("\n========== STEP 2 ==========");
    console.log(filteredProducts);


    // ======================================
    // STEP 3 - Rename fields
    // ======================================

    const renamedProducts = filteredProducts.map(product => ({
        productId: product.id,
        name: product.title,
        category: product.category,
        discount: product.discountPercentage,
        rating: product.rating
    }));

    console.log("\n========== STEP 3 ==========");
    console.log(renamedProducts);


    // ======================================
    // STEP 4 - Add marketingTag
    // ======================================

    const marketingProducts = renamedProducts.map(product => ({
        ...product,
        marketingTag: product.rating >= 4
            ? "PROMOTE"
            : "REVIEW"
    }));

    console.log("\n========== STEP 4 ==========");
    console.log(marketingProducts);


    // ======================================
    // STEP 5 - Sort by highest discount
    // ======================================

    const sortedProducts = [...marketingProducts].sort(
        (a, b) => b.discount - a.discount
    );

    console.log("\n========== STEP 5 ==========");
    console.log(sortedProducts);


    // ======================================
    // STEP 6 - Save to marketing-products.json
    // ======================================

    fs.writeFileSync(
        "marketing-products.json",
        JSON.stringify(sortedProducts, null, 2)
    );

    console.log("\n========== STEP 6 ==========");
    console.log("marketing-products.json created successfully!");

}

processProducts();