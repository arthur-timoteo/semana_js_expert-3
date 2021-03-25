import Events from 'events';
import CliConfig from './src/cliConfig.js';
import SocketClient from './src/socket.js';
import TerminalController from "./src/terminalController.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);
// console.log('config', config);

const componentEmitter = new Events();
const socketClient = new SocketClient(config)
await socketClient.initialize()

// const constroller = new TerminalController();
// await constroller.initializeTable(componentEmitter);