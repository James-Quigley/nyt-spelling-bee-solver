import { NextApiRequest, NextApiResponse } from "next";

import Word from "../../models/Word";
import { verifyJWT } from "../../util/jwt";
import wordsJson from "../../words.json";

const words = wordsJson as string[];

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let cookie: { user: string; letters: string[] };
  try {
    cookie = verifyJWT(req.cookies.user) as { user: string; letters: string[] };
  } catch (e) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const { word, type } = req.body as { word: string; type: string };
  if (!word.split("").every((letter) => cookie.letters.includes(letter))) {
    return res.status(400).send("Invalid word");
  }

  if (!words.includes(word) || !["up", "down"].includes(type)) {
    return res.status(400).json({
      message: `Invalid word: ${word}. Or invalid type: ${type}`,
    });
  }

  const result = Word.findOneAndUpdate(
    { word },
    {
      $inc: {
        votes: type === "up" ? 1 : -1,
      },
    },
    { new: true, upsert: true }
  ).exec();
  await result;
  res.status(201).json({ message: "success" });
};

export default handler;
