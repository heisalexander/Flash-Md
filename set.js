const fs = require('fs-extra');
const path = require("path");
const { Sequelize } = require('sequelize');

// Load environment variables if the .env file exists
if (fs.existsSync('set.env')) {
    require('dotenv').config({ path: __dirname + '/set.env' });
}

const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined ? databasePath : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'FLASH-MD-WA-BOT;;;=>eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiU1BJMGhnL0JXMGM3b1NVMFRqd2R6MTlxdktxRzVDOStPcDNnODBMNWlsRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK203b3IvRWdHN3RiRldsU1JnK0ZpVFdkYUUxWDZhTkNFL29KTk5vVHREcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1RlJHTHk1L244aEx1SmgwS096bFZIRUU5R3dyY09pcE9DdC9iZlBnbkUwPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIxRGU2Y3RqcGtlb1lUUW5UbXhxd2lXTWNhdzVrK1VPc1BLcGxUL285Y25JPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkdBcnhFOVVTbGtrSTA4OFF6SE9hUGx3ZXNQR3l4bW5ibkhlU2ZnMkJybTg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjIybk5XMjRXY3hxc09UcjM1bUZjRkZzOVBUT3RRNDg0RXNQSTZFZk0xamM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiT0NxT2FPUlRJRzJDYXFTTFFheE5NZjdvMllGcWdjc3JISXNrQzV2a0IxND0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSm15L2lwQkZrNWI4ck9tK015RnZ2WVkySTNiWWRERnplNjdzNnNKQ3dDQT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpDKzVpUlhsN211N25jUmQzdG5wWDM0elRXL3VLUmdQU1pxaEZmeVg2OFIxaDVwR1RnVDFTQVdmKzlteVU3VFhQcjk3ZU5CdHRmN2R2MGdiVUN1ZkNRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTAzLCJhZHZTZWNyZXRLZXkiOiJjeVpGRUM4dmRPN2J4VXdXUWxvZ3VyNExCam1jd0c5TmZXZGNlbHNkRU9nPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6NjEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjo2MSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJuV3d6WnJ0blJMQ2dseU1LN2dFTHR3IiwicGhvbmVJZCI6IjkxZGY4MDk3LTllY2EtNGQ5NS05ZmQxLTY3YzNkNzJhMDkwYiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJmVFlZTFJxNk95dHNhRVVwM2FBQ21lUWRpckU9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWnRSQlJZbkN5SmdBV0VBb2tXd3ovL01NSjdVPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Iks4SEw5UFozIiwibWUiOnsiaWQiOiIyMzQ5MDI0NTUzNjEyOjM3QHMud2hhdHNhcHAubmV0In0sImFjY291bnQiOnsiZGV0YWlscyI6IkNQekU0SVlDRUlpdmg3c0dHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJpZEQvTTQrOU5VSThhT2ZXTGhDd1RyRnJzQ09OWnU3angwZTBsNHNuZnpjPSIsImFjY291bnRTaWduYXR1cmUiOiJiS1Q1KzR1MTdmanBWczk4ZHQvRzFma3NxdDFVTVU3Zk1wc2E5ZVl3ODlWQk0xcWJKMlFGczFrY2d0cCtNMmxyOXFuZzN5UUdDV2tZZlhJNGVlL1lBdz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiSm4xM083c3E3cTEwcXNsZDVjVE1hbDdLa2RzYUF2VThpckhraGtlTG1hTXVSSXVCU3hMK2syRTlJSjdUMTFpTmR2ZUR3WGdtMHlDYVNkNnQzNm9QRHc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyMzQ5MDI0NTUzNjEyOjM3QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlluUS96T1B2VFZDUEdqbjFpNFFzRTZ4YTdBampXYnU0OGRIdEplTEozODMifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3MzQ0NjU0MzEsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBS3BWIn0=',
    PREFIXES: (process.env.PREFIX || '').split(',').map(prefix => prefix.trim()).filter(Boolean),
    OWNER_NAME: process.env.OWNER_NAME || "France King",
    OWNER_NUMBER: process.env.OWNER_NUMBER || "2349024553612",
    AUTO_READ_STATUS: process.env.AUTO_VIEW_STATUS || "on",
    AUTOREAD_MESSAGES: process.env.AUTO_READ_MESSAGES || "off",
    CHATBOT: process.env.CHAT_BOT || "off",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_SAVE_STATUS || 'off',
    A_REACT: process.env.AUTO_REACTION || 'off',
    L_S: process.env.STATUS_LIKE || 'off',
    AUTO_BLOCK: process.env.BLOCK_ALL || 'off',
    URL: process.env.MENU_LINKS || 'https://files.catbox.moe/c2jdkw.jpg',
    MODE: process.env.BOT_MODE || "private",
    PM_PERMIT: process.env.PM_PERMIT || 'on',
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    WARN_COUNT: process.env.WARN_COUNT || '3',
    PRESENCE: process.env.PRESENCE || '',
    ADM: process.env.ANTI_DELETE || 'on',
    TZ: process.env.TIME_ZONE || 'Africa/Nairobi',
    DP: process.env.STARTING_MESSAGE || "on",
    ANTICALL: process.env.ANTICALL || 'on',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd"
        : "postgresql://flashmd_user:JlUe2Vs0UuBGh0sXz7rxONTeXSOra9XP@dpg-cqbd04tumphs73d2706g-a/flashmd",
    W_M: null, // Add this line
};

// Watch for changes in this file and reload it automatically
const fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Updated ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
