var fetch = require("node-fetch")
var youtube = require("youtube-search-api") //shit youtube's quota, you can make only 100 searches per day
module.exports = (data, args, token) => {
  if (args.video) {
    youtube.GetListByKeyword(args.video.name).then((res) => {
      if (res.items.length == 0) return followUp({content: "No such video"}, data, token)
      followUp({
        content: `https://youtube.com/watch?v=${res.items[0].id}`
      }, data, token)
    })
  }
  return { type: 5 }
}
function followUp(body, data, token) {
  fetch(`https://discord.com/api/v9/webhooks/750171699303153759/${data.token}/messages/@original`, {
    method: "PATCH",
    headers: {
      "Authorization": "Bot " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  }).then(res => res.json()).then(console.log)
}