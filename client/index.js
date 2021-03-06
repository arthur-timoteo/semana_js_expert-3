#!/usr/bin/env node

/*
    chmod +x index.js
*/

/*
bash node index.js
npm i -g @arthurtimoteo/hacker-chat-client
npm unlink -g @arthurtimoteo/hacker-chat-client
hacker-chat \
    --username arthur \
    --room sala01 \

./index.js \
    --username arthur \
    --room sala01 \

node index.js \
    --username arthur \
    --room sala01 \
    --hostUri localhost
*/

import Events from 'events';
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socket.js';
import TerminalController from "./src/terminalController.js";
import EventManager from './src/eventManager.js'

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

const componentEmitter = new Events();
const socketClient = new SocketClient(config)
await socketClient.initialize()
const eventManager = new EventManager({ componentEmitter, socketClient})
const events = eventManager.getEvents()
socketClient.attachEvents(events)
const data = {
    roomId: config.room,
    userName: config.username
}
eventManager.joinRoomAndWairForMessages(data)
const constroller = new TerminalController();
await constroller.initializeTable(componentEmitter);