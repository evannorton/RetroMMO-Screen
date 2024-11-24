import { PianoKeyType } from "retrommo-types";

export const getPianoKeyAudioPath = (
  index: number,
  type: PianoKeyType,
): string => {
  const whiteKeyAudioPaths: string[] = [
    "sfx/piano-keys/1c",
    "sfx/piano-keys/3d",
    "sfx/piano-keys/5e",
    "sfx/piano-keys/6f",
    "sfx/piano-keys/8g",
    "sfx/piano-keys/10a",
    "sfx/piano-keys/12b",
    "sfx/piano-keys/13c",
    "sfx/piano-keys/15d",
    "sfx/piano-keys/17e",
    "sfx/piano-keys/18f",
    "sfx/piano-keys/20g",
    "sfx/piano-keys/22a",
    "sfx/piano-keys/24b",
  ];
  const blackKeyAudioPaths: string[] = [
    "sfx/piano-keys/2c#",
    "sfx/piano-keys/4d#",
    "sfx/piano-keys/7f#",
    "sfx/piano-keys/9g#",
    "sfx/piano-keys/11a#",
    "sfx/piano-keys/14c#",
    "sfx/piano-keys/16d#",
    "sfx/piano-keys/19f#",
    "sfx/piano-keys/21g#",
    "sfx/piano-keys/23a#",
  ];
  switch (type) {
    case PianoKeyType.White: {
      const path: string | undefined = whiteKeyAudioPaths[index];
      if (typeof path === "undefined") {
        throw new Error(`Audio path is null for white key index ${index}`);
      }
      return path;
    }
    case PianoKeyType.Black: {
      const path: string | undefined = blackKeyAudioPaths[index];
      if (typeof path === "undefined") {
        throw new Error(`Audio path is null for black key index ${index}`);
      }
      return path;
    }
  }
};
