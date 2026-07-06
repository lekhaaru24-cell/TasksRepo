// declaring and initializing the array 
let students = ["Lekha", "Rahul", "Anu", "Kiran"];
console.log(students);
console.log(students[0]);
console.log(students[3]);
console.log(students.length);

//accessing array elements using loops
let prices = [499, 999, 1999];

for(let i = 0; i < prices.length; i++){
    console.log("Price:", prices[i]);
}

//array of objects
let employees = [
    { id: 1, name: "Lekha", department: "AI" },
    { id: 2, name: "Rahul", department: "HR" },
    { id: 3, name: "Anu",   department: "Testing" }
];

console.log(employees[0].name);
console.log(employees[2].department);
