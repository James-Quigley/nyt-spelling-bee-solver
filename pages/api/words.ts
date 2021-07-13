import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

import wordsJson from "../../words.json";
import { createJWT } from "../../util/jwt";
import Word from "../../models/Word";

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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

  res.setHeader("Set-Cookie", serialize("user", createJWT(letters)));

  const words = getWords(letters);

  const votes = await Word.find({
    word: {
      $in: words,
    },
  }).exec();

  const votesPerWord = Object.fromEntries(votes.map((v) => [v.word, v.votes]));

  words.forEach((word) => {
    if (!votesPerWord[word]) {
      votesPerWord[word] = 0;
    }
  });

  const sorted = Object.entries(votesPerWord)
    .sort((a, b) => b[1] - a[1])
    .map((v) => v[0]);

  return res.status(200).json({
    words: sorted,
  });
};

export default handler;
