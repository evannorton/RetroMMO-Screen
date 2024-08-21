import { Character } from "../../../classes/Character";
import { CharacterSelectStateSchema, state } from "../../../state";
import { Class } from "../../../classes/Class";
import {
  Color,
  Direction,
  MainMenuCharacterSelectDeleteCharacterRequest,
  MainMenuCharacterSelectSelectCharacterRequest,
  MainMenuCharacterSelectSortCharacterLeftRequest,
  MainMenuCharacterSelectSortCharacterRightRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  State,
  createButton,
  createLabel,
  createSprite,
  emitToSocketioServer,
  getGameHeight,
  getGameWidth,
} from "pixel-pigeon";
import { createCharacterCreateState } from "../../state/main-menu/createCharacterCreateState";
import { createPanel } from "../components/createPanel";
import { createPlayerSprite } from "../components/createPlayerSprite";
import { createPressableButton } from "../components/createPressableButton";
import { getCharacterSelectState } from "../../state/main-menu/getCharacterSelectState";
import { getCyclicIndex } from "../../getCyclicIndex";
import { getDefinable } from "../../../definables";
import { getMainMenuState } from "../../state/main-menu/getMainMenuState";
import { getMaxCharacters } from "../../getMaxCharacters";
import { postWindowMessage } from "../../postWindowMessage";

export const createCharacterSelectUI = (): void => {
  const condition = (): boolean =>
    state.values.mainMenuState !== null &&
    state.values.mainMenuState.values.characterSelectState !== null;
  const charactersPerPage: number = 7;
  const getIndexOffset = (): number =>
    getCharacterSelectState().values.page * charactersPerPage;
  const getOffsetIndex = (index: number): number => index + getIndexOffset();
  const hasCharacter = (index: number): boolean =>
    state.values.characterIDs.length - getIndexOffset() > index;
  const getLastPage = (): number =>
    Math.max(
      Math.floor((state.values.characterIDs.length - 1) / charactersPerPage),
      0,
    );
  const page = (offset: number): void => {
    const pages: number[] = [];
    for (let i: number = 0; i < getLastPage() + 1; i++) {
      pages.push(i);
    }
    getCharacterSelectState().setValues({
      page: getCyclicIndex(
        pages.indexOf(getCharacterSelectState().values.page) + offset,
        pages,
      ),
    });
  };
  // Background panel
  createPanel({
    condition,
    height: getGameHeight(),
    imagePath: "panels/basic",
    width: getGameWidth(),
    x: 0,
    y: 0,
  });
  // Title
  createLabel({
    color: Color.White,
    coordinates: {
      condition,
      x: getGameWidth() / 2,
      y: 10,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 2,
    text: { value: "Character Select" },
  });
  // Create character button
  createPressableButton({
    condition,
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      if (state.values.characterIDs.length >= getMaxCharacters()) {
        postWindowMessage({ event: "subscribe/character-limit" });
      } else {
        getMainMenuState().setValues({
          characterCreateState: createCharacterCreateState(),
          characterSelectState: null,
        });
      }
    },
    text: { value: "Create" },
    width: 48,
    x: 60,
    y: 38,
  });
  // Sort characters button
  createPressableButton({
    condition: (): boolean =>
      condition() &&
      state.values.characterIDs.length > 0 &&
      getCharacterSelectState().values.characterIDToDelete === null,
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      getCharacterSelectState().setValues({
        characterIDToDelete: null,
        isDeleting: false,
        isSorting: getCharacterSelectState().values.isSorting === false,
      });
    },
    text: (): CreateLabelOptionsText =>
      getCharacterSelectState().values.isSorting
        ? { value: "Done" }
        : { value: "Sort" },
    width: 48,
    x: 128,
    y: 38,
  });
  // Confirm delete button
  createPressableButton({
    condition: (): boolean =>
      condition() &&
      getCharacterSelectState().values.isDeleting &&
      getCharacterSelectState().values.characterIDToDelete !== null,
    height: 16,
    imagePath: "pressable-buttons/red",
    onClick: (): void => {
      const { characterIDToDelete: characterID } =
        getCharacterSelectState().values;
      if (characterID === null) {
        throw new Error("Character ID to delete is null");
      }
      emitToSocketioServer<MainMenuCharacterSelectDeleteCharacterRequest>({
        data: {
          characterID,
        },
        event: "main-menu/character-select/delete-character",
      });
    },
    text: { value: "Confirm" },
    width: 48,
    x: 128,
    y: 38,
  });
  // Delete character button
  createPressableButton({
    condition: (): boolean =>
      condition() && state.values.characterIDs.length > 0,
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      getCharacterSelectState().setValues({
        characterIDToDelete: null,
        isDeleting: getCharacterSelectState().values.isDeleting === false,
        isSorting: false,
      });
    },
    text: (): CreateLabelOptionsText =>
      getCharacterSelectState().values.isDeleting
        ? { value: "Cancel" }
        : { value: "Delete" },
    width: 48,
    x: 196,
    y: 38,
  });
  // For each character slot
  for (let i: number = 0; i < charactersPerPage; i++) {
    const characterCondition = (): boolean => {
      if (condition()) {
        return hasCharacter(i);
      }
      return false;
    };
    const canPlayCharacter = (): boolean => {
      const index: number = getOffsetIndex(i);
      return index < getMaxCharacters();
    };
    const getCharacter = (): Character =>
      getDefinable(
        Character,
        state.values.characterIDs[getOffsetIndex(i)] as string,
      );
    // Character panel
    createPanel({
      condition: characterCondition,
      height: 34,
      imagePath: "panels/basic",
      width: 128,
      x: i % 2 === 0 ? 20 : 156,
      y: 60 + 42 * Math.floor(i / 2),
    });
    // Character sprite
    createPlayerSprite({
      clothesDyeID: (): string => getCharacter().getClothesDye().id,
      condition: characterCondition,
      direction: Direction.Down,
      figureID: (): string => getCharacter().figure.id,
      hairDyeID: (): string => getCharacter().getHairDye().id,
      isAnimated: true,
      maskID: (): string => getCharacter().getMask().id,
      outfitID: (): string => getCharacter().getOutfit().id,
      skinColorID: (): string => getCharacter().skinColor.id,
      x: i % 2 === 0 ? 33 : 169,
      y: 69 + 42 * Math.floor(i / 2),
    });
    // Character info
    createLabel({
      color: Color.White,
      coordinates: {
        condition: characterCondition,
        x: i % 2 === 0 ? 84 : 220,
        y: 74 + 42 * Math.floor(i / 2),
      },
      horizontalAlignment: "center",
      maxLines: 1,
      maxWidth: getGameWidth(),
      size: 1,
      text: (): CreateLabelOptionsText => {
        const character: Character = getCharacter();
        return {
          value: `Lv${character.level} ${
            getDefinable(Class, character.class.id).abbreviation
          }`,
        };
      },
    });
    // Play button
    const playCondition = (): boolean =>
      characterCondition() &&
      getCharacterSelectState().values.isDeleting === false &&
      getCharacterSelectState().values.isSorting === false;
    const playX: number = i % 2 === 0 ? 125 : 261;
    const playY: number = 71 + 42 * Math.floor(i / 2);
    const playWidth: number = 10;
    const playHeight: number = 12;
    createSprite({
      animationID: "default",
      animations: [
        {
          frames: [
            {
              height: playHeight,
              sourceHeight: playHeight,
              sourceWidth: playWidth,
              sourceX: 0,
              sourceY: 0,
              width: playWidth,
            },
          ],
          id: "default",
        },
      ],
      coordinates: {
        condition: playCondition,
        x: playX,
        y: playY,
      },
      imagePath: (): string =>
        canPlayCharacter() ? "arrows/green" : "arrows/right-small",
    });
    createButton({
      coordinates: {
        condition: playCondition,
        x: playX,
        y: playY,
      },
      height: playHeight,
      onClick: (): void => {
        const index: number = getOffsetIndex(i);
        const characterID: string | undefined =
          state.values.characterIDs[index];
        if (typeof characterID === "undefined") {
          throw new Error("Out of bounds character IDs index");
        }
        if (canPlayCharacter()) {
          emitToSocketioServer<MainMenuCharacterSelectSelectCharacterRequest>({
            data: {
              characterID,
            },
            event: "main-menu/character-select/select-character",
          });
        } else {
          postWindowMessage({ event: "subscribe/character-limit" });
        }
      },
      width: playWidth,
    });
    // Sort left arrow
    const sortCondition = (): boolean =>
      characterCondition() &&
      getCharacterSelectState().values.isSorting &&
      canPlayCharacter();
    const sortLeftX: number = i % 2 === 0 ? 114 : 250;
    const sortLeftY: number = 71 + 42 * Math.floor(i / 2);
    const sortLeftWidth: number = 10;
    const sortLeftHeight: number = 12;
    createSprite({
      animationID: "default",
      animations: [
        {
          frames: [
            {
              height: sortLeftHeight,
              sourceHeight: sortLeftHeight,
              sourceWidth: sortLeftWidth,
              sourceX: 0,
              sourceY: 0,
              width: sortLeftWidth,
            },
          ],
          id: "default",
        },
      ],
      coordinates: {
        condition: sortCondition,
        x: sortLeftX,
        y: sortLeftY,
      },
      imagePath: "arrows/left-small",
    });
    createButton({
      coordinates: {
        condition: sortCondition,
        x: sortLeftX,
        y: sortLeftY,
      },
      height: sortLeftHeight,
      onClick: (): void => {
        const characterID: string | undefined =
          state.values.characterIDs[getOffsetIndex(i)];
        if (typeof characterID === "undefined") {
          throw new Error("Out of bounds character IDs index");
        }
        emitToSocketioServer<MainMenuCharacterSelectSortCharacterLeftRequest>({
          data: { characterID },
          event: "main-menu/character-select/sort-character-left",
        });
      },
      width: sortLeftWidth,
    });
    // Sort right arrow
    const sortRightX: number = i % 2 === 0 ? 129 : 265;
    const sortRightY: number = 71 + 42 * Math.floor(i / 2);
    const sortRightWidth: number = 10;
    const sortRightHeight: number = 12;
    createSprite({
      animationID: "default",
      animations: [
        {
          frames: [
            {
              height: sortRightHeight,
              sourceHeight: sortRightHeight,
              sourceWidth: sortRightWidth,
              sourceX: 0,
              sourceY: 0,
              width: sortRightWidth,
            },
          ],
          id: "default",
        },
      ],
      coordinates: {
        condition: sortCondition,
        x: sortRightX,
        y: sortRightY,
      },
      imagePath: "arrows/right-small",
    });
    createButton({
      coordinates: {
        condition: sortCondition,
        x: sortRightX,
        y: sortRightY,
      },
      height: sortRightHeight,
      onClick: (): void => {
        const characterID: string | undefined =
          state.values.characterIDs[getOffsetIndex(i)];
        if (typeof characterID === "undefined") {
          throw new Error("Out of bounds character IDs index");
        }
        emitToSocketioServer<MainMenuCharacterSelectSortCharacterRightRequest>({
          data: { characterID },
          event: "main-menu/character-select/sort-character-right",
        });
      },
      width: sortRightWidth,
    });
    // Delete X
    const deleteButtonCondition = (): boolean =>
      characterCondition() &&
      getCharacterSelectState().values.isDeleting &&
      (getCharacterSelectState().values.characterIDToDelete ===
        state.values.characterIDs[getOffsetIndex(i)] ||
        getCharacterSelectState().values.characterIDToDelete === null);
    const deleteButtonX: number = i % 2 === 0 ? 125 : 261;
    const deleteButtonY: number = 72 + 42 * Math.floor(i / 2);
    const deleteButtonWidth: number = 10;
    const deleteButtonHeight: number = 11;
    createSprite({
      animationID: "default",
      animations: [
        {
          frames: [
            {
              height: deleteButtonHeight,
              sourceHeight: deleteButtonHeight,
              sourceWidth: deleteButtonWidth,
              sourceX: 0,
              sourceY: 0,
              width: deleteButtonWidth,
            },
          ],
          id: "default",
        },
      ],
      coordinates: {
        condition: deleteButtonCondition,
        x: deleteButtonX,
        y: deleteButtonY,
      },
      imagePath: "x",
    });
    createButton({
      coordinates: {
        condition: deleteButtonCondition,
        x: deleteButtonX,
        y: deleteButtonY,
      },
      height: deleteButtonHeight,
      onClick: (): void => {
        const characterSelectState: State<CharacterSelectStateSchema> =
          getCharacterSelectState();
        const index: number = getOffsetIndex(i);
        characterSelectState.setValues({
          characterIDToDelete:
            characterSelectState.values.characterIDToDelete !==
            state.values.characterIDs[index]
              ? state.values.characterIDs[index]
              : null,
        });
      },
      width: deleteButtonWidth,
    });
  }
  // Page number
  const paginationCondition = (): boolean =>
    condition() && state.values.characterIDs.length > charactersPerPage;
  createLabel({
    color: Color.White,
    coordinates: {
      condition: paginationCondition,
      x: 220,
      y: 190,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: getGameWidth(),
    size: 1,
    text: (): CreateLabelOptionsText => ({
      value: `Page ${getCharacterSelectState().values.page + 1}`,
    }),
  });
  // Page left arrow
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 14,
            sourceHeight: 14,
            sourceWidth: 14,
            sourceX: 0,
            sourceY: 0,
            width: 14,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition: paginationCondition,
      x: 204,
      y: 202,
    },
    imagePath: "arrows/left",
  });
  createButton({
    coordinates: {
      condition: paginationCondition,
      x: 204,
      y: 202,
    },
    height: 14,
    onClick: (): void => {
      page(-1);
    },
    width: 14,
  });
  // Page right arrow
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 14,
            sourceHeight: 14,
            sourceWidth: 14,
            sourceX: 0,
            sourceY: 0,
            width: 14,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition: paginationCondition,
      x: 222,
      y: 202,
    },
    imagePath: "arrows/right",
  });
  createButton({
    coordinates: {
      condition: paginationCondition,
      x: 222,
      y: 202,
    },
    height: 14,
    onClick: (): void => {
      page(1);
    },
    width: 14,
  });
};
