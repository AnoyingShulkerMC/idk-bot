var fetch = require("node-fetch")
var safeeval = require("safe-eval")
var log;
module.exports = (data, args, token, polls) => {
  log = ""
  
  try {
    var output = safeeval(args.statement, {
      console: {
        log(str) {
          log += str + "\n"
        }
      }
    }, {
      timeout: 2000,
      breakOnSigInt: true
    })
  } catch (er) {
    return {
      type: 4, data: {
        embeds: [
          {
            title: er.name,
            description: er.message
          }
        ]
      }
    }
  }
  var result = {
    type: 4, data: {
      embeds: [
        {
          fields: [
            {
              name: "Your code",
              value: `\`\`\`js\n${args.statement}\n\`\`\``
            },
            {
              name: "Result",
              value: `\`\`\`js\n${output}\n\`\`\``
            }
          ]
        }
      ]
    }
  }
  if (log != "") {
    result.data.embeds[0].fields.push({
      name: "Logs",
      value: `\`\`\`js\n${log}\n\`\`\``
    })
  }
  return result
}