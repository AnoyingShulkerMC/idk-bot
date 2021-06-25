var fetch = require("node-fetch")
module.exports = (token) => {
  fetch("https://discord.com/api/v9/applications/750171699303153759/commands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      name: "blame",
      description: "blame a damn user",
      options: [
        {
          name: "user",
          description: "who to blame",
          type: 6,
          required: true
        }
      ]
    })
  })
}