var fetch = require("node-fetch")
module.exports = (data, args, token) => {
  console.log(args)
  fetch(`https://discord.com/api/v9/users/${args.user}`, {
    method: "GET",
    headers: {
      "Authorization": "Bot " + token
    }
  }).then((res) => res.json()).then(json => {
    var size = args.size || 4096
    var hash = json.avatar
    if (!hash) {
      fetch(`https://discord.com/api/v9/webhooks/750171699303153759/${data.token}/messages/@original`, {
        method: "PATCH",
        headers: {
          "Authorization": "Bot " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          embeds: [
            {
              image: {
                url: `https://cdn.discordapp.com/embed/avatars/${json.discriminator % 5}.png?size=${size}`
              }
            }
          ]
        })
      })
    } else {
      var extension = ".png"
      if (hash.startsWith("a_")) extension = ".gif"
      fetch(`https://discord.com/api/v9/webhooks/750171699303153759/${data.token}/messages/@original`, {
        method: "PATCH",
        headers: {
          "Authorization": "Bot " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          embeds: [
            {
              image: {
                url: `https://cdn.discordapp.com/avatars/${args.user}/${hash}${extension}?size=${size}`
              }
            }
          ]
        })
      })
    }
  })
  return { type: 5 }
}