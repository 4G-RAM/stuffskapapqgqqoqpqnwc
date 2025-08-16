import fs from 'fs/promises';
import axios from 'axios';
import { join } from 'path';

const config = {
  name: "resort",
  aliases: [],
  description: "Manage your resort.",
  usage: "",
  cooldown: 5,
  credits: "Dymyrius"
};

const langData = {
  "en_US": {
    "resort.noResort": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝. 𝚄𝚜𝚎 `𝚛𝚎𝚜𝚘𝚛𝚝 𝚋𝚞𝚢` 𝚝𝚘 𝚐𝚎𝚝 𝚘𝚗𝚎.",
    "resort.buySuccess": "𝙲𝚘𝚗𝚐𝚛𝚊𝚝𝚞𝚕𝚊𝚝𝚒𝚘𝚗𝚜! 𝚈𝚘𝚞'𝚟𝚎 𝚙𝚞𝚛𝚌𝚑𝚊𝚜𝚎𝚍 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝 𝚗𝚊𝚖𝚎𝚍 {resortName}!",
    "resort.buyFailure": "𝚈𝚘𝚞 𝚍𝚘𝚗'𝚝 𝚑𝚊𝚟𝚎 𝚎𝚗𝚘𝚞𝚐𝚑 𝚌𝚛𝚎𝚍𝚒𝚝𝚜 𝚝𝚘 𝚋𝚞𝚢 𝚊 𝚛𝚎𝚜𝚘𝚛𝚝.",
    "resort.menuOptions": "◦❭❯❱【𝐑𝐄𝐒𝐎𝐑𝐓 𝐌𝐄𝐍𝐔】❰❮❬◦\n\n𝖶𝖾𝗅𝖼𝗈𝗆𝖾 𝗍𝗈 𝗍𝗁𝖾 𝖢𝖺𝗌𝗂𝗇𝗈 𝖱𝖾𝗌𝖔𝗋𝗍 𝖬𝖺𝗇𝖺𝗀𝖾𝗆𝖾𝗇𝗍 𝖲𝗒𝗌𝗍𝖾𝗆! 🌴\n\n𝖦𝖾𝗍 𝗋𝖾𝖺𝖽𝗒 𝗍𝗈 𝖼𝗋𝖾𝖺𝗍𝖾 𝖺𝗇𝖽 𝗆𝖺𝗇𝖺𝗀𝖾 𝗒𝗈𝗎𝗋 𝖽𝗋𝖾𝖺𝗆 𝗋𝖾𝗌𝗈𝗋𝗍.\n\n𝖢𝗁𝗈𝗈𝗌𝖾 𝖺𝗇 𝗈𝗉𝗍𝗂𝗈𝗇:\n• `𝘳𝘦𝘴𝘰𝘳𝘵 𝘣𝘶𝘺 <𝗇𝖺𝗆𝖾>` » 𝖯𝗎𝗋𝖼𝗁𝖺𝗌𝖾 𝖺 𝗇𝖾𝗐 𝗋𝖾𝗌𝗈𝗋𝗍.\n• `𝘳𝘦𝘴𝘰𝘳𝘵 𝘤𝘩𝘦𝘤𝘬` » 𝖢𝗁𝖾𝖼𝗄 𝗍𝗁𝖾 𝗌𝗍𝖺𝗍𝗎𝗌 𝗈𝖿 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍.\n• `𝘳𝘦𝘴𝘰𝘳𝘵 𝘤𝘭𝘦𝘢𝘯` » 𝖢𝗅𝖾𝖺𝗇 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍.\n• `𝘳𝘦𝘀𝘰𝘳𝘵 𝘶𝘱𝘨𝘳𝘢𝘥𝘦` » 𝖴𝗉𝗀𝗋𝖺𝖽𝖾 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍.\n• `𝘳𝘦𝘴𝘰𝘳𝘵 𝘤𝘰𝘭𝘭𝘦𝘤𝘵` » 𝖢𝗈𝗅𝗅𝖾𝖼𝗍 𝗏𝖺𝗅𝗎𝖾 𝖿𝗋𝗈𝗆 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍.\n𝟨. `𝘳𝘦𝘴𝘰𝘳𝘵 𝘳𝘦𝘯𝘢𝘮𝘦 <𝗇𝖾𝗐𝖭𝖺𝗆𝖾>` » 𝖱𝖾𝗇𝖺𝗆𝖾 𝗒𝗈𝗎𝗋 𝗋𝖾𝗌𝗈𝗋𝗍."
  }
};

const resortImages = [
  "https://i.imgur.com/SOA08ZY.png",
  "https://i.imgur.com/TJjSR0b.jpg",
  "https://i.imgur.com/2rbIdig.jpg",
  "https://i.imgur.com/B4LfB3N.png",
  "https://i.imgur.com/rAp1ht1.png",
  "https://i.imgur.com/m0U81MX.jpg",
  "https://i.imgur.com/cAYBO5u.jpg",
  "https://i.imgur.com/TlA5ses.jpg",
  "https://i.imgur.com/hHIw2Ay.jpg",
  "https://i.imgur.com/Sgj79Gi.jpg",
  "https://i.imgur.com/ZoldXIQ.png",
  "https://i.imgur.com/CZD4GrY.jpg",
  "https://i.imgur.com/kJciB1v.jpg",
  "https://i.imgur.com/8dbenRw.png",
  "https://i.imgur.com/OHpHq2I.png",
  "https://i.imgur.com/54iBcHP.jpg",
  "https://i.imgur.com/Hgr4MDD.jpg",
  "https://i.imgur.com/qUqWSMD.jpg",
  "https://i.imgur.com/8LtPOT9.jpg",
  "https://i.imgur.com/zokGGXP.jpg",
  "https://i.imgur.com/OxfHFlI.jpg",
  "https://i.imgur.com/c3Q7gxt.jpg",
  "https://i.imgur.com/4KvBgkQ.jpg",
  "https://i.imgur.com/AJikYqr.jpg"
];

const valueIncreaseInterval = 7 * 60 * 1000; // 7 minutes
const cleanCooldownDuration = 2 * 60 * 60 * 1000; // 2 hours
const maxResortLevel = 24;

let userResorts = new Map();
let cleanlinessCooldowns = new Map();
const PATH = join(global.assetsPath, 'user_resorts.json');

// Load saved data
async function loadUserData() {
  try {
    const data = await fs.readFile(PATH, 'utf8');
    const parsed = JSON.parse(data);

    // Validate and load userResorts as Map
    if (parsed.userResorts && Array.isArray(parsed.userResorts)) {
      userResorts = new Map(parsed.userResorts.map(([userID, resort]) => [userID, resort]));
    } else {
      userResorts = new Map();
    }

    // Load cleanliness cooldowns
    if (parsed.cleanlinessCooldowns && Array.isArray(parsed.cleanlinessCooldowns)) {
      cleanlinessCooldowns = new Map(parsed.cleanlinessCooldowns);
    } else {
      cleanlinessCooldowns = new Map();
    }
  } catch (err) {
    console.error("Failed to load user resorts:", err);
    userResorts = new Map();
    cleanlinessCooldowns = new Map();
  }
}

// Save data to file
async function saveUserData() {
  try {
    const data = {
      userResorts: Array.from(userResorts.entries()),
      cleanlinessCooldowns: Array.from(cleanlinessCooldowns.entries())
    };
    await fs.writeFile(PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error("Failed to save user resorts:", err);
  }
}

// Calculate resort value and value increase for a given level
function calculateResortValue(level) {
  const baseValue = level * 10000;
  const valueIncrease = level * 3000 * level; // level^2 * 3000
  const imageURL = resortImages[level - 1] || resortImages[0];
  return { value: baseValue, valueIncrease, imageURL };
}

// Periodically update resort values and cleanliness
setInterval(() => {
  const currentTime = Date.now();

  for (const [userID, resort] of userResorts.entries()) {
    // Increase resort value over time
    const { valueIncrease, imageURL } = calculateResortValue(resort.level);
    resort.value = (resort.value || 0) + valueIncrease;

    // Decrease cleanliness by 2% every interval (7 min here)
    resort.cleanliness = Math.max((resort.cleanliness || 100) - 2, 0);

    // Update image URL for current level
    resort.imageURL = imageURL;

    userResorts.set(userID, resort);
  }

  // Clean up expired cooldowns
  for (const [userID, lastCleanTime] of cleanlinessCooldowns.entries()) {
    if (currentTime - lastCleanTime >= cleanCooldownDuration) {
      cleanlinessCooldowns.delete(userID);
    }
  }

  saveUserData();
}, valueIncreaseInterval);

// The main command handler function
async function onCall({ message, getLang, args }) {
  const { Users } = global.controllers;
  if (!message || !message.body) {
    console.error("Invalid message object or message body!");
    return;
  }

  const senderID = message.senderID;
  const lang = getLang;

  if (!args.length || args[0] === "menu") {
    // Show menu with a resort image
    const menuText = lang("resort.menuOptions");
    const resortImageResponse = await axios.get("https://i.imgur.com/kKP3G5t.png", { responseType: "stream" });
    return message.reply({ body: menuText, attachment: resortImageResponse.data });
  }

  // Handle buy command
  if (args[0] === "buy") {
    if (userResorts.has(senderID)) {
      return message.reply("You already own a resort. Sell it before buying a new one.");
    }
    const resortPrice = 1_000_000;
    const userBalance = await Users.getMoney(senderID);
    if (userBalance < resortPrice) {
      return message.reply(lang("resort.buyFailure"));
    }
    if (args.length < 2) {
      return message.reply("Please provide a name for your resort.");
    }
    const resortName = args.slice(1).join(" ");
    const newResort = {
      name: resortName,
      level: 1,
      cleanliness: 100,
      value: calculateResortValue(1).value,
      imageURL: resortImages[0]
    };
    userResorts.set(senderID, newResort);
    await Users.decreaseMoney(senderID, resortPrice);
    saveUserData();

    const imageResponse = await axios.get(resortImages[0], { responseType: "stream" });
    return message.reply({
      body: `Congratulations! You've purchased a resort named ${resortName}! 🏖`,
      attachment: imageResponse.data
    });
  }

  // Handle clean command
  if (args[0] === "clean") {
    if (!userResorts.has(senderID)) {
      return message.reply(lang("resort.noResort"));
    }
    const lastClean = cleanlinessCooldowns.get(senderID) || 0;
    const now = Date.now();
    if (now - lastClean < cleanCooldownDuration) {
      const remain = cleanCooldownDuration - (now - lastClean);
      const remainHours = Math.ceil(remain / (60 * 60 * 1000));
      return message.reply(`Your resort is already clean. You can clean it again in ${remainHours} hour(s). ⏱`);
    }
    cleanlinessCooldowns.set(senderID, now);
    const resort = userResorts.get(senderID);
    resort.cleanliness = 100;
    userResorts.set(senderID, resort);
    saveUserData();
    return message.reply("You've cleaned your resort! It's now sparkling clean. 🧹");
  }

  // Handle check command
  if (args[0] === "check") {
    if (!userResorts.has(senderID)) {
      return message.reply(lang("resort.noResort"));
    }
    const resort = userResorts.get(senderID);
    const statusMsg =
      `🏨 Resort Name: ${resort.name}\n` +
      `⬆️ Resort Level: ${resort.level}\n` +
      `🧹 Cleanliness: ${resort.cleanliness}%\n` +
      `📈 Income: ₱${resort.value}`;

    if (resort.imageURL) {
      const imageResponse = await axios.get(resort.imageURL, { responseType: "stream" });
      return message.reply({ body: statusMsg, attachment: imageResponse.data });
    }
    return message.reply(statusMsg);
  }

  // Handle upgrade command
  if (args[0] === "upgrade") {
    if (!userResorts.has(senderID)) {
      return message.reply(lang("resort.noResort"));
    }
    const resort = userResorts.get(senderID);
    if (resort.level >= maxResortLevel) {
      return message.reply("Your resort is already at the maximum level.");
    }
    const now = Date.now();
    const lastUpgrade = resort.lastUpgradeTime || 0;
    const upgradeCooldown = 5 * 60 * 60 * 1000; // 5 hours

    if (now - lastUpgrade < upgradeCooldown) {
      const remain = upgradeCooldown - (now - lastUpgrade);
      const remainHours = Math.ceil(remain / (60 * 60 * 1000));
      return message.reply(`You can't upgrade yet. Please wait ${remainHours} hour(s) before upgrading again. ⏱`);
    }

    const basePrice = 50_000;
    const multiplier = 2 ** (resort.level - 1);
    const upgradeCost = basePrice * multiplier;
    const userBalance = await Users.getMoney(senderID);
    if (userBalance < upgradeCost) {
      return message.reply(`You don't have enough credits to upgrade your resort. Upgrade costs ₱${upgradeCost}.`);
    }
    try {
      await Users.decreaseMoney(senderID, upgradeCost);
    } catch (e) {
      console.error("Failed to deduct money:", e);
      return message.reply("An error occurred while deducting your money.");
    }

    const nextLevel = Math.min(resort.level + 1, maxResortLevel);
    const { value: nextValue, imageURL: nextImageURL } = calculateResortValue(nextLevel);
    resort.level = nextLevel;
    resort.value = nextValue;
    resort.lastUpgradeTime = now;
    resort.imageURL = nextImageURL;
    userResorts.set(senderID, resort);
    saveUserData();

    let msg = `Congratulations! Your resort has been upgraded to level ${nextLevel}. Its value increased to ₱${nextValue}. The upgrade cost you ₱${upgradeCost}. ⬆`;
    if (nextLevel === maxResortLevel) {
      msg += " Your resort is now at the maximum level!";
    }
    return message.reply(msg);
  }

  // Handle collect command
  if (args[0] === "collect") {
    if (!userResorts.has(senderID)) {
      return message.reply(lang("resort.noResort"));
    }
    const resort = userResorts.get(senderID);
    const amount = resort.value || 0;
    if (amount <= 0) {
      return message.reply("There's no value to collect from your resort.");
    }
    await Users.increaseMoney(senderID, amount);
    resort.value = 0;
    userResorts.set(senderID, resort);
    saveUserData();
    return message.reply(`You've collected ₱${amount} from your resort! 💰`);
  }

  // Handle rename command
  if (args[0] === "rename") {
    if (!userResorts.has(senderID)) {
      return message.reply(lang("resort.noResort"));
    }
    if (args.length < 2) {
      return message.reply("Please provide a new name for your resort.");
    }
    const newName = args.slice(1).join(" ");
    const resort = userResorts.get(senderID);
    resort.name = newName;
    userResorts.set(senderID, resort);
    saveUserData();
    return message.reply(`Your resort has been renamed to "${newName}". 🏨`);
  }

  // Default: show menu
  const menuText = lang("resort.menuOptions");
  return message.reply(menuText);
}

// Load data on module load
loadUserData();

export default {
  config,
  langData,
  onCall
};
