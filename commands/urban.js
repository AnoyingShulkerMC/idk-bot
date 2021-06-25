var fetch = require("node-fetch")
module.exports = (data, args, token) => {
  console.log(args)
  if (args.lookup) {
    fetch(`http://api.urbandictionary.com/v0/define?term=${args.lookup.term}`, {
      method: "GET"
    }).then(res => res.json()).then(json => {
      var definitions = json.list
      console.log(json.list.length)
      if (definitions.length == 0) return followUp({ content: "No one has posted a definition for that word" }, data, token)
      if (definitions.length > 1) {
        definitions.sort((a, b) => {
          var scorea = a.thumbs_up - a.thumbs_down
          var scoreb = b.thumbs_up - b.thumbs_down
          var sort = args.lookup.sort || "mostvotes"
          if (sort == "mostvotes") {
            return scorea < scoreb ? 1 : -1
          } else {
            return scorea > scoreb ? 1 : -1
          }
        })
      }
      var top = definitions[0]
      console.log(top)
      var definition = top.definition
      if (definition.length > 1024) {
        console.log("definition too large")
        fetch("https://pastie.io/documents", {
          method: "POST",
          body: splitbyWords(top.definition)
        }).then(res => res.json()).then(json => {
          followUp({
            content: "",
            embeds: [
              {
                title: top.word,
                url: top.permalink,
                fields: [
                  {
                    name: "Meaning",
                    value: `The definition was too large, but I was able to create a [hastebin](https://pastie.io/${json.key})`
                  },
                  {
                    name: "Example",
                    value: (top.example.length > 1024 ? "The example was too long" : top.example) || "No example provided"
                  }
                ],
                footer: {
                  text: `With ${top.thumbs_up} upvotes and ${top.thumbs_down} downvotes`
                }
              }
            ]
          }, data, token)
        })

      } else {
        followUp({
          content: "",
          embeds: [
            {
              title: top.word,
              url: top.permalink,
              fields: [
                {
                  name: "Meaning",
                  value: top.definition
                },
                {
                  name: "Example",
                  value: (top.example.length > 1024 ? "The example was too long" : top.example) || "No example provided"
                }
              ],
              footer: {
                text: `With ${top.thumbs_up} upvotes and ${top.thumbs_down} downvotes`
              }
            }
          ]
        }, data, token)
      }
    })
    return { type: 5 }
  } else if (args.search) {
    fetch(`https://api.urbandictionary.com/v0/autocomplete-extra?term=${args.search.query}`, {
      method: "GET"
    }).then(res => res.json()).then(json => {
      var results = json.results;
      if (results.length == 0) return followUp({ content: "Your search returned no definitions" }, data, token)
      if (results.length > 10) {
        results = results.splice(0, 10)
      }
      var embed = {
        title: "Results",
        fields: []
      }
      for (var i = 0; i < results.length; i++) {
        embed.fields.push({
          name: results[i].term,
          value: results[i].preview
        })
      }
      followUp({
        embeds: [
          embed
        ]
      }, data, token)
    })
    return { type: 5 }
  } else if (args.lookupbyid) {
    fetch(`https://api.urbandictionary.com/v0/define?defid=${args.lookupbyid.id}`, {
      method: "GET"
    }).then(res => res.json()).then(json => {
      var definitions = json.list
      if (definitions.length == 0) return followUp({ content: "I was not able to find a definition matching the id" }, data, token)
      var top = definitions[0]
      if (top.definition.length > 1024) {
        fetch("https://pastie.io/documents", {
          method: "POST",
          body: top.definition
        }).then(res => res.json()).then(json => {
          followUp({
            content: "",
            embeds: [
              {
                title: top.word,
                url: top.permalink,
                fields: [
                  {
                    name: "Meaning",
                    value: `The definition was too large, but I was able to create a [hastebin](https://pastie.io/${json.key})`
                  },
                  {
                    name: "Example",
                    value: (top.example.length > 1024 ? "The example was too long" : top.example) || "No example provided"
                  }
                ]
              }
            ]
          }, data, token)
        })
      } else {
        followUp({
          content: "",
          embeds: [
            {
              title: top.word,
              url: top.permalink,
              fields: [
                {
                  name: "Meaning",
                  value: top.definition
                },
                {
                  name: "Example",
                  value: (top.example.length > 1024 ? "The example was too long" : top.example) || "No example provided"
                }
              ]
            }
          ]
        }, data, token)
      }
    })
    return { type: 5 }
  } else if (args.hasOwnProperty("wordoftheday")) {
    fetch("https://api.urbandictionary.com/v0/words_of_the_day", {
      method: "GET"
    }).then(res => res.json()).then(json => {
      var definitions = json.list
      var top = definitions[0]
      if (top.definition.length > 1024) {
        fetch("https://pastie.io/documents", {
          method: "POST",
          body: top.definition
        }).then(res => res.json()).then(json => {
          followUp({
            content: "",
            embeds: [
              {
                title: top.word,
                url: top.permalink,
                fields: [
                  {
                    name: "Meaning",
                    value: `The definition was too large, but I was able to create a [hastebin](https://pastie.io/${json.key})`
                  },
                  {
                    name: "Example",
                    value: (top.example.length > 1024 ? "The example was too long" : top.example) || "No example provided"
                  }
                ]
              }
            ]
          }, data, token)
        })
      } else {
        followUp({
          content: "",
          embeds: [
            {
              title: top.word,
              url: top.permalink,
              fields: [
                {
                  name: "Meaning",
                  value: top.definition
                },
                {
                  name: "Example",
                  value: (top.example.length > 1024 ? "The example was too long" : top.example) || "No example provided"
                }
              ]
            }
          ]
        }, data, token)
      }
    })
    return {type: 5}
  }
  
}
function followUp(body, data, token) {
  console.log(data.token)
  fetch(`https://discord.com/api/v9/webhooks/750171699303153759/${data.token}/messages/@original`, {
    method: "PATCH",
    headers: {
      "Authorization": "Bot " + token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
}
function splitbyWords(str) {
  console.log("processign")
  function chunkMaxLength(arr, chunkSize, maxLength) {
    return Array.from({ length: maxLength }, () => arr.splice(0, chunkSize));
  }
  var array = str.split(" ")
  var res = chunkMaxLength(array, 20, Math.ceil(array.length / 20))
  var ret = ""
  res.forEach((val) => {
    var idk = ""
    idk = val.join(" ")
    ret += idk + "\n"
  })
  return ret;
}