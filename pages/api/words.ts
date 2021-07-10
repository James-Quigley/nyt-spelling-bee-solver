import type { NextApiRequest, NextApiResponse } from "next";

import wordsJson from "../../words.json";

const words = wordsJson as string[];

// returns all words from the words.json file
// that are at least 4 letters long
// and must contain the first letter in the array
// and all letters in the word must be in the letters array
const getWords = (letters: string[]): string[] => {
  return words.filter(
    (word: string) =>
      word.length >= 4 &&
      word.includes(letters[0]) &&
      Array.from(word).every((letter) => letters.includes(letter))
  );
};

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const letters: string[] = req.body?.letters ?? [];

  // check that there are 7 alphabetic characters in letters
  if (
    letters.length !== 7 ||
    !letters.every((letter) => /[a-z]/.test(letter))
  ) {
    return res.status(400).json({
      error:
        "The letters must be 7 characters long and contain only lowercase letters",
    });
  }

  return res.status(200).json({
    words: getWords(letters),
  });
};

export default handler;
