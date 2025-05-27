const cache = new Map();
const TTL = 120000;
module.exports = {
  get: key => {
    const e = cache.get(key);
    if (!e || Date.now() > e.exp) { cache.delete(key); return null; }
    return e.val;
  },
  set: (key, val) => cache.set(key, { val, exp: Date.now()+TTL })
};