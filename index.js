const { Client, GatewayIntentBits } = require('discord.js');
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    getVoiceConnection
} = require('@discordjs/voice');
const play = require('play-dl');

const TOKEN = process.env.TOKEN;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

const player = createAudioPlayer();

client.once('ready', () => {
    console.log(`${client.user.tag} Online!`);
});

client.on('messageCreate', async (msg) => {

    if (msg.author.bot) return;

    // !ping
    if (msg.content === '!ping') {
        return msg.reply('Pong!');
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

        return msg.reply('Masuk voice channel!');
    }

    // !leave
    if (msg.content === '!leave') {

        const connection = getVoiceConnection(msg.guild.id);

        if (!connection)
            return msg.reply('Bot tidak ada di voice.');

        connection.destroy();

        return msg.reply('Keluar voice channel!');
    }

    // !stop
    if (msg.content === '!stop') {

        player.stop();

        return msg.reply('Musik dihentikan.');
    }

    // !play LINK
    if (msg.content.startsWith('!play ')) {

        if (!msg.member.voice.channel)
            return msg.reply('Masuk voice channel dulu!');

        const url = msg.content.split(' ')[1];

        const connection = joinVoiceChannel({
            channelId: msg.member.voice.channel.id,
            guildId: msg.guild.id,
            adapterCreator: msg.guild.voiceAdapterCreator
        });

        try {

            const stream = await play.stream(url);

            const resource = createAudioResource(stream.stream, {
                inputType: stream.type
            });

            player.play(resource);

            connection.subscribe(player);

            msg.reply('Memutar musik...');

        } catch (err) {

            console.log(err);

            msg.reply('Gagal memutar lagu.');
        }
    }

});

client.login(TOKEN);
