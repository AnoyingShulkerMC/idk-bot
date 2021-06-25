var fetch = require("node-fetch")
module.exports = (token) => {
  fetch("https://discord.com/api/v9/applications/750171699303153759/commands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      name: "say",
      description: "Say something boi",
      options: [
        {
          name: "msg",
          description: "what 2 say",
          type: 3,
          required: true
        }
      ]
    })
  })
}