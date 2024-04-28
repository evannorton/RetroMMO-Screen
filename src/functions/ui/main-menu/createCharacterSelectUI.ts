import { Character } from "../../../classes/Character";
import {
  CharacterSelectStateSchema,
  MainMenuStateSchema,
  state,
} from "../../../state";
import { Class } from "../../../classes/Class";
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
import { getCyclicIndex } from "../../getCyclicIndex";
import { getDefinable } from "../../../definables";

export const createCharacterSelectUI = (): void => {
  const condition = (): boolean =>
    state.values.mainMenuState !== null &&
    state.values.mainMenuState.values.characterSelectState !== null;
  const getMainMenuState = (): State<MainMenuStateSchema> => {
    if (state.values.mainMenuState === null) {
      throw new Error("mainMenuState is null");
    }
    return state.values.mainMenuState;
  };
  const getCharacterSelectState = (): State<CharacterSelectStateSchema> => {
    const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
    if (mainMenuState.values.characterSelectState === null) {
      throw new Error("characterSelectState is null");
    }
    return mainMenuState.values.characterSelectState;
  };
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
    color: "#ffffff",
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
      getMainMenuState().setValues({
        characterCreateState: createCharacterCreateState(),
        characterSelectState: null,
      });
    },
    text: { value: "Create" },
    width: 48,
    x: 60,
    y: 38,
  });
  // Sort characters button
  createPressableButton({
    condition,
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      getCharacterSelectState().setValues({
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
  // Delete character button
  createPressableButton({
    condition,
    height: 16,
    imagePath: "pressable-buttons/gray",
    onClick: (): void => {
      getCharacterSelectState().setValues({
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
    const getCharacter = (): Character =>
      getDefinable(Character, state.values.characterIDs[getOffsetIndex(i)]);
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
      clothesDyeItemID: (): string => getCharacter().clothesDyeItem.id,
      condition: characterCondition,
      figureID: (): string => getCharacter().figure.id,
      hairDyeItemID: (): string => getCharacter().hairDyeItem.id,
      maskItemID: (): string => getCharacter().maskItem.id,
      outfitItemID: (): string => getCharacter().outfitItem.id,
      skinColorID: (): string => getCharacter().skinColor.id,
      x: i % 2 === 0 ? 33 : 169,
      y: 69 + 42 * Math.floor(i / 2),
    });
    // Character info
    createLabel({
      color: "#ffffff",
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
      imagePath: "arrows/green",
      recolors: [],
    });
    createButton({
      coordinates: {
        condition: playCondition,
        x: playX,
        y: playY,
      },
      height: playHeight,
      onClick: (): void => {
        emitToSocketioServer({
          data: getOffsetIndex(i),
          event: "character-select/select-character",
        });
      },
      width: playWidth,
    });
    // Sort left arrow
    const sortCondition = (): boolean =>
      characterCondition() && getCharacterSelectState().values.isSorting;
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
      recolors: [],
    });
    createButton({
      coordinates: {
        condition: sortCondition,
        x: sortLeftX,
        y: sortLeftY,
      },
      height: sortLeftHeight,
      onClick: (): void => {
        emitToSocketioServer({
          data: getOffsetIndex(i),
          event: "character-select/sort-character-left",
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
      recolors: [],
    });
    createButton({
      coordinates: {
        condition: sortCondition,
        x: sortRightX,
        y: sortRightY,
      },
      height: sortRightHeight,
      onClick: (): void => {
        emitToSocketioServer({
          data: getOffsetIndex(i),
          event: "character-select/sort-character-right",
        });
      },
      width: sortRightWidth,
    });
  }
  // Page number
  createLabel({
    color: "#ffffff",
    coordinates: {
      condition,
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
      condition,
      x: 204,
      y: 202,
    },
    imagePath: "arrows/left",
    recolors: [],
  });
  createButton({
    coordinates: {
      condition,
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
      condition,
      x: 222,
      y: 202,
    },
    imagePath: "arrows/right",
    recolors: [],
  });
  createButton({
    coordinates: {
      condition,
      x: 222,
      y: 202,
    },
    height: 14,
    onClick: (): void => {
      page(1);
    },
    width: 14,
  });

  // for (let i: number = 0; i < serverConstants.pageSizes.characterSelect; i++) {

  //   // Delete
  //   new Picture(
  //     `character-select/character/${i}/delete`,
  //     (): PictureOptions => ({
  //       grayscale: false,
  //       height: 11,
  //       imageSourceSlug: "x",
  //       recolors: [],
  //       sourceHeight: 11,
  //       sourceWidth: 10,
  //       sourceX: 0,
  //       sourceY: 0,
  //       width: 10,
  //       x: i % 2 === 0 ? 125 : 261,
  //       y: 72 + 42 * Math.floor(i / 2),
  //     }),
  //     (player: Player): boolean =>
  //       player.isAtCharacterSelect &&
  //       player.hasCharacterSelectCharacters(i + 1) &&
  //       player.characterSelectIsDeleting &&
  //       (player.isDeletingIndex(i) || player.isDeletingNoIndex()),
  //     (player: Player): void => {
  //       player.selectCharacterForDeletion(i);
  //     },
  //   );
  // }

  // // Confirm delete character button
  // new Button(
  //   "character-select/confirm-delete",
  //   (): ButtonOptions => ({
  //     color: Color.White,
  //     height: 16,
  //     imageSourceSlug: "buttons/red",
  //     text: "Confirm",
  //     width: 48,
  //     x: 128,
  //     y: 38,
  //   }),
  //   (player: Player): boolean =>
  //     player.isAtCharacterSelect && player.isDeletingAnIndex(),
  //   (player: Player): void => {
  //     player.confirmDeleteCharacter();
  //   },
  // );
};
