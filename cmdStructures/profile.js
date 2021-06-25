var fetch = require("node-fetch")
module.exports = (token) => {
  fetch("https://discord.com/api/v9/applications/750171699303153759/commands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      name: "profile",
      description: "Get image of target user's profile",
      options: [
        {
          name: "user",
          description: "Whose profile to get?",
          type: 6,
          required: true
        },
        {
          name: "size",
          description: "Size of image",
          type: 4,
          choices: [
            {
              name: "16",
              value: 16
            },
            {
              name: "32",
              value: 32
            },
            {
              name: "64",
              value: 64
            },
            {
              name: "128",
              value: 128
            },
            {
              name: "256",
              value: 256
            },
            {
              name: "512",
              value: 512
            },
            {
              name: "1024",
              value: 1024
            },
            {
              name: "2048",
              value: 2048
            },
            {
              name: "4096",
              value: 4096
            }
          ]
        }
      ]
    })
  })
}