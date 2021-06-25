var fetch = require("node-fetch")
var Canvas = require("canvas")
module.exports = (data, args,token) => {
  console.log(args)
  fetch(`https://discord.com/api/v9/users/${args.user}`, {
    method: "GET",
    headers: {
      "Authorization": "Bot " + token
    }
  }).then((res) => res.json()).then(async json => {
    var hash = json.avatar
    var url = `https://cdn.discordapp.com/avatars/${args.user}/${hash}.png?size=4096`
    var boundary = makeid(20)
    Canvas.registerFont("comic.ttf", {family: "Comic sans"})
    var canvas = Canvas.createCanvas(4096,5376)
    var ctx = canvas.getContext("2d")
    ctx.fillStyle = "white"
    ctx.fillRect(0,0,4096, 1280)
    ctx.font = '620px "Comic Sans"'
    ctx.textAlign = "center"
    ctx.fillStyle = "#4f4f4f"
    ctx.fillText('Blame', 2048, 960)
    // var background = await Canvas.loadImage("./blame.png")
    // ctx.drawImage(background, 0, 0, 4096, 5376)
    var pfp = await Canvas.loadImage(url)
    ctx.drawImage(pfp, 0, 1280, 4096, 4096)
    var content1 = `--${boundary}\n` +
      `Content-Disposition: form-data; name="file"; filename="blame.png"` +
      `Content-Type: image/png\n\n`
    var jsonContent = JSON.stringify({
      embeds: [
        {
          title: "get blam'd lol",
          image: {
            url: "attachment://blame.png"
          }
        }
      ]
    })
    var content2 = `--${boundary}\n` +
      `Content-Disposition: form-data; name="payload_json"\n\n` +
      `${jsonContent}\n` +
      `--${boundary}--`
    var payload = Buffer.concat([
      new Buffer(content1, "utf-8"),
      canvas.toBuffer(),
      new Buffer(content2, "utf-8")
    ])
    fetch(`https://discord.com/api/v9/webhooks/750171699303153759/${data.token}/messages/@original`, {
      method: "PATCH",
      headers: {
        "Authorization": "Bot " + token,
        "Content-Type": `multipart/form-data; boundary=${boundary}` 
      },
      body: payload
    })
  })
  return { type: 5 }
}
function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}