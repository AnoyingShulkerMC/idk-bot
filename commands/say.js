var fetch = require("node-fetch")
module.exports = (data, args, token) => {
  fetch(`https://discord.com/api/v8/channels/${data.channel_id}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      embed: { description: data.data.options[0].value, title: data.member.nick + " said" }
    })
  })
  return { type: 4, data: { content: "Message posted", flags:64 } };
}