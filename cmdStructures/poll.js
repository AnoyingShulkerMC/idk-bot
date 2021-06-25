var fetch = require("node-fetch")
module.exports = (token) => {
  fetch("https://discord.com/api/v9/applications/750171699303153759/commands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      name: "poll",
      description: "Poll",
      options: [
        {
          name: "yesorno",
          description: "Displays a question with yes and no options",
          type: 1,
          options: [
            {
              name: "question",
              description: "The question to be displayed",
              required: true,
              type: 3
            }
          ]
        },
        {
          name: "longresponse",
          description: "idk how 2 describe it (Comming soon)",
          type: 1,
          options: [
            {
              name: "question",
              description: "The question to be displayed",
              type: 3,
              required: true
            }
          ]
        },
        {
          name: "multiplechoice",
          description: "Displays up to 25 options and the question",
          type: 1,
          options: [
            {
              name: "question",
              description: "The question to be displayed",
              type: 3,
              required: true
            },
            {
              name: "options",
              description: "Options seperated by commas",
              type: 3,
              required: true
            }
          ]
        }
      ]
    })
  })
}