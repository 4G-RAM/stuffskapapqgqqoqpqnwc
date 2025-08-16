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

// ভিডিও ক্যাটাগরি ও URL
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

export async function onCall({ message }) {
  const categoryKeys = Object.keys(categories);
  let msg = `🎥 ভিডিও ক্যাটাগরি:\n\n`;
  categoryKeys.forEach((cat, i) => {
    msg += `${i + 1}. ${cat}\n`;
  });
  msg += `\nReply with the number to choose a category.`;

  const sentMsg = await message.reply(msg);
  return sentMsg.addReplyEvent({
    callback: handleCategorySelection,
    categoryKeys
  });
}

async function handleCategorySelection({ message, eventData }) {
  const choice = parseInt(message.body);
  const { categoryKeys } = eventData;

  if (isNaN(choice) || choice < 1 || choice > categoryKeys.length) {
    return message.reply("Invalid category number. Please try again.");
  }

  const selectedCategory = categoryKeys[choice - 1];
  const videos = categories[selectedCategory];
  let msg = `📂 ক্যাটাগরি: ${selectedCategory}\nভিডিও তালিকা:\n\n`;

  videos.forEach((url, i) => {
    msg += `${i + 1}. ভিডিও ${i + 1}\n`;
  });
  msg += `\nReply with the number to get the video.`;

  const sentMsg = await message.reply(msg);
  return sentMsg.addReplyEvent({
    callback: handleVideoSelection,
    videos
  });
}

async function handleVideoSelection({ message, eventData }) {
  const choice = parseInt(message.body);
  const { videos } = eventData;

  if (isNaN(choice) || choice < 1 || choice > videos.length) {
    return message.reply("Invalid video number. Please try again.");
  }

  const videoURL = videos[choice - 1];
  await message.reply({ attachment: videoURL });
}

export default {
  config,
  onCall,
};
