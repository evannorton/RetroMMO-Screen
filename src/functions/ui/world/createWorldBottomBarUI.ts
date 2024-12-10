import { Color, Direction, ResourcePool } from "retrommo-types";
import { State, createButton, emitToSocketioServer } from "pixel-pigeon";
import { WorldCharacter } from "../../../classes/WorldCharacter";
import { WorldStateSchema, state } from "../../../state";
import { closeWorldMenus } from "../../world-menus/closeWorldMenus";
import { createBottomBarIcon } from "../components/createBottomBarIcon";
import { createCharacterSprite } from "../components/createCharacterSprite";
import { createImage } from "../components/createImage";
import { createPanel } from "../components/createPanel";
import { createResourceBar } from "../components/createResourceBar";
import { getConstants } from "../../getConstants";
import { getDefaultedClothesDye } from "../../defaulted-cosmetics/getDefaultedClothesDye";
import { getDefaultedHairDye } from "../../defaulted-cosmetics/getDefaultedHairDye";
import { getDefaultedMask } from "../../defaulted-cosmetics/getDefaultedMask";
import { getDefaultedOutfit } from "../../defaulted-cosmetics/getDefaultedOutfit";
import { getDefinable } from "definables";
import { getWorldState } from "../../state/getWorldState";
import { handleWorldCharacterClick } from "../../handleWorldCharacterClick";
import {
  inventoryInputCollectionID,
  questLogInputCollectionID,
  spellbookInputCollectionID,
  statsInputCollectionID,
} from "../../../input";
import { questLogWorldMenu } from "../../../world-menus/questLogWorldMenu";

export const createWorldBottomBarUI = (): void => {
  const tileSize: number = getConstants()["tile-size"];
  const condition = (): boolean => state.values.worldState !== null;
  // Bottom bar background
  createPanel({
    condition,
    height: 32,
    imagePath: "panels/basic",
    width: 304,
    x: 0,
    y: 208,
  });
  // For each party member
  for (
    let partyMemberIndex: number = 0;
    partyMemberIndex < 3;
    partyMemberIndex++
  ) {
    const partyMemberCondition = (): boolean => {
      if (condition()) {
        const worldState: State<WorldStateSchema> = getWorldState();
        const character: WorldCharacter = getDefinable(
          WorldCharacter,
          worldState.values.worldCharacterID,
        );
        return partyMemberIndex < character.party.worldCharacters.length;
      }
      return false;
    };
    const getWorldCharacter = (): WorldCharacter => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const partyMemberCharacter: WorldCharacter | undefined =
        worldCharacter.party.worldCharacters[partyMemberIndex];
      if (typeof partyMemberCharacter === "undefined") {
        throw new Error("No party member character.");
      }
      return partyMemberCharacter;
    };
    const partyMemberMPCondition = (): boolean =>
      getWorldCharacter().class.resourcePool === ResourcePool.MP;
    // Bottom bar player sprite
    const playerX: number = 6 + partyMemberIndex * 60;
    const playerY: number = 216;
    createCharacterSprite({
      clothesDyeID: (): string => {
        const worldCharacter: WorldCharacter = getWorldCharacter();
        return getDefaultedClothesDye(
          worldCharacter.hasClothesDyeItem()
            ? worldCharacter.clothesDyeItem.id
            : undefined,
        ).id;
      },
      coordinates: {
        condition: partyMemberCondition,
        x: playerX,
        y: playerY,
      },
      direction: Direction.Down,
      figureID: (): string => getWorldCharacter().figure.id,
      hairDyeID: (): string => {
        const worldCharacter: WorldCharacter = getWorldCharacter();
        return getDefaultedHairDye(
          worldCharacter.hasHairDyeItem()
            ? worldCharacter.hairDyeItem.id
            : undefined,
        ).id;
      },
      maskID: (): string => {
        const worldCharacter: WorldCharacter = getWorldCharacter();
        return getDefaultedMask(
          worldCharacter.hasMaskItem() ? worldCharacter.maskItem.id : undefined,
        ).id;
      },
      outfitID: (): string => {
        const worldCharacter: WorldCharacter = getWorldCharacter();
        return getDefaultedOutfit(
          worldCharacter.hasOutfitItem()
            ? worldCharacter.outfitItem.id
            : undefined,
        ).id;
      },
      skinColorID: (): string => getWorldCharacter().skinColor.id,
    });
    createButton({
      coordinates: {
        condition: partyMemberCondition,
        x: playerX,
        y: playerY,
      },
      height: tileSize,
      onClick: (): void => {
        handleWorldCharacterClick(getWorldCharacter().id);
      },
      width: tileSize,
    });
    // Bottom bar player hp
    createResourceBar({
      condition: partyMemberCondition,
      iconImagePath: "resource-bar-icons/hp",
      maxValue: (): number => getWorldCharacter().resources.maxHP,
      primaryColor: Color.BrightRed,
      secondaryColor: Color.DarkPink,
      value: (): number => getWorldCharacter().resources.hp,
      x: 23 + partyMemberIndex * 60,
      y: 215,
    });
    // Bottom bar player mp
    createResourceBar({
      condition: (): boolean =>
        partyMemberCondition() && partyMemberMPCondition(),
      iconImagePath: "resource-bar-icons/mp",
      maxValue: (): number => getWorldCharacter().resources.maxMP as number,
      primaryColor: Color.PureBlue,
      secondaryColor: Color.StrongBlue,
      value: (): number => getWorldCharacter().resources.mp as number,
      x: 23 + partyMemberIndex * 60,
      y: 225,
    });
  }
  // Leave party button
  const leavePartyCondition = (): boolean =>
    condition() &&
    getDefinable(WorldCharacter, getWorldState().values.worldCharacterID).party
      .worldCharacters.length > 1;
  createImage({
    condition: leavePartyCondition,
    height: 11,
    imagePath: "x",
    onClick: (): void => {
      emitToSocketioServer({
        data: {},
        event: "world/leave-party",
      });
    },
    width: 10,
    x: 192,
    y: 219,
  });
  // Stats icon
  createBottomBarIcon({
    condition,
    imagePath: "bottom-bar-icons/stats",
    inputCollectionID: statsInputCollectionID,
    isSelected: false,
    onClick: (): void => {
      closeWorldMenus();
      emitToSocketioServer({
        data: {},
        event: "legacy/open-stats",
      });
    },
    x: 209,
    y: 214,
  });
  // Quest log icon
  createBottomBarIcon({
    condition,
    imagePath: "bottom-bar-icons/quest-log",
    inputCollectionID: questLogInputCollectionID,
    isSelected: (): boolean => questLogWorldMenu.isOpen(),
    onClick: (): void => {
      if (questLogWorldMenu.isOpen()) {
        questLogWorldMenu.close();
      } else {
        closeWorldMenus();
        questLogWorldMenu.open({});
      }
    },
    x: 232,
    y: 214,
  });
  // Spellbook icon
  createBottomBarIcon({
    condition,
    imagePath: "bottom-bar-icons/spellbook",
    inputCollectionID: spellbookInputCollectionID,
    isSelected: false,
    onClick: (): void => {
      closeWorldMenus();
      emitToSocketioServer({
        data: {},
        event: "legacy/open-spellbook",
      });
    },
    x: 255,
    y: 214,
  });
  // Inventory icon
  createBottomBarIcon({
    condition,
    imagePath: "bottom-bar-icons/inventory",
    inputCollectionID: inventoryInputCollectionID,
    isSelected: false,
    onClick: (): void => {
      closeWorldMenus();
      emitToSocketioServer({
        data: {},
        event: "legacy/open-inventory",
      });
    },
    x: 278,
    y: 214,
  });
};
