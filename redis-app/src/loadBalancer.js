import httpProxy from "http-proxy"
import express from "express"

const PORT = 4000 

const lb = express()
const proxy = httpProxy.createProxyServer()

const targets = ["http://localhost:3001", "http://localhost:3002", "http://localhost:3003"]

let i = 0
lb.use((req, res) => {
    const target = targets[i++ % targets.length]
    proxy.web(req, res, { target })
})

lb.listen(PORT, function() {
    console.log("Starting load balancer on port " + PORT)
})