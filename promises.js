// Basic promise(resolve,reject)
function checkAge(age) {

    return new Promise((resolve, reject) => {

        if (age >= 18) {
            resolve("You are eligible to vote.");
        } else {
            reject("You are not eligible to vote.");
        }

    });

}

// Promise.all()->run multiple promises together
checkAge(20)
    .then(message => console.log(message))
    .catch(error => console.log(error));


    const english = Promise.resolve(85);
const maths = Promise.resolve(90);
const science = Promise.resolve(95);

Promise.all([english, maths, science])
    .then(marks => {
        console.log(marks);
    });

    