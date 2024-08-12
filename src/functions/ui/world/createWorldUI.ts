import { Character } from "../../../classes/Character";
import { Direction, WorldExitToMainMenuRequest } from "retrommo-types";
import { createBottomBarIcon } from "../components/createBottomBarIcon";
import { createButton, createSprite, emitToSocketioServer } from "pixel-pigeon";
import { createPanel } from "../components/createPanel";
import { createPlayerSprite } from "../components/createPlayerSprite";
import { getDefinable } from "../../../definables";
import {
  inventoryInputCollectionID,
  spellbookInputCollectionID,
  statsInputCollectionID,
} from "../../../input";
import { state } from "../../../state";

export const createWorldUI = (): void => {
  const condition = (): boolean => state.values.worldState !== null;
  // Logout
  createPanel({
    condition,
    height: 24,
    imagePath: "panels/basic",
    width: 48,
    x: 256,
    y: 0,
  });
  createSprite({
    animationID: "default",
    animations: [
      {
        frames: [
          {
            height: 14,
            sourceHeight: 14,
            sourceWidth: 28,
            sourceX: 0,
            sourceY: 0,
            width: 28,
          },
        ],
        id: "default",
      },
    ],
    coordinates: {
      condition,
      x: 266,
      y: 5,
    },
    imagePath: "arrows/logout",
  });
  createButton({
    coordinates: {
      condition,
      x: 266,
      y: 5,
    },
    height: 14,
    onClick: (): void => {
      emitToSocketioServer<WorldExitToMainMenuRequest>({
        data: {},
        event: "world/exit-to-main-menu",
      });
    },
    width: 28,
  });
  // Bottom bar background
  createPanel({
    condition,
    height: 32,
    imagePath: "panels/basic",
    width: 304,
    x: 0,
    y: 208,
  });
  for (
    let partyMemberIndex: number = 0;
    partyMemberIndex < 3;
    partyMemberIndex++
  ) {
    const getCharacter = (): Character => {
      if (state.values.worldState === null) {
        throw new Error("No world state.");
      }
      const character: Character = getDefinable(
        Character,
        state.values.worldState.values.characterID,
      );
      const partyMemberCharacter: Character | undefined =
        character.party.characters[partyMemberIndex];
      if (typeof partyMemberCharacter === "undefined") {
        throw new Error("No party member character.");
      }
      return partyMemberCharacter;
    };
    createPlayerSprite({
      clothesDyeID: (): string => getCharacter().getClothesDye().id,
      condition: (): boolean => {
        if (condition()) {
          if (state.values.worldState === null) {
            throw new Error("No world state.");
          }
          const character: Character = getDefinable(
            Character,
            state.values.worldState.values.characterID,
          );
          return partyMemberIndex < character.party.characters.length;
        }
        return false;
      },
      direction: Direction.Down,
      figureID: (): string => getCharacter().figure.id,
      hairDyeID: (): string => getCharacter().getHairDye().id,
      maskID: (): string => getCharacter().getMask().id,
      outfitID: (): string => getCharacter().getOutfit().id,
      skinColorID: (): string => getCharacter().skinColor.id,
      x: 6 + partyMemberIndex * 60,
      y: 216,
    });
  }
  // Stats icon
  createBottomBarIcon({
    condition,
    inputCollectionID: statsInputCollectionID,
    legacyOpen: (): void => {
      emitToSocketioServer({
        data: {},
        event: "legacy/open-stats",
      });
    },
    selectedImagePath: "bottom-bar-icons/stats/selected",
    unselectedImagePath: "bottom-bar-icons/stats/unselected",
    x: 232,
    y: 214,
  });
  // Spellbook icon
  createBottomBarIcon({
    condition,
    inputCollectionID: spellbookInputCollectionID,
    legacyOpen: (): void => {
      emitToSocketioServer({
        data: {},
        event: "legacy/open-spellbook",
      });
    },
    selectedImagePath: "bottom-bar-icons/spellbook/selected",
    unselectedImagePath: "bottom-bar-icons/spellbook/unselected",
    x: 255,
    y: 214,
  });
  // Inventory icon
  createBottomBarIcon({
    condition,
    inputCollectionID: inventoryInputCollectionID,
    legacyOpen: (): void => {
      emitToSocketioServer({
        data: {},
        event: "legacy/open-inventory",
      });
    },
    selectedImagePath: "bottom-bar-icons/inventory/selected",
    unselectedImagePath: "bottom-bar-icons/inventory/unselected",
    x: 278,
    y: 214,
  });
};
