'use strict'

const dgram = require('dgram')

const socket = dgram.createSocket('udp4')
// socket.setBroadcast(true)

socket.on('listening', () => console.log('Listening'))

socket.on('message', (msg, rinfo) => {
  console.log('Recieved msg:', msg.toString());
  console.log('rInfo:', rinfo)
})

socket.bind(3000)
