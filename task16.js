//AMLC-UN SANCTIONS

const axios =require("axios");
const fs=require("fs");
const https=require("https");

const BASE_URL="https://www.amlc.gov.ph";
const httpsAgent=new https.Agent({rejectUnauthorized:false});

 async function getNewsUrls(){
  const {data}=await axios.get(`${BASE_URL}/api/un-sanctions`,{
    httpsAgent,
  });
  const urls=data.data.map((item)=>({
    id:item.id,
    title:item.title,
    date:item.publicationDate,
    author_id:item.authorId,
    author_username:item.authorUsername,
    url:`${BASE_URL}/un-sanctions/${item.slug}`,

  }));
  
  urls.forEach((item,i)=>{
    console.log(`${i+1}.[${item.data}] ${item.title} `);
    console.log(` ${item.urls}\n`);
  });

  fs.writeFileSync("amlc_un_sanctions", JSON.stringify(urls,null,2));
  console.log(`Total urls:${urls.length}`);
  console.log("results saved in amlc_un_sanctions");
  return urls;
 }

 getNewsUrls().catch(console.error);
