'use strict';

const dgram = require('dgram');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const build_message = (msg, username) => {
  return Buffer.from(`user:${username}\nmessage:${msg}\n\n`);
};

const parse_message = buffer => {
  const matches = buffer.toString().match(/^user:([^\n]*)\nmessage:([^\n]*)\n\n$/);
  if (!matches[1] || !matches[2]) {
    return false;
  }
  return `${matches[1]}: ${matches[2]}\n`;
};

void (async function() {
  const socket = dgram.createSocket('udp4');

  const err = await new Promise(resolve => socket.bind(4000, resolve));
  if (err) {
    console.error('could not create socket: %s', err.message);
    process.exit(1);
  }

  socket.setBroadcast(true);

  const username = await new Promise(resolve => rl.question('Enter your username: ', resolve));

  socket.on('message', buffer => {
    const msg = parse_message(buffer);
    if (msg) {
      console.log(msg);
    }
  });
  rl.on('line', line => {
    socket.send(build_message(line, username), 3000, '255.255.255.255');
    console.log();
  });
})();
