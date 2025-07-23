export const generateNumbers = (
  startingNumber,
  numbersToGenerate,
  sequenceType = "incremental",
  prefix = "",
  lastGenerated = null
) => {
  const charset = "0123456789abcdefghijklmnopqrstuvwxyz"; // 36 characters
  const base = charset.length; // 36
  const maxLength = 6; // Up to 6 characters
  const DEFAULT_START = "000001"; // Default starting point when lastGenerated is null/undefined

  // Validate sequence type
  if (!["incremental", "even", "odd"].includes(sequenceType)) {
    throw new Error(`Invalid sequence type: ${sequenceType}`);
  }

  // If lastGenerated is not provided, start from DEFAULT_START (000001)
  if (lastGenerated === null || lastGenerated === undefined) {
    startingNumber = parseInt(DEFAULT_START, base);
    if (isNaN(startingNumber)) {
      throw new Error(
        `Invalid base-36 default starting number: ${DEFAULT_START}`
      );
    }
  }
  // If lastGenerated is provided, extract the numeric part and use that as starting point
  else if (lastGenerated) {
    // Remove the prefix if it exists
    const numericPart = lastGenerated.startsWith(prefix)
      ? lastGenerated.slice(prefix.length)
      : lastGenerated;

    // Convert base-36 string to a decimal number
    startingNumber = parseInt(numericPart, base) + 1;
    if (isNaN(startingNumber)) {
      throw new Error(`Invalid base-36 last generated number: ${numericPart}`);
    }
  }
  // Otherwise, process the startingNumber as provided
  else if (typeof startingNumber === "string") {
    startingNumber = parseInt(startingNumber, base);
    if (isNaN(startingNumber)) {
      throw new Error(`Invalid base-36 starting number: ${startingNumber}`);
    }
  }

  // Helper function to convert a number to a base-36 string
  function toBase36(num) {
    let result = "";
    do {
      result = charset[num % base] + result;
      num = Math.floor(num / base);
    } while (num > 0);

    // Pad with leading zeroes to ensure a length of 6
    return result.padStart(maxLength, "0");
  }

  const results = [];
  let currentNumber = startingNumber;

  while (results.length < numbersToGenerate) {
    // Check sequence type
    if (sequenceType === "even" && currentNumber % 2 !== 0) {
      currentNumber++;
      continue;
    }
    if (sequenceType === "odd" && currentNumber % 2 === 0) {
      currentNumber++;
      continue;
    }

    // Ensure the number is within range
    if (currentNumber >= Math.pow(base, maxLength)) {
      currentNumber = 0;
    }

    results.push({
      shortLink: prefix + toBase36(currentNumber),
      code: toBase36(currentNumber),
    });
    currentNumber++;
  }

  return results;
};

// Example usage:
// const startingNumber = "0"; 
// const numbersToGenerate = 1; 
// const sequenceType = "incremental"; 
// const prefix = "Shardul-"; 
// const lastGenerated = "Shardul-00000m"; 

// Continue from last generated
// const generatedNumbers = generateNumbers(
//   startingNumber,
//   numbersToGenerate,
//   sequenceType,
//   prefix,
//   lastGenerated
// );
// console.log(generatedNumbers);
