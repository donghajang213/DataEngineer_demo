// express.js

const express = require("express");
const client = require("prom-client");
const app = express();
const register = client.register;

//  /metrics endpoint
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
});

// root endpoint
app.get("/", (req, res) => {
    res.send("Hello from Dockerized App!");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});