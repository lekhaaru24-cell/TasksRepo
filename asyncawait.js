//basic example for async and await
function getMessage() {

    return new Promise((resolve) => {

        setTimeout(() => {
            resolve("Welcome to JavaScript!");
        }, 2000);

    });

}

async function displayMessage() {

    console.log("Loading...");

    const message = await getMessage();

    console.log(message);

}

displayMessage();

//bank balance
function withdraw(balance, amount) {

    return new Promise((resolve, reject) => {

        if (balance >= amount) {
            resolve(balance - amount);
        } else {
            reject("Insufficient Balance");
        }

    });

}

async function bank() {

    try {

        const remaining = await withdraw(5000, 2000);

        console.log("Remaining Balance:", remaining);

    } catch (error) {

        console.log(error);

    }

}

bank();

//multiple awaits(sequential)

function task(name, time) {

    return new Promise((resolve) => {

        setTimeout(() => {

            resolve(name);

        }, time);

    });

}

async function completeTasks() {

    console.log(await task("Task 1 Completed", 1000));

    console.log(await task("Task 2 Completed", 2000));

    console.log(await task("Task 3 Completed", 1000));

}

completeTasks();