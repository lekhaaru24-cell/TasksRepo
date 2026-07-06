//loop through employees name
let employees = ["Lekha", "Rahul", "Anu", "Kiran"];

for (let i = 0; i < employees.length; i++) {
    console.log(employees[i]);
}

//print even no's

for (let i = 2; i <= 10; i += 2) {
    console.log(i);
}

//while 
let count = 5;

while (count > 0) {
    console.log(count);
    count--;
}

console.log("Blast Off!");

// do while
let attempts = 1;

do {
    console.log("Login Attempt", attempts);
    attempts++;
} while (attempts <= 3);

//for...of -->arrays
let subjects = ["Math", "Science", "English"];

for (let subject of subjects) {
    console.log(subject);

}

// strings
let name = "Lekha";

for (let letter of name) {
    console.log(letter);
}

//for...in
let student = {
    name: "Lekha",
    age: 21,
    course: "ISE"
};

for (let key in student) {
    console.log(key, ":", student[key]);
}

//array indexes

let colors = ["Red", "Blue", "Green"];

for (let index in colors) {
    console.log(index, colors[index]);
}

//forEach()
let products = ["Laptop", "Mouse", "Keyboard"];

products.forEach((product, index) => {
    console.log(index + 1, product);
});

//continue

for (let i = 1; i <= 5; i++) {

    if (i == 3) {
        continue;
    }

    console.log(i);
}

//break
for (let i = 1; i <= 10; i++) {

    if (i == 6) {
        break;
    }

    console.log(i);
}