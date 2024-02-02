# Everynyan telegram bot
## ping them fuckers

## Settings up the bot (linux + pm2)

1. First at all, install reqs:
    * Node.js v16.6.0+
    * npm that matches your node version
    * pm2
2. Copy this repo on your machine:
    * I'm recommending doing all this stuff in your /home dir
    ```bash
    git clone https://github.com/vo1ter/everynyan-telegram-bot
    ```
3. Install node.js packages
    ```bash
    cd everynyan-telegram-bot
    npm i
    ```
4. Create .env file:
    ```env
        TELEGRAM_TOKEN=your_token
    ```
5. Rename members.json.example to members.json.
6. Launch your bot with pm2:
    ```bash
    pm2 start bot.js
    ```
6. Done!

## ToDo
- [ ] Create tempmute
- [ ] Create logs on threadCreate, threadDelete, threadListSync, threadMembersUpdate, threadMemberUpdate, threadUpdate, guildMemberUpdate, /mod kick, ban, mute and tempmute
- [x] Change welcome channel id to system channel
- [x] Transfer start role id into config.json
- [ ] ~~Create reaction collector for game and rank roles~~ Irrelevant due to "insight" feature added recently to discord community servers.