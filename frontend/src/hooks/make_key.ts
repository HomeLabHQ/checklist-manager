const make_key = (number: number, prefix: string): string => {
  return `${prefix}-${number}`;
};

export default make_key;
