/////////////////////////////////////////////////////////////////////////////
// CORE FILE
// DONT EDIT UNLESS YOU KNOW WHAT UR DOING
/////////////////////////////////////////////////////////////////////////////
var fetch = require("node-fetch")
var seq = null
var ws = require("ws")
var listeners = []
function parseArgs(data) {
  console.log(data.data.options)
  var args = {}
  if (!data.data.options) return {}
  for (var i = 0; i < data.data.options.length; i++) {
    args[data.data.options[i].name] = data.data.options[i].value || data.data.options[i].options
    if (Array.isArray(args[data.data.options[i].name])) args[data.data.options[i].name] = parseChild(args[data.data.options[i].name])
  }
  return args
}
function parseChild(arg) {
  var args = {}
  for (var i = 0; i < arg.length; i++) {
    args[arg[i].name] = arg[i].value || arg[i].options
  }
  return args
}
function addComponentListeners(messageId, customId, exec) {
  listeners.push({
    id: messageId,
    custom_id: customId,
    exec: exec
  })
}
function connect() {
  var con = new ws("wss://gateway.discord.gg/?v=9&encoding=json");
  con.on("message", handler)
  con.on("close", (c, r) => {
    console.log(c, r)
    connect()
  })
  function handler(d) {
    var json = JSON.parse(d.toString())
    switch (json.op) {
      case 10:
        setInterval(() => {
          con.send(JSON.stringify({
            op: 1,
            d: seq
          }))
        }, json.d.heartbeat_interval)
        console.log("identify")
        con.send(JSON.stringify({
          op: 2,
          d: {
            token: token,
            properties: {
              $os: "windows",
              $browser: "Node.js",
              $device: "windows"
            },
            intents: 32509
          }
        }))
        return;
      case 0:
        switch (json.t) {
          case "READY":
            //updateCommandStructure(token)
            return
          case "INTERACTION_CREATE":
            if (json.d.type == 2) {
              var data = json.d
              var args = parseArgs(data)
              var output = require(`./commands/${data.data.name}`)(data, args, token, addComponentListeners)
              fetch(`https://discord.com/api/v9/interactions/${json.d.id}/${json.d.token}/callback`, {
                method: "POST",
                headers: {
                  "Authorization": "Bot " + token,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(output)
              })
            } else if (json.d.type == 3) {
              var data = json.d
              for (var i = 0; i < listeners.length; i++) {
                if (data.message.id == listeners[i].id && data.data.custom_id == listeners[i].custom_id) {
                  var output = listeners[i].exec(data, token)
                  fetch(`https://discord.com/api/v9/interactions/${json.d.id}/${json.d.token}/callback`, {
                    method: "POST",
                    headers: {
                      "Authorization": "Bot " + token,
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(output)
                  })
                }
              }
            }
        }
    }
  }
}
connect()
