// task on array methods(only using methods like every,filter,find,map,reduce,sort,some)
const articles = [
 {
id: 1,
title: "EU Tax Reform Updates",
type: "pdf",
words: 1200
 },
 {
id: 2,
title: "Climate Change Regulations",
type: "html",
words: 2500
 },
 {
id: 3,
title: "Data Privacy Guidelines",
type: "pdf",
words: 1800
 },
 {
id: 4,
title: "Financial Compliance Report",
type: "html",
words: 3200
 },
 {
id: 5,
title: "Healthcare Policy Changes",
type: "pdf",
words: 950
 },
 {
id: 6,
title: "Employment Law Amendments",
type: "html",
words: 2700
 },
 {
id: 7,
title: "Consumer Protection Rules",
type: "pdf",
words: 1450
 },
 {
id: 8,
title: "International Trade Update",
type: "html",
words: 4100
 },
 {
id: 9,
title: "Banking Sector Reforms",
type: "pdf",
words: 2200
 },
 {
id: 10,
title: "Energy Market Analysis",
type: "html",
words: 1600
 },
 {
id: 11,
title: "AI Governance Framework",
type: "pdf",
words: 3400
 },
 {
id: 12,
title: "Cybersecurity Standards",
type: "html",
words: 2900
 },
 {
id: 13,
title: "Insurance Industry Review",
type: "pdf",
words: 800
 },
 {
id: 14,
title: "Public Procurement Rules",
type: "html",
words: 2100
 },
 {
id: 15,
title: "Environmental Compliance Guide",
type: "pdf",
words: 3800
 },
 {
id: 16,
title: "Tax Filing Procedures",
type: "html",
words: 1400
 },
 {
id: 17,
title: "Digital Services Act Summary",
type: "pdf",
words: 2600
 },
 {
id: 18,
title: "Corporate Governance Code",
type: "html",
words: 1750
 },
 {
id: 19,
title: "Competition Law Overview",
type: "pdf",
words: 3100
 },
 {
id: 20,
title: "Cross-Border Investment Rules",
type: "html",
words: 2300
 }
];
// 1.pdf count

const pdfCount=articles.filter(key=>key.type === "pdf").length;
console.log(pdfCount);

// 2.html count

const htmlCount=articles.filter(key=>key.type === "html").length;
console.log(pdfCount);

// 3.total articles acrosss all articles

const total=articles.reduce((sum,article)=>{
 return sum+article.words;
},0);

console.log(total);

//4.longest article

const longestAr=articles.reduce((longest,article)=>{
 return article.words > longest.words ? article : longest;
});

console.log(longestAr);

// 5.shortest article

const shortestAr=articles.reduce((shortest,article)=>{
 return article.words > shortest.words ? article : shortest;
});

console.log(longestAr);

//6.check for the article graeter than 3500

const lenExceeds=articles.some(val=>val.words>3500);
console.log(lenExceeds);

// 7.title check

const allHaveTitle = articles.every(article => article.title);

console.log(allHaveTitle);

// 8.all pdf article titles

const pdfTitles=articles.filter(article=>article.type==="pdf").
map(article=>article.title);
console.log(pdfTitles);

// 9. all html article titles

const htmlTitles=articles.filter(article=>article.type==="html").
map(article=>article.title);
console.log(htmlTitles);

// 10. sorting by wordcount desc
const sortedByWords = [...articles].sort(
 (a, b) => b.words - a.words
);

console.log(sortedByWords);

// 11. sorting by alpha

const sortedByTitle = [...articles].sort((a, b) =>
a.title.localeCompare(b.title)
);

console.log(sortedByTitle);

// 12. Group articles by type
const groupedByType = articles.reduce((groups, article) => {
 groups[article.type] = groups[article.type] || [];
 groups[article.type].push(article);
 return groups;
}, {});

console.log(groupedByType);

// 13. Calculate average word count for PDF articles
articles
 .filter(article => article.type === "pdf")
 .reduce((sum, article) => sum + article.words, 0) /
articles.filter(article => article.type === "pdf").length;

// 14. Calculate average word count for HTML articles
const htmlArticles = articles.filter(article => article.type === "html");

const htmlAverageWords =
 htmlArticles.reduce((sum, article) => sum + article.words, 0) /
 htmlArticles.length;

console.log(htmlAverageWords);
// 15. Find all articles with more than 2500 words
const articlesOver2500 = articles.filter(article => article.words > 2500);
console.log(articlesOver2500);

// 16. Find all articles with less than 1500 words
const articlesUnder1500 = articles.filter(article => article.words < 1500);
console.log(articlesUnder1500);

// 17. Create a new array containing only { id, title }
const articleIdTitles = articles.map(({ id, title }) => ({
id,
title
}));
console.log(articleIdTitles);

// 18. Create a new array containing { title, readingTime }
const articleReadingTimes = articles.map(({ title, words }) => ({
title,
readingTime: Math.ceil(words / 200)
}));

console.log(articleReadingTimes);

// 19. Find the top 5 longest articles
const top5LongestArticles = [...articles]
 .sort((a, b) => b.words - a.words)
 .slice(0, 5);
 console.log(top5LongestArticles);

 // 20. summary object
const summary = {
    totalArticles: articles.length,
    pdfCount,
    htmlCount,
    totalWords: total,
    averageWords: total / articles.length,
    longestArticle: longestAr,
    shortestArticle: shortestAr
};

console.log(summary);