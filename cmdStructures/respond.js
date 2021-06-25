var fetch = require("node-fetch")
module.exports = (token) => {
  fetch("https://discord.com/api/v9/applications/750171699303153759/commands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      name: "respond",
      description: "Respond to a long response question",
      options: [
        {
          name: "id",
          description: "The ID of the poll",
          type: 3,
          required: true
        },
        {
          name: "answer",
          description: "Whats ur answer?",
          type: 3,
          required: true
        }
      ]
    })
  })
}