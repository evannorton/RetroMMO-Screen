import {
  NumLock,
  createInputCollection,
  createInputPressHandler,
  emitToSocketioServer,
  takeScreenshot,
} from "pixel-pigeon";
import { postWindowMessage } from "./functions/postWindowMessage";

const screenshotInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyP" }],
  name: "Screenshot",
});
const spinInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ShiftLeft" }],
  name: "Spin",
});
const moveLeftWASDInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyA" }],
  name: "Move left",
});
const moveLeftArrowInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ArrowLeft" }],
  name: "Move left",
});
const moveLeftNumpadInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      numLock: NumLock.Without,
      value: "Numpad4",
    },
  ],
  name: "Move left",
});
const moveRightWASDInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyD" }],
  name: "Move right",
});
const moveRightArrowInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ArrowRight" }],
  name: "Move right",
});
const moveRightNumpadInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      numLock: NumLock.Without,
      value: "Numpad6",
    },
  ],
  name: "Move right",
});
const moveUpWASDInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyW" }],
  name: "Move up",
});
const moveUpArrowInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ArrowUp" }],
  name: "Move up",
});
const moveUpNumpadInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      numLock: NumLock.Without,
      value: "Numpad8",
    },
  ],
  name: "Move up",
});
const moveDownWASDInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyS" }],
  name: "Move down",
});
const moveDownArrowInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ArrowDown" }],
  name: "Move down",
});
const moveDownNumpadInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      numLock: NumLock.Without,
      value: "Numpad2",
    },
  ],
  name: "Move down",
});
const actionInputCollectionID: string = createInputCollection({
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
const emotesInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyM" }],
  name: "Toggle emotes menu",
});
const lastEmoteInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyL" }],
  name: "Use last emote",
});
const globalChatInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyY" }],
  name: "Global chat",
});
const localChatInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyU" }],
  name: "Local chat",
});
const partyChatInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyH" }],
  name: "Party chat",
});
const tradeChatInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyT" }],
  name: "Trade chat",
});
const modChatInputCollectionID: string = createInputCollection({
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
  inputCollectionID: spinInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "ShiftLeft",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "ShiftLeft" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveLeftWASDInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "KeyA",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "KeyA" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveLeftArrowInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "ArrowLeft",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "ArrowLeft" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveLeftNumpadInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "Numpad4",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "Numpad4" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveRightWASDInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "KeyD",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "KeyD" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveRightArrowInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "ArrowRight",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "ArrowRight" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveRightNumpadInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "Numpad6",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "Numpad6" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveUpWASDInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "KeyW",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "KeyW" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveUpArrowInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "ArrowUp",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "ArrowUp" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveUpNumpadInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "Numpad8",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "Numpad8" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveDownWASDInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "KeyS",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "KeyS" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveDownArrowInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "ArrowDown",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "ArrowDown" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  inputCollectionID: moveDownNumpadInputCollectionID,
  onInput: (): void => {
    emitToSocketioServer({
      data: {
        key: "Numpad2",
        numlock: false,
      },
      event: "keydown",
    });
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "Numpad2" as unknown as object,
      event: "keyup",
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
      data: "global" as unknown as object,
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  inputCollectionID: localChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "local" as unknown as object,
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  inputCollectionID: partyChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "party" as unknown as object,
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  inputCollectionID: tradeChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "trade" as unknown as object,
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  inputCollectionID: modChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "mod" as unknown as object,
      event: "open-chat",
    });
  },
});
