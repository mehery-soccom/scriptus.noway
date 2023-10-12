const EventEmitter = require('events');
const myEmitter = new EventEmitter();


module.exports = {
    on(eventname,listner){
        return myEmitter.on(eventname,listner)
    },
    emit(eventname,data){
        return myEmitter.emit(eventname,data)
    }
}