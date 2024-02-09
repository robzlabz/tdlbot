import axios from 'axios';
import dotenv from 'dotenv';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();
const token = process.env.TELEGRAM_BOT_TOKEN || '';
const igDownloadUrl = process.env.IG_DOWNLOAD_URL;
const bot = new TelegramBot(token, {polling: true});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    console.log('Received a message:', text);

    const instagramUrl = text.match(/https:\/\/www\.instagram\.com\/(p|reel)\/\w+\//);
    if (instagramUrl) {
        console.log('Instagram URL detected:', instagramUrl[0]);

        try {
            const response = await axios.get(`${igDownloadUrl}/api/video?url=${instagramUrl[0]}`);
            const videoUrl = response.data.data.videoUrl;
            await bot.sendMessage(chatId, 'Here is your video: ' + videoUrl);
        } catch (error) {
            console.error('An error occurred:', error);
            bot.sendMessage(chatId, 'An error occurred while processing your request.');
        }
    } else {
        console.log('No Instagram URL detected in message.');
        bot.sendMessage(chatId, 'Please enter the Instagram link you want to download. For example, https://www.instagram.com/p/BvQjgKClbv_/');
    }
});