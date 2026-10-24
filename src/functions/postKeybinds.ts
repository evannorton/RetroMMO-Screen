import {
  KeybindInputCollection,
  KeybindKeyboardButton,
  KeybindNumLock,
  KeybindsUpstreamWindowMessage,
} from "retrommo-types";
import {
  InputCollectionSnapshot,
  KeyboardButton,
  NumLock,
  getInputCollections,
} from "pixel-pigeon";
import { postWindowMessage } from "./postWindowMessage";
import {
  settingsKeybindInputCollectionIDs,
} from "../settingsKeybindInputCollectionIDs";

const getKeybindNumLock = (numLock: NumLock): KeybindNumLock => {
  switch (numLock) {
    case NumLock.Default:
      return "default";
    case NumLock.With:
      return "with";
    case NumLock.Without:
      return "without";
  }
  throw new Error(`Unexpected num lock "${numLock}".`);
};
const getKeybindKeyboardButton = (
  keyboardButton: KeyboardButton,
): KeybindKeyboardButton => ({
  numLock: getKeybindNumLock(keyboardButton.numLock),
  value: keyboardButton.value,
});
const getSettingsKeybindInputCollectionSnapshot = (
  inputCollectionSnapshots: readonly InputCollectionSnapshot[],
  inputCollectionID: string,
): InputCollectionSnapshot => {
  let inputCollectionSnapshot: InputCollectionSnapshot | undefined;
  for (const candidateInputCollectionSnapshot of inputCollectionSnapshots) {
    if (candidateInputCollectionSnapshot.id === inputCollectionID) {
      inputCollectionSnapshot = candidateInputCollectionSnapshot;
    }
  }
  if (typeof inputCollectionSnapshot === "undefined") {
    throw new Error(
      `Settings keybind input collection "${inputCollectionID}" does not exist.`,
    );
  }
  return inputCollectionSnapshot;
};
const getKeybindInputCollection = (
  inputCollection: InputCollectionSnapshot,
): KeybindInputCollection => ({
  gamepadButtons: inputCollection.gamepadButtons,
  id: inputCollection.id,
  joystickDirections: inputCollection.joystickDirections,
  keyboardButtons: inputCollection.keyboardButtons.map(getKeybindKeyboardButton),
  matchesDefaultInputs: inputCollection.matchesDefaultInputs,
  mouseButtons: inputCollection.mouseButtons,
  name: inputCollection.name,
});

export const postKeybinds = (): void => {
  const inputCollectionSnapshots: readonly InputCollectionSnapshot[] =
    getInputCollections();
  const inputCollections: KeybindInputCollection[] = [];
  for (const inputCollectionID of settingsKeybindInputCollectionIDs) {
    const inputCollectionSnapshot: InputCollectionSnapshot =
      getSettingsKeybindInputCollectionSnapshot(
        inputCollectionSnapshots,
        inputCollectionID,
      );
    inputCollections.push(getKeybindInputCollection(inputCollectionSnapshot));
  }
  postWindowMessage<KeybindsUpstreamWindowMessage>({
    data: {
      inputCollections,
    },
    event: "keybinds",
  });
};
