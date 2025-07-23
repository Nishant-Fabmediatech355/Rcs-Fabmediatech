import ShortLinkCode from "../models/ShortLinkCode.js";
import { generateNumbers } from "./IncrementalCharsGenerator.js";

export const ShortLinkCodeGenerator = async (codeType, senderId) => {
  const startingNumber = "0"; // Base-36 starting number
  const numbersToGenerate = 1; // Generate 10 numbers
  const sequenceType = "incremental"; // Incremental sequence
  const prefix = senderId
    ? `${process.env.backend_url}/${senderId}/`
    : `${process.env.backend_url}/`;
  try {
    const shortLinkCode = await ShortLinkCode.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (!shortLinkCode) {
      const newGen = generateNumbers(
        startingNumber,
        numbersToGenerate,
        sequenceType,
        prefix,
        null
      );
      let query = {};
      if (codeType === "short") {
        query.Shortcode = newGen[0].code;
      }
      if (codeType === "clicker") {
        query.Clickercode = newGen[0].code;
      }
      await ShortLinkCode.create(query);
      return newGen[0];
    } else {
      const newGen = generateNumbers(
        startingNumber,
        numbersToGenerate,
        sequenceType,
        prefix,
        codeType === "clicker"
          ? shortLinkCode.dataValues.Clickercode
          : shortLinkCode.dataValues.Shortcode
      );
      let query = {};
      if (codeType === "short") {
        query.Shortcode = newGen[0].code;
      }
      if (codeType === "clicker") {
        query.Clickercode = newGen[0].code;
      }
      await shortLinkCode.update(query);
      // console.log({ newGen: newGen[0].code }, "hhh");
      return newGen[0];
    }

    // shortLinkCode.code;
  } catch (error) {
    console.log({ error });
    return false;
  }
};
