import { createIdFactory } from "./id.js";

export function createDb(seed) {
  const state = {
    users: seed.users.map((u) => ({ ...u })),
    incidents: seed.incidents.map((i) => ({ ...i })),
    activity: seed.activity.map((a) => ({ ...a })),
  };

  const ids = createIdFactory({
    incident: "inc",
    activity: "act",
  });

  const maxCounters = {
    inc: maxSuffix(state.incidents.map((i) => i.id)),
    act: maxSuffix(state.activity.map((a) => a.id)),
  };
  ids.seedCounters(maxCounters);

  return {
    state,
    ids,
    reset(nextSeed) {
      state.users = nextSeed.users.map((u) => ({ ...u }));
      state.incidents = nextSeed.incidents.map((i) => ({ ...i }));
      state.activity = nextSeed.activity.map((a) => ({ ...a }));
      ids.seedCounters({
        inc: maxSuffix(state.incidents.map((i) => i.id)),
        act: maxSuffix(state.activity.map((a) => a.id)),
      });
    },
  };
}

function maxSuffix(ids) {
  let max = 0;
  for (const id of ids) {
    const m = String(id).match(/_(\d+)$/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max;
}


