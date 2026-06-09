import { NumLock, createInputCollection } from "pixel-pigeon";

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
export const screenshotInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyP" }],
  name: "Screenshot",
});
export const spinInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ShiftLeft" }],
  name: "Spin",
});
export const moveLeftWASDInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyA" }],
  name: "Move left",
});
export const moveLeftArrowInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ArrowLeft" }],
  name: "Move left",
});
export const moveLeftNumpadInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      numLock: NumLock.Without,
      value: "Numpad4",
    },
  ],
  name: "Move left",
});
export const moveLeftJoystickInputCollectionID: string = createInputCollection({
  joystickDirections: ["left"],
  name: "Move left",
});
export const moveRightWASDInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyD" }],
  name: "Move right",
});
export const moveRightArrowInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ArrowRight" }],
  name: "Move right",
});
export const moveRightNumpadInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      numLock: NumLock.Without,
      value: "Numpad6",
    },
  ],
  name: "Move right",
});
export const moveRightJoystickInputCollectionID: string = createInputCollection(
  {
    joystickDirections: ["right"],
    name: "Move right",
  },
);
export const moveUpWASDInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyW" }],
  name: "Move up",
});
export const moveUpArrowInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ArrowUp" }],
  name: "Move up",
});
export const moveUpNumpadInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      numLock: NumLock.Without,
      value: "Numpad8",
    },
  ],
  name: "Move up",
});
export const moveUpJoystickInputCollectionID: string = createInputCollection({
  joystickDirections: ["up"],
  name: "Move up",
});
export const moveDownWASDInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyS" }],
  name: "Move down",
});
export const moveDownArrowInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "ArrowDown" }],
  name: "Move down",
});
export const moveDownNumpadInputCollectionID: string = createInputCollection({
  keyboardButtons: [
    {
      numLock: NumLock.Without,
      value: "Numpad2",
    },
  ],
  name: "Move down",
});
export const moveDownJoystickInputCollectionID: string = createInputCollection({
  joystickDirections: ["down"],
  name: "Move down",
});
export const actionInputCollectionID: string = createInputCollection({
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
export const cancelBattleActionInputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "KeyQ",
      },
    ],
    name: "Cancel battle action",
  });
export const unbindBattleHotkeyInputCollectionID: string =
  createInputCollection({
    keyboardButtons: [
      {
        value: "Backspace",
      },
    ],
    name: "Unbind battle hotkey",
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
  name: "Battle hotkey 1",
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
  name: "Battle hotkey 2",
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
  name: "Battle hotkey 3",
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
  name: "Battle hotkey 4",
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
  name: "Battle hotkey 5",
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
  name: "Battle hotkey 6",
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
  name: "Battle hotkey 7",
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
  name: "Battle hotkey 8",
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
  name: "Battle hotkey 9",
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
    name: "Battle hotkey 10",
  },
);
export const useBattleHotkey11InputCollectionID: string = createInputCollection(
  {
    keyboardButtons: [
      {
        value: "Minus",
      },
    ],
    name: "Battle hotkey 11",
  },
);
export const useBattleHotkey12InputCollectionID: string = createInputCollection(
  {
    keyboardButtons: [
      {
        value: "Equal",
      },
    ],
    name: "Battle hotkey 12",
  },
);
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
