const config = {
  name: "link",
  version: "1.0.0",
  permission: 0,
  credits: "SK-SIDDIK-KHAN",
  description: "Get Facebook profile link",
  usePrefix: false,
  category: "utility",
  usages: "link [@mention/reply]",
  cooldowns: 5
};

async function onCall({ message }) {
  const { messageReply, senderID, mentions, type, args, reply, send } = message;

  let uid;

  if (type === "message_reply" && messageReply?.senderID) {
    uid = messageReply.senderID;
  } else if (args.join(" ").includes("@") && Object.keys(mentions).length > 0) {
    uid = Object.keys(mentions)[0];
  } else {
    uid = senderID;
  }

  if (!uid) {
    return reply("⚠️ Could not determine user ID.");
  }

  const profileLink = `https://www.facebook.com/profile.php?id=${uid}`;

  return send(`${profileLink}`);
}

export default {
  config,
  onCall
}
