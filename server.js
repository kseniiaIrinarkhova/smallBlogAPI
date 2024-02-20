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

// Logging Middleware
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

// Valid API Keys.
apiKeys = ["perscholas", "ps-example", "hJAsknw-L198sAJD-l3kasx"];

// New middleware to check for API keys!
// Note that if the key is not verified,
// we do not call next(); this is the end.
// This is why we attached the /api/ prefix
// to our routing at the beginning!
app.use("/api", function (req, res, next) {
    var key = req.query["api-key"];

    // Check for the absence of a key.
    if (!key) next(error(400, "API Key Required"));

    // Check for key validity.
    if (apiKeys.indexOf(key) === -1) next(error(401, "Invalid API Key"));

    // Valid key! Store it in req.key for route access.
    req.key = key;
    next();
});

//Routes
app.get("/", (req, res) => {
    res.send("Work in progress!");
});

app.use('/api/users', require('./routes/users.js'));
app.use('/api/posts', require('./routes/posts.js'));
app.use('/api/comments', require('./routes/comments.js'));

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