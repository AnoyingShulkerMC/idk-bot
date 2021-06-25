var fetch = require("node-fetch")
module.exports = (token) => {
  fetch("https://discord.com/api/v9/applications/750171699303153759/commands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      name: "weeb",
      description: "Get SFW anime pics",
      options: [
        {
          name: "img",
          description: "The type of pic",
          type: 3,
          required: true,
          choices: [
            {
              name: "neko",
              value: "neko"
            },
            {
              name: "kitsune",
              value: "kitsune"
            },
            {
              name: "waifu",
              value: "waifu"
            }
          ]
        }
      ]
    })
  }).then(res => res.json()).then(console.log)
}