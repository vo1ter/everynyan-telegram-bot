const { Telegraf } = require('telegraf')
const { message } = require('telegraf/filters');
const fs = require('fs');
const { group } = require('console');
require('dotenv').config() // make them .env vars work

const bot = new Telegraf(process.env.TELEGRAM_TOKEN)

function checkUser(groupId, userId) { // check if user exists in database
    let memberListFile = fs.readFileSync("./members.json"); // read database
    let memberList = JSON.parse(memberListFile)[`channel${groupId}`]; // get data about the current channel
    if(memberList === undefined) { // if channel is not in our database, add one
        let jsonData = JSON.parse(memberListFile);
        jsonData[`channel${groupId}`] = {
            "ids": []
        }
        fs.writeFileSync("./members.json", JSON.stringify(jsonData));
        return checkUser(groupId, userId); // recursion
    }
    if(memberList["ids"].includes(userId) == false) { // if user doesn't exist in database add one
        let jsonData = JSON.parse(memberListFile);
        jsonData[`channel${groupId}`].ids.push(userId);
        fs.writeFileSync("./members.json", JSON.stringify(jsonData));
    }
    else { // if user exists, return true
        return true;
    }
}

function removeUser(groupId, userId) { // remove user from database (e.g. if they left the group)
    let memberListFile = fs.readFileSync("./members.json"); // read database
    let jsonData = JSON.parse(memberListFile); // get all data from database
    jsonData[`channel${groupId}`].ids = jsonData[`channel${groupId}`].ids.filter((element) => { // spooky searching algo
        return element != userId // return results without the users id
    })
    fs.writeFileSync("./members.json", JSON.stringify(jsonData)) // update database
}

async function mentionEveryone(ctx, message, groupId) {
    let memberListFile = fs.readFileSync("./members.json"); // read database
    let idList = JSON.parse(memberListFile)[`channel${groupId}`].ids; // get id's of the channel
    message += "\n" // add space to the message (so it won't look like garbage)

    for(let i = 0; idList.length > i; i++) {
        chatMember = await ctx.getChatMember(idList[i]); // get info about the chat member
        if(chatMember.user.username == undefined) { // if member doesn't have a username, use first name instead
            chatMemberUsername = chatMember.user.first_name;
        }
        else { // if member does have a username, use it
            chatMemberUsername = chatMember.user.username;
        }

        message += `[${chatMemberUsername}](tg://user?id=${idList[i]}) `; // message constructor
    }

    ctx.sendMessage(message, { parse_mode: 'MarkdownV2' });
}

bot.hears('@everyone', (ctx) => {
    try { // try catch so bot don't crash if message was deleted before he did it
        ctx.deleteMessage(ctx.update.message.id);
    }
    catch (error) {}
    mentionEveryone(ctx, "", ctx.update.message.chat.id)
})

bot.on('message', (ctx) => {
    let userId = ctx.update.message.from.id;
    let channelId = ctx.update.message.chat.id;

    try {
        if(ctx.update.message.left_chat_member) { // remove user from database if he left the group
            removeUser(channelId, ctx.update.message.left_chat_member.id)
        }
    }
    catch {}

    if(ctx.update.message.from.username == "uasaverbot" && !ctx.update.message.video) { // delete ad messages from USaver
        try {
            ctx.deleteMessage(ctx.update.message.id)
        }
        catch (err) {}
    }

    checkUser(channelId, userId)
})

bot.command('all', async (ctx) => {
    console.log(ctx)
})

bot.command('everyone', async (ctx) => {
    console.log(ctx)
})

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))