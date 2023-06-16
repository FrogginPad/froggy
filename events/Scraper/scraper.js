const { EmbedBuilder } = require('discord.js');
const axios = require('axios');
const cheerio = require('cheerio');
const cron = require('cron');
const client = require('../../index');

module.exports = {
  name: 'scraper.js',
}; 

//returns an list containing the strings of both ongoing and upcoming tournies
function TourneyBuilder(data) {
  const $ = cheerio.load(data);
  const allTournies = $('#bodyContent').text().split('Completed')[0].split('Upcoming')[1].split('Ongoing');
  const upcomingTournies = SplitTourneyStrings(allTournies[0]);
  const ongoingTournies = SplitTourneyStrings(allTournies[1]);
  let tourneyArr = [];

  upcomingTournies.forEach((item) => {
    tourneyArr.push(item.split('|')[1].trim());
  });
  ongoingTournies.forEach((item) => {
    tourneyArr.push(item.split('|')[1].trim());
  });
  return tourneyArr;
};

function SplitTourneyStrings(tourneyArr) {
  return tourneyArr.split('\n').filter((item) => { return item != '' });
}

//returns a list of featured matches that occur within 24 hours of the job
async function MatchBuilder(matchData, tourneyData) {
  const $ = cheerio.load(matchData);
  const allMatches = $('table.wikitable.wikitable-striped.infobox_matches_content').text().split('\n').filter((item) => { return item != '' });
  const matchArr = SplitMatchStrings(allMatches);
  const today = new Date();

  //filter matches down to featured tournies and same day
  //reduce duplicates (ty liquipedia)
  return matchArr
    .filter((match) => {
      return tourneyData.includes(match.tourney) && 
      MatchIsWithin24Hours(today, match.matchTime) && 
      match.matchFormat.startsWith('Bo');
    })
    .reduce((unique, o) => {
      if(!unique.some(obj => obj.teamleft === o.teamleft && obj.teamright === o.teamright && obj.matchTime.toString() === o.matchTime.toString())) {
        unique.push(o);
      };
      return unique;
    },[]);  
};

function SplitMatchStrings(allMatches) {
  let matchArr = [];
  for (i = 0; i < allMatches.length; i++) {
    if(i % 4 === 0){
        let tl = allMatches[i].trim();
        let mf = allMatches[i+1].replace(/[vs()]/g,'').slice(-3);
        let tr = allMatches[i+2].trim();
        let time = new Date(allMatches[i+3].split(' UTC')[0].replace(' -', '').concat(' UTC'));
        let tour = allMatches[i+3].split(' UTC')[1];
        matchArr.push({teamleft: tl, matchFormat: mf, teamright: tr, matchTime: time, tourney: tour});
    }
  } 
  return matchArr;
}

function MatchIsWithin24Hours(today, matchTime) {
  return matchTime.getTime() < today.getTime() + (24 * 60 * 60 * 1000)
};

function MessageBuilder(channel) {
  axios.get('https://liquipedia.net/valorant/Liquipedia:Tournaments').then(tourneyResp => {
    axios.get('https://liquipedia.net/valorant/Liquipedia:Matches').then(async matchResp => {
      const matchArr = await MatchBuilder(matchResp.data, TourneyBuilder(tourneyResp.data));
      if (matchArr.length > 0) {
        channel.send({
          embeds: [new EmbedBuilder()
          .setColor('Green')
          .setTitle('Matches for today')
          ]
        });
        console.log('Matches scraped: ', matchArr);
        matchArr.forEach((match) => {
          channel.send({
            embeds: [new EmbedBuilder()
            .setColor('Green')
            .setTitle(match.teamleft + ' vs. ' + match.teamright)
            .setDescription('<t:'+ Date.parse(match.matchTime)/1000 + ':F>' + '\n' + match.tourney)
            ]
          })
        });
      } else {
        channel.send({
          embeds: [new EmbedBuilder()
          .setColor('Green')
          .setTitle('No matches today :(')
          ]
        });
      }
    });
  });
}

//clear channel of previous day's messages
async function ClearChat (channel, amountToDelete) {
  const messageManager = channel.messages;
  const messages = await messageManager.channel.messages.fetch({ limit: amountToDelete });
  channel.bulkDelete(messages,true);

}

//runs once a day at specified time 'SS MM HH' - 06:00 default
client.once('ready', () => {
  const channel = client.channels.cache.find(
    channel => channel.name.toLowerCase() === "matches-for-today"
  )
  let scheduledEvent = new cron.CronJob('00 00 06 * * *', () => {
    ClearChat(channel, 100);
    MessageBuilder(channel);
  });
  scheduledEvent.start()
});
