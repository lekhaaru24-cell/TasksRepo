// synchronous file operations-File systems

const fs=require("fs");
fs.writeFileSync("sample.txt", "Learning Node.js File System");

fs.appendFileSync("sample.txt", "\nThis is another line.");

console.log(fs.readFileSync("sample.txt", "utf8"));

fs.renameSync("sample.txt", "newSample.txt");
console.log("File renamed");

if (fs.existsSync("newSample.txt")) {
    console.log("File exists");
}

fs.unlinkSync("newSample.txt");
console.log("File deleted");

fs.mkdirSync("MyFolder");
console.log("Folder created");

fs.rmdirSync("MyFolder");
console.log("Folder removed");

//asynchronous file operation

const fs = require("fs");

// Create and write file
fs.writeFile("demo.txt", "Welcome to Node.js File System", (err) => {
    if (err) throw err;
    console.log("File created and data written");

    // Read file
    fs.readFile("demo.txt", "utf8", (err, data) => {
        if (err) throw err;
        console.log("File content:");
        console.log(data);

        // Append data
        fs.appendFile("demo.txt", "\nLearning asynchronous operations.", (err) => {
            if (err) throw err;
            console.log("Data appended");

            // Rename file
            fs.rename("demo.txt", "myDemo.txt", (err) => {
                if (err) throw err;
                console.log("File renamed");

                // Check file exists
                fs.access("myDemo.txt", fs.constants.F_OK, (err) => {
                    if (err) {
                        console.log("File does not exist");
                    } else {
                        console.log("File exists");
                    }

                    // Delete file
                    fs.unlink("myDemo.txt", (err) => {
                        if (err) throw err;
                        console.log("File deleted");
                    });
                });
            });
        });
    });
});

