import axios from "axios";

const config = {
  name: "fbcover",
  description: "Generate a Facebook cover",
  usage: "name - subname - phone - address - email - color",
  cooldown: 0,
  permissions: [0],
  usePrefix: true,
  credits: "SK-SIDDIK-KHAN"
};

async function onCall({ message, args }) {
  const apiUrl = "https://fbcover-apis.onrender.com/fbcover";
  const input = args.join(" ");
  const parts = input.split(" - ").map(x => x.trim());
  const [name, subname, phone, address, email, color] = parts;
  const id = message.senderID;

  if (parts.length < 6 || !name || !subname || !phone || !address || !email) {
    return message.reply(`❌| Wrong \n👉 Usage: ${config.usage}`);
  }

  const loadingMessage = await message.reply("⏳ Generating your Facebook cover...");

  const url = `${apiUrl}?name=${encodeURIComponent(name)}&subname=${encodeURIComponent(subname)}&address=${encodeURIComponent(address)}&email=${encodeURIComponent(email)}&sdt=${encodeURIComponent(phone)}&color=${encodeURIComponent(color || "red")}&uid=${id}`;

  try {
    const response = await axios.get(url, { responseType: "stream" });

    if (loadingMessage?.messageID) {
      global.api.unsendMessage(loadingMessage.messageID);
    }

    setTimeout(() => {
      const infoText = `✿━━━━━━━━━━━━━━━━━━✿\n🔵 𝗙𝗜𝗥𝗦𝗧 𝗡𝗔𝗠𝗘: ${name}\n⚫ 𝗦𝗘𝗖𝗢𝗡𝗗 𝗡𝗔𝗠𝗘: ${subname}\n⚪ 𝗔𝗗𝗗𝗥𝗘𝗦𝗦: ${address}\n📫 𝗠𝗔𝗜𝗟: ${email}\n☎️ 𝗣𝗛𝗢𝗡𝗘 𝗡𝗢: ${phone}\n🎇 𝗖𝗢𝗟𝗢𝗥: ${color}\n✿━━━━━━━━━━━━━━━━━━✿`;

      message.reply({
        body: infoText,
        attachment: response.data
      });
    }, 1000);

  } catch (err) {
    console.error(err);
    if (loadingMessage?.messageID) {
      global.api.unsendMessage(loadingMessage.messageID);
    }
    return message.reply("❌ Failed to generate Facebook cover");
  }
}

export default {
  config,
  onCall
};
