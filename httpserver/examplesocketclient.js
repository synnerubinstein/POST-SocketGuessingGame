
//Importer Socket.io klient
const io = require('socket.io-client')
const socket = io('http://localhost:3000');

let brukernavn = 'moskito'
let svar = '3asdasdasd'


socket.on('connect', () => {
    console.log('connected')
})

socket.emit('usr&response', {brukernavn, svar})

