var fetch = require("node-fetch")
module.exports = (data, args, token) => {
  fetch(`https://neko-love.xyz/api/v1/${args.img}`, {
    method: "GET"
  }).then(res => res.json()).then(json => {
    console.log(json)
    followUp({content: json.url}, data, token)
  })
  return {type: 5}
}
function followUp(body, data, token) {
  fetch(`https://discord.com/api/v9/webhooks/750171699303153759/${data.token}/messages/@original`, {
    method: "PATCH",
    headers: {
      "Authorization": "Bot " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
}