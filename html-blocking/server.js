const express = require("express")
const path = require("path")

const app = express()
const PORT = 8000

function wait(delay) {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}

app.get("/", (req, res) => {
    wait(100).then(() => {
        res.sendFile(path.join(__dirname, "index.html"))
    })
})

app.get("/main.js", (req, res) => {
    wait(5000).then(() => {
        res.sendFile(path.join(__dirname, "main.js"))
    })
    // res.sendFile(path.join(__dirname, "main.js"))
})

app.get("/main.css", (req, res) => {
    wait(1500).then(() => {
        res.sendFile(path.join(__dirname, "main.css"))
    })
    // res.sendFile(path.join(__dirname, "main.css"))
})

app.listen(PORT, () => {
    console.log("Server started!")
})