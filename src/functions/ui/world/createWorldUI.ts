import {
  Color,
  Direction,
  ResourcePool,
  WorldExitToMainMenuRequest,
} from "retrommo-types";
import {
  State,
  createButton,
  createSprite,
  emitToSocketioServer,
} from "pixel-pigeon";
import { WorldCharacter } from "../../../classes/WorldCharacter";
import { WorldStateSchema, state } from "../../../state";
import { createBottomBarIcon } from "../components/createBottomBarIcon";
import { createPanel } from "../components/createPanel";
import { createPlayerSprite } from "../components/createPlayerSprite";
import { createResourceBar } from "../components/createResourceBar";
import { getDefaultedClothesDye } from "../../getDefaultedCosmetics/getDefaultedClothesDye";
import { getDefaultedHairDye } from "../../getDefaultedCosmetics/getDefaultedHairDye";
import { getDefaultedMask } from "../../getDefaultedCosmetics/getDefaultedMask";
import { getDefaultedOutfit } from "../../getDefaultedCosmetics/getDefaultedOutfit";
import { getDefinable } from "../../../definables";
import { getWorldState } from "../../state/getWorldState";
import {
  inventoryInputCollectionID,
  spellbookInputCollectionID,
  statsInputCollectionID,
} from "../../../input";

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
    createPlayerSprite({
      clothesDyeID: (): string => {
        const worldCharacter: WorldCharacter = getWorldCharacter();
        return getDefaultedClothesDye(
          worldCharacter.hasClothesDyeItem()
            ? worldCharacter.clothesDyeItem.id
            : undefined,
        ).id;
      },
      condition: partyMemberCondition,
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
      x: 6 + partyMemberIndex * 60,
      y: 216,
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
