const {links} = require('../config.json');
const availableLinks = links;
const Discord = require('discord.js');

module.exports = {
    name: "ad",
    description: "Gives you a link.",
    modOnly: false,
    cooldown: 120,
    execute(msg, args, client){
        const user = msg.author;
        //If no links available, leave
        if(availableLinks.length < 1){
            msg.channel.send("We have run out of usable links! Please try again in a few hours.");
            return;
        }

        //Get a random link
        const randNum = Math.floor(Math.random()*(availableLinks.length));
        const newLink = availableLinks[randNum];
        const indexOfLink = availableLinks.indexOf(newLink);

        //Send messages and delete them
        msg.delete();
        const embed = new Discord.MessageEmbed()
                                .setColor('#ffff00')
                                .setTitle('AD')
                                .setDescription(`${user} used ${newLink}.`);
        msg.channel.send(`${user}, your link: ${newLink}`).then(sentMsg => sentMsg.delete({timeout:60000}));
        client.channels.fetch('712959606552526938').then(c => c.send(embed));
        //Removes the sent link from the links user will be able to use.
        availableLinks.splice(indexOfLink, 1);
        console.log(availableLinks.length);
        setTimeout(() => {
            availableLinks.push(newLink);
            console.log(availableLinks.length);
        }, 1000 * 60 * 60 * 10);
    }
}