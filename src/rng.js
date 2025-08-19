const crypto = require('crypto');

function makeSeed(base) {
  return crypto.createHash('sha256').update(base).digest('hex').slice(0, 32);
}

function RNG(seed) {
  let state = BigInt('0x' + seed.padEnd(32, '0'));
  return {
    next() {
      // xorshift64*
      state ^= state << 13n;
      state ^= state >> 7n;
      state ^= state << 17n;
      return Number(state & 0xffffffffn) / 0x100000000; // [0,1)
    },
    pick(arr) { return arr[Math.floor(this.next() * arr.length)]; },
    int(max) { return Math.floor(this.next() * max); }
  };
}

module.exports = { makeSeed, RNG };
