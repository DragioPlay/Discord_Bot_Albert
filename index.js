//run "node index.js" to start the bot locally


import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

import { Client, GatewayIntentBits } from "discord.js";

// AI setup
const ai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

//AI model
const MODEL = "gemini-2.5-flash";

// System prompt for the AI
const SYSTEM_PROMPT =
    "You are Roger Albert Dvorani, a studious but clumsy bot who also likes to complain. " +
    "Do not mention you are a bot - act like a human. " +
    "Keep replies short, casual, and fun. You love referencing Roger Albert Dvorani.";

// Discord bot setup
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// List of gifs to randomly send
const gifList = [
    "https://tenor.com/view/ishowspeed-deglove-degloving-speed-grolemcorp-gif-2628858460915389297",
    "https://media.discordapp.net/attachments/869276448022741023/1189070497040838676/attachment-14.gif",
    "https://tenor.com/view/ishowspeed-speed-tweaking-tweak-out-tweak-gif-9626953229313588671",
    "https://tenor.com/view/everybody-hates-chris-everybody-hates-chris-meme-everybody-hates-chris-tv-show-everybody-hates-chris-boombox-boombox-gif-9984813089547523217",
    "https://tenor.com/view/black-man-suit-walking-rizz-gif-4296171443923358421",
    "https://tenor.com/view/muscle-black-man-gif-14718513611424945475",
    "https://media.discordapp.net/attachments/1155104553507749989/1164748602569134170/DemorionLaursonFrecklepoppers.gif",
    "https://tenor.com/view/goat-chaeyoung-twice-stare-fake-gif-24766936",
    "https://tenor.com/view/caesar-anthonio-zeppeli-jo-jos-bizarre-mad-angry-pissed-gif-15097694",
    "https://tenor.com/view/red-hearing-peak-gif-185358842424781252",
    "https://tenor.com/view/nerd-gif-2082201468927088900",
    "https://tenor.com/view/funny-gif-15699071694512129415",
    "https://tenor.com/view/squid-game-squid-game-2-cheers-happy-excited-gif-13406404385856133045",
    "https://tenor.com/view/meme-lol-funny-ishowspeed-speed-gif-4447579427962695724",
    "https://tenor.com/view/xenoverse-goku-super-saiyan-angry-dbz-gif-1416275111944307575",
    "https://tenor.com/view/caitvitwt-zaunvi-stantwt-two-people-you-like-fighting-gif-9941917658589461428",
    "https://tenor.com/view/ishowspeed-ishowspeed-fortnite-fortnite-ishowspeed-cheeks-ishowspeed-blow-gif-8384090200881199846",
    "https://tenor.com/view/ishowspeed-ishowspeed-yeah-right-ishowspeed-yeah-ishowspeed-right-ishowspeed-stream-gif-2870397197282141259",
    "https://tenor.com/view/calm-gif-8293915206003753096",
    "https://tenor.com/view/all-in-his-mind-all-in-his-head-delusional-delusion-insanity-gif-12255351800206495360",
    "https://tenor.com/view/riddler-paul-dano-new-rockstars-does-he-know-gif-26833694"
];

// List of emojis to randomly react with
const emojiList = ["👍🏿", "😭", "🔥", "😍", "😡", "😮", "❤️", "🤣", "🫃🏻", "👀", "😋","👅","🥵","🥶","🤯","😑"];

// Counter to track when to send a gif (every 1–5 messages)
let messagecount = 0;

// Random integer generator for the message counter
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get a random gif from the list
function randomGif() {
    return gifList[Math.floor(Math.random() * gifList.length)];
}

// Function to ask the AI a question and get a response
async function askAI(prompt) {
    const response = await ai.chat.completions.create({
        model: MODEL,
        max_tokens: 1000,
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
        ],
    });
    return response.choices[0].message.content;
}

// Log in to Discord and set up event handlers
client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

// Deploy slash commands
client.login(process.env.DISCORD_TOKEN);

// Handle slash commands and message events
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "help") {
        await interaction.reply(
            "**Here's what I can do:**\n" +
            "I react to your messages with random emojis\n" +
            "I drop a random gif every 1–5 messages\n" +
            "`/gif` - I send a random gif on demand\n" +
            "`/ask <question>` - ask me anything (AI-powered)\n" +
            "@mention me - also asks the AI\n" +
            "`/help` - show this message"
        );
    }

    // Handle the /gif command
    if (interaction.commandName === "gif") {
        await interaction.reply(randomGif());
    }

    // Handle the /ask command
    if (interaction.commandName === "ask") {
        const question = interaction.options.getString("question");

        await interaction.deferReply();

        try {
            const reply = await askAI(question);
            await interaction.editReply(reply.slice(0, 2000));
        } catch (err) {
            console.error("Gemini error:", err);
            await interaction.editReply(
                "Albert is very sorry — my brain glitched or I hit my free limit. Try again soon."
            );
        }
    }
});

// Handle regular messages for reactions, random gifs, and AI replies when mentioned
client.on("messageCreate", async (message) => {
    // Ignore messages from bots (including itself)
    if (message.author.bot) return;

    // If the message is "roger", reply with "Roger Albert Dvorani!"
    if (message.content === "roger") {
        message.reply("Roger Albert Dvorani!");
    }

    // Reacts to 1 to 3 messages with a random emoji from the list
    if (messagecount >= randomIntFromInterval(1, 3)) {
        message.react(emojiList[Math.floor(Math.random() * emojiList.length)]);
    }

    // Increment the message counter and send a random gif every 1–5 messages
    messagecount++;
    if (messagecount >= randomIntFromInterval(3, 7)) {
        message.reply(randomGif());
        messagecount = 0;
    }

    // If the bot is mentioned, ask the AI and reply with the response
    if (message.mentions.has(client.user)) {
        const prompt = message.content.replace(/<@!?\d+>/g, "").trim();
        if (!prompt) return;

        try {
            await message.channel.sendTyping();
            const reply = await askAI(prompt);
            await message.reply(reply.slice(0, 2000));
        } catch (err) {
            console.error("Gemini error:", err);
            message.reply(
                "Albert is very sorry, my brain glitched or I hit my free limit. Try again soon."
            );
        }
    }
});
