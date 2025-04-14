export const getSumOfNumbers = (arr: readonly number[]): number => {
  if (arr.length === 0) {
    return 0;
  }
  let total: number = 0;
  for (const item of arr) {
    total += item;
  }
  return total;
};
