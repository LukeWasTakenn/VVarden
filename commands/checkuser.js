const { func } = require('../functions.js');
const util = require('../utils.js');

const userNotInDB = (msg) => {
  // User is Good, so fake it
  bot.createMessage(msg.channel.id, {
    embed: {
      description:
      ':white_check_mark: UserID not found in Database.\nThey are either fine or not yet listed.',
      color: 0xffff00,
    },
  });
}

const userIsInDB = (userInfo, msg) => {
  // In Database
  let badType = ['blacklisted', 'permblacklisted'];
  if (badType.includes(userInfo.status)) {
    bot.createMessage(msg.channel.id, {
      embed: {
        title: ':shield: User Blacklisted',
        description: `<@${userInfo.userid}> has been seen in ${
          userInfo.servers.split(';').length
        } bad Discord servers.`,
        author: {
          name: userInfo.last_username,
          icon_url: userInfo.avatar,
        },
        thumbnail: { url: userInfo.avatar },
        color: 0x800000,
        fields: [
          // Array of field objects
          {
            name: 'User Information', // Field
            value: `**ID**: ${userInfo.userid} / **Name**: ${userInfo.last_username}`,
            inline: false, // Whether you want multiple fields in same line
          },
          {
            name: 'Blacklist Reason',
            value: `**User Type**: ${userInfo.user_type}\n**Details**: ${userInfo.reason}`,
            inline: false,
          },
          {
            name: `Added Type: ${userInfo.filter_type}`,
            value: `**Date Added**: ${func.date(userInfo.added_date)}`,
            inline: false,
          },
        ],
        footer: {
          // Footer text
          text: 'VVarden by Vampire#8144',
        },
      },
    });
  } else {
    userNotInDB(msg)
  }
}

// Checkuser
let checkuser = function () {
  bot.registerCommand(
    'checkuser',
    async (msg, args) => {
      // TODO: add validation, dev only so meh atm
      if (args.length == 1) {
        if (msg.mentions.length > 0) {
          // Mentioned user
          let userID = msg.mentions[0].id;
          let userInfo = await func.getUserFromDB(userID);
          if (!userInfo) {
            userNotInDB(msg)
          } else {
            userIsInDB(userInfo, msg)            
          }
        } else {
          let userID = args[0].charAt[0] == '<' ? util.stripID(args[0]) : args[0];

          if (!isNaN(userID)) {
            // Should be a valid ID
            let userInfo = await func.getUserFromDB(userID);
            if (!userInfo) {
              userNotInDB(msg)
            } else {
              userIsInDB(userInfo, msg)
            }
          } else {
            // Not a Number
            bot.createMessage(msg.channel.id, 'Invalid User ID or Mention.');
          }
        }
      } else {
        bot.createMessage(msg.channel.id, 'Invalid Argument Length.');
      }
    },
    {
      description: 'Check User',
      fullDescription: 'Check user database status',
      usage: 'checkuser 000000000000000',
      aliases: ['cu'],
      argsRequired: true,
    }
  );
};

module.exports = checkuser;
