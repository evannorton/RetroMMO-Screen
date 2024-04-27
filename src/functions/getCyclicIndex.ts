export const getCyclicIndex = <T>(index: number, arr: T[]): number =>
  ((index % arr.length) + arr.length) % arr.length;
