import {
  NumLock,
  State,
  createInputCollection,
  createInputPressHandler,
  emitToSocketioServer,
  takeScreenshot,
} from "pixel-pigeon";
import { WorldStateSchema, state } from "./state";
import { canWalk } from "./functions/canWalk";
import { closeWorldMenus } from "./functions/world-menus/closeWorldMenus";
import { emotesWorldMenu } from "./world-menus/emotesWorldMenu";
import { getWorldState } from "./functions/state/getWorldState";
import { interact } from "./functions/interact";
import { isAWorldMenuOpen } from "./functions/world-menus/isAWorldMenuOpen";
import { isWorldCombatInProgress } from "./functions/isWorldCombatInProgress";
import { pianoWorldMenu } from "./world-menus/pianoWorldMenu";
import { postWindowMessage } from "./functions/postWindowMessage";
import { useEmote } from "./functions/useEmote";

export const whitePianoKeyInputCollectionIDs: readonly string[] = [
  createInputCollection({
    keyboardButtons: [{ value: "KeyZ" }],
    name: "White piano key 1",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyX" }],
    name: "White piano key 2",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyC" }],
    name: "White piano key 3",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyV" }],
    name: "White piano key 4",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyB" }],
    name: "White piano key 5",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyN" }],
    name: "White piano key 6",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyM" }],
    name: "White piano key 7",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyQ" }],
    name: "White piano key 8",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyW" }],
    name: "White piano key 9",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyE" }],
    name: "White piano key 10",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyR" }],
    name: "White piano key 11",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyT" }],
    name: "White piano key 12",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyY" }],
    name: "White piano key 13",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyU" }],
    name: "White piano key 14",
  }),
];
export const blackPianoKeyInputCollectionIDs: readonly string[] = [
  createInputCollection({
    keyboardButtons: [{ value: "KeyS" }],
    name: "Black piano key 1",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyD" }],
    name: "Black piano key 2",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyG" }],
    name: "Black piano key 3",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyH" }],
    name: "Black piano key 4",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "KeyJ" }],
    name: "Black piano key 5",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "Digit2" }],
    name: "Black piano key 6",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "Digit3" }],
    name: "Black piano key 7",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "Digit5" }],
    name: "Black piano key 8",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "Digit6" }],
    name: "Black piano key 9",
  }),
  createInputCollection({
    keyboardButtons: [{ value: "Digit7" }],
    name: "Black piano key 10",
  }),
];
export const targetWorldPartyCharacter1InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit1",
      },
      {
        numLock: NumLock.With,
        value: "Numpad1",
      },
    ],
    name: "Target world party character 1",
  });
export const targetWorldPartyCharacter2InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit2",
      },
      {
        numLock: NumLock.With,
        value: "Numpad2",
      },
    ],
    name: "Target world party character 2",
  });
export const targetWorldPartyCharacter3InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit3",
      },
      {
        numLock: NumLock.With,
        value: "Numpad3",
      },
    ],
    name: "Target world party character 3",
  });
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
export const questLogInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyX" }],
  name: "Toggle quest log menu",
});
export const spellbookInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyC" }],
  name: "Toggle spellbook menu",
});
export const inventoryInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyV" }],
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

export const useAttackInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "KeyE",
    },
  ],
  name: "Use Attack",
});
export const toggleBattleAbilitiesInputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "KeyC",
      },
    ],
    name: "Toggle battle abilities",
  });
export const toggleBattleItemsInputCollectionID: string = createInputCollection(
  {
    keyboardButtons: [
      {
        value: "KeyV",
      },
    ],
    name: "Toggle battle items",
  },
);
export const usePassInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "KeyZ",
    },
  ],
  name: "Use Pass",
});
export const useEscapeInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "KeyX",
    },
  ],
  name: "Use Escape",
});
export const useBattleHotkey1InputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "Digit1",
    },
    {
      numLock: NumLock.With,
      value: "Numpad1",
    },
  ],
  name: "Use battle hotkey 1",
});
export const useBattleHotkey2InputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "Digit2",
    },
    {
      numLock: NumLock.With,
      value: "Numpad2",
    },
  ],
  name: "Use battle hotkey 2",
});
export const useBattleHotkey3InputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "Digit3",
    },
    {
      numLock: NumLock.With,
      value: "Numpad3",
    },
  ],
  name: "Use battle hotkey 3",
});
export const useBattleHotkey4InputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "Digit4",
    },
    {
      numLock: NumLock.With,
      value: "Numpad4",
    },
  ],
  name: "Use battle hotkey 4",
});
export const useBattleHotkey5InputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "Digit5",
    },
    {
      numLock: NumLock.With,
      value: "Numpad5",
    },
  ],
  name: "Use battle hotkey 5",
});
export const useBattleHotkey6InputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "Digit6",
    },
    {
      numLock: NumLock.With,
      value: "Numpad6",
    },
  ],
  name: "Use battle hotkey 6",
});
export const useBattleHotkey7InputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "Digit7",
    },
    {
      numLock: NumLock.With,
      value: "Numpad7",
    },
  ],
  name: "Use battle hotkey 7",
});
export const useBattleHotkey8InputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "Digit8",
    },
    {
      numLock: NumLock.With,
      value: "Numpad8",
    },
  ],
  name: "Use battle hotkey 8",
});
export const useBattleHotkey9InputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      value: "Digit9",
    },
    {
      numLock: NumLock.With,
      value: "Numpad9",
    },
  ],
  name: "Use battle hotkey 9",
});
export const useBattleHotkey10InputCollectionID: string = createInputCollection(
  {
    keyboardButtons: [
      {
        value: "Digit0",
      },
      {
        numLock: NumLock.With,
        value: "Numpad0",
      },
    ],
    name: "Use battle hotkey 10",
  },
);
export const useBattleHotkey11InputCollectionID: string = createInputCollection(
  {
    keyboardButtons: [
      {
        value: "Minus",
      },
    ],
    name: "Use battle hotkey 11",
  },
);
export const useBattleHotkey12InputCollectionID: string = createInputCollection(
  {
    keyboardButtons: [
      {
        value: "Equal",
      },
    ],
    name: "Use battle hotkey 12",
  },
);
export const cancelBattleActionInputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "KeyQ",
      },
    ],
    name: "Cancel battle action",
  });
export const targetBattleEnemyCharacter1InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit1",
      },
      {
        numLock: NumLock.With,
        value: "Numpad1",
      },
    ],
    name: "Target battle enemy character 1",
  });
export const targetBattleEnemyCharacter2InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit2",
      },
      {
        numLock: NumLock.With,
        value: "Numpad2",
      },
    ],
    name: "Target battle enemy character 2",
  });
export const targetBattleEnemyCharacter3InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit3",
      },
      {
        numLock: NumLock.With,
        value: "Numpad3",
      },
    ],
    name: "Target battle enemy character 3",
  });
export const targetBattleEnemyCharacter4InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit4",
      },
      {
        numLock: NumLock.With,
        value: "Numpad4",
      },
    ],
    name: "Target battle enemy character 4",
  });
export const targetBattleEnemyCharacter5InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit5",
      },
      {
        numLock: NumLock.With,
        value: "Numpad5",
      },
    ],
    name: "Target battle enemy character 5",
  });
export const targetBattleEnemyCharacter6InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit6",
      },
      {
        numLock: NumLock.With,
        value: "Numpad6",
      },
    ],
    name: "Target battle enemy character 6",
  });
export const targetBattleEnemyCharacter7InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit7",
      },
      {
        numLock: NumLock.With,
        value: "Numpad7",
      },
    ],
    name: "Target battle enemy character 7",
  });
export const targetBattleEnemyCharacter8InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit8",
      },
      {
        numLock: NumLock.With,
        value: "Numpad8",
      },
    ],
    name: "Target battle enemy character 8",
  });
export const targetBattleEnemyCharacter9InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit9",
      },
      {
        numLock: NumLock.With,
        value: "Numpad9",
      },
    ],
    name: "Target battle enemy character 9",
  });
export const targetBattleFriendlyCharacter1InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit1",
      },
      {
        numLock: NumLock.With,
        value: "Numpad1",
      },
    ],
    name: "Target battle friendly character 1",
  });
export const targetBattleFriendlyCharacter2InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit2",
      },
      {
        numLock: NumLock.With,
        value: "Numpad2",
      },
    ],
    name: "Target battle friendly character 2",
  });
export const targetBattleFriendlyCharacter3InputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Digit3",
      },
      {
        numLock: NumLock.With,
        value: "Numpad3",
      },
    ],
    name: "Target battle friendly character 3",
  });
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: screenshotInputCollectionID,
  onInput: (): void => {
    takeScreenshot();
  },
});
createInputPressHandler({
  condition: (): boolean =>
    state.values.worldState !== null &&
    pianoWorldMenu.isOpen() === false &&
    isWorldCombatInProgress() === false,
  inputCollectionID: emotesInputCollectionID,
  onInput: (): void => {
    if (emotesWorldMenu.isOpen()) {
      emotesWorldMenu.close();
    } else {
      closeWorldMenus();
      emotesWorldMenu.open({});
    }
  },
});
createInputPressHandler({
  condition: (): boolean =>
    state.values.worldState !== null && pianoWorldMenu.isOpen() === false,
  inputCollectionID: lastEmoteInputCollectionID,
  onInput: (): void => {
    const worldState: State<WorldStateSchema> = getWorldState();
    if (worldState.values.lastUsedEmoteID !== null) {
      useEmote(worldState.values.lastUsedEmoteID);
    }
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
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
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveLeftWASDInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "KeyA",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "KeyA" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveLeftArrowInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "ArrowLeft",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "ArrowLeft" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveLeftNumpadInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "Numpad4",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "Numpad4" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveRightWASDInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "KeyD",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "KeyD" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveRightArrowInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "ArrowRight",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "ArrowRight" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveRightNumpadInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "Numpad6",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "Numpad6" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveUpWASDInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "KeyW",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "KeyW" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveUpArrowInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "ArrowUp",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "ArrowUp" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveUpNumpadInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "Numpad8",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "Numpad8" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveDownWASDInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "KeyS",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "KeyS" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveDownArrowInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "ArrowDown",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "ArrowDown" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: moveDownNumpadInputCollectionID,
  onInput: (): void => {
    if (canWalk()) {
      emitToSocketioServer({
        data: {
          key: "Numpad2",
          numlock: false,
        },
        event: "keydown",
      });
    }
  },
  onRelease: (): void => {
    emitToSocketioServer({
      data: "Numpad2" as unknown as object,
      event: "keyup",
    });
  },
});
createInputPressHandler({
  condition: (): boolean =>
    state.values.worldState !== null && isWorldCombatInProgress() === false,
  inputCollectionID: actionInputCollectionID,
  onInput: (): void => {
    if (isAWorldMenuOpen()) {
      closeWorldMenus();
    } else {
      interact();
    }
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: globalChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "global" as unknown as object,
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: localChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "local" as unknown as object,
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: partyChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "party" as unknown as object,
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: tradeChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "trade" as unknown as object,
      event: "open-chat",
    });
  },
});
createInputPressHandler({
  condition: (): boolean => pianoWorldMenu.isOpen() === false,
  inputCollectionID: modChatInputCollectionID,
  onInput: (): void => {
    postWindowMessage({
      data: "mod" as unknown as object,
      event: "open-chat",
    });
  },
});
