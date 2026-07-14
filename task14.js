/* fetch the urls from the base url by passing params along with the api request and saved the urls and 
other details in the task14_result.json */

const axios = require("axios");
const fs=require("fs");
const BASE_URL = "https://www.a2x.co.za";

async function getPage1Urls() {
  const { data } = await axios.get(`${BASE_URL}/news/ajax-news-paginated/sec`, {
   
    params: {
      sEcho: 1,
      iColumns: 6,
      iDisplayStart: 0,   // page 1
      iDisplayLength: 15, // 15 items per page
      iSortCol_0: 1,
      sSortDir_0: "desc",
      iSortingCols: 1,
      _: Date.now(),
    },
  });
  
  const urls = data.aaData.map((item) => ({ // aaData is a property in the api response item[0]-newsRef
    date: item[1],
    company: item[2],
    title: item[3],
    url: `${BASE_URL}/news/news-detail?newsRef=${encodeURIComponent(item[0])}`,
  }));

  urls.forEach((item, i) => {
    console.log(`${i + 1}. [${item.date}] ${item.company} - ${item.title}`);
    console.log(`${item.url}\n`);
  });

  return urls;
}
getPage1Urls().then((urls)=>{
   
fs.writeFileSync("task14_result.json",JSON.stringify(urls,null,2)
);
console.log("results stored in task14_results.json"); 
}).catch(console.error);
 




 