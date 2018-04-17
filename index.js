'use strict';

const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const inbound = process.env.TEST_MODE == 1 ? 3000 : 4000;
const outbound = process.env.TEST_MODE == 1 ? 4000 : 3000;

const { parse_message, build_message, print, log } = require('./utils');

void (async function() {
  const socket = dgram.createSocket('udp4');

  const err = await new Promise(resolve => socket.bind(inbound, resolve));
  if (err) {
    console.error('could not create socket: %s', err.message);
    process.exit(1);
  }

  socket.setBroadcast(true);

  const username = await new Promise(resolve => rl.question('Enter your username: ', resolve));
  const join = build_message({ message: 'joining', command: 'JOIN', username });
  socket.send(join, outbound, '255.255.255.255');

  console.log();
  log(`${username} joined!\n`);

  socket.on('message', buffer => {
    const msg = parse_message(buffer);
    if (msg) {
      print(msg);
    }
  });

  rl.on('line', message => {
    const buffer = /^\/leave$/.test(message)
      ? build_message({ username, message, command: 'LEAVE' })
      : build_message({ username, message, command: 'TALK' });

    socket.send(buffer, outbound, '255.255.255.255');
    console.log();
  });
})();
