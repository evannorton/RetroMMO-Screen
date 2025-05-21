import { Ability } from "../../../classes/Ability";
import {
  BattleCancelSubmittedMoveRequest,
  BattleEvent,
  BattleEventType,
  BattlePhase,
  BattleUseAbilityEvent,
  BattleUseAbilityRequest,
  BattleUseItemInstanceRequest,
  Color,
  Direction,
  ResourcePool,
  TargetType,
} from "retrommo-types";
import { BattleMenuState, BattleStateSchema, state } from "../../../state";
import { Battler } from "../../../classes/Battler";
import { ClassAbilityUnlock } from "../../../classes/Class";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createButton,
  createEllipse,
  createInputPressHandler,
  createLabel,
  createQuadrilateral,
  emitToSocketioServer,
  getCurrentTime,
  getGameHeight,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { Item } from "../../../classes/Item";
import { ItemInstance } from "../../../classes/ItemInstance";
import { Reachable } from "../../../classes/Reachable";
import {
  battleAbilitiesPerPage,
  battleItemsPerPage,
  targetBlinkDuration,
} from "../../../constants";
import {
  cancelBattleActionInputCollectionID,
  targetBattleEnemyCharacter1InputCollectionID,
  targetBattleEnemyCharacter2InputCollectionID,
  targetBattleEnemyCharacter3InputCollectionID,
  targetBattleEnemyCharacter4InputCollectionID,
  targetBattleEnemyCharacter5InputCollectionID,
  targetBattleEnemyCharacter6InputCollectionID,
  targetBattleEnemyCharacter7InputCollectionID,
  targetBattleEnemyCharacter8InputCollectionID,
  targetBattleEnemyCharacter9InputCollectionID,
  targetBattleFriendlyCharacter1InputCollectionID,
  targetBattleFriendlyCharacter2InputCollectionID,
  targetBattleFriendlyCharacter3InputCollectionID,
  toggleBattleAbilitiesInputCollectionID,
  toggleBattleItemsInputCollectionID,
  useAttackInputCollectionID,
  useEscapeInputCollectionID,
  usePassInputCollectionID,
} from "../../../input";
import { createCharacterSprite } from "../components/createCharacterSprite";
import { createIconListItem } from "../components/createIconListItem";
import { createImage } from "../components/createImage";
import { createPanel } from "../components/createPanel";
import { createPressableButton } from "../components/createPressableButton";
import { createResourceBar } from "../components/createResourceBar";
import { createSlot } from "../components/createSlot";
import { getBattleState } from "../../state/getBattleState";
import { getCyclicIndex } from "../../getCyclicIndex";
import { getDefaultedClothesDye } from "../../defaulted-cosmetics/getDefaultedClothesDye";
import { getDefaultedHairDye } from "../../defaulted-cosmetics/getDefaultedHairDye";
import { getDefaultedMask } from "../../defaulted-cosmetics/getDefaultedMask";
import { getDefaultedOutfit } from "../../defaulted-cosmetics/getDefaultedOutfit";
import { getDefinable } from "definables";
import { getSumOfNumbers } from "../../getSumOfNumbers";

const getQueuedAction = (): Ability | ItemInstance => {
  const battleState: State<BattleStateSchema> = getBattleState();
  if (battleState.values.queuedAction === null) {
    throw new Error("queuedAction is null");
  }
  switch (battleState.values.queuedAction.actionDefinableReference.className) {
    case "Ability":
      return getDefinable(
        Ability,
        battleState.values.queuedAction.actionDefinableReference.id,
      );
    case "ItemInstance":
      return getDefinable(
        ItemInstance,
        battleState.values.queuedAction.actionDefinableReference.id,
      );
    default:
      throw new Error(
        `queuedAction.actionDefinableReference.className is not a valid class name: ${battleState.values.queuedAction.actionDefinableReference.className}`,
      );
  }
};
const getQueuedActionAbility = (): Ability => {
  const queuedAction: Ability | ItemInstance = getQueuedAction();
  if (queuedAction instanceof Ability) {
    return queuedAction;
  }
  if (queuedAction instanceof ItemInstance) {
    return queuedAction.item.ability;
  }
  throw new Error("queuedAction is not an Ability or ItemInstance");
};
const useAction = (battlerID?: string): void => {
  const action: Ability | ItemInstance = getQueuedAction();
  if (action instanceof Ability) {
    emitToSocketioServer<BattleUseAbilityRequest>({
      data: {
        abilityID: action.id,
        battlerID,
      },
      event: "battle/use-ability",
    });
  } else if (action instanceof ItemInstance) {
    emitToSocketioServer<BattleUseItemInstanceRequest>({
      data: {
        battlerID,
        itemInstanceID: action.id,
      },
      event: "battle/use-item-instance",
    });
  }
};
const useAbility = (battlerID: string): void => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const ability: Ability = getDefinable(Ability, battlerID);
  battleState.setValues({
    abilitiesPage: 0,
    itemsPage: 0,
    menuState: BattleMenuState.Default,
    queuedAction: {
      actionDefinableReference: ability.getReference(),
      queuedAt: getCurrentTime(),
    },
    selectedAbilityIndex: null,
    selectedItemInstanceIndex: null,
  });
  switch (ability.targetType) {
    case TargetType.AllAllies:
    case TargetType.AllEnemies:
    case TargetType.None:
    case TargetType.Self:
      useAction();
      break;
  }
};
const useItemInstance = (itemInstanceID: string): void => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const itemInstance: ItemInstance = getDefinable(ItemInstance, itemInstanceID);
  battleState.setValues({
    abilitiesPage: 0,
    itemsPage: 0,
    menuState: BattleMenuState.Default,
    queuedAction: {
      actionDefinableReference: itemInstance.getReference(),
      queuedAt: getCurrentTime(),
    },
    selectedAbilityIndex: null,
    selectedItemInstanceIndex: null,
  });
  switch (itemInstance.item.ability.targetType) {
    case TargetType.AllAllies:
    case TargetType.AllEnemies:
    case TargetType.None:
    case TargetType.Self:
      useAction();
      break;
  }
};
const isTargeting = (): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  if (battleState.values.queuedAction !== null) {
    const ability: Ability = getQueuedActionAbility();
    switch (ability.targetType) {
      case TargetType.SingleAlly:
      case TargetType.SingleEnemy:
        return true;
    }
  }
  return false;
};
const canUseAbility = (abilityID: string): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const battler: Battler = getDefinable(Battler, battleState.values.battlerID);
  const ability: Ability = getDefinable(Ability, abilityID);
  return (
    ability.hasFleeChance() === false ||
    battleState.values.friendlyBattlerIDs[0] === battler.id
  );
};
const getAbilityIDs = (): readonly string[] => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const battler: Battler = getDefinable(Battler, battleState.values.battlerID);
  return battler.battleCharacter.player.character.class.abilityUnlocks
    .filter(
      (abilityUnlock: ClassAbilityUnlock): boolean =>
        getDefinable(Ability, abilityUnlock.abilityID).canBeUsedInBattle &&
        abilityUnlock.level <= battler.battleCharacter.player.character.level &&
        canUseAbility(abilityUnlock.abilityID),
    )
    .map(
      (abilityUnlock: ClassAbilityUnlock): string => abilityUnlock.abilityID,
    );
};
const getLastAbilitiesPage = (): number =>
  Math.max(
    Math.floor((getAbilityIDs().length - 1) / battleAbilitiesPerPage),
    0,
  );
const pageAbilities = (offset: number): void => {
  const pages: number[] = [];
  for (let i: number = 0; i < getLastAbilitiesPage() + 1; i++) {
    pages.push(i);
  }
  const battleState: State<BattleStateSchema> = getBattleState();
  battleState.setValues({
    abilitiesPage: getCyclicIndex(
      pages.indexOf(battleState.values.abilitiesPage) + offset,
      pages,
    ),
  });
};
const getAbility = (i: number): Ability => {
  const abilityIDs: readonly string[] = getAbilityIDs();
  const abilityID: string | undefined = abilityIDs[i];
  if (typeof abilityID === "undefined") {
    throw new Error("Ability ID not found");
  }
  return getDefinable(Ability, abilityID);
};
const getPaginatedAbilityIDs = (): readonly string[] => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const abilityIDs: readonly string[] = getAbilityIDs();
  const startIndex: number =
    battleState.values.abilitiesPage * battleAbilitiesPerPage;
  const endIndex: number =
    startIndex + battleAbilitiesPerPage > abilityIDs.length
      ? abilityIDs.length
      : startIndex + battleAbilitiesPerPage;
  return abilityIDs.slice(startIndex, endIndex);
};
const getPaginatedAbility = (i: number): Ability => {
  const abilityIDs: readonly string[] = getPaginatedAbilityIDs();
  const abilityID: string | undefined = abilityIDs[i];
  if (typeof abilityID === "undefined") {
    throw new Error("Ability ID not found");
  }
  return getDefinable(Ability, abilityID);
};
const hasPaginatedAbility = (i: number): boolean => {
  const abilityIDs: readonly string[] = getPaginatedAbilityIDs();
  return typeof abilityIDs[i] !== "undefined";
};
const selectedAbilityCondition = (): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  return (
    battleState.values.menuState === BattleMenuState.Abilities &&
    battleState.values.selectedAbilityIndex !== null
  );
};
const getSelectedAbility = (): Ability => {
  const battleState: State<BattleStateSchema> = getBattleState();
  if (battleState.values.selectedAbilityIndex === null) {
    throw new Error("selectedAbilityIndex is null");
  }
  return getAbility(battleState.values.selectedAbilityIndex);
};
const getItemInstanceIDs = (): readonly string[] => {
  const battleState: State<BattleStateSchema> = getBattleState();
  return battleState.values.itemInstanceIDs;
};
const getLastItemsPage = (): number =>
  Math.max(
    Math.floor((getItemInstanceIDs().length - 1) / battleItemsPerPage),
    0,
  );
const pageItems = (offset: number): void => {
  const pages: number[] = [];
  for (let i: number = 0; i < getLastItemsPage() + 1; i++) {
    pages.push(i);
  }
  const battleState: State<BattleStateSchema> = getBattleState();
  battleState.setValues({
    itemsPage: getCyclicIndex(
      pages.indexOf(battleState.values.itemsPage) + offset,
      pages,
    ),
  });
};
const getItemInstance = (i: number): ItemInstance => {
  const itemInstanceIDs: readonly string[] = getItemInstanceIDs();
  const itemInstanceID: string | undefined = itemInstanceIDs[i];
  if (typeof itemInstanceID === "undefined") {
    throw new Error("ItemInstance ID not found");
  }
  return getDefinable(ItemInstance, itemInstanceID);
};
const getPaginatedItemInstanceIDs = (): readonly string[] => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const itemInstanceIDs: readonly string[] = getItemInstanceIDs();
  const startIndex: number = battleState.values.itemsPage * battleItemsPerPage;
  const endIndex: number =
    startIndex + battleItemsPerPage > itemInstanceIDs.length
      ? itemInstanceIDs.length
      : startIndex + battleItemsPerPage;
  return itemInstanceIDs.slice(startIndex, endIndex);
};
const getPaginatedItemInstance = (i: number): ItemInstance => {
  const itemInstanceIDs: readonly string[] = getPaginatedItemInstanceIDs();
  const itemInstanceID: string | undefined = itemInstanceIDs[i];
  if (typeof itemInstanceID === "undefined") {
    throw new Error("ItemInstance ID not found");
  }
  return getDefinable(ItemInstance, itemInstanceID);
};
const hasPaginatedItemInstance = (i: number): boolean => {
  const itemInstanceIDs: readonly string[] = getPaginatedItemInstanceIDs();
  return typeof itemInstanceIDs[i] !== "undefined";
};
const selectedItemInstanceCondition = (): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  return (
    battleState.values.menuState === BattleMenuState.Items &&
    battleState.values.selectedItemInstanceIndex !== null
  );
};
const getSelectedItemInstance = (): ItemInstance => {
  const battleState: State<BattleStateSchema> = getBattleState();
  if (battleState.values.selectedItemInstanceIndex === null) {
    throw new Error("selectedItemInstanceIndex is null");
  }
  return getItemInstance(battleState.values.selectedItemInstanceIndex);
};

export interface CreateBattleUIOptions {
  readonly enemyBattlerIDs: readonly string[];
  readonly friendlyBattlerIDs: readonly string[];
}
export const createBattleUI = ({
  enemyBattlerIDs,
  friendlyBattlerIDs,
}: CreateBattleUIOptions): HUDElementReferences => {
  const buttonIDs: string[] = [];
  const ellipseIDs: string[] = [];
  const inputPressHandlerIDs: string[] = [];
  const labelIDs: string[] = [];
  const quadrilateralIDs: string[] = [];
  const hudElementReferences: HUDElementReferences[] = [];
  const gameWidth: number = getGameWidth();
  const gameHeight: number = getGameHeight();
  // Landscape BG
  hudElementReferences.push(
    createImage({
      height: gameHeight,
      imagePath: (): string =>
        getDefinable(Reachable, getBattleState().values.reachableID).landscape
          .imagePath,
      width: gameWidth,
      x: 0,
      y: 0,
    }),
  );
  // Submitted actions panel
  hudElementReferences.push(
    createPanel({
      condition: (): boolean =>
        getBattleState().values.friendlyBattlerIDs.length > 1,
      height: 47,
      imagePath: "panels/basic",
      width: 304,
      x: 0,
      y: 0,
    }),
  );
  // Friendly battlers
  const friendlyTargetInputCollectionIDs: string[] = [
    targetBattleFriendlyCharacter1InputCollectionID,
    targetBattleFriendlyCharacter2InputCollectionID,
    targetBattleFriendlyCharacter3InputCollectionID,
  ];
  for (let i: number = 0; i < friendlyBattlerIDs.length; i++) {
    const inputCollectionID: string | undefined =
      friendlyTargetInputCollectionIDs[i];
    if (typeof inputCollectionID === "undefined") {
      throw new Error("inputCollectionID is undefined");
    }
    const getBattler = (): Battler => {
      const friendlyBattlerID: string | undefined = friendlyBattlerIDs[i];
      if (typeof friendlyBattlerID === "undefined") {
        throw new Error("friendlyBattlerID is undefined");
      }
      return getDefinable(Battler, friendlyBattlerID);
    };
    // Battler panel
    hudElementReferences.push(
      createPanel({
        height: 40,
        imagePath: "panels/basic",
        width: 81,
        x: 61 + i * 81,
        y: 200,
      }),
    );
    // Battler name
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          x: 101 + i * 81,
          y: 206,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 64,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: getBattler().battleCharacter.player.username,
        }),
      }),
    );
    // Battler player sprite
    hudElementReferences.push(
      createCharacterSprite({
        clothesDyeID: (): string => {
          const battler: Battler = getBattler();
          return getDefaultedClothesDye(
            battler.battleCharacter.hasClothesDyeItem()
              ? battler.battleCharacter.clothesDyeItemID
              : undefined,
          ).id;
        },
        coordinates: {
          x: 73 + i * 81,
          y: 216,
        },
        direction: Direction.Down,
        figureID: (): string => getBattler().battleCharacter.figureID,
        hairDyeID: (): string => {
          const battler: Battler = getBattler();
          return getDefaultedHairDye(
            battler.battleCharacter.hasHairDyeItem()
              ? battler.battleCharacter.hairDyeItemID
              : undefined,
          ).id;
        },
        maskID: (): string => {
          const battler: Battler = getBattler();
          return getDefaultedMask(
            battler.battleCharacter.hasMaskItem()
              ? battler.battleCharacter.maskItemID
              : undefined,
          ).id;
        },
        outfitID: (): string => {
          const battler: Battler = getBattler();
          return getDefaultedOutfit(
            battler.battleCharacter.hasOutfitItem()
              ? battler.battleCharacter.outfitItemID
              : undefined,
          ).id;
        },
        skinColorID: (): string => getBattler().battleCharacter.skinColorID,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean =>
            isTargeting() &&
            getQueuedActionAbility().targetType === TargetType.SingleAlly,
          x: 73 + i * 81,
          y: 216,
        },
        height: 32,
        onClick: (): void => {
          useAction(getBattler().id);
        },
        width: 32,
      }),
    );
    // Battler HP bar
    hudElementReferences.push(
      createResourceBar({
        iconImagePath: "resource-bar-icons/hp",
        maxValue: (): number => getBattler().resources.maxHP,
        primaryColor: Color.BrightRed,
        secondaryColor: Color.DarkPink,
        value: (): number => getBattler().resources.hp,
        x: 97 + i * 81,
        y: 216,
      }),
    );
    // Battler MP bar
    hudElementReferences.push(
      createResourceBar({
        condition: (): boolean =>
          getBattler().battleCharacter.player.character.class.resourcePool ===
          ResourcePool.MP,
        iconImagePath: "resource-bar-icons/mp",
        maxValue: (): number => {
          const maxMP: number | null = getBattler().resources.maxMP;
          if (maxMP === null) {
            throw new Error("maxMP is null");
          }
          return maxMP;
        },
        primaryColor: Color.PureBlue,
        secondaryColor: Color.StrongBlue,
        value: (): number => {
          const mp: number | null = getBattler().resources.mp;
          if (mp === null) {
            throw new Error("mp is null");
          }
          return mp;
        },
        x: 97 + i * 81,
        y: 226,
      }),
    );
    // Battler ability target
    const targetCondition = (): boolean => {
      if (isTargeting()) {
        const battleState: State<BattleStateSchema> = getBattleState();
        if (battleState.values.queuedAction === null) {
          throw new Error("queuedAction is null");
        }
        const ability: Ability = getQueuedActionAbility();
        if (ability.targetType === TargetType.SingleAlly) {
          return (
            ((getCurrentTime() - battleState.values.queuedAction.queuedAt) %
              targetBlinkDuration) *
              2 <
            targetBlinkDuration
          );
        }
      }
      return false;
    };
    createQuadrilateral({
      color: Color.VeryDarkGray,
      coordinates: {
        condition: targetCondition,
        x: i * 81 + 76,
        y: 227,
      },
      height: 9,
      width: 9,
    });
    createLabel({
      color: Color.White,
      coordinates: {
        condition: targetCondition,
        x: i * 81 + 81,
        y: 228,
      },
      horizontalAlignment: "center",
      text: {
        value: String(i + 1),
      },
    });
    // Submitted actions
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            getBattleState().values.friendlyBattlerIDs.length > 1 &&
            getBattler().battleCharacter.hasSubmittedMove(),
          x: 8,
          y: 8 + i * 12,
        },
        horizontalAlignment: "left",
        text: (): CreateLabelOptionsText => {
          const battler: Battler = getBattler();
          let value: string = `${battler.battleCharacter.player.username} will use `;
          switch (
            battler.battleCharacter.submittedMove.actionDefinableReference
              .className
          ) {
            case "Ability": {
              const ability: Ability = getDefinable(
                Ability,
                battler.battleCharacter.submittedMove.actionDefinableReference
                  .id,
              );
              value += ability.name;
              break;
            }
            case "Item": {
              const item: Item = getDefinable(
                Item,
                battler.battleCharacter.submittedMove.actionDefinableReference
                  .id,
              );
              value += item.name;
              break;
            }
          }
          if (
            typeof battler.battleCharacter.submittedMove.battlerID !==
            "undefined"
          ) {
            const targetBattler: Battler = getDefinable(
              Battler,
              battler.battleCharacter.submittedMove.battlerID,
            );
            value += ` on ${targetBattler.battleCharacter.player.username}`;
          }
          value += ".";
          return {
            value,
          };
        },
      }),
    );
    inputPressHandlerIDs.push(
      createInputPressHandler({
        condition: (): boolean => {
          if (isTargeting()) {
            const ability: Ability = getQueuedActionAbility();
            return ability.targetType === TargetType.SingleAlly;
          }
          return false;
        },
        inputCollectionID,
        onInput: (): void => {
          useAction(getBattler().id);
        },
      }),
    );
  }
  // Enemy battlers
  const enemyTargetInputCollectionIDs: string[] = [
    targetBattleEnemyCharacter1InputCollectionID,
    targetBattleEnemyCharacter2InputCollectionID,
    targetBattleEnemyCharacter3InputCollectionID,
    targetBattleEnemyCharacter4InputCollectionID,
    targetBattleEnemyCharacter5InputCollectionID,
    targetBattleEnemyCharacter6InputCollectionID,
    targetBattleEnemyCharacter7InputCollectionID,
    targetBattleEnemyCharacter8InputCollectionID,
    targetBattleEnemyCharacter9InputCollectionID,
  ];
  for (let i: number = 0; i < enemyBattlerIDs.length; i++) {
    const inputCollectionID: string | undefined =
      enemyTargetInputCollectionIDs[i];
    if (typeof inputCollectionID === "undefined") {
      throw new Error("inputCollectionID is undefined");
    }
    const getBattler = (): Battler => {
      const enemyBattlerID: string | undefined = enemyBattlerIDs[i];
      if (typeof enemyBattlerID === "undefined") {
        throw new Error("enemyBattlerID is undefined");
      }
      return getDefinable(Battler, enemyBattlerID);
    };
    const getX = (): number => {
      const width: number = 32;
      const leftWidths: number[] = [];
      const rightWidths: number[] = [];
      for (let j: number = 0; j < enemyBattlerIDs.length; j++) {
        if (j < i) {
          leftWidths.push(width);
        } else if (j > i) {
          rightWidths.push(width);
        }
      }
      const leftWidth: number =
        getSumOfNumbers(leftWidths) + leftWidths.length * 8;
      const rightWidth: number =
        getSumOfNumbers(rightWidths) + rightWidths.length * 8;
      const totalWidth: number = width + leftWidth + rightWidth;
      const startX: number = Math.floor(gameWidth / 2 - totalWidth / 2);
      return startX + leftWidth;
    };
    // Enemy shadow
    ellipseIDs.push(
      createEllipse({
        color: (): string =>
          getDefinable(Reachable, getBattleState().values.reachableID).landscape
            .shadowColor,
        coordinates: {
          x: (): number => getX() + 4,
          y: 122,
        },
        height: 8,
        width: 23,
      }),
    );
    // Enemy character sprite
    hudElementReferences.push(
      createCharacterSprite({
        clothesDyeID: (): string => {
          const battler: Battler = getBattler();
          return getDefaultedClothesDye(
            battler.battleCharacter.hasClothesDyeItem()
              ? battler.battleCharacter.clothesDyeItemID
              : undefined,
          ).id;
        },
        coordinates: {
          x: (): number => getX(),
          y: 96,
        },
        direction: Direction.Down,
        figureID: (): string => getBattler().battleCharacter.figureID,
        hairDyeID: (): string => {
          const battler: Battler = getBattler();
          return getDefaultedHairDye(
            battler.battleCharacter.hasHairDyeItem()
              ? battler.battleCharacter.hairDyeItemID
              : undefined,
          ).id;
        },
        maskID: (): string => {
          const battler: Battler = getBattler();
          return getDefaultedMask(
            battler.battleCharacter.hasMaskItem()
              ? battler.battleCharacter.maskItemID
              : undefined,
          ).id;
        },
        outfitID: (): string => {
          const battler: Battler = getBattler();
          return getDefaultedOutfit(
            battler.battleCharacter.hasOutfitItem()
              ? battler.battleCharacter.outfitItemID
              : undefined,
          ).id;
        },
        scale: 2,
        skinColorID: (): string => getBattler().battleCharacter.skinColorID,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean => {
            if (isTargeting()) {
              const ability: Ability = getQueuedActionAbility();
              return ability.targetType === TargetType.SingleEnemy;
            }
            return false;
          },
          x: getX(),
          y: 96,
        },
        height: 32,
        onClick: (): void => {
          useAction(getBattler().id);
        },
        width: 32,
      }),
    );
    // Enemy targetting number
    const targetingNumberCondition = (): boolean => {
      if (isTargeting()) {
        const battleState: State<BattleStateSchema> = getBattleState();
        if (battleState.values.queuedAction === null) {
          throw new Error("queuedAction is null");
        }
        const ability: Ability = getQueuedActionAbility();
        if (ability.targetType === TargetType.SingleEnemy) {
          return (
            ((getCurrentTime() - battleState.values.queuedAction.queuedAt) %
              targetBlinkDuration) *
              2 <
            targetBlinkDuration
          );
        }
        return false;
      }
      return false;
    };
    quadrilateralIDs.push(
      createQuadrilateral({
        color: Color.VeryDarkGray,
        coordinates: {
          condition: targetingNumberCondition,
          x: (): number => getX() + 11,
          y: 123,
        },
        height: 9,
        width: 9,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: targetingNumberCondition,
          x: (): number => getX() + 16,
          y: 124,
        },
        horizontalAlignment: "center",
        text: (): CreateLabelOptionsText => ({
          value: String(i + 1),
        }),
      }),
    );
    inputPressHandlerIDs.push(
      createInputPressHandler({
        condition: (): boolean => {
          if (isTargeting()) {
            const ability: Ability = getQueuedActionAbility();
            return ability.targetType === TargetType.SingleEnemy;
          }
          return false;
        },
        inputCollectionID,
        onInput: (): void => {
          useAction(getBattler().id);
        },
      }),
    );
  }
  // Commands panel
  hudElementReferences.push(
    createPanel({
      height: 100,
      imagePath: "panels/basic",
      width: 61,
      x: 0,
      y: 140,
    }),
  );
  // Commands attack button
  const attackButtonCondition = (): boolean =>
    getBattleState().values.phase === BattlePhase.Selection &&
    isTargeting() === false &&
    canUseAbility("attack") &&
    getDefinable(
      Battler,
      getBattleState().values.battlerID,
    ).battleCharacter.hasSubmittedMove() === false;
  hudElementReferences.push(
    createPressableButton({
      condition: attackButtonCondition,
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        useAbility("attack");
      },
      text: { value: "Attack" },
      width: 49,
      x: 6,
      y: 146,
    }),
  );
  inputPressHandlerIDs.push(
    createInputPressHandler({
      condition: attackButtonCondition,
      inputCollectionID: useAttackInputCollectionID,
      onInput: (): void => {
        useAbility("attack");
      },
    }),
  );
  // Commands ability button
  const abilityButtonCondition = (): boolean =>
    getBattleState().values.phase === BattlePhase.Selection &&
    isTargeting() === false &&
    getDefinable(
      Battler,
      getBattleState().values.battlerID,
    ).battleCharacter.hasSubmittedMove() === false;
  const doAbilityCommand = (): void => {
    const battleState: State<BattleStateSchema> = getBattleState();
    if (battleState.values.menuState === BattleMenuState.Abilities) {
      battleState.setValues({
        abilitiesPage: 0,
        itemsPage: 0,
        menuState: BattleMenuState.Default,
        selectedAbilityIndex: null,
        selectedItemInstanceIndex: null,
      });
    } else {
      battleState.setValues({
        itemsPage: 0,
        menuState: BattleMenuState.Abilities,
        selectedItemInstanceIndex: null,
      });
    }
  };
  hudElementReferences.push(
    createPressableButton({
      condition: abilityButtonCondition,
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: doAbilityCommand,
      text: { value: "Ability" },
      width: 49,
      x: 6,
      y: 164,
    }),
  );
  inputPressHandlerIDs.push(
    createInputPressHandler({
      condition: abilityButtonCondition,
      inputCollectionID: toggleBattleAbilitiesInputCollectionID,
      onInput: doAbilityCommand,
    }),
  );
  // Commands item button
  const itemButtonCondition = (): boolean =>
    getBattleState().values.phase === BattlePhase.Selection &&
    isTargeting() === false &&
    getDefinable(
      Battler,
      getBattleState().values.battlerID,
    ).battleCharacter.hasSubmittedMove() === false;
  const doItemCommand = (): void => {
    const battleState: State<BattleStateSchema> = getBattleState();
    if (battleState.values.menuState === BattleMenuState.Items) {
      battleState.setValues({
        abilitiesPage: 0,
        itemsPage: 0,
        menuState: BattleMenuState.Default,
        selectedAbilityIndex: null,
        selectedItemInstanceIndex: null,
      });
    } else {
      battleState.setValues({
        abilitiesPage: 0,
        menuState: BattleMenuState.Items,
        selectedAbilityIndex: null,
      });
    }
  };
  hudElementReferences.push(
    createPressableButton({
      condition: itemButtonCondition,
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: doItemCommand,
      text: { value: "Item" },
      width: 49,
      x: 6,
      y: 182,
    }),
  );
  inputPressHandlerIDs.push(
    createInputPressHandler({
      condition: itemButtonCondition,
      inputCollectionID: toggleBattleItemsInputCollectionID,
      onInput: doItemCommand,
    }),
  );
  // Commands pass button
  const passButtonCondition = (): boolean =>
    getBattleState().values.phase === BattlePhase.Selection &&
    isTargeting() === false &&
    canUseAbility("pass") &&
    getDefinable(
      Battler,
      getBattleState().values.battlerID,
    ).battleCharacter.hasSubmittedMove() === false;
  hudElementReferences.push(
    createPressableButton({
      condition: passButtonCondition,
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        useAbility("pass");
      },
      text: { value: "Pass" },
      width: 49,
      x: 6,
      y: 200,
    }),
  );
  inputPressHandlerIDs.push(
    createInputPressHandler({
      condition: passButtonCondition,
      inputCollectionID: usePassInputCollectionID,
      onInput: (): void => {
        useAbility("pass");
      },
    }),
  );
  // Commands escape button
  const escapeButtonCondition = (): boolean =>
    getBattleState().values.phase === BattlePhase.Selection &&
    isTargeting() === false &&
    canUseAbility("escape") &&
    getDefinable(
      Battler,
      getBattleState().values.battlerID,
    ).battleCharacter.hasSubmittedMove() === false;
  hudElementReferences.push(
    createPressableButton({
      condition: escapeButtonCondition,
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        useAbility("escape");
      },
      text: { value: "Escape" },
      width: 49,
      x: 6,
      y: 218,
    }),
  );
  inputPressHandlerIDs.push(
    createInputPressHandler({
      condition: escapeButtonCondition,
      inputCollectionID: useEscapeInputCollectionID,
      onInput: (): void => {
        useAbility("escape");
      },
    }),
  );
  // Commands cancel targetting button
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean => isTargeting(),
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        getBattleState().setValues({
          queuedAction: null,
        });
      },
      text: { value: "Cancel" },
      width: 49,
      x: 6,
      y: 146,
    }),
  );
  inputPressHandlerIDs.push(
    createInputPressHandler({
      condition: (): boolean => isTargeting(),
      inputCollectionID: cancelBattleActionInputCollectionID,
      onInput: (): void => {
        getBattleState().setValues({
          queuedAction: null,
        });
      },
    }),
  );
  // Commands cancel submitted action buttons
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean =>
        getDefinable(
          Battler,
          getBattleState().values.battlerID,
        ).battleCharacter.hasSubmittedMove(),
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        emitToSocketioServer<BattleCancelSubmittedMoveRequest>({
          data: {},
          event: "battle/cancel-submitted-move",
        });
      },
      text: { value: "Cancel" },
      width: 49,
      x: 6,
      y: 146,
    }),
  );
  inputPressHandlerIDs.push(
    createInputPressHandler({
      condition: (): boolean =>
        getDefinable(
          Battler,
          getBattleState().values.battlerID,
        ).battleCharacter.hasSubmittedMove(),
      inputCollectionID: cancelBattleActionInputCollectionID,
      onInput: (): void => {
        emitToSocketioServer<BattleCancelSubmittedMoveRequest>({
          data: {},
          event: "battle/cancel-submitted-move",
        });
      },
    }),
  );
  // Instructions panel
  hudElementReferences.push(
    createPanel({
      condition: (): boolean =>
        getBattleState().values.phase === BattlePhase.Selection,
      height: 34,
      imagePath: "panels/basic",
      width: 243,
      x: 61,
      y: 140,
    }),
  );
  // Instructions label
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean =>
          getBattleState().values.phase === BattlePhase.Selection,
        x: 69,
        y: 148,
      },
      horizontalAlignment: "left",
      maxLines: 1,
      maxWidth: 229,
      size: 1,
      text: (): CreateLabelOptionsText => {
        const battler: Battler = getDefinable(
          Battler,
          getBattleState().values.battlerID,
        );
        if (battler.battleCharacter.hasSubmittedMove()) {
          return { value: "Waiting for other players." };
        }
        if (isTargeting()) {
          return { value: "Select a target." };
        }
        return {
          value: "Select an action.",
        };
      },
    }),
  );
  // Queued action label
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => isTargeting(),
        x: 276,
        y: 154,
      },
      horizontalAlignment: "right",
      size: 1,
      text: (): CreateLabelOptionsText => {
        const action: Ability | ItemInstance = getQueuedAction();
        if (action instanceof Ability) {
          return {
            value: action.name,
          };
        }
        if (action instanceof ItemInstance) {
          return {
            value: action.item.name,
          };
        }
        throw new Error("queuedAction is not an Ability or ItemInstance");
      },
    }),
  );
  // Queued action Slot
  hudElementReferences.push(
    createSlot({
      condition: (): boolean => isTargeting(),
      icons: [
        {
          imagePath: (): string => {
            const action: Ability | ItemInstance = getQueuedAction();
            if (action instanceof Ability) {
              return action.iconImagePath;
            }
            if (action instanceof ItemInstance) {
              return action.item.iconImagePath;
            }
            throw new Error("queuedAction is not an Ability or ItemInstance");
          },
        },
      ],
      imagePath: "slots/basic",
      x: 280,
      y: 149,
    }),
  );
  // Abilities panel
  hudElementReferences.push(
    createPanel({
      condition: (): boolean =>
        getBattleState().values.menuState === BattleMenuState.Abilities,
      height: 110,
      imagePath: "panels/basic",
      width: 243,
      x: 61,
      y: 90,
    }),
  );
  // For each battle ability
  for (let i: number = 0; i < battleAbilitiesPerPage; i++) {
    // Icon list item
    hudElementReferences.push(
      createIconListItem({
        condition: (): boolean =>
          getBattleState().values.menuState === BattleMenuState.Abilities &&
          hasPaginatedAbility(i),
        icons: [
          {
            imagePath: (): string => getPaginatedAbility(i).iconImagePath,
          },
        ],
        isSelected: (): boolean =>
          getBattleState().values.selectedAbilityIndex ===
          i + getBattleState().values.abilitiesPage * battleAbilitiesPerPage,
        onClick: (): void => {
          const battleState: State<BattleStateSchema> = getBattleState();
          if (
            battleState.values.selectedAbilityIndex ===
            i + battleState.values.abilitiesPage * battleAbilitiesPerPage
          ) {
            battleState.setValues({
              selectedAbilityIndex: null,
            });
          } else {
            battleState.setValues({
              selectedAbilityIndex:
                i + battleState.values.abilitiesPage * battleAbilitiesPerPage,
            });
          }
        },
        slotImagePath: "slots/basic",
        text: (): CreateLabelOptionsText => ({
          value: getPaginatedAbility(i).name,
        }),
        width: 116,
        x: 68,
        y: 97 + i * 20,
      }),
    );
  }
  // Abilities page up arrow
  hudElementReferences.push(
    createImage({
      condition: (): boolean =>
        getBattleState().values.menuState === BattleMenuState.Abilities &&
        getAbilityIDs().length > battleAbilitiesPerPage,
      height: 16,
      imagePath: "arrows/up",
      onClick: (): void => {
        pageAbilities(-1);
      },
      width: 12,
      x: 188,
      y: 97,
    }),
  );
  // Abilities page number
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean =>
          getBattleState().values.menuState === BattleMenuState.Abilities &&
          getAbilityIDs().length > battleAbilitiesPerPage,
        x: 194,
        y: 141,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: String(getBattleState().values.abilitiesPage + 1),
      }),
    }),
  );
  // Abilities page down arrow
  hudElementReferences.push(
    createImage({
      condition: (): boolean =>
        getBattleState().values.menuState === BattleMenuState.Abilities &&
        getAbilityIDs().length > battleAbilitiesPerPage,
      height: 16,
      imagePath: "arrows/down",
      onClick: (): void => {
        pageAbilities(1);
      },
      width: 12,
      x: 188,
      y: 177,
    }),
  );
  // Selected ability name
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: selectedAbilityCondition,
        x: 252,
        y: 106,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: getSelectedAbility().name,
      }),
    }),
  );
  // Selected ability icon
  hudElementReferences.push(
    createImage({
      condition: selectedAbilityCondition,
      height: 16,
      imagePath: (): string => getSelectedAbility().iconImagePath,
      width: 16,
      x: 244,
      y: 124,
    }),
  );
  // Selected ability mp cost
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean =>
          selectedAbilityCondition() && getSelectedAbility().mpCost > 0,
        x: 252,
        y: 150,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => {
        const ability: Ability = getSelectedAbility();
        return {
          value: `${ability.mpCost} MP`,
        };
      },
    }),
  );
  // Selected ability use button
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean => {
        if (selectedAbilityCondition()) {
          const battleState: State<BattleStateSchema> = getBattleState();
          const battler: Battler = getDefinable(
            Battler,
            battleState.values.battlerID,
          );
          const mp: number = battler.resources.mp ?? 0;
          return mp >= getSelectedAbility().mpCost;
        }
        return false;
      },
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        const ability: Ability = getSelectedAbility();
        useAbility(ability.id);
      },
      text: { value: "Use" },
      width: 34,
      x: 216,
      y: 168,
    }),
  );
  // Selected ability bind button
  hudElementReferences.push(
    createPressableButton({
      condition: selectedAbilityCondition,
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        console.log("Bind");
      },
      text: { value: "Bind" },
      width: 34,
      x: 255,
      y: 168,
    }),
  );
  // Items panel
  hudElementReferences.push(
    createPanel({
      condition: (): boolean =>
        getBattleState().values.menuState === BattleMenuState.Items,
      height: 110,
      imagePath: "panels/basic",
      width: 243,
      x: 61,
      y: 90,
    }),
  );
  // For each item instance
  for (let i: number = 0; i < battleItemsPerPage; i++) {
    // Icon list item
    hudElementReferences.push(
      createIconListItem({
        condition: (): boolean =>
          getBattleState().values.menuState === BattleMenuState.Items &&
          hasPaginatedItemInstance(i),
        icons: [
          {
            imagePath: (): string =>
              getPaginatedItemInstance(i).item.iconImagePath,
          },
        ],
        isSelected: (): boolean =>
          getBattleState().values.selectedItemInstanceIndex ===
          i + getBattleState().values.itemsPage * battleItemsPerPage,
        onClick: (): void => {
          const battleState: State<BattleStateSchema> = getBattleState();
          if (
            battleState.values.selectedItemInstanceIndex ===
            i + battleState.values.itemsPage * battleItemsPerPage
          ) {
            battleState.setValues({
              selectedItemInstanceIndex: null,
            });
          } else {
            battleState.setValues({
              selectedItemInstanceIndex:
                i + battleState.values.itemsPage * battleItemsPerPage,
            });
          }
        },
        slotImagePath: "slots/basic",
        text: (): CreateLabelOptionsText => ({
          value: getPaginatedItemInstance(i).item.name,
        }),
        width: 116,
        x: 68,
        y: 97 + i * 20,
      }),
    );
  }
  // Items page up arrow
  hudElementReferences.push(
    createImage({
      condition: (): boolean =>
        getBattleState().values.menuState === BattleMenuState.Items &&
        getItemInstanceIDs().length > battleItemsPerPage,
      height: 16,
      imagePath: "arrows/up",
      onClick: (): void => {
        pageItems(-1);
      },
      width: 12,
      x: 188,
      y: 97,
    }),
  );
  // Items page number
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean =>
          getBattleState().values.menuState === BattleMenuState.Items &&
          getItemInstanceIDs().length > battleItemsPerPage,
        x: 194,
        y: 141,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: String(getBattleState().values.itemsPage + 1),
      }),
    }),
  );
  // Items page down arrow
  hudElementReferences.push(
    createImage({
      condition: (): boolean =>
        getBattleState().values.menuState === BattleMenuState.Items &&
        getItemInstanceIDs().length > battleItemsPerPage,
      height: 16,
      imagePath: "arrows/down",
      onClick: (): void => {
        pageItems(1);
      },
      width: 12,
      x: 188,
      y: 177,
    }),
  );
  // Selected item instance name
  labelIDs.push(
    createLabel({
      color: Color.White,
      coordinates: {
        condition: selectedItemInstanceCondition,
        x: 252,
        y: 106,
      },
      horizontalAlignment: "center",
      text: (): CreateLabelOptionsText => ({
        value: getSelectedItemInstance().item.name,
      }),
    }),
  );
  // Selected item instance icon
  hudElementReferences.push(
    createImage({
      condition: selectedItemInstanceCondition,
      height: 16,
      imagePath: (): string => getSelectedItemInstance().item.iconImagePath,
      width: 16,
      x: 244,
      y: 124,
    }),
  );
  // Selected item instance use button
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean =>
        selectedItemInstanceCondition() &&
        getSelectedItemInstance().item.hasAbility() &&
        getSelectedItemInstance().item.ability.canBeUsedInBattle &&
        canUseAbility(getSelectedItemInstance().item.ability.id),
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        const itemInstance: ItemInstance = getSelectedItemInstance();
        useItemInstance(itemInstance.id);
      },
      text: { value: "Use" },
      width: 34,
      x: 216,
      y: 168,
    }),
  );
  // Selected item instance bind button
  hudElementReferences.push(
    createPressableButton({
      condition: selectedItemInstanceCondition,
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        console.log("Bind");
      },
      text: { value: "Bind" },
      width: 34,
      x: 255,
      y: 168,
    }),
  );
  // Events panel
  hudElementReferences.push(
    createPanel({
      condition: (): boolean =>
        getBattleState().values.phase === BattlePhase.Round,
      height: 60,
      imagePath: "panels/basic",
      width: 243,
      x: 61,
      y: 140,
    }),
  );
  // Events text
  for (let i: number = 0; i < 2; i++) {
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            getBattleState().values.phase === BattlePhase.Round &&
            state.values.serverTime !== null,
          x: 69,
          y: 148 + i * 22,
        },
        horizontalAlignment: "left",
        maxLines: 2,
        maxWidth: 229,
        size: 1,
        text: (): CreateLabelOptionsText => {
          if (state.values.serverTime === null) {
            throw new Error("serverTime is null");
          }
          const battleState: State<BattleStateSchema> = getBattleState();
          if (battleState.values.round === null) {
            throw new Error("round is null");
          }
          const elapsedServerTime: number =
            state.values.serverTime - battleState.values.round.serverTime;
          const battleEvent: BattleEvent | undefined =
            battleState.values.round.events.find(
              (roundBattleEvent: BattleEvent): boolean =>
                roundBattleEvent.channel === i &&
                elapsedServerTime >= roundBattleEvent.startedAt &&
                elapsedServerTime <
                  roundBattleEvent.startedAt + roundBattleEvent.duration,
            );
          if (typeof battleEvent !== "undefined") {
            switch (battleEvent.type) {
              case BattleEventType.UseAbility: {
                const useAbilityBattleEvent: BattleUseAbilityEvent =
                  battleEvent as BattleUseAbilityEvent;
                const ability: Ability = getDefinable(
                  Ability,
                  useAbilityBattleEvent.abilityID,
                );
                if (typeof useAbilityBattleEvent.target !== "undefined") {
                  return {
                    value: `${useAbilityBattleEvent.caster.name} uses ${ability.name} on ${useAbilityBattleEvent.target.name}.`,
                  };
                }
                return {
                  value: `${useAbilityBattleEvent.caster.name} uses ${ability.name}.`,
                };
              }
            }
          }
          return { value: "" };
        },
      }),
    );
  }
  return mergeHUDElementReferences([
    {
      buttonIDs,
      ellipseIDs,
      inputPressHandlerIDs,
      labelIDs,
      quadrilateralIDs,
    },
    ...hudElementReferences,
  ]);
};
