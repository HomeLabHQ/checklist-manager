const makeSwap = <T>(array: T[], from: number, to: number): T[] =>
  array.splice(from, 1, array.splice(to, 1, array[from])[0] as T);
export default makeSwap;
