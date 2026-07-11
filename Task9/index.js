
// 1.checking the headless shell 

// (async()=>{
//     const browser=await puppeteer.launch({
//         headless:'shell'
//     });
//     const page=await browser.newPage();
//     await page.goto('https://www.geeksforgeeks.org/');
//     await new Promise(resolve=>setTimeout(resolve,5000));
//     await page.screenshot({path:'GFG.png'}); // take the screenshot of the page
//     await page.pdf({path:'gfg.pdf'});
//     await browser.close();
   
// })();


// 2.to fetch the book title and the price

// (async () => {
//   const browser = await puppeteer.launch({
//     headless: false
//   });

//   const page = await browser.newPage();

//   await page.goto("https://books.toscrape.com/", {
//     waitUntil: "networkidle2"
//   });

//   //Get all elements
//   const bookElements = await page.$$(".product_pod");

//   const books = [];

//   //Loop through elements
//   for (const book of bookElements) {

//     // extract title
//     const titleElement = await book.$("h3 a");
//     const title = await page.evaluate(el => el.getAttribute("title"), titleElement);

//     // extract price
//     const priceElement = await book.$(".price_color");
//     const price = await page.evaluate(el => el.innerText, priceElement);

//     books.push({
//       title,
//       price
//     });
//   }

//   console.log(books);

//   await browser.close();
// })();


// 3. To get the author details
const puppeteer=require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();

  await page.goto("https://quotes.toscrape.com/", {
    waitUntil: "networkidle2"

  });
  const links=await page.$$eval(".quote a[href^='/author/'] ",
  elements => elements.map(
    el=>el.href
  )
);

const result=[];
for(let link of links){
    await page.goto(link,{waitUntil: "networkidle2"
});
const data=await page.evaluate(()=>{
return{
    Author_name:document.querySelector(".author-title").innerText,
    born:document.querySelector(".author-born-date").innerText,
    description:document.querySelector(".author-description").innerText
};
 
});
result.push(data);
}

const data1 = await page.evaluate(() => {
    return {
        name: document.querySelector(".text-muted a").innerText
    };
})

console.log(data1);
console.log(result);
await browser.close();
})();

