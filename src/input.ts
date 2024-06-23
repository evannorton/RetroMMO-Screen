import {
  NumLock,
  createInputCollection,
  createInputPressHandler,
  emitToSocketioServer,
  takeScreenshot,
} from "pixel-pigeon";
import { postWindowMessage } from "./functions/postWindowMessage";

export const screenshotInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyP" }],
  name: "Screenshot",
});
export const actionInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    { value: "KeyZ" },
    {
      value: "Space",
    },
    {
      numLock: NumLock.Without,
      value: "Numpad5",
    },
  ],
  name: "Action",
});
export const statsInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyZ" }],
  name: "Toggle stats menu",
});
export const spellbookInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyX" }],
  name: "Toggle spellbook menu",
});
export const inventoryInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyC" }],
  name: "Toggle inventory menu",
});
export const emotesInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyM" }],
  name: "Toggle emotes menu",
});
export const lastEmoteInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyL" }],
  name: "Use last emote",
});
export const globalChatInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyY" }],
  name: "Global chat",
});
export const localChatInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyU" }],
  name: "Local chat",
});
export const partyChatInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyH" }],
  name: "Party chat",
});
export const tradeChatInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyT" }],
  name: "Trade chat",
});
export const modChatInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyG" }],
  name: "Mod chat",
});
createInputPressHandler({
  inputCollectionID: screenshotInputCollectionID,
  onInput: (): void => {
    takeScreenshot();
  },
});
createInputPressHandler({
  inputCollectionID: emotesInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {},
      event: "legacy/open-emotes",
    });
  },
});
createInputPressHandler({
  inputCollectionID: lastEmoteInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {},
      event: "legacy/use-last-emote",
    });
  },
});
createInputPressHandler({
  inputCollectionID: actionInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {},
      event: "legacy/action",
    });
  },
});
createInputPressHandler({
  inputCollectionID: globalChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "global",
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  inputCollectionID: localChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "local",
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  inputCollectionID: partyChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "party",
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  inputCollectionID: tradeChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "trade",
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  inputCollectionID: modChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "mod",
      event: "open-chat",
    });
  },
});
