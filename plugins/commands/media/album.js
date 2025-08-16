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

// Pagination constant
const PAGE_SIZE = 5;

// Command call হলে category list দেখানো
export async function onCall({ message, args }) {
  const categoryKeys = Object.keys(categories);
  const page = parseInt(args[0]) || 1;
  const totalPages = Math.ceil(categoryKeys.length / PAGE_SIZE);

  if (page > totalPages) {
    return message.reply(`❌ Page ${page} doesn't exist. Total pages: ${totalPages}`);
  }

  const startIndex = (page - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const pageCategories = categoryKeys.slice(startIndex, endIndex);

  let msg = `╭╼|━♡𝐒𝐈𝐃𝐃𝐈𝐊-𝐁𝐎𝐓-𝟎𝟕♡━|╾╮\n\nআপনার পছন্দের ভিডিও দেখতে একটি নাম্বারে রিপ্লাই করুন:\n\n`;

  pageCategories.forEach((cat, idx) => {
    msg += `${startIndex + idx + 1}. ${cat}\n`;
  });

  msg += `\nPage ${page}/${totalPages}\nReply with number.\n`;

  const replyMsg = await message.reply(msg);

  // 30 সেকেন্ড পরে auto unsend
  setTimeout(() => {
    replyMsg.unsend().catch(() => {});
  }, 30000);

  // Reply handle
  message.addReplyEvent({
    type: "selectCategory",
    categoryKeys,
    pageCategories,
    callback: async ({ message: replyMessage, body }) => {
      const choice = parseInt(body);
      if (!choice || choice < 1 || choice > categoryKeys.length) {
        return replyMessage.reply("Invalid choice. Try again.");
      }

      const selectedCategory = categoryKeys[choice - 1];
      const videos = categories[selectedCategory];

      // Loading message
      const loadingMsg = await replyMessage.reply(`⏳ Loading ${selectedCategory}...`);

      let videoMsg = `Category: ${selectedCategory}\n\n`;
      videos.forEach((v, i) => {
        videoMsg += `${i + 1}. ${v}\n`;
      });
      videoMsg += "\nReply with number to get video.";

      const replyCategoryMsg = await replyMessage.reply(videoMsg);

      // Remove loading message
      await replyMessage.unsend(loadingMsg.messageID);

      // Auto unsend category list after 30 seconds
      setTimeout(() => {
        replyCategoryMsg.unsend().catch(() => {});
      }, 30000);

      // Save for video selection
      replyCategoryMsg.addReplyEvent({
        type: "selectVideo",
        videos,
        callback: async ({ message: videoMessage, body }) => {
          const videoChoice = parseInt(body);
          if (!videoChoice || videoChoice < 1 || videoChoice > videos.length) {
            return videoMessage.reply("Invalid choice. Try again.");
          }

          // Loading before sending video
          const loadingVideo = await videoMessage.reply(`⏳ Sending video...`);

          const videoURL = videos[videoChoice - 1];
          await videoMessage.reply({ attachment: videoURL });

          // Remove loading video message
          await videoMessage.unsend(loadingVideo.messageID);
        }
      });
    }
  });
}
