import ComponentsBuilder from './components.js';
import {constants} from './constants.js';

export default class TerminalController{
    #usersColors = new Map();
    constructor(){}

    #pickColor(){
        return `#${((1 << 24) * Math.random() | 0).toString(16)}-fg`;
    }

    #getUserColor(userName){
        if(this.#usersColors.has(userName))
            return this.#usersColors.get(userName)

        const collor = this.#pickColor();
        this.#usersColors.set(userName, collor);

        return collor
    }

    #onInputReceived(eventEmitter){
        return function (){
            const message = this.getValue();
            console.log(message);
            this.clearValue();

        }
    }

    #onMessageReceived({screen, chat}){
        return msg => {
            const {userName, message} = msg;
            const collor = this.#getUserColor(userName);
            chat.addItem(`{${collor}}{bold}${userName}{/bold}: ${message}`);

            screen.render()
        }
    }

    #onLogChanged({screen, activityLog}){
        return msg => {
            const [userName] = msg.split(/\s/);
            const collor = this.#getUserColor(userName);
            activityLog.addItem(`{${collor}}{bold}${msg.toString()}{/bold}`);

            screen.render()
        }
    }

    #onStatusChanged({screen, status}){
        return users => {
            const {content} = status.items.shift()
            status.clearItems()
            status.addItem(content);

            users.forEach(userName => {
                const collor = this.#getUserColor(userName);
                status.addItem(`{${collor}}{bold}${userName}{/bold}`);
            })

            screen.render()
        }
    }

    #registerEvents(eventEmitter, components){
        eventEmitter.on(constants.events.app.MESSAGE_RECEIVED, this.#onMessageReceived(components))
        eventEmitter.on(constants.events.app.ACITVITYLOG_UPDATED, this.#onLogChanged(components))
        eventEmitter.on(constants.events.app.STATUS_UPDATED, this.#onStatusChanged(components))
    }

    async initializeTable(eventEmitter){
        const components = new ComponentsBuilder()
            .setScreen({title: 'HackerChat - Arthur'})
            .setLayoutComponent()
            .setInputComponent(this.#onInputReceived(eventEmitter))
            .setChatComponent()
            .setActivityLogComponent()
            .setStatusComponent()
            .build()

        this.#registerEvents(eventEmitter, components)

        components.input.focus()
        components.screen.render()
    }
}