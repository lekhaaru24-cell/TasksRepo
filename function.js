//function declaration
function greet() {
    console.log("Welcome to JavaScript!");
}

greet();

//function with params
function greet(name) {
    console.log("Hello " + name);
}

greet("Lekha");
greet("Rahul");

//function returning a value

function add(a, b) {
    return a + b;
}

let result = add(10, 20);

console.log(result);

//function expression
const multiply = function(a, b) {
    return a * b;
};

console.log(multiply(5, 6));

//arrow function
const square = (num) => {
    return num * num;
};

console.log(square(8));

//anonymous function
setTimeout(function() {
    console.log("Hello after 2 seconds");
}, 2000);

//IIFE
(function() {
    console.log("This function runs immediately.");
})();

//default parameters
function welcome(name = "Guest") {
    console.log("Welcome " + name);
}

welcome();
welcome("Lekha");

//rest parameters

function total(...marks) {

    let sum = 0;

    for(let mark of marks){
        sum += mark;
    }

    return sum;
}

console.log(total(80,90,85));
console.log(total(50,60));

//call back function
function greet(name) {
    console.log("Hello " + name);
}

function processUser(callback) {
    callback("Lekha");
}

processUser(greet);
