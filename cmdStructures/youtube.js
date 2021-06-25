var fetch = require("node-fetch")
module.exports = (token) => {
  fetch("https://discord.com/api/v9/applications/750171699303153759/commands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      name: "youtube",
      description: "Get a youtube video",
      options: [
        {
          name: "video",
          description: "Get a video matching the name",
          type: 1,
          options: [
            {
              name: "name",
              description: "The name of the video",
              type: 3,
              required: true
            }
          ]
        }
      ]
    })
  })
}