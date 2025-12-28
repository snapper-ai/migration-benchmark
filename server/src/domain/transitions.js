export const allowedTransitions = {
  triggered: ["acknowledged"],
  acknowledged: ["investigating"],
  investigating: ["mitigated", "resolved"],
  mitigated: ["resolved"],
  resolved: [],
};

export function canTransition(from, to) {
  const allowed = allowedTransitions[from] || [];
  return allowed.includes(to);
}


