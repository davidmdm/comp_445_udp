'use strict'

const dgram = require('dgram')

const socket = dgram.createSocket('udp4')
// socket.setBroadcast(true)

socket.on('listening', () => console.log('Listening'))

const data = Buffer.from('Hello');
socket.send(data, 3000);