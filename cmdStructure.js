var fetch = require("node-fetch")
var fs = require("fs")
module.exports = (token) => {
  var files = fs.readdirSync("./cmdStructures")
  for (var i = 0; i < files.length; i++) {
    require(`./cmdStructures/${files[i]}`)(token)
  }
}