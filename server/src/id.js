import { customRandom } from "nanoid";

const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";

export function createIdFactory(prefixByEntity) {
  const counters = new Map(); // key: shortPrefix -> number

  function seedCounters(map) {
    for (const [shortPrefix, n] of Object.entries(map)) {
      counters.set(shortPrefix, Number(n) || 0);
    }
  }

  function nextShort(shortPrefix) {
    const next = (counters.get(shortPrefix) || 0) + 1;
    counters.set(shortPrefix, next);
    return next;
  }

  function stableBytes(seedNumber, size) {
    const arr = new Uint8Array(size);
    // Very simple deterministic mixing; not random.
    let x = seedNumber >>> 0;
    for (let i = 0; i < size; i += 1) {
      x = (x * 1664525 + 1013904223) >>> 0;
      arr[i] = x & 0xff;
    }
    return arr;
  }

  function create(entityType) {
    const short = prefixByEntity[entityType];
    if (!short) throw new Error(`Unknown id entityType: ${entityType}`);
    const n = nextShort(short);
    const rand = (size) => stableBytes(n, size);
    const nano = customRandom(alphabet, 8, rand);
    return `${short}_${String(n).padStart(3, "0")}_${nano()}`;
  }

  return { create, seedCounters };
}


