export const getFormattedInteger = (integer: number): string => {
  const numStr: string = integer.toString();
  let result: string = "";
  let count: number = 0;
  // Loop through the string from right to left
  for (let i: number = numStr.length - 1; i >= 0; i--) {
    const numChar: string | undefined = numStr[i];
    if (typeof numChar === "undefined") {
      throw new Error("numChar is undefined");
    }
    result = numChar + result;
    count++;
    // Add a comma after every three digits (except at the start)
    if (count % 3 === 0 && i !== 0) {
      result = `,${result}`;
    }
  }
  return result;
};
