'use strict';

const dgram = require('dgram');
const readline = require('readline');
const ip = require('ip');

const myIP = ip.address();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let inbound;
let outbound;

if (process.env.TEST_MODE) {
  inbound = process.env.TEST_MODE == 1 ? 3000 : 4000;
  outbound = process.env.TEST_MODE == 1 ? 4000 : 3000;
} else {
  inbound = 3000;
  outbound = 3000;
}

const { parse_message, build_message, print, log } = require('./utils');

void (async function() {
  const socket = dgram.createSocket('udp4');

  socket.on('error', err => {
    console.error('Error with socket connection: %s', err.message);
    process.exit(1);
  });

  await new Promise(resolve => socket.bind(inbound, resolve));

  const socketInfo = socket.address();
  socket.setBroadcast(true);

  const username = await new Promise(resolve => rl.question('Enter your username: ', resolve));
  const join = build_message({ message: 'joining', command: 'JOIN', username });
  socket.send(join, outbound, '255.255.255.255');

  socket.on('message', buffer => {
    const msg = parse_message(buffer);
    if (msg.command === 'JOIN') {
      const ping = build_message({ message: '/ping', command: 'PING', username });
      socket.send(ping, outbound, '255.255.255.255');
    }
    if (msg) {
      print(msg);
    }
  });

  rl.on('line', message => {
    if (/^\/who$/.test(message)) {
      const buffer = build_message({ username, message, command: 'WHO' });
      socket.send(buffer, socketInfo.port, myIP);
      return console.log();
    }

    if (/^\/leave$/.test(message)) {
      const buffer = build_message({ username, message, command: 'LEAVE' });
      socket.send(buffer, outbound, '255.255.255.255');
      const buffer2 = build_message({ username, message: '/quit', command: 'QUIT' });
      socket.send(buffer2, socketInfo.port, myIP);
      return console.log();
    }

    const buffer = build_message({ username, message, command: 'TALK' });
    socket.send(buffer, outbound, '255.255.255.255');
    console.log();
  });
})();
