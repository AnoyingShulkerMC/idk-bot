var fetch = require("node-fetch")
module.exports = (token) => {
  fetch("https://discord.com/api/v9/applications/750171699303153759/commands", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bot " + token
    },
    body: JSON.stringify({
      name: "urban",
      description: "Search Urban Dictionary",
      options: [
        {
          name: "wordoftheday",
          description: "Gets the word of the day",
          type: 1
        },
        {
          name: "lookup",
          description: "Looks up a word",
          type: 1,
          options: [
            {
              name: "term",
              description: "The term to search",
              type: 3,
              required: true
            },
            {
              name: "sort",
              description: "The way to sort, Defalts to most votes",
              type: 3,
              required: false,
              choices: [
                {
                  name: "mostvotes",
                  value: "mostvotes"
                },
                {
                  name: "leastvotes",
                  value: "leastvotes"
                }
              ]
            }
          ]
        },
        {
          name: "search",
          description: "Searches a word and returns up to 10 matching definitions",
          type: 1,
          options: [
            {
              name: "query",
              description: "The search query",
              required: true,
              type: 3
            }
          ]
        },
        {
          name: "lookupbyid",
          description: "Retrieve single definition by id",
          type: 1,
          options: [
            {
              name: "id",
              description: "The id to retrieve",
              required: true,
              type: 3
            }
          ]
        }
      ]
    })
  })
}