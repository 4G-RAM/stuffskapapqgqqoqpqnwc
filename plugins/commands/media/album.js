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

const PAGE_SIZE = 5;

// ✅ main command
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

  // ✅ Save reply context
  message.saveReply({
    type: "selectCategory",
    categoryKeys,
    pageCategories
  });

  // Auto unsend
  setTimeout(() => {
    replyMsg.unsend().catch(() => {});
  }, 30000);
}

// ✅ reply handler
export async function handleReply({ message, eventData }) {
  const body = message.body?.trim();
  const choice = parseInt(body);

  // Category selected
  if (eventData.type === "selectCategory") {
    const { categoryKeys } = eventData;

    if (!choice || choice < 1 || choice > categoryKeys.length) {
      return message.reply("Invalid category number. Try again.");
    }

    const selectedCategory = categoryKeys[choice - 1];
    const videos = categories[selectedCategory];

    const loadingMsg = await message.reply(`⏳ Loading ${selectedCategory}...`);

    let videoList = `📂 Category: ${selectedCategory}\n\n`;
    videos.forEach((v, i) => {
      videoList += `${i + 1}. ${v}\n`;
    });
    videoList += `\nReply with number to get the video.`;

    const videoMsg = await message.reply(videoList);

    await message.unsend(loadingMsg.messageID);

    message.saveReply({
      type: "selectVideo",
      videos
    });

    setTimeout(() => videoMsg.unsend().catch(() => {}), 30000);
  }

  // Video selected
  else if (eventData.type === "selectVideo") {
    const { videos } = eventData;

    if (!choice || choice < 1 || choice > videos.length) {
      return message.reply("Invalid video number. Try again.");
    }

    const loading = await message.reply("⏳ Sending video...");

    const videoURL = videos[choice - 1];
    await message.reply({ attachment: videoURL });

    await message.unsend(loading.messageID);
  }
}

// ✅ Final export
export default {
  config,
  onCall,
  handleReply
};
