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
import { MainMenuCharacter } from "../../../classes/MainMenuCharacter";
import {
  MainMenuCharacterSelectStateSchema,
  MainMenuStateSchema,
  state,
} from "../../../state";
import { createMainMenuCharacterCreateState } from "../../state/main-menu/createMainMenuCharacterCreateState";
import { createPanel } from "../components/createPanel";
import { createPlayerSprite } from "../components/createPlayerSprite";
import { createPressableButton } from "../components/createPressableButton";
import { getCyclicIndex } from "../../getCyclicIndex";
import { getDefaultedClothesDye } from "../../defaulted-cosmetics/getDefaultedClothesDye";
import { getDefaultedHairDye } from "../../defaulted-cosmetics/getDefaultedHairDye";
import { getDefaultedMask } from "../../defaulted-cosmetics/getDefaultedMask";
import { getDefaultedOutfit } from "../../defaulted-cosmetics/getDefaultedOutfit";
import { getDefinable } from "definables";
import { getMainMenuCharacterSelectState } from "../../state/main-menu/getMainMenuCharacterSelectState";
import { getMainMenuState } from "../../state/main-menu/getMainMenuState";
import { getMaxCharacters } from "../../getMaxCharacters";
import { mainMenuCharactersPerPage } from "../../../constants/mainMenuCharactersPerPage";
import { postWindowMessage } from "../../postWindowMessage";

export const createMainMenuCharacterSelectUI = (): void => {
  const condition = (): boolean =>
    state.values.mainMenuState !== null &&
    state.values.mainMenuState.values.characterSelectState !== null;
  const getIndexOffset = (): number =>
    getMainMenuCharacterSelectState().values.page * mainMenuCharactersPerPage;
  const getOffsetIndex = (index: number): number => index + getIndexOffset();
  const hasCharacter = (index: number): boolean => {
    const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
    return (
      mainMenuState.values.mainMenuCharacterIDs.length - getIndexOffset() >
      index
    );
  };
  const getLastPage = (): number => {
    const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
    return Math.max(
      Math.floor(
        (mainMenuState.values.mainMenuCharacterIDs.length - 1) /
          mainMenuCharactersPerPage,
      ),
      0,
    );
  };
  const page = (offset: number): void => {
    const pages: number[] = [];
    for (let i: number = 0; i < getLastPage() + 1; i++) {
      pages.push(i);
    }
    getMainMenuCharacterSelectState().setValues({
      page: getCyclicIndex(
        pages.indexOf(getMainMenuCharacterSelectState().values.page) + offset,
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
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      if (
        mainMenuState.values.mainMenuCharacterIDs.length >= getMaxCharacters()
      ) {
        postWindowMessage({ event: "subscribe/character-limit" });
      } else {
        getMainMenuState().setValues({
          characterCreateState: createMainMenuCharacterCreateState(),
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
    condition: (): boolean => {
      if (condition()) {
        const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
        return (
          mainMenuState.values.mainMenuCharacterIDs.length > 0 &&
          getMainMenuCharacterSelectState().values
            .mainMenuCharacterIDToDelete === null
        );
      }
      return false;
    },
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      getMainMenuCharacterSelectState().setValues({
        isDeleting: false,
        isSorting: getMainMenuCharacterSelectState().values.isSorting === false,
        mainMenuCharacterIDToDelete: null,
      });
    },
    text: (): CreateLabelOptionsText =>
      getMainMenuCharacterSelectState().values.isSorting
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
      getMainMenuCharacterSelectState().values.isDeleting &&
      getMainMenuCharacterSelectState().values.mainMenuCharacterIDToDelete !==
        null,
    height: 16,
    imagePath: "pressable-buttons/red",
    onClick: (): void => {
      const { mainMenuCharacterIDToDelete } =
        getMainMenuCharacterSelectState().values;
      if (mainMenuCharacterIDToDelete === null) {
        throw new Error("Character ID to delete is null");
      }
      emitToSocketioServer<MainMenuCharacterSelectDeleteCharacterRequest>({
        data: {
          mainMenuCharacterID: mainMenuCharacterIDToDelete,
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
    condition: (): boolean => {
      if (condition()) {
        const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
        return mainMenuState.values.mainMenuCharacterIDs.length > 0;
      }
      return false;
    },
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      getMainMenuCharacterSelectState().setValues({
        isDeleting:
          getMainMenuCharacterSelectState().values.isDeleting === false,
        isSorting: false,
        mainMenuCharacterIDToDelete: null,
      });
    },
    text: (): CreateLabelOptionsText =>
      getMainMenuCharacterSelectState().values.isDeleting
        ? { value: "Cancel" }
        : { value: "Delete" },
    width: 48,
    x: 196,
    y: 38,
  });
  // For each character slot
  for (let i: number = 0; i < mainMenuCharactersPerPage; i++) {
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
    const getMainMenuCharacter = (): MainMenuCharacter => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      return getDefinable(
        MainMenuCharacter,
        mainMenuState.values.mainMenuCharacterIDs[getOffsetIndex(i)] as string,
      );
    };
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
      clothesDyeID: (): string => {
        const mainMenuCharacter: MainMenuCharacter = getMainMenuCharacter();
        return getDefaultedClothesDye(
          mainMenuCharacter.hasClothesDyeItem()
            ? mainMenuCharacter.clothesDyeItem.id
            : undefined,
        ).id;
      },
      condition: characterCondition,
      direction: Direction.Down,
      figureID: (): string => getMainMenuCharacter().figure.id,
      hairDyeID: (): string => {
        const mainMenuCharacter: MainMenuCharacter = getMainMenuCharacter();
        return getDefaultedHairDye(
          mainMenuCharacter.hasHairDyeItem()
            ? mainMenuCharacter.hairDyeItem.id
            : undefined,
        ).id;
      },
      isAnimated: true,
      maskID: (): string => {
        const mainMenuCharacter: MainMenuCharacter = getMainMenuCharacter();
        return getDefaultedMask(
          mainMenuCharacter.hasMaskItem()
            ? mainMenuCharacter.maskItem.id
            : undefined,
        ).id;
      },
      outfitID: (): string => {
        const mainMenuCharacter: MainMenuCharacter = getMainMenuCharacter();
        return getDefaultedOutfit(
          mainMenuCharacter.hasOutfitItem()
            ? mainMenuCharacter.outfitItem.id
            : undefined,
        ).id;
      },
      skinColorID: (): string => getMainMenuCharacter().skinColor.id,
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
        const mainMenuCharacter: MainMenuCharacter = getMainMenuCharacter();
        return {
          value: `Lv${mainMenuCharacter.level} ${
            getDefinable(Class, mainMenuCharacter.class.id).abbreviation
          }`,
        };
      },
    });
    // Play button
    const playCondition = (): boolean =>
      characterCondition() &&
      getMainMenuCharacterSelectState().values.isDeleting === false &&
      getMainMenuCharacterSelectState().values.isSorting === false;
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
        const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
        const index: number = getOffsetIndex(i);
        const mainMenuCharacterID: string | undefined =
          mainMenuState.values.mainMenuCharacterIDs[index];
        if (typeof mainMenuCharacterID === "undefined") {
          throw new Error("Out of bounds character IDs index");
        }
        if (canPlayCharacter()) {
          emitToSocketioServer<MainMenuCharacterSelectSelectCharacterRequest>({
            data: {
              mainMenuCharacterID,
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
      getMainMenuCharacterSelectState().values.isSorting &&
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
        const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
        const mainMenuCharacterID: string | undefined =
          mainMenuState.values.mainMenuCharacterIDs[getOffsetIndex(i)];
        if (typeof mainMenuCharacterID === "undefined") {
          throw new Error("Out of bounds character IDs index");
        }
        emitToSocketioServer<MainMenuCharacterSelectSortCharacterLeftRequest>({
          data: { mainMenuCharacterID },
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
        const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
        const mainMenuCharacterID: string | undefined =
          mainMenuState.values.mainMenuCharacterIDs[getOffsetIndex(i)];
        if (typeof mainMenuCharacterID === "undefined") {
          throw new Error("Out of bounds character IDs index");
        }
        emitToSocketioServer<MainMenuCharacterSelectSortCharacterRightRequest>({
          data: { mainMenuCharacterID },
          event: "main-menu/character-select/sort-character-right",
        });
      },
      width: sortRightWidth,
    });
    // Delete X
    const deleteButtonCondition = (): boolean => {
      if (characterCondition()) {
        const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
        return (
          characterCondition() &&
          getMainMenuCharacterSelectState().values.isDeleting &&
          (getMainMenuCharacterSelectState().values
            .mainMenuCharacterIDToDelete ===
            mainMenuState.values.mainMenuCharacterIDs[getOffsetIndex(i)] ||
            getMainMenuCharacterSelectState().values
              .mainMenuCharacterIDToDelete === null)
        );
      }
      return false;
    };
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
        const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
        const characterSelectState: State<MainMenuCharacterSelectStateSchema> =
          getMainMenuCharacterSelectState();
        const index: number = getOffsetIndex(i);
        characterSelectState.setValues({
          mainMenuCharacterIDToDelete:
            characterSelectState.values.mainMenuCharacterIDToDelete !==
            mainMenuState.values.mainMenuCharacterIDs[index]
              ? mainMenuState.values.mainMenuCharacterIDs[index]
              : null,
        });
      },
      width: deleteButtonWidth,
    });
  }
  // Page number
  const paginationCondition = (): boolean => {
    if (condition()) {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      return (
        mainMenuState.values.mainMenuCharacterIDs.length >
        mainMenuCharactersPerPage
      );
    }
    return false;
  };
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
      value: `Page ${getMainMenuCharacterSelectState().values.page + 1}`,
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