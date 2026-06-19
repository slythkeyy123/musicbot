const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

const TOKEN = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.once('ready', () => {
    console.log(`${client.user.tag} Online!`);
});

client.on('messageCreate', msg => {

    if (msg.author.bot) return;

    // !ping
    if (msg.content === '!ping') {
        msg.reply('Pong!');
    }

    // !join
    if (msg.content === '!join') {

        if (!msg.member.voice.channel)
            return msg.reply('Masuk voice channel dulu!');

        joinVoiceChannel({
            channelId: msg.member.voice.channel.id,
            guildId: msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator
        });

        msg.reply('Masuk voice channel!');
    }

    // !leave
    if (msg.content === '!leave') {

        const connection = getVoiceConnection(msg.guild.id);

        if (!connection)
            return msg.reply('Bot tidak ada di voice channel.');

        connection.destroy();

        msg.reply('Keluar dari voice channel!');
    }

});

client.login(TOKEN);
