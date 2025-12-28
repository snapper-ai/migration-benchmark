export const statusOrder = [
  "triggered",
  "acknowledged",
  "investigating",
  "mitigated",
  "resolved",
];

export const allowedTransitions = {
  triggered: ["acknowledged"],
  acknowledged: ["investigating"],
  investigating: ["mitigated", "resolved"],
  mitigated: ["resolved"],
  resolved: [],
};


