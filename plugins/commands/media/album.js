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

// ভিডিও categories
const categories = {
    "ISLAMIC-VIDEO": [
        "https://i.imgur.com/3EXzdzu.mp4",
        "https://i.imgur.com/elsJxEk.mp4",
        "https://i.imgur.com/htitv6P.mp4",
        "https://i.imgur.com/iD8lpOs.mp4"
    ],
    "FUN-VIDEO": [
        "https://i.imgur.com/fun1.mp4",
        "https://i.imgur.com/fun2.mp4",
        "https://i.imgur.com/fun3.mp4"
    ]
};

// command call হলে category list দেখানো
export async function onCall({ message, args }) {
    const categoryList = Object.keys(categories);
    let msg = `╭─♡ XAVIA BOT ♡─╮\n\nভিডিও আলবাম কেটেগরি:\n\n`;

    categoryList.forEach((cat, idx) => {
        msg += `${idx + 1}. ${cat}\n`;
    });

    msg += `\nReply করুন category number দিয়ে।`;

    const replyMsg = await message.reply(msg);

    // reply handle করার জন্য save করা
    message.addReplyEvent({
        type: "selectCategory",
        categoryList,
        callback: async ({ message: replyMessage, body }) => {
            const choice = parseInt(body);
            if (!choice || choice < 1 || choice > categoryList.length) {
                return replyMessage.reply("Invalid choice. Try again.");
            }

            const selectedCategory = categoryList[choice - 1];
            const videos = categories[selectedCategory];

            let videoMsg = `Category: ${selectedCategory}\n\n`;
            videos.forEach((v, i) => {
                videoMsg += `${i + 1}. ${v}\n`;
            });
            videoMsg += "\nReply with number to get video.";

            const replyCategoryMsg = await replyMessage.reply(videoMsg);

            // save for video selection
            replyCategoryMsg.addReplyEvent({
                type: "selectVideo",
                videos,
                callback: async ({ message: videoMessage, body }) => {
                    const videoChoice = parseInt(body);
                    if (!videoChoice || videoChoice < 1 || videoChoice > videos.length) {
                        return videoMessage.reply("Invalid choice. Try again.");
                    }

                    const videoURL = videos[videoChoice - 1];
                    await videoMessage.reply({ attachment: videoURL });
                }
            });
        }
    });
}
