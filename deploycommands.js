import dotenv from "dotenv";
dotenv.config();

import { REST, Routes, SlashCommandBuilder } from "discord.js";

// Define every slash command here.
const commands = [
    // /help - shows what the bot can do
    new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows what Roger Albert Dvorani can do"),

    // /ask <question> - required text option (AI powered)
    new SlashCommandBuilder()
        .setName("ask")
        .setDescription("Ask Roger Albert Dvorani anything (AI-powered)")
        .addStringOption((option) =>
            option
                .setName("question")
                .setDescription("What do you want to ask?")
                .setRequired(true)
        ),

    // /gif - sends a random gif from the list
    new SlashCommandBuilder()
        .setName("gif")
        .setDescription("Sends a random gif from the list"),
].map((command) => command.toJSON());

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

try {
    console.log("Registering GLOBAL slash commands...");

    // applicationCommands = global
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
        body: commands,
    });
    console.log("Slash commands registered successfully.");
    
} catch (err) {
    console.error(err);
}