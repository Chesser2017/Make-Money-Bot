const {codes} = require('../config.json');
const availableCodes = codes;
const Discord = require('discord.js');

module.exports = {
    name: "code",
    description: "Gives you points.",
    modOnly: false,
    cooldown: 0,
    execute(msg, args, client){
        const code = args[1];
        //If user's code doesn't exist/is invalid
        if(!codes.includes(code)){
            msg.channel.send(`The code you sent has already been used, or is invalid.`);
            return;
        }
        //If there are no usable codes
        if(availableCodes.length<1){
            msg.channel.send("We have run out of usable codes!");
            return;
        }
        //Send messages and delete them
        msg.delete();
        const embed = new Discord.MessageEmbed()
                                .setColor('#00ff00')
                                .setTitle('CODE')
                                .setDescription(`${user} used ${code}.`);
        msg.channel.send(`${user} you earned 25 <:Infonium:633993157108826112> `).then(sentMsg => sentMsg.delete({timeout:60000}));
        client.channels.fetch('822559862574678027').then(c => c.send(embed));
        client.channels.fetch('822559862574678027').then(c => c.send(`${user} +25 <:Infonium:633993157108826112> `));
        //Removes the sent code from the codes user will be able to use.
        availableCodes.splice(availableCodes.indexOf(code), 1);
        setTimeout(() => {
            availableCodes.push(code);
            console.log(availableCodes.length);
        }, 10000); //9 hours and 55 min
    }
}
