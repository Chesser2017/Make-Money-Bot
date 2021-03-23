module.exports = {
    name: "help-ads",
    description: "Shows how to make real coins.",
    modOnly: false,
    cooldown: 120,
    execute(msg, args){
        const user = msg.author;
        msg.channel.send(`**${user}, If you want to make real coins, follow these steps:**\n\n**1)** Type **!ad** in the Chat!\n**2)** Click on the Link\n**3)** Watch the AD and click Discover interesting articles then press on the X up-right\n**4)** After this you will be forwarded to a Website\n**5)** Copy the Code you see and paste it in TDiscord Channel`);

    }
}
