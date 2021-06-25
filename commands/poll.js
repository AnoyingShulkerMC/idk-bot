var fetch = require("node-fetch")
const {JsonDB} = require("node-json-db")
var db = new JsonDB("polls.json", true, true, "/")
module.exports = (data, args, token, addComponentListeners) => {
  console.log(data,args,token)
  if (args.yesorno) {
    var yesVotes = []
    var noVotes = []
    console.log("Bot " + token)
    fetch(`https://discord.com/api/v9/channels/${data.channel_id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bot " + token
      },
      body: JSON.stringify({
        embed: {
          description: "Click yes or no",
          title: args.yesorno.question
        },
        components: [
          {
            type: 1,
            components: [
              {
                type: 2,
                style: 3,
                label: "Yes",
                custom_id: "poll_yes"
              },
              {
                type: 2,
                style: 4,
                label: "No",
                custom_id: "poll_no"
              }
            ]
          }
        ]
      })
    }).then(res => res.json()).then(json => {
      addComponentListeners(json.id, "poll_yes", (data2) => {
        function removeItemAll(arr, value) {
          var i = 0;
          while (i < arr.length) {
            if (arr[i] === value) {
              arr.splice(i, 1);
            } else {
              ++i;
            }
          }
          return arr;
        }
        if (noVotes.includes(data2.member.user.id) || yesVotes.includes(data2.member.user.id)) {
          yesVotes = removeItemAll(yesVotes, data2.member.user.id)
          noVotes = removeItemAll(noVotes, data2.member.user.id)
        }
        yesVotes.push(data2.member.user.id)
        var description = "0"
        if (yesVotes.length - noVotes.length > 0) {
          description = "✅" + (yesVotes.length - noVotes.length)
        } else if (yesVotes.length - noVotes.length < 0) {
          description = "❎" + (noVotes.length - yesVotes.length)
        }
        return {
          type: 7,
          data: {
            embeds: [
              {
                title: args.yesorno.question,
                description: description,
                footer: {
                  text:"Click yes or no"
                }
              }
            ]
          }
        }
      })
      addComponentListeners(json.id, "poll_no", (data2) => {
        function removeItemAll(arr, value) {
          var i = 0;
          while (i < arr.length) {
            if (arr[i] === value) {
              arr.splice(i, 1);
            } else {
              ++i;
            }
          }
          return arr;
        }
        if (noVotes.includes(data2.member.user.id) || yesVotes.includes(data2.member.user.id)) {
          yesVotes = removeItemAll(yesVotes, data2.member.user.id)
          noVotes = removeItemAll(noVotes, data2.member.user.id)
        }
        noVotes.push(data2.member.user.id)
        var description = "0"
        if (yesVotes.length - noVotes.length > 0) {
          description = "✅" + (yesVotes.length - noVotes.length)
        } else if (yesVotes.length - noVotes.length < 0) {
          description = "❎" + (noVotes.length - yesVotes.length)
        }
        return {
          type: 7,
          data: {
            embeds: [
              {
                title: args.yesorno.question,
                description: description,
                footer: {
                  text: "Click yes or no"
                }
              }
            ]
          }
        }
      })
    })
    return {type: 4, data: { content: "Poll Posted" } }
  } else if (args.longresponse) {
    var pollid = "poll" + Date.now()
    fetch(`https://discord.com/api/v9/channels/${data.channel_id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bot " + token
      },
      body: JSON.stringify({
        embed: { description: `Answer using \`/respond id: ${pollid} answer: <response goes here>\` in any channel`, title: args.longresponse.question }
      })
      
    }).then(res => res.json()).then(json => {
      db.push("/longresponse/" + pollid, {
        question: args.longresponse.question,
        msgid: json.id,
        channelid: json.channel_id,
        responses: {}
      })
    })
    
    return { type: 4, data: { content: "Poll Posted" } }
  } else {
    var choices = args.multiplechoice.options.split(",")
    var votes = {}
    var names = {}
    var components = []
    if (choices.length > 25) return { type: 4, data: {content: "This poll only supports up to 25 options"}}
    for (var i = 0; i < Math.ceil(choices.length / 5); i++) {
      var temp = []
      choices.slice(i * 5, i * 5 + (Math.min(choices.length - i * 5, 5))).forEach((k, a) => {
        temp.push({
          type: 2,
          style: 1,
          label: k,
          custom_id: "poll_multiplechoice_" + ((i * 5) + a).toString()
        })
      })
      components[i] = {
        type: 1,
        components: temp
      }
    }
    for (var i = 0; i < choices.length; i++) {
      votes["poll_multiplechoice_" + i] = []
      names["poll_multiplechoice_" + i] = choices[i]
    }
    if (choices.length == 2) {
      components[0].components[0].style = 3
      components[0].components[1].style = 4
    }
    console.log(components)
    fetch(`https://discord.com/api/v9/channels/${data.channel_id}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bot " + token
      },
      body: JSON.stringify({
        embed: { description: "Click one of the options below", title: args.multiplechoice.question },
        components: components
      })
    }).then(res => res.json()).then(json => {
      console.log(json)
      for (var i = 0; i < choices.length; i++) {
        addComponentListeners(json.id, "poll_multiplechoice_" + i, (data2) => {
          console.log(data2.data.custom_id)
          function removeItemAll(arr, value) {
            var i = 0;
            while (i < arr.length) {
              if (arr[i] === value) {
                arr.splice(i, 1);
              } else {
                ++i;
              }
            }
            return arr;
          }
          for (const [key, value] of Object.entries(votes)) {
            if (value.includes(data2.member.user.id)) {
              votes[key] = removeItemAll(votes[key], data2.member.user.id)
            }
          }
          console.log(data2.data.custom_id)
          votes[data2.data.custom_id].push(data2.member.user.id)
          console.log(votes)
          var description = ""
          for (const [key, value] of Object.entries(votes)) {
            description += `${names[key]} - ${value.length}\n`
          }
          console.log(votes)
          return {
            type: 7,
            data: {
              embeds: [
                {
                  title: args.multiplechoice.question,
                  description: description,
                  footer: {
                    text: "Click one of the buttons below"
                  }
                }
              ]
            }
          }
        })
      }
    })
    return { type: 4, data: {content: "Poll Posted"} }
  }
}