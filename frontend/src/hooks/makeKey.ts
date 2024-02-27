const makeKey = (number: number, prefix: string): string => {
  return `${prefix}-${number}`;
};

export default makeKey;
