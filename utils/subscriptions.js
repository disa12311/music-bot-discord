const map = new Map();
module.exports = {
  set: (k,v) => map.set(k,v),
  get: k => map.get(k),
  has: k => map.has(k),
  delete: k => map.delete(k),
};