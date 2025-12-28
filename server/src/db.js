import { createIdFactory } from "./id.js";

export function createDb(seed) {
  const state = {
    users: seed.users.map((u) => ({ ...u })),
    services: seed.services.map((s) => ({ ...s })),
    incidents: seed.incidents.map((i) => ({ ...i })),
    comments: seed.comments.map((c) => ({ ...c })),
    activity: seed.activity.map((a) => ({ ...a })),
  };

  const ids = createIdFactory({
    service: "svc",
    incident: "inc",
    comment: "cmt",
    activity: "act",
  });

  const maxCounters = {
    svc: maxSuffix(state.services.map((s) => s.id)),
    inc: maxSuffix(state.incidents.map((i) => i.id)),
    cmt: maxSuffix(state.comments.map((c) => c.id)),
    act: maxSuffix(state.activity.map((a) => a.id)),
  };
  ids.seedCounters(maxCounters);

  return {
    state,
    ids,
    reset(nextSeed) {
      state.users = nextSeed.users.map((u) => ({ ...u }));
      state.services = nextSeed.services.map((s) => ({ ...s }));
      state.incidents = nextSeed.incidents.map((i) => ({ ...i }));
      state.comments = nextSeed.comments.map((c) => ({ ...c }));
      state.activity = nextSeed.activity.map((a) => ({ ...a }));
      ids.seedCounters({
        svc: maxSuffix(state.services.map((s) => s.id)),
        inc: maxSuffix(state.incidents.map((i) => i.id)),
        cmt: maxSuffix(state.comments.map((c) => c.id)),
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


