const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function encodeBase58(number) {
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

function generateShortURL(sequencerID) {
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
