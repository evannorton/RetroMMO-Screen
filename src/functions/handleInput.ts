import { ChatChannel } from "../classes/ChatChannel";
import { OpenChatUpstreamWindowMessage } from "retrommo-types";
import {
  State,
  createInputPressHandler,
  emitToSocketioServer,
  takeScreenshot,
} from "pixel-pigeon";
import { WorldStateSchema, state } from "../state";
import {
  emotesInputCollectionID,
  lastEmoteInputCollectionID,
  moveDownArrowInputCollectionID,
  moveDownJoystickInputCollectionID,
  moveDownNumpadInputCollectionID,
  moveDownWASDInputCollectionID,
  moveLeftArrowInputCollectionID,
  moveLeftJoystickInputCollectionID,
  moveLeftNumpadInputCollectionID,
  moveLeftWASDInputCollectionID,
  moveRightArrowInputCollectionID,
  moveRightJoystickInputCollectionID,
  moveRightNumpadInputCollectionID,
  moveRightWASDInputCollectionID,
  moveUpArrowInputCollectionID,
  moveUpJoystickInputCollectionID,
  moveUpNumpadInputCollectionID,
  moveUpWASDInputCollectionID,
  screenshotInputCollectionID,
  lockMovementCollectionID,
  actionInputCollectionID,
  actionNumpadInputCollectionID,
} from "../inputCollections";
import { canWalk } from "../functions/canWalk";
import { closeWorldMenus } from "../functions/world-menus/closeWorldMenus";
import { emotesWorldMenu } from "../world-menus/emotesWorldMenu";
import { getDefinables } from "definables";
import { getWorldState } from "../functions/state/getWorldState";
import {
  holdJoystickDirection,
  pressKeyboardShift,
  releaseJoystickDirection,
  releaseKeyboardShift,
} from "../functions/syncShiftKey";
import { interact } from "../functions/interact";
import { isAWorldMenuOpen } from "../functions/world-menus/isAWorldMenuOpen";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";
import { pianoWorldMenu } from "../world-menus/pianoWorldMenu";
import { postWindowMessage } from "../functions/postWindowMessage";
import { useEmote } from "../functions/useEmote";

export const handleInput = (): void => {
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
      state.values.worldState.values.queuedBattle === null &&
      pianoWorldMenu.isOpen() === false &&
      isWorldCombatInProgress() === false,
    inputCollectionID: emotesInputCollectionID,
    onInput: (): void => {
      if (emotesWorldMenu.isOpen()) {
        emotesWorldMenu.close({});
      } else {
        closeWorldMenus({});
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
    inputCollectionID: lockMovementCollectionID,
    onInput: (): void => {
      pressKeyboardShift();
    },
    onRelease: (): void => {
      releaseKeyboardShift();
    },
  });
  createInputPressHandler({
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
    inputCollectionID: moveLeftJoystickInputCollectionID,
    onInput: (): void => {
      holdJoystickDirection("JoystickLeft");
    },
    onRelease: (): void => {
      releaseJoystickDirection("JoystickLeft");
    },
  });
  createInputPressHandler({
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
    inputCollectionID: moveRightJoystickInputCollectionID,
    onInput: (): void => {
      holdJoystickDirection("JoystickRight");
    },
    onRelease: (): void => {
      releaseJoystickDirection("JoystickRight");
    },
  });
  createInputPressHandler({
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
    inputCollectionID: moveUpJoystickInputCollectionID,
    onInput: (): void => {
      holdJoystickDirection("JoystickUp");
    },
    onRelease: (): void => {
      releaseJoystickDirection("JoystickUp");
    },
  });
  createInputPressHandler({
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
    inputCollectionID: moveDownJoystickInputCollectionID,
    onInput: (): void => {
      holdJoystickDirection("JoystickDown");
    },
    onRelease: (): void => {
      releaseJoystickDirection("JoystickDown");
    },
  });
  createInputPressHandler({
    condition: (): boolean =>
      state.values.worldState !== null && isWorldCombatInProgress() === false,
    inputCollectionID: actionInputCollectionID,
    onInput: (): void => {
      if (isAWorldMenuOpen()) {
        closeWorldMenus({});
      } else {
        interact();
      }
    },
  });
  createInputPressHandler({
    condition: (): boolean =>
      state.values.worldState !== null && isWorldCombatInProgress() === false,
    inputCollectionID: actionNumpadInputCollectionID,
    onInput: (): void => {
      if (isAWorldMenuOpen()) {
        closeWorldMenus({});
      } else {
        interact();
      }
    },
  });
  for (const chatChannel of getDefinables(ChatChannel).values()) {
    createInputPressHandler({
      condition: (): boolean =>
        pianoWorldMenu.isOpen() === false &&
        (typeof chatChannel.condition === "function"
          ? chatChannel.condition()
          : chatChannel.condition),
      inputCollectionID: chatChannel.inputCollectionID,
      onInput: (): void => {
        postWindowMessage<OpenChatUpstreamWindowMessage>({
          data: {
            chatChannel: chatChannel.id,
          },
          event: "open-chat",
        });
      },
    });
  }
};
