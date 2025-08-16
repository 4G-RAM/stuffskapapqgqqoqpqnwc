// plugins/commands/media/album.js

export const config = {
    name: "album",
    aliases: ["videoalbum"],
    version: "1.0.0",
    role: 0,
    author: "SK-SIDDIK-KHAN",
    description: "Send videos from categories",
    category: "media",
    cooldown: 5,
};

// ভিডিও ক্যাটাগরি
const categories = {
    "ISLAMIC-VIDEO": [
        "https://i.imgur.com/g6cdosz.mp4",
        "https://i.imgur.com/4gY1bWL.mp4",
        "https://i.imgur.com/Y2AnTbO.mp4",
        "https://i.imgur.com/slARoKZ.mp4",
        "https://i.imgur.com/HU45akB.mp4"
    ],
    "FUN-VIDEO": [
        "https://i.imgur.com/evswpXP.mp4",
        "https://i.imgur.com/CbwvstK.mp4",
        "https://i.imgur.com/19j5Vhh.mp4",
        "https://i.imgur.com/VYRYUNJ.mp4"
    ]
};

export async function onCall({ message, args }) {
    try {
        await message.react("⏳");

        const categoryList = Object.keys(categories);
        let msg = `╭╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╮\n\nআপনার পছন্দের ভিডিও দেখতে একটি নাম্বারে রিপ্লাই করুন:\n\n`;

        categoryList.forEach((cat, idx) => {
            msg += `${idx + 1}. ${cat}\n`;
        });

        msg += `\nReply করুন category number দিয়ে।`;

        const replyMsg = await message.reply(msg);

        replyMsg.addReplyEvent({
            type: "selectCategory",
            categoryList,
            callback: async ({ message: replyMessage, body }) => {
                const choice = parseInt(body);
                if (!choice || choice < 1 || choice > categoryList.length) {
                    await replyMessage.react("❌");
                    return replyMessage.reply("❌ Invalid choice. Try again.");
                }

                await replyMessage.react("✅");

                const selectedCategory = categoryList[choice - 1];
                const videos = categories[selectedCategory];

                let videoMsg = `🎥 Category: ${selectedCategory}\n\n`;
                videos.forEach((v, i) => {
                    videoMsg += `${i + 1}. Video ${i + 1}\n`;
                });
                videoMsg += "\nReply with number to get video.";

                const replyCategoryMsg = await replyMessage.reply(videoMsg);

                replyCategoryMsg.addReplyEvent({
                    type: "selectVideo",
                    videos,
                    callback: async ({ message: videoMessage, body }) => {
                        const videoChoice = parseInt(body);
                        if (!videoChoice || videoChoice < 1 || videoChoice > videos.length) {
                            await videoMessage.react("❌");
                            return videoMessage.reply("❌ Invalid choice. Try again.");
                        }

                        const videoURL = videos[videoChoice - 1];
                        await videoMessage.react("✅");

                        return videoMessage.reply({
                            body: `🎬 Here's your video from ${selectedCategory}:`,
                            attachment: await global.utils.getStreamFromURL(videoURL)
                        });
                    }
                });
            }
        });

        await message.react("✅");
    } catch (err) {
        console.error(err);
        await message.react("❌");
        return message.reply("❌ কোনো সমস্যা হয়েছে, পরে আবার চেষ্টা করুন।");
    }
}
