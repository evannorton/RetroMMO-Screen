import {
  createInputCollection,
  createInputPressHandler,
  takeScreenshot,
} from "pixel-pigeon";

const screenshotInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyP" }],
  name: "Screenshot",
});

export const statsInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyZ" }],
  name: "Stats",
});
export const spellbookInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyX" }],
  name: "Spellbook",
});
export const inventoryInputCollectionID: string = createInputCollection({
  keyboardButtons: [{ value: "KeyC" }],
  name: "Inventory",
});
createInputPressHandler({
  inputCollectionID: screenshotInputCollectionID,
  onInput: (): void => {
    takeScreenshot();
  },
});
