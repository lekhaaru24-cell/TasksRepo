//Number
let age = 21;
let price = 99.99;
let negative = -100;

console.log(age);
console.log(price);
console.log(negative);

console.log(typeof age);

//String

let firstName = "Lekha";
let lastName = 'DH';

console.log(firstName);
console.log(lastName);

console.log(firstName + " " + lastName);

console.log(typeof firstName);


//Boolean
let isStudent = true;
let isPlaced = false;

console.log(isStudent);
console.log(isPlaced);

console.log(typeof isStudent);

//undefined

let city;

console.log(city);
console.log(typeof city);

//null
let data = null;

console.log(data);

console.log(typeof data);

//Bigint
let big = 123456789123456789123456789n;

console.log(big);

console.log(typeof big);

//symbol
let id1 = Symbol("id");
let id2 = Symbol("id");

console.log(id1 === id2);

console.log(typeof id1);

//object
let student = {
    name: "Lekha",
    age: 21,
    course: "ISE"
};

console.log(student);

console.log(student.name);

console.log(typeof student);

//Date
let today = new Date();

console.log(today);

console.log(typeof today);

//check every datatype
let num = 100;
let str = "JavaScript";
let bool = true;
let value = undefined;
let empty = null;
let big1 = 100n;
let sym = Symbol("id");
let obj = {};



console.log(typeof num);
console.log(typeof str);
console.log(typeof bool);
console.log(typeof value);
console.log(typeof empty);
console.log(typeof big1);
console.log(typeof sym);
console.log(typeof obj);
