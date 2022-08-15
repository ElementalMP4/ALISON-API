const { createCanvas, loadImage } = require('canvas');
const express = require("express");
const config = require("./config.json");

const app = express();

function setTextSize(ctx, text, maxwidth) {
    let size = 30;
    ctx.font = `${size}px Whitney Bold`;
    while (ctx.measureText(text).width > maxwidth && size > 8) {
        size--;
        ctx.font = `${size}px Whitney Bold`;
    }
    return ctx.measureText(text).width;
}

function getLines(ctx, text, maxWidth) {
    var words = text.split(" ");
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

async function createQuoteImage(req, res) {
    console.log("Making member card");

    const avatarURL = req.query.avatar_url;
    const username = "-" + req.query.username;
    const quote = '"' + req.query.quote + '"';

    const canvas = createCanvas(800, 800)
    const ctx = canvas.getContext('2d');

    let backgroundImage = await loadImage(avatarURL);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    ctx.globalAlpha = 0.75;
    ctx.fillStyle = "#000000"
    ctx.fillRect(20, 565, 760, 210);
    ctx.globalAlpha = 1;

    ctx.font = `40px Whitney Bold`;
    let lines = getLines(ctx, quote, 740);
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    let offset = 0;
    lines.forEach(line => {
        ctx.fillText(line, 400, 585 + offset, 740);
        offset += 43;
    });

    setTextSize(ctx, username, 300);
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(username, 400, 715);

    res.send(canvas.toDataURL('image/png', 1));
    console.log("Made quote image");
}

app.get('/api/quote', (req, res) => createQuoteImage(req, res));
app.listen(config.port);
console.log("Listening on port " + config.port);