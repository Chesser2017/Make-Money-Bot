const Discord = require('discord.js');
const fs = require('fs');
const {codes} = require('./config.json');
const availableCodes = codes;
const {prefix, token} = require('./config.json');

const cooldowns = new Discord.Collection();
const client = new Discord.Client();
client.commands = new Discord.Collection();
const userBot = new Discord.Client();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for(const file of commandFiles){
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    client.user.setActivity(`${prefix}help-ads`, {type: "PLAYING"});
    console.log('ready');
})

client.on('message', msg => {
    if(msg.author.bot || !msg.content.startsWith(prefix) || !msg.guild) return;

    const arguments = msg.content.slice(prefix.length).split(/ +/);
    const commandName = arguments[0];

    const code = arguments[0];
    if(codes.includes(code)){
        //If there are no usable codes
        if(availableCodes.length < 1){
            msg.channel.send("You have run out of usable codes!");
            return;
        }
        //Send messages and delete them
        msg.delete();
        const embed = new Discord.MessageEmbed()
                                .setColor('#00FF0')
                                .setTitle('CODE')
                                .setDescription(`${msg.author} used ${code}.`);
        msg.channel.send(`${msg.author} you earned 250 pancakes!`).then(sentMsg => sentMsg.delete({timeout:60000}));
        client.channels.fetch('712959606552526938').then(c => c.send(embed));
        client.channels.fetch('712711521590968350').then(c => c.send(`p!addbalance 250 ${msg.author}`));
        userBot.channels.fetch('712711521590968350').then(c => c.send(`p!addbalance 250 ${msg.author}`));
        //Removes the sent code from the codes user will be able to use.
        availableCodes.splice(availableCodes.indexOf(code), 1);
        setTimeout(() => {
            console.log(availableCodes.length);
            availableCodes.push(code);
            console.log(availableCodes.length);
        }, (1000 * 60 * 60 * 9) + (1000*60*55)); //9 hours and 55 min
    }
    


    const command = client.commands.get(commandName) 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if(!command) return;
    if(command.modOnly && !msg.member.hasPermission('MANAGE_ROLES')){
        return msg.reply(` you do not have the permissions for that message!`)
    }
    if(!cooldowns.has(command.name)){
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 0) * 1000;

    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return msg.reply(`please wait ${Math.round(timeLeft.toFixed(1))} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(msg.author.id, now);
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
    try{
        command.execute(msg, arguments, client);
    }catch{
        console.log("There was an error.");
    }
})

client.login(process.env.BOT_TOKEN);
userBot.login(process.env.USER_TOKEN);