const Counter = require('../models/counter');

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

async function getSequencerId() {
  // Increment the sequence ID atomically
  const counter = await Counter.findByIdAndUpdate(
    'urlSeq',
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  return counter.seq;
}

function encodeBase58(number) {
  console.log({ number });
  let encoded = '';
  while (number) {
    let remainder = number % 58;
    number = Math.floor(number / 58);
    encoded = BASE58[remainder] + encoded;
  }
  return encoded;
}

function decodeBase58(encoded) {
  let decoded = 0;
  for (let i = 0; i < encoded.length; i++) {
    const index = BASE58.indexOf(encoded[i]);
    if (index === -1) {
      throw new Error('Invalid character in Base58 encoded string');
    }
    decoded = decoded * 58 + index;
  }
  return decoded;
}

async function generateShortURL() {
  const sequencerID = await getSequencerId();

  // Ensure sequencerID starts from at least 1 billion
  if (sequencerID < 1000000000) {
    throw new Error('Sequencer ID must start from at least 1 billion');
  }
  return encodeBase58(sequencerID);
}

function decodeShortURL(shortUrl) {
  return decodeBase58(shortUrl);
}

module.exports = { generateShortURL, decodeShortURL };
