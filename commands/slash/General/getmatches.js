const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const moment = require('moment');
const cron = require('cron');
const client = require('../../../index');
const guild = require('../../../config/guild');
require('dotenv').config();

const { API_URL } = process.env;
const matchLink = `${API_URL}/v1/vlr/matches/today`;

const VCTNA = [
  'NRG Esports',
  'MIBR',
  'Cloud9',
  'FURIA',
  'LOUD',
  'Leviatán',
  'Sentinels',
  '100 Thieves',
  'Evil Geniuses',
  'G2 Esports',
  'KRÜ Esports',
  '2GAME Esports',
];
const VCTEU = [
  'Team Heretics',
  'Karmine Corp',
  'FUT Esports',
  'GIANTX',
  'Natus Vincere',
  'KOI',
  'Team Liquid',
  'BBL Esports',
  'FNATIC',
  'Team Vitality',
  'Gentle Mates',
  'Apeks',
];
const VCTPA = [
  'T1',
  'ZETA DIVISION',
  'Global Esports',
  'BLEED',
  'DRX',
  'Team Secret',
  'Talon Esports',
  'DetonatioN FocusMe',
  'Paper Rex',
  'Gen.G',
  'Rex Regum Qeon',
  'BOOM Esports',
  'Nongshim RedForce',
];
const VCTCN = [
  'Trace Esports',
  'TYLOO',
  'FunPlus Phoenix',
  'Nova Esports',
  'JD Gaming',
  'Titan Esports Club',
  'Dragon Ranger Gaming',
  'All Gamers',
  'EDward Gaming',
  'Bilibili Gaming',
  'Wolves Esports',
  'XLG Esports',
];
const VCTList = VCTNA.concat(VCTEU).concat(VCTPA).concat(VCTCN);

function convertTimeToDatetime(matchTime) {
  const today = new Date().toISOString().slice(0, 10);
  const time = moment(matchTime, ['h:mm A']).format('HH:mm:ss');
  return `${today}T${time}`;
}

function MatchIsWithin24Hours(eta) {
  return !eta.includes('d') && !eta.includes('w') && eta !== '';
}

async function SplitMatches(allMatches) {
  const matchArr = [];
  for (let i = 0; i < allMatches.length; i++) {
    const tl = allMatches[i].team_one_name;
    const tr = allMatches[i].team_two_name;
    const time = allMatches[i].match_time;
    const tour = allMatches[i].event_name;
    const countdown = allMatches[i].eta;

    // T1 teams only
    if ((VCTList.includes(tl) || VCTList.includes(tr)) && MatchIsWithin24Hours(countdown)) {
      matchArr.push({
        teamleft: tl, teamright: tr, matchTime: convertTimeToDatetime(time), tourney: tour,
      });
    }
  }
  return matchArr;
}

// clear channel of previous day's messages
async function ClearChat(channel) {
  const messageManager = channel.messages;
  const messages = await messageManager.channel.messages.fetch({ limit: 100 });
  channel.bulkDelete(messages, true);
}

function MessageBuilder(channel) {
  axios.get(matchLink).then(async (matchResp) => {
    const matchArr = await SplitMatches(matchResp.data.matches);
    if (matchArr.length > 0) {
      channel.setTopic('Here are the upcoming featured matches today.');
      matchArr.forEach((match) => {
        channel.send({
          embeds: [new EmbedBuilder()
            .setColor('Green')
            .setTitle(`${match.teamleft} vs. ${match.teamright}`)
            .setDescription(`<t:${Date.parse(match.matchTime) / 1000}:F>\n${match.tourney}`),
          ],
        });
      });
    } else {
      channel.setTopic('There are no featured matches today :(');
    }
  });
}

function GetMatches() {
  const channel = client.channels.cache.get(guild.Channels.OnlyFrogs.matchesText);
  ClearChat(channel);
  MessageBuilder(channel);
}

// runs once a day at specified time 'SS MM HH' - 00:01 default
client.once('ready', () => {
  const scheduledEvent = new cron.CronJob('00 01 00 * * *', () => {
    GetMatches();
  });
  scheduledEvent.start();
});

module.exports = {
  name: 'getmatches',
  description: 'Populates the matches channel',
  type: 1,
  options: [],
  permissions: {
    DEFAULT_MEMBER_PERMISSIONS: 'SendMessages',
  },
  run: async (runClient, interaction, config, db) => {
    GetMatches();
    return interaction.reply({
      content: 'Getting matches...',
      ephemeral: true,
    });
  },
};
