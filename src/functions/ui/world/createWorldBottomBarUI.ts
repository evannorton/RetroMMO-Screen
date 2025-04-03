import { Ability } from "../../../classes/Ability";
import {
  Color,
  Constants,
  Direction,
  ResourcePool,
  WorldUseAbilityRequest,
  WorldUseItemInstanceRequest,
} from "retrommo-types";
import { ItemInstance } from "../../../classes/ItemInstance";
import { Player } from "../../../classes/Player";
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
import {
  getBagItemInstance,
  inventoryWorldMenu,
} from "../../../world-menus/inventoryWorldMenu";
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
import { isWorldCombatInProgress } from "../../isWorldCombatInProgress";
import { questLogWorldMenu } from "../../../world-menus/questLogWorldMenu";
import { statsWorldMenu } from "../../../world-menus/statsWorldMenu";

export const createWorldBottomBarUI = (): void => {
  const tileSize: number = getConstants()["tile-size"];
  const condition = (): boolean => state.values.worldState !== null;
  const constants: Constants = getConstants();
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
    partyMemberIndex < constants["maximum-party-size"];
    partyMemberIndex++
  ) {
    const partyMemberCondition = (): boolean => {
      if (condition()) {
        const worldState: State<WorldStateSchema> = getWorldState();
        const worldCharacter: WorldCharacter = getDefinable(
          WorldCharacter,
          worldState.values.worldCharacterID,
        );
        return (
          partyMemberIndex <
          worldCharacter.player.character.party.playerIDs.length
        );
      }
      return false;
    };
    const getPlayer = (): Player => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      const partyMemberPlayer: Player | undefined =
        worldCharacter.player.character.party.players[partyMemberIndex];
      if (typeof partyMemberPlayer === "undefined") {
        throw new Error("No party member player.");
      }
      return partyMemberPlayer;
    };
    const partyMemberMPCondition = (): boolean =>
      getPlayer().character.class.resourcePool === ResourcePool.MP;
    // Bottom bar player sprite
    const playerX: number = 6 + partyMemberIndex * 60;
    const playerY: number = 216;
    createCharacterSprite({
      clothesDyeID: (): string => {
        const player: Player = getPlayer();
        return getDefaultedClothesDye(
          player.worldCharacter.hasClothesDyeItem()
            ? player.worldCharacter.clothesDyeItem.id
            : undefined,
        ).id;
      },
      coordinates: {
        condition: partyMemberCondition,
        x: playerX,
        y: playerY,
      },
      direction: Direction.Down,
      figureID: (): string => getPlayer().worldCharacter.figure.id,
      hairDyeID: (): string => {
        const player: Player = getPlayer();
        return getDefaultedHairDye(
          player.worldCharacter.hasHairDyeItem()
            ? player.worldCharacter.hairDyeItem.id
            : undefined,
        ).id;
      },
      maskID: (): string => {
        const player: Player = getPlayer();
        return getDefaultedMask(
          player.worldCharacter.hasMaskItem()
            ? player.worldCharacter.maskItem.id
            : undefined,
        ).id;
      },
      outfitID: (): string => {
        const player: Player = getPlayer();
        return getDefaultedOutfit(
          player.worldCharacter.hasOutfitItem()
            ? player.worldCharacter.outfitItem.id
            : undefined,
        ).id;
      },
      skinColorID: (): string => getPlayer().worldCharacter.skinColor.id,
      statusIconImagePath: (): string | undefined => {
        const player: Player = getPlayer();
        if (
          player.worldCharacter.hasIsRenewing() &&
          player.worldCharacter.isRenewing
        ) {
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
        const partyMemberWorldPlayer: Player = getPlayer();
        if (
          inventoryWorldMenu.isOpen() &&
          inventoryWorldMenu.state.values.startedTargetingAt !== null
        ) {
          if (inventoryWorldMenu.state.values.selectedBagItemIndex === null) {
            throw new Error("No selected bag item index.");
          }
          const itemInstance: ItemInstance = getBagItemInstance(
            inventoryWorldMenu.state.values.selectedBagItemIndex,
          );
          emitToSocketioServer<WorldUseItemInstanceRequest>({
            data: {
              itemInstanceID: itemInstance.id,
              playerID: partyMemberWorldPlayer.id,
            },
            event: "world/use-item-instance",
          });
          inventoryWorldMenu.state.setValues({ isAwaitingWorldCombat: true });
        } else if (
          spellbookWorldMenu.isOpen() &&
          spellbookWorldMenu.state.values.startedTargetingAt !== null
        ) {
          if (spellbookWorldMenu.state.values.selectedAbilityIndex === null) {
            throw new Error("No selected ability index.");
          }
          const ability: Ability = getSpellbookAbility(
            spellbookWorldMenu.state.values.selectedAbilityIndex,
          );
          emitToSocketioServer<WorldUseAbilityRequest>({
            data: {
              abilityID: ability.id,
              playerID: partyMemberWorldPlayer.id,
            },
            event: "world/use-ability",
          });
          spellbookWorldMenu.state.setValues({ isAwaitingWorldCombat: true });
        } else {
          handleWorldCharacterClick(partyMemberWorldPlayer.worldCharacterID);
        }
      },
      width: tileSize,
    });
    // Bottom bar player hp
    createResourceBar({
      condition: partyMemberCondition,
      iconImagePath: "resource-bar-icons/hp",
      maxValue: (): number => getPlayer().worldCharacter.resources.maxHP,
      primaryColor: Color.BrightRed,
      secondaryColor: Color.DarkPink,
      value: (): number => getPlayer().worldCharacter.resources.hp,
      x: 23 + partyMemberIndex * 60,
      y: 215,
    });
    // Bottom bar player mp
    createResourceBar({
      condition: (): boolean =>
        partyMemberCondition() && partyMemberMPCondition(),
      iconImagePath: "resource-bar-icons/mp",
      maxValue: (): number =>
        getPlayer().worldCharacter.resources.maxMP as number,
      primaryColor: Color.PureBlue,
      secondaryColor: Color.StrongBlue,
      value: (): number => getPlayer().worldCharacter.resources.mp as number,
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
    getDefinable(WorldCharacter, getWorldState().values.worldCharacterID).player
      .character.party.playerIDs.length > 1 &&
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
    isSelected: (): boolean => statsWorldMenu.isOpen(),
    onClick: (): void => {
      if (statsWorldMenu.isOpen()) {
        statsWorldMenu.close();
      } else {
        closeWorldMenus();
        statsWorldMenu.open({});
      }
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
