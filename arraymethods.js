//push-to add element at the end of an array
let courses = ["Java", "Python"];

courses.push("JavaScript");

console.log(courses);

//pop-to delete an element from the end of an array

let cities = ["Bengaluru", "Mysuru", "Mangaluru"];

cities.pop();

console.log(cities);

//unshift-to add element at the beginning of an array
let tasks = ["Complete Assignment", "Go Shopping"];

tasks.unshift("Attend Meeting");

console.log(tasks);

//shift-to delete an element from the beginning of an array
let queue = ["Customer1", "Customer2", "Customer3"];

queue.shift();

console.log(queue);

//includes
let languages = ["Java", "Python", "C++", "JavaScript"];

console.log(languages.includes("Python"));
console.log(languages.includes("Go"));

//indexOf

let books = ["DSA", "DBMS", "OS", "CN"];

console.log(books.indexOf("OS"));
console.log(books.indexOf("AI"));

//slice-to extract part of an array

let schedule = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

let weekdays = schedule.slice(0, 3);

console.log(weekdays);
console.log(schedule);

//splice-to add or delete elements
let products = ["Laptop", "Tablet", "Printer"];

products.splice(1, 1, "Monitor");

console.log(products);

//map-transform each element
let names = ["lekha", "rahul", "anu"];

let upperNames = names.map(name => name.toUpperCase());

console.log(upperNames);

//filter-to keep only matching elements
let ages = [12, 18, 25, 15, 30];

let adults = ages.filter(age => age >= 18);

console.log(adults);

//reduce-combine all values into one
let marks = [80, 90, 85, 95];

let total = marks.reduce((sum, mark) => sum + mark, 0);

console.log(total);

//find-to find the first matching elements
let prices = [150, 250, 500, 120];

let expensive = prices.find(price => price > 300);

console.log(expensive);

//sort-to sort the elements based on the condition
let scores = [78, 92, 65, 88];

scores.sort((a, b) => a - b);

console.log(scores);

//reverse-reverse an array
let stops = ["Stop1", "Stop2", "Stop3", "Stop4"];

stops.reverse();

console.log(stops);

//join-convert array to string

let folders = ["Users", "Lekha", "Documents"];

console.log(folders.join("/"));

//split-convert string to array
let names1 = "Lekha,Rahul,Anu";

let students = names1.split(",");

console.log(students);

//every-to check if all elemnts satisfy a condition
let ages1 = [20, 25, 30];

let eligible = ages1.every(age => age >= 18);

console.log(eligible);


//some-check if at least one element satisfy a condition
let marks1 = [35, 42, 55, 28];

let hasFailed = marks1.some(mark => mark < 35);

console.log(hasFailed);

