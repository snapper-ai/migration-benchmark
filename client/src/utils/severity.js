export const severityOrder = ["S1", "S2", "S3", "S4"];

export function compareSeverity(a, b) {
  const ia = severityOrder.indexOf(a);
  const ib = severityOrder.indexOf(b);
  return ia - ib;
}


