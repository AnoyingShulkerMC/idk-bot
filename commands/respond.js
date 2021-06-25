var fetch = require("node-fetch")
const { JsonDB } = require("node-json-db")
var db
module.exports = (data, args, token) => {
  db = new JsonDB("polls", true, true, "/")
  //does the poll exist?
  if (!db.exists(`/longresponse/${args.id}`)) return {
    data: { content: "The poll doesn't exist" },
    type:4
  }
  var poll = db.getData(`/longresponse/${args.id}`)
  console.log(poll)
  poll.responses[data.member.user.id] = args.answer
  db.push(`/longresponse/${args.id}`, poll)
  console.log(poll.responses)
  var description = "Answers: \n"
  for (const [key, value] of Object.entries(poll.responses)) {
    description += `${value} - <@${key}>\n`
  }
  if (description.length > 2048) return { data: { content: "Poll reaches max embed limit", flags: 64 }, type: 4 }
  var ret = { data: { content: "Answer posted", flags: 64 }, type: 4 }
  fetch(`https://discord.com/api/v9/channels/${poll.channelid}/messages/${poll.msgid}`, {
    method: "PATCH",
    headers: {
      "Authorization": "Bot " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      embed: {
        title: poll.question,
        description: description,
        footer: {
          text: `Answer using "/respond id: ${args.id} answer: <answer>" in any channel`
        }
      }
    })
  }).then(res => res.json()).then(json => {
    if (json.code == 10008) ret = { data: { content: "The message was deleted", flags: 64 }, type: 4 }
  })
  return ret
}