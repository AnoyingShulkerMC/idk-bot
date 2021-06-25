var fetch = require("node-fetch")
module.exports = (token) => {
  fetch("https://discord.com/api/v9/applications/750171699303153759/commands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      name: "eval",
      description: "Evaluate a statement",
      options: [
        {
          name: "statement",
          description: "js statement",
          type: 3,
          required: true
        }
      ]
    })
  }).then(res => res.json()).then(console.log)
}