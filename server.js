//Imports
//express lib
const express = require("express");

const error = require("./utilities/error.js");

const app = express();
const PORT = 3000;

const bodyParser = require('body-parser')
// Parsing Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ extended: true }));

//Middleware

// Logging Middlewaare
app.use((req, res, next) => {
    const time = new Date();

    console.log(
        `-----
${time.toLocaleTimeString()}: Received a ${req.method} request to ${req.url}.`
    );
    console.log(req.body)
    if (Object.keys(req.body).length > 0) {
        console.log("Containing the data:");
        console.log(`${JSON.stringify(req.body)}`);
    }
    next();
});



//Routs
app.get("/", (req, res) => {
    res.send("Work in progress!");
});

app.use('/users', require('./routes/users.js'))
app.use('/posts', require('./routes/posts.js'))

// Custom 404 (not found) middleware.
// Since we place this last, it will only process
// if no other routes have already sent a response!
// We also don't need next(), since this is the
// last stop along the request-response cycle.
app.use((req, res) => {
    res.status(404);
    res.json({ error: "Resource Not Found" });
});


// Error-handling middleware.
// Any call to next() that includes an
// Error() will skip regular middleware and
// only be processed by error-handling middleware.
// This changes our error handling throughout the application,
// but allows us to change the processing of ALL errors
// at once in a single location, which is important for
// scalability and maintainability.
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
});

//listen for certain port
app.listen(PORT, ()=>{
    console.log(`Server listening on port: ${PORT}`)
})