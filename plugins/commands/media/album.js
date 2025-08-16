// plugins/commands/media/album.js (ES Module)

import fs from 'fs';
import path from 'path';
import https from 'https';

export const config = {
    name: "album",
    aliases: ["videoalbum"],
    version: "1.0.0",
    role: 0,
    author: "SK-SIDDIK-KHAN",
    description: "Send videos from categories",
    category: "media",
    countDown: 5,
};

const categories = {
    "ISLAMIC-VIDEO": [
        "https://i.imgur.com/3EXzdzu.mp4",
        "https://i.imgur.com/elsJxEk.mp4",
        "https://i.imgur.com/htitv6P.mp4",
        "https://i.imgur.com/iD8lpOs.mp4",
        "https://i.imgur.com/iD8lpOs.mp4"
    ],
    "FUN-VIDEO": [
        "https://i.imgur.com/fun1.mp4",
        "https://i.imgur.com/fun2.mp4",
        "https://i.imgur.com/fun3.mp4"
    ]
};

// Send list of videos to user
async function sendVideoList(message, category) {
    if (!categories[category]) {
        return message.reply(`Category "${category}" not found`);
    }

    const videoList = categories[category];

    let msg = `╭╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╮\n\n` +
              `আপনার পছন্দের ভিডিও দেখতে একটি নাম্বারে রিপ্লাই করুন:\n\n`;

    videoList.forEach((video, index) => {
        msg += `${index + 1}. ${video}\n`;
    });

    const replyMsg = await message.reply(msg);

    // Save for reply handling
    global.GoatBot.onReply.set(replyMsg.messageID, {
        commandName: "album",
        messageID: replyMsg.messageID,
        author: message.senderID,
        type: "selectCategory",
        category
    });
}

// Handle user reply
export async function onReply({ bot, event, message }) {
    const replyData = global.GoatBot.onReply.get(event.messageReply?.messageID);
    if (!replyData) return;

    if (replyData.type === "selectCategory") {
        const choice = parseInt(event.body);
        const videoList = categories[replyData.category];

        if (!choice || choice < 1 || choice > videoList.length) {
            return message.reply("Invalid choice. Please reply with a valid number.");
        }

        const videoURL = videoList[choice - 1];
        await message.reply({ body: `Here is your video:`, attachment: videoURL });
        global.GoatBot.onReply.delete(event.messageReply.messageID);
    }
}

// Main command start
export async function onStart({ bot, chatId, message }) {
    const categoryList = Object.keys(categories);
    let msg = `╭╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╮\n\n` +
              `ভিডিও আলবাম কেটেগরি:\n\n`;

    categoryList.forEach((cat, idx) => {
        msg += `${idx + 1}. ${cat}\n`;
    });

    const replyMsg = await message.reply(msg);

    // Save for category selection reply
    global.GoatBot.onReply.set(replyMsg.messageID, {
        commandName: "album",
        messageID: replyMsg.messageID,
        author: message.senderID,
        type: "selectCategoryList"
    });
}

// Handle category selection
export async function onCategorySelect({ bot, event, message }) {
    const replyData = global.GoatBot.onReply.get(event.messageReply?.messageID);
    if (!replyData || replyData.type !== "selectCategoryList") return;

    const choice = parseInt(event.body);
    const categoryList = Object.keys(categories);

    if (!choice || choice < 1 || choice > categoryList.length) {
        return message.reply("Invalid choice. Please reply with a valid number.");
    }

    const selectedCategory = categoryList[choice - 1];
    await sendVideoList(message, selectedCategory);
    global.GoatBot.onReply.delete(event.messageReply.messageID);
}
