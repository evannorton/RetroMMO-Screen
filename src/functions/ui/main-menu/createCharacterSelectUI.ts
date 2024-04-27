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
import { Savefile, SavefileCharacter } from "retrommo-types";
import { createCharacterCreateState } from "../../state/main-menu/createCharacterCreateState";
import { createPanel } from "../components/createPanel";
import { createPlayerSprite } from "../components/createPlayerSprite";
import { createPressableButton } from "../components/createPressableButton";
import {
  defaultClothesDyeItemID,
  defaultHairDyeItemID,
  defaultMaskItemID,
  defaultOutfitItemID,
} from "../../../constants/defaultVanities";
import { getCyclicIndex } from "../../getCyclicIndex";
import { getDefinable } from "../../../definables";

export const createCharacterSelectUI = (): void => {
  const condition = (): boolean =>
    state.values.mainMenuState !== null &&
    state.values.mainMenuState.values.characterSelectState !== null;
  const getSavefile = (): Savefile => {
    if (state.values.savefile === null) {
      throw new Error("savefile is null");
    }
    return state.values.savefile;
  };
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
    getSavefile().characters.length - getIndexOffset() > index;
  const getLastPage = (): number =>
    Math.max(
      Math.floor((getSavefile().characters.length - 1) / charactersPerPage),
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
        if (state.values.savefile === null) {
          throw new Error("savefile is null");
        }
        return hasCharacter(i);
      }
      return false;
    };
    const getCharacter = (): SavefileCharacter =>
      getSavefile().characters[getOffsetIndex(i)];
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
      clothesDyeItemID: (): string => {
        const character: SavefileCharacter = getCharacter();
        if (character.clothesDyeItemInstance !== null) {
          return character.clothesDyeItemInstance.itemID;
        }
        return defaultClothesDyeItemID;
      },
      condition: characterCondition,
      figureID: (): string => getCharacter().figureID,
      hairDyeItemID: (): string => {
        const character: SavefileCharacter = getCharacter();
        if (character.hairDyeItemInstance !== null) {
          return character.hairDyeItemInstance.itemID;
        }
        return defaultHairDyeItemID;
      },
      maskItemID: (): string => {
        const character: SavefileCharacter = getCharacter();
        if (character.maskItemInstance !== null) {
          return character.maskItemInstance.itemID;
        }
        return defaultMaskItemID;
      },
      outfitItemID: (): string => {
        const character: SavefileCharacter = getCharacter();
        if (character.outfitItemInstance !== null) {
          return character.outfitItemInstance.itemID;
        }
        return defaultOutfitItemID;
      },
      skinColorID: (): string => getCharacter().skinColorID,
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
        const character: SavefileCharacter = getCharacter();
        return {
          value: `Lv${character.level} ${
            getDefinable(Class, character.classID).abbreviation
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
          event: "select-character",
        });
      },
      width: playWidth,
    });
    //   // Play
    //   new Picture(
    //     `character-select/character/${i}/play`,
    //     (player: Player): PictureOptions => ({
    //       grayscale: false,
    //       height: 12,
    //       imageSourceSlug: player.canPlayCharacterSelectCharacter(i)
    //         ? "arrows/green"
    //         : "arrows/right-small",
    //       recolors: [],
    //       sourceHeight: 12,
    //       sourceWidth: 10,
    //       sourceX: 0,
    //       sourceY: 0,
    //       width: 10,
    //       x: i % 2 === 0 ? 125 : 261,
    //       y: 71 + 42 * Math.floor(i / 2),
    //     }),
    //     (player: Player): boolean =>
    //       player.isAtCharacterSelect &&
    //       player.hasCharacterSelectCharacters(i + 1) &&
    //       player.characterSelectIsDeleting === false &&
    //       player.characterSelectIsSorting === false,
    //     (player: Player): void => {
    //       player.playCharacterIndex(i);
    //     },
    //   );
    //   new Label(
    //     `character-select/character/${i}`,
    //     (player: Player): LabelOptions => {
    //       const character: Character = player.getCharacterSelectCharacter(i);
    //       const characterSelectClass: Class = getClass(character.classSlug);
    //       return {
    //         color: Color.White,
    //         horizontalAlignment: "center",
    //         maxLines: 1,
    //         maxWidth: getGameWidth(),
    //         size: 1,
    //         text: `Lv${character.level} ${characterSelectClass.abbreviation}`,
    //         verticalAlignment: "middle",
    //         x: i % 2 === 0 ? 84 : 220,
    //         y: 77 + 42 * Math.floor(i / 2),
    //       };
    //     },
    //     (player: Player): boolean =>
    //       player.isAtCharacterSelect &&
    //       player.hasCharacterSelectCharacters(i + 1),
    //   );
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
  //   // Sort Left
  //   new Picture(
  //     `character-select/character/${i}/sort/left`,
  //     (): PictureOptions => ({
  //       grayscale: false,
  //       height: 12,
  //       imageSourceSlug: "arrows/left-small",
  //       recolors: [],
  //       sourceHeight: 12,
  //       sourceWidth: 10,
  //       sourceX: 0,
  //       sourceY: 0,
  //       width: 10,
  //       x: i % 2 === 0 ? 114 : 250,
  //       y: 71 + 42 * Math.floor(i / 2),
  //     }),
  //     (player: Player): boolean =>
  //       player.isAtCharacterSelect &&
  //       player.hasAccessibleCharacterSelectCharacters(i + 1) &&
  //       player.characterIsFirstSortableCharacter(i) === false &&
  //       player.characterSelectIsSorting,
  //     (player: Player): void => {
  //       player.sortCharacterLeft(i);
  //     },
  //   );
  //   // Sort Right
  //   new Picture(
  //     `character-select/character/${i}/sort/right`,
  //     (): PictureOptions => ({
  //       grayscale: false,
  //       height: 12,
  //       imageSourceSlug: "arrows/right-small",
  //       recolors: [],
  //       sourceHeight: 12,
  //       sourceWidth: 10,
  //       sourceX: 0,
  //       sourceY: 0,
  //       width: 10,
  //       x: i % 2 === 0 ? 129 : 265,
  //       y: 71 + 42 * Math.floor(i / 2),
  //     }),
  //     (player: Player): boolean =>
  //       player.isAtCharacterSelect &&
  //       player.hasAccessibleCharacterSelectCharacters(i + 1) &&
  //       player.characterIsLastSortableCharacter(i) === false &&
  //       player.characterSelectIsSorting,
  //     (player: Player): void => {
  //       player.sortCharacterRight(i);
  //     },
  //   );
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
