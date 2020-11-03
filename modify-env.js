const fs = require("fs")

function modifyEnv(contractAddress) {
    const env = fs.readFileSync(".env.local").toString()
    const lines = env.split("\n").slice(1)
    const newEnv = [`REACT_APP_CONTRACT=${contractAddress}`, ...lines].join("\n")
    fs.writeFileSync(".env.local", newEnv)
}

module.exports = modifyEnv