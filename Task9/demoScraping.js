const puppeteer=require('puppeteer');

(async()=>{
    const browser=await puppeteer.launch({
        headless:false
    });
    const page=await browser.newPage();
    await page.goto('https://www.incredibleindia-tourism.org/state-in-india/state-in-india.html',
        { waitUntil: "networkidle2" }
    );
    
    const data=await page.evaluate(()=>{
            let results=[];
            const states=document.querySelectorAll("h2");

            states.forEach((state)=>{
                let stateName=state.innerText.trim();
                let places=[];
                const sibling=state.nextElementSibling;
               
                if(sibling){
               let items=sibling.querySelectorAll("li,a");
               items.forEach((item)=>{
                let text=item.innerText.trim();
                if(text)
                    places.push(text);
                
               });
               }

               results.push({
                states:stateName,
                places:places
            });

            });
            return results;
                     
           
    })
     console.log(JSON.stringify(data, null, 2));
await browser.close();
})();