const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('cron');
const client = require('../../../index');
const guild = require('../../../config/guild');

const tourneyLink = 'https://liquipedia.net/valorant/Liquipedia:Tournaments';
const matchLink = 'https://liquipedia.net/valorant/Liquipedia:Matches';
const liquipediaIsBad = [
  'VCT 2024: Pacific Kickoff',
  'VCT 2024: Americas Kickoff',
  'VCT 2024: EMEA Kickoff',
  'VCT 2024: China Kickoff'
];

function SplitTourneyStrings(tourneyArr) {
  return tourneyArr.split('\n').filter((item) => item !== '');
}

// returns an list containing the strings of both ongoing and upcoming tournies
function TourneyBuilder(data) {
  const $ = cheerio.load(data);
  const allTournies = $('#bodyContent').text().split('Completed')[0].split('Upcoming')[1].split('Ongoing');
  const upcomingTournies = SplitTourneyStrings(allTournies[0]);
  const ongoingTournies = SplitTourneyStrings(allTournies[1]);
  const tourneyArr = [];

  upcomingTournies.forEach((item) => {
    tourneyArr.push(item.split('|')[1].trim());
  });
  ongoingTournies.forEach((item) => {
    tourneyArr.push(item.split('|')[1].trim());
  });
  liquipediaIsBad.forEach((item) => {
    tourneyArr.push(item);
  });
  return tourneyArr;
}

function SplitMatchStrings(allMatches) {
  const matchArr = [];
  for (let i = 0; i < allMatches.length; i++) {
    if (i % 4 === 0) {
      const tl = allMatches[i].trim();
      const mf = allMatches[i + 1].replace(/[vs()]/g, '').slice(-3);

      // stops building objects once reaching completed matches (2:1, 0:3, etc.)
      if (!(mf.startsWith('Bo') || mf === '')) { break; }
      const tr = allMatches[i + 2].trim();
      const time = new Date(allMatches[i + 3].split(' UTC')[0].replace(' -', '').concat(' UTC'));
      const tour = allMatches[i + 3].split(' UTC')[1];
      matchArr.push({
        teamleft: tl, matchFormat: mf, teamright: tr, matchTime: time, tourney: tour,
      });
    }
  }
  return matchArr;
}

function MatchIsWithin24Hours(today, matchTime) {
  return matchTime.getTime() < today.getTime() + (24 * 60 * 60 * 1000);
}

// returns a list of featured matches that occur within 24 hours of the job
async function MatchBuilder(matchData, tourneyData) {
  const $ = cheerio.load(matchData);
  const allMatches = $('table.wikitable.wikitable-striped.infobox_matches_content').text().split('\n').filter((item) => item !== '');
  const matchArr = SplitMatchStrings(allMatches);
  const today = new Date();

  // filter matches down to featured tournies and same day
  // trim tourney strings to everything before ' - ' in cases of group/swiss/etc. stages
  return matchArr
    .filter((match) => tourneyData.includes(match.tourney.split(' - ')[0])
      && MatchIsWithin24Hours(today, match.matchTime))
    .reduce((unique, o) => {
      if (!unique.some((obj) => obj.teamleft === o.teamleft && obj.teamright === o.teamright && obj.matchTime.toString() === o.matchTime.toString())) {
        unique.push(o);
      }
      return unique;
    }, []);
}

// clear channel of previous day's messages
async function ClearChat(channel) {
  const messageManager = channel.messages;
  const messages = await messageManager.channel.messages.fetch({ limit: 100 });
  channel.bulkDelete(messages, true);
}

function MessageBuilder(channel) {
  axios.get(tourneyLink).then((tourneyResp) => {
    axios.get(matchLink).then(async (matchResp) => {
      const matchArr = await MatchBuilder(matchResp.data, TourneyBuilder(tourneyResp.data));
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
  });
}

function GetMatches() {
  const channel = client.channels.cache.get(guild.Channels.OnlyFrogs.matchesText);
  ClearChat(channel);
  MessageBuilder(channel);
}

// runs once a day at specified time 'SS MM HH' - 04:00 default
client.once('ready', () => {
  const scheduledEvent = new cron.CronJob('00 00 04 * * *', () => {
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
