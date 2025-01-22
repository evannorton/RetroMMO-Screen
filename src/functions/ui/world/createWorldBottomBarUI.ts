import { Ability } from "../../../classes/Ability";
import {
  Color,
  Direction,
  ResourcePool,
  WorldUseAbilityRequest,
} from "retrommo-types";
import {
  State,
  createButton,
  createLabel,
  createQuadrilateral,
  emitToSocketioServer,
  getCurrentTime,
} from "pixel-pigeon";
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
import {
  getSpellbookAbility,
  spellbookWorldMenu,
} from "../../../world-menus/spellbookWorldMenu";
import { getWorldState } from "../../state/getWorldState";
import { handleWorldCharacterClick } from "../../handleWorldCharacterClick";
import {
  inventoryInputCollectionID,
  questLogInputCollectionID,
  spellbookInputCollectionID,
  statsInputCollectionID,
} from "../../../input";
import { inventoryWorldMenu } from "../../../world-menus/inventoryWorldMenu";
import { isWorldCombatInProgress } from "../../isWorldCombatInProgress";
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
      statusIconImagePath: (): string | undefined => {
        const worldCharacter: WorldCharacter = getWorldCharacter();
        if (worldCharacter.hasIsRenewing() && worldCharacter.isRenewing) {
          return "status-icons/renew";
        }
        return undefined;
      },
    });
    createButton({
      coordinates: {
        condition: (): boolean =>
          partyMemberCondition() && isWorldCombatInProgress() === false,
        x: playerX,
        y: playerY,
      },
      height: tileSize,
      onClick: (): void => {
        if (spellbookWorldMenu.state.values.startedTargetingAt !== null) {
          if (spellbookWorldMenu.state.values.selectedAbilityIndex === null) {
            throw new Error("No selected ability index.");
          }
          const ability: Ability = getSpellbookAbility(
            spellbookWorldMenu.state.values.selectedAbilityIndex,
          );
          const worldCharacter: WorldCharacter = getWorldCharacter();
          const partyMemberWorldCharacter: WorldCharacter | undefined =
            worldCharacter.party.worldCharacters[partyMemberIndex];
          if (typeof partyMemberWorldCharacter === "undefined") {
            throw new Error("No party member world character.");
          }
          emitToSocketioServer<WorldUseAbilityRequest>({
            data: {
              abilityID: ability.id,
              playerID: partyMemberWorldCharacter.playerID,
            },
            event: "world/use-ability",
          });
          spellbookWorldMenu.state.setValues({ isAwaitingWorldCombat: true });
        } else {
          handleWorldCharacterClick(getWorldCharacter().id);
        }
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
    // Bottom bar player ability target
    const targetCondition = (): boolean =>
      partyMemberCondition() &&
      spellbookWorldMenu.isOpen() &&
      spellbookWorldMenu.state.values.startedTargetingAt !== null &&
      (getCurrentTime() - spellbookWorldMenu.state.values.startedTargetingAt) %
        1500 <
        750 &&
      isWorldCombatInProgress() === false;
    createQuadrilateral({
      color: Color.VeryDarkGray,
      coordinates: {
        condition: targetCondition,
        x: playerX + 3,
        y: playerY + 11,
      },
      height: 9,
      width: 9,
    });
    createLabel({
      color: Color.White,
      coordinates: {
        condition: targetCondition,
        x: playerX + 8,
        y: playerY + 12,
      },
      horizontalAlignment: "center",
      text: {
        value: String(partyMemberIndex + 1),
      },
    });
  }
  // Leave party button
  const leavePartyCondition = (): boolean =>
    condition() &&
    getDefinable(WorldCharacter, getWorldState().values.worldCharacterID).party
      .worldCharacters.length > 1 &&
    isWorldCombatInProgress() === false;
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
    condition: (): boolean =>
      condition() && isWorldCombatInProgress() === false,
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
    condition: (): boolean =>
      condition() && isWorldCombatInProgress() === false,
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
    condition: (): boolean =>
      condition() && isWorldCombatInProgress() === false,
    imagePath: "bottom-bar-icons/spellbook",
    inputCollectionID: spellbookInputCollectionID,
    isSelected: (): boolean => spellbookWorldMenu.isOpen(),
    onClick: (): void => {
      if (spellbookWorldMenu.isOpen()) {
        spellbookWorldMenu.close();
      } else {
        closeWorldMenus();
        spellbookWorldMenu.open({});
      }
    },
    x: 255,
    y: 214,
  });
  // Inventory icon
  createBottomBarIcon({
    condition: (): boolean =>
      condition() && isWorldCombatInProgress() === false,
    imagePath: "bottom-bar-icons/inventory",
    inputCollectionID: inventoryInputCollectionID,
    isSelected: (): boolean => inventoryWorldMenu.isOpen(),
    onClick: (): void => {
      if (inventoryWorldMenu.isOpen()) {
        inventoryWorldMenu.close();
      } else {
        closeWorldMenus();
        inventoryWorldMenu.open({});
      }
    },
    x: 278,
    y: 214,
  });
};
