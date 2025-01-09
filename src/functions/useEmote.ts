import { Emote } from "../classes/Emote";
import { WorldEmoteRequest } from "retrommo-types";
import { emitToSocketioServer } from "pixel-pigeon";
import { getDefinable } from "definables";

export const useEmote = (emoteID: string): void => {
  const emote: Emote = getDefinable(Emote, emoteID);
  emitToSocketioServer<WorldEmoteRequest>({
    data: {
      emoteID: emote.id,
    },
    event: "world/emote",
  });
};
