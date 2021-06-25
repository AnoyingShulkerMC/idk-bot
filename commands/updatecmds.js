var fetch = require("node-fetch")
module.exports = (data, args, token) => {
  function clearRequireCache() {
    Object.keys(require.cache).forEach(function (key) {
      delete require.cache[key];
    });
  }
  clearRequireCache()
  require("../cmdStructure.js")(token)
  return { type: 4, data: {content: "Updated commands"}}
}