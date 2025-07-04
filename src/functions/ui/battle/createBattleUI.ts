import { Ability } from "../../../classes/Ability";
import {
  BattleBindAbilityRequest,
  BattleBindItemRequest,
  BattleCancelSubmittedMoveRequest,
  BattleDamageEvent,
  BattleDeathEvent,
  BattleDefeatEvent,
  BattleEventType,
  BattleExperienceEvent,
  BattleFriendlyTargetFailureEvent,
  BattleGoldEvent,
  BattleHealEvent,
  BattleImpactAlignment,
  BattleInstakillEvent,
  BattlePhase,
  BattleRejuvenateEvent,
  BattleUnbindHotkeyRequest,
  BattleUseAbilityEvent,
  BattleUseAbilityRequest,
  BattleUseItemEvent,
  BattleUseItemInstanceRequest,
  Color,
  Direction,
  ResourcePool,
  TargetType,
} from "retrommo-types";
import { BattleImpactAnimation } from "../../../classes/BattleImpactAnimation";
import {
  BattleMenuState,
  BattleStateBindAction,
  BattleStateHotkey,
  BattleStateRound,
  BattleStateRoundEventInstance,
  BattleStateSchema,
  state,
} from "../../../state";
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
  createSprite,
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
  battleImpactAnimationDuration,
  battleItemsPerPage,
  grayColors,
  hotkeyLabelBlinkDuration,
  targetBlinkDuration,
} from "../../../constants";
import { canFleeBattle } from "../../battle/canFleeBattle";
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
  unbindBattleHotkeyInputCollectionID,
  useAttackInputCollectionID,
  useBattleHotkey10InputCollectionID,
  useBattleHotkey11InputCollectionID,
  useBattleHotkey12InputCollectionID,
  useBattleHotkey1InputCollectionID,
  useBattleHotkey2InputCollectionID,
  useBattleHotkey3InputCollectionID,
  useBattleHotkey4InputCollectionID,
  useBattleHotkey5InputCollectionID,
  useBattleHotkey6InputCollectionID,
  useBattleHotkey7InputCollectionID,
  useBattleHotkey8InputCollectionID,
  useBattleHotkey9InputCollectionID,
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
import { getBattlerHeight } from "../../battle/getBattlerHeight";
import { getBattlerWidth } from "../../battle/getBattlerWidth";
import { getCyclicIndex } from "../../getCyclicIndex";
import { getDefaultedClothesDye } from "../../defaulted-cosmetics/getDefaultedClothesDye";
import { getDefaultedHairDye } from "../../defaulted-cosmetics/getDefaultedHairDye";
import { getDefaultedMask } from "../../defaulted-cosmetics/getDefaultedMask";
import { getDefaultedOutfit } from "../../defaulted-cosmetics/getDefaultedOutfit";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../../getFormattedInteger";
import { getSumOfNumbers } from "../../getSumOfNumbers";
import { isBattleMultiplayer } from "../../battle/isBattleMultiplayer";

const getBattler = (): Battler =>
  getDefinable(Battler, getBattleState().values.battlerID);
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
    bindAction: null,
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
    bindAction: null,
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
    (battleState.values.friendlyBattlerIDs[0] === battler.id && canFleeBattle())
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
const isBindingHotkey = (): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  return battleState.values.bindAction !== null;
};
const isUnbindingHotkey = (): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  return battleState.values.unbindStartedAt !== null;
};
const areBindHotkeyLabelsVisible = (): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const bindAction: BattleStateBindAction | null =
    battleState.values.bindAction;
  if (bindAction === null) {
    throw new Error("bindAction is null");
  }
  const bindStartedAt: number = bindAction.bindStartedAt;
  const diff: number = getCurrentTime() - bindStartedAt;
  const amount: number = diff % (hotkeyLabelBlinkDuration * 2);
  return amount < hotkeyLabelBlinkDuration;
};
const areUnbindHotkeyLabelsVisible = (): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  if (battleState.values.unbindStartedAt === null) {
    throw new Error("unbindStartedAt is null");
  }
  const diff: number = getCurrentTime() - battleState.values.unbindStartedAt;
  const amount: number = diff % (hotkeyLabelBlinkDuration * 2);
  return amount < hotkeyLabelBlinkDuration;
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
  const spriteIDs: string[] = [];
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
      condition: isBattleMultiplayer,
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
    const getFriendlyBattler = (): Battler => {
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
          value: getFriendlyBattler().battleCharacter.player.username,
        }),
      }),
    );
    // Battler player sprite
    hudElementReferences.push(
      createCharacterSprite({
        clothesDyeID: (): string => {
          const battler: Battler = getFriendlyBattler();
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
        figureID: (): string => getFriendlyBattler().battleCharacter.figureID,
        hairDyeID: (): string => {
          const battler: Battler = getFriendlyBattler();
          return getDefaultedHairDye(
            battler.battleCharacter.hasHairDyeItem()
              ? battler.battleCharacter.hairDyeItemID
              : undefined,
          ).id;
        },
        maskID: (): string => {
          const battler: Battler = getFriendlyBattler();
          return getDefaultedMask(
            battler.battleCharacter.hasMaskItem()
              ? battler.battleCharacter.maskItemID
              : undefined,
          ).id;
        },
        outfitID: (): string => {
          const battler: Battler = getFriendlyBattler();
          return getDefaultedOutfit(
            battler.battleCharacter.hasOutfitItem()
              ? battler.battleCharacter.outfitItemID
              : undefined,
          ).id;
        },
        skinColorID: (): string =>
          getFriendlyBattler().battleCharacter.skinColorID,
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
          useAction(getFriendlyBattler().id);
        },
        width: 32,
      }),
    );
    // Battler HP bar
    hudElementReferences.push(
      createResourceBar({
        iconImagePath: "resource-bar-icons/hp",
        maxValue: (): number => getFriendlyBattler().resources.maxHP,
        primaryColor: Color.BrightRed,
        secondaryColor: Color.DarkPink,
        value: (): number => getFriendlyBattler().resources.hp,
        x: 97 + i * 81,
        y: 216,
      }),
    );
    // Battler MP bar
    hudElementReferences.push(
      createResourceBar({
        condition: (): boolean =>
          getFriendlyBattler().battleCharacter.player.character.class
            .resourcePool === ResourcePool.MP,
        iconImagePath: "resource-bar-icons/mp",
        maxValue: (): number => {
          const maxMP: number | null = getFriendlyBattler().resources.maxMP;
          if (maxMP === null) {
            throw new Error("maxMP is null");
          }
          return maxMP;
        },
        primaryColor: Color.PureBlue,
        secondaryColor: Color.StrongBlue,
        value: (): number => {
          const mp: number | null = getFriendlyBattler().resources.mp;
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
    quadrilateralIDs.push(
      createQuadrilateral({
        color: Color.VeryDarkGray,
        coordinates: {
          condition: targetCondition,
          x: i * 81 + 76,
          y: 227,
        },
        height: 9,
        width: 9,
      }),
    );
    labelIDs.push(
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
      }),
    );
    // Submitted actions
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            isBattleMultiplayer() &&
            getFriendlyBattler().battleCharacter.hasSubmittedMove(),
          x: 8,
          y: 8 + i * 12,
        },
        horizontalAlignment: "left",
        text: (): CreateLabelOptionsText => {
          const battler: Battler = getFriendlyBattler();
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
          useAction(getFriendlyBattler().id);
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
  const getAliveBattlerIDs = (): readonly string[] =>
    enemyBattlerIDs.filter(
      (enemyBattlerID: string): boolean =>
        getDefinable(Battler, enemyBattlerID).isAlive,
    );
  for (const enemyBattlerID of enemyBattlerIDs) {
    const getEnemyBattler = (): Battler =>
      getDefinable(Battler, enemyBattlerID);
    const getAliveBattlerIndex = (): number =>
      getAliveBattlerIDs().indexOf(getEnemyBattler().id);
    const getX = (): number => {
      const width: number = 32;
      const leftWidths: number[] = [];
      const rightWidths: number[] = [];
      const aliveBattlerIndex: number = getAliveBattlerIndex();
      for (let j: number = 0; j < getAliveBattlerIDs().length; j++) {
        if (j < aliveBattlerIndex) {
          leftWidths.push(width);
        } else if (j > aliveBattlerIndex) {
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
    const getY = (): number => 128 - getBattlerHeight(enemyBattlerID);
    const getImpactAnimationEventInstance = ():
      | BattleStateRoundEventInstance
      | undefined => {
      const battleState: State<BattleStateSchema> = getBattleState();
      const round: BattleStateRound | null = battleState.values.round;
      if (round === null) {
        throw new Error("round is null");
      }
      const serverTime: number | null = state.values.serverTime;
      if (serverTime === null) {
        throw new Error("serverTime is null");
      }
      return round.eventInstances.find(
        (eventInstance: BattleStateRoundEventInstance): boolean => {
          const elapsedServerTime: number = serverTime - round.serverTime;
          if (
            elapsedServerTime >= eventInstance.event.startedAt &&
            elapsedServerTime <
              eventInstance.event.startedAt + eventInstance.event.duration
          ) {
            switch (eventInstance.event.type) {
              case BattleEventType.Damage: {
                const damageEvent: BattleDamageEvent =
                  eventInstance.event as BattleDamageEvent;
                return damageEvent.target.battlerID === enemyBattlerID;
              }
              case BattleEventType.Heal: {
                const healEvent: BattleHealEvent =
                  eventInstance.event as BattleHealEvent;
                return healEvent.target.battlerID === enemyBattlerID;
              }
              case BattleEventType.Instakill: {
                const instakillEvent: BattleInstakillEvent =
                  eventInstance.event as BattleInstakillEvent;
                return instakillEvent.target.battlerID === enemyBattlerID;
              }
              case BattleEventType.Rejuvenate: {
                const rejuvenateEvent: BattleRejuvenateEvent =
                  eventInstance.event as BattleRejuvenateEvent;
                return rejuvenateEvent.target.battlerID === enemyBattlerID;
              }
            }
          }
          return false;
        },
      );
    };
    const hasImpactAnimation = (): boolean => {
      const battleState: State<BattleStateSchema> = getBattleState();
      if (battleState.values.round === null) {
        throw new Error("round is null");
      }
      if (state.values.serverTime === null) {
        throw new Error("serverTime is null");
      }
      const elapsedServerTime: number =
        state.values.serverTime - battleState.values.round.serverTime;
      return battleState.values.round.eventInstances.some(
        (eventInstance: BattleStateRoundEventInstance): boolean => {
          if (
            elapsedServerTime >= eventInstance.event.startedAt &&
            elapsedServerTime <
              eventInstance.event.startedAt + battleImpactAnimationDuration * 8
          ) {
            switch (eventInstance.event.type) {
              case BattleEventType.Damage: {
                const damageEvent: BattleDamageEvent =
                  eventInstance.event as BattleDamageEvent;
                return damageEvent.target.battlerID === enemyBattlerID;
              }
              case BattleEventType.Heal: {
                const healEvent: BattleHealEvent =
                  eventInstance.event as BattleHealEvent;
                return healEvent.target.battlerID === enemyBattlerID;
              }
              case BattleEventType.Instakill: {
                const instakillEvent: BattleInstakillEvent =
                  eventInstance.event as BattleInstakillEvent;
                return instakillEvent.target.battlerID === enemyBattlerID;
              }
              case BattleEventType.Rejuvenate: {
                const rejuvenateEvent: BattleRejuvenateEvent =
                  eventInstance.event as BattleRejuvenateEvent;
                return rejuvenateEvent.target.battlerID === enemyBattlerID;
              }
            }
          }
          return false;
        },
      );
    };
    const getImpactAnimation = (): BattleImpactAnimation => {
      const battleState: State<BattleStateSchema> = getBattleState();
      if (battleState.values.round === null) {
        throw new Error("round is null");
      }
      if (state.values.serverTime === null) {
        throw new Error("serverTime is null");
      }
      const matchedEventInstance: BattleStateRoundEventInstance | undefined =
        getImpactAnimationEventInstance();
      if (typeof matchedEventInstance === "undefined") {
        throw new Error("matchedEventInstance is undefined");
      }
      switch (matchedEventInstance.event.type) {
        case BattleEventType.Damage: {
          const damageEvent: BattleDamageEvent =
            matchedEventInstance.event as BattleDamageEvent;
          if (damageEvent.isCrit === true) {
            return getDefinable(Ability, damageEvent.abilityID)
              .battleImpactCritAnimation;
          }
          if (damageEvent.isInstakill === true) {
            return getDefinable(Ability, damageEvent.abilityID)
              .battleImpactInstakillAnimation;
          }
          return getDefinable(Ability, damageEvent.abilityID)
            .battleImpactAnimation;
        }
        case BattleEventType.Heal: {
          const healEvent: BattleHealEvent =
            matchedEventInstance.event as BattleHealEvent;
          return getDefinable(Ability, healEvent.abilityID)
            .battleImpactAnimation;
        }
        case BattleEventType.Instakill: {
          const instakillEvent: BattleInstakillEvent =
            matchedEventInstance.event as BattleInstakillEvent;
          return getDefinable(Ability, instakillEvent.abilityID)
            .battleImpactInstakillAnimation;
        }
        case BattleEventType.Rejuvenate: {
          const rejuvenateEvent: BattleRejuvenateEvent =
            matchedEventInstance.event as BattleRejuvenateEvent;
          return getDefinable(Ability, rejuvenateEvent.abilityID)
            .battleImpactAnimation;
        }
      }
      throw new Error("matchedEventInstance.event.type is not valid");
    };
    const enemySpriteCondition = (): boolean => {
      const battleState: State<BattleStateSchema> = getBattleState();
      if (getEnemyBattler().isAlive) {
        switch (battleState.values.phase) {
          case BattlePhase.Round: {
            if (battleState.values.round === null) {
              throw new Error("round is null");
            }
            if (state.values.serverTime === null) {
              throw new Error("serverTime is null");
            }
            if (hasImpactAnimation() === false) {
              return true;
            }
            const eventInstance: BattleStateRoundEventInstance | undefined =
              getImpactAnimationEventInstance();
            if (typeof eventInstance === "undefined") {
              throw new Error("eventInstance is undefined");
            }
            switch (eventInstance.event.type) {
              case BattleEventType.Damage:
              case BattleEventType.Instakill: {
                const elapsedServerTime: number =
                  state.values.serverTime - battleState.values.round.serverTime;
                const diff: number =
                  elapsedServerTime - eventInstance.event.startedAt;
                const frame: number = Math.floor(
                  diff / battleImpactAnimationDuration,
                );
                if (frame >= 8) {
                  return true;
                }
                return frame % 2 === 1;
              }
              default:
                return true;
            }
          }
          case BattlePhase.Selection: {
            return true;
          }
        }
      }
      return false;
    };
    // Enemy shadow
    ellipseIDs.push(
      createEllipse({
        color: (): string =>
          getDefinable(Reachable, getBattleState().values.reachableID).landscape
            .shadowColor,
        coordinates: {
          condition: enemySpriteCondition,
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
          const battler: Battler = getEnemyBattler();
          return getDefaultedClothesDye(
            battler.battleCharacter.hasClothesDyeItem()
              ? battler.battleCharacter.clothesDyeItemID
              : undefined,
          ).id;
        },
        coordinates: {
          condition: enemySpriteCondition,
          x: getX,
          y: getY,
        },
        direction: Direction.Down,
        figureID: (): string => getEnemyBattler().battleCharacter.figureID,
        hairDyeID: (): string => {
          const battler: Battler = getEnemyBattler();
          return getDefaultedHairDye(
            battler.battleCharacter.hasHairDyeItem()
              ? battler.battleCharacter.hairDyeItemID
              : undefined,
          ).id;
        },
        maskID: (): string => {
          const battler: Battler = getEnemyBattler();
          return getDefaultedMask(
            battler.battleCharacter.hasMaskItem()
              ? battler.battleCharacter.maskItemID
              : undefined,
          ).id;
        },
        outfitID: (): string => {
          const battler: Battler = getEnemyBattler();
          return getDefaultedOutfit(
            battler.battleCharacter.hasOutfitItem()
              ? battler.battleCharacter.outfitItemID
              : undefined,
          ).id;
        },
        scale: 2,
        skinColorID: (): string =>
          getEnemyBattler().battleCharacter.skinColorID,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean => {
            if (getEnemyBattler().isAlive && isTargeting()) {
              const ability: Ability = getQueuedActionAbility();
              return ability.targetType === TargetType.SingleEnemy;
            }
            return false;
          },
          x: getX,
          y: 96,
        },
        height: 32,
        onClick: (): void => {
          useAction(getEnemyBattler().id);
        },
        width: 32,
      }),
    );
    // Enemy impact animation
    spriteIDs.push(
      createSprite({
        animationID: "default",
        animationStartedAt: (): number => {
          const eventInstance: BattleStateRoundEventInstance | undefined =
            getImpactAnimationEventInstance();
          if (typeof eventInstance === "undefined") {
            throw new Error("eventInstance is undefined");
          }
          if (state.values.serverTime === null) {
            throw new Error("serverTime is null");
          }
          const battleState: State<BattleStateSchema> = getBattleState();
          if (battleState.values.round === null) {
            throw new Error("round is null");
          }
          const diff: number =
            state.values.serverTime -
            (eventInstance.event.startedAt +
              battleState.values.round.serverTime);
          return getCurrentTime() - diff;
        },
        animations: [
          {
            frames: [
              {
                duration: battleImpactAnimationDuration,
                height: 40,
                sourceHeight: 40,
                sourceWidth: 24,
                sourceX: 24 * 0,
                sourceY: 0,
                width: 24,
              },
              {
                duration: battleImpactAnimationDuration,
                height: 40,
                sourceHeight: 40,
                sourceWidth: 24,
                sourceX: 24 * 1,
                sourceY: 0,
                width: 24,
              },
              {
                duration: battleImpactAnimationDuration,
                height: 40,
                sourceHeight: 40,
                sourceWidth: 24,
                sourceX: 24 * 2,
                sourceY: 0,
                width: 24,
              },
              {
                duration: battleImpactAnimationDuration,
                height: 40,
                sourceHeight: 40,
                sourceWidth: 24,
                sourceX: 24 * 3,
                sourceY: 0,
                width: 24,
              },
              {
                duration: battleImpactAnimationDuration,
                height: 40,
                sourceHeight: 40,
                sourceWidth: 24,
                sourceX: 24 * 4,
                sourceY: 0,
                width: 24,
              },
              {
                duration: battleImpactAnimationDuration,
                height: 40,
                sourceHeight: 40,
                sourceWidth: 24,
                sourceX: 24 * 5,
                sourceY: 0,
                width: 24,
              },
              {
                duration: battleImpactAnimationDuration,
                height: 40,
                sourceHeight: 40,
                sourceWidth: 24,
                sourceX: 24 * 6,
                sourceY: 0,
                width: 24,
              },
              {
                height: 40,
                sourceHeight: 40,
                sourceWidth: 24,
                sourceX: 24 * 7,
                sourceY: 0,
                width: 24,
              },
            ],
            id: "default",
          },
        ],
        coordinates: {
          condition: (): boolean =>
            getBattleState().values.phase === BattlePhase.Round &&
            state.values.serverTime !== null &&
            hasImpactAnimation(),
          x: (): number =>
            getX() + Math.floor(getBattlerWidth(enemyBattlerID) / 2) - 12,
          y: (): number => {
            if (state.values.serverTime === null) {
              throw new Error("serverTime is null");
            }
            const battleState: State<BattleStateSchema> = getBattleState();
            if (battleState.values.round === null) {
              throw new Error("round is null");
            }
            const battleImpactAnimation: BattleImpactAnimation =
              getImpactAnimation();
            switch (battleImpactAnimation.alignment) {
              case BattleImpactAlignment.Bottom:
                return 88;
              case BattleImpactAlignment.Center:
                return (
                  getY() + Math.round(getBattlerHeight(enemyBattlerID) / 2) - 20
                );
            }
          },
        },
        imagePath: (): string => getImpactAnimation().imagePath,
      }),
    );
    // Enemy targetting number
    const targetingNumberCondition = (): boolean => {
      if (getEnemyBattler().isAlive && isTargeting()) {
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
          value: String(getAliveBattlerIndex() + 1),
        }),
      }),
    );
    inputPressHandlerIDs.push(
      createInputPressHandler({
        condition: (): boolean => {
          if (getEnemyBattler().isAlive && isTargeting()) {
            const ability: Ability = getQueuedActionAbility();
            return ability.targetType === TargetType.SingleEnemy;
          }
          return false;
        },
        inputCollectionID: (): string => {
          const inputCollectionID: string | undefined =
            enemyTargetInputCollectionIDs[getAliveBattlerIndex()];
          if (typeof inputCollectionID === "undefined") {
            throw new Error("inputCollectionID is undefined");
          }
          return inputCollectionID;
        },
        onInput: (): void => {
          useAction(getEnemyBattler().id);
        },
      }),
    );
  }
  // Hotkeys
  const hotkeys: readonly [string, string][] = [
    [useBattleHotkey1InputCollectionID, "1"],
    [useBattleHotkey2InputCollectionID, "2"],
    [useBattleHotkey3InputCollectionID, "3"],
    [useBattleHotkey4InputCollectionID, "4"],
    [useBattleHotkey5InputCollectionID, "5"],
    [useBattleHotkey6InputCollectionID, "6"],
    [useBattleHotkey7InputCollectionID, "7"],
    [useBattleHotkey8InputCollectionID, "8"],
    [useBattleHotkey9InputCollectionID, "9"],
    [useBattleHotkey10InputCollectionID, "0"],
    [useBattleHotkey11InputCollectionID, "-"],
    [useBattleHotkey12InputCollectionID, "="],
  ];
  // Hotkeys background
  hudElementReferences.push(
    createPanel({
      condition: (): boolean =>
        getBattleState().values.phase === BattlePhase.Selection,
      height: 26,
      imagePath: "panels/basic",
      width: 243,
      x: 61,
      y: 174,
    }),
  );
  // Hotkeys slots
  for (let i: number = 0; i < hotkeys.length; i++) {
    const hotkeyData: [string, string] | undefined = hotkeys[i];
    if (typeof hotkeyData === "undefined") {
      throw new Error("hotkey is undefined");
    }
    const [inputCollectionID, label] = hotkeyData;
    const isSlotFilled = (): boolean => {
      const battleState: State<BattleStateSchema> = getBattleState();
      const hotkey: BattleStateHotkey | undefined =
        battleState.values.hotkeys.find(
          (battleHotkey: BattleStateHotkey): boolean =>
            battleHotkey.index === i,
        );
      return typeof hotkey !== "undefined";
    };
    const getSlotHotkey = (): BattleStateHotkey => {
      const battleState: State<BattleStateSchema> = getBattleState();
      const hotkey: BattleStateHotkey | undefined =
        battleState.values.hotkeys.find(
          (battleHotkey: BattleStateHotkey): boolean =>
            battleHotkey.index === i,
        );
      if (typeof hotkey === "undefined") {
        throw new Error("hotkey is undefined");
      }
      return hotkey;
    };
    const canUseHotkey = (): boolean => {
      const battleState: State<BattleStateSchema> = getBattleState();
      const hotkey: BattleStateHotkey = getSlotHotkey();
      switch (hotkey.hotkeyableDefinableReference.className) {
        case "Ability": {
          const ability: Ability = getDefinable(
            Ability,
            hotkey.hotkeyableDefinableReference.id,
          );
          const mp: number | undefined = getBattler().resources.mp ?? 0;
          return ability.mpCost <= mp && canUseAbility(ability.id);
        }
        case "Item": {
          const item: Item = getDefinable(
            Item,
            hotkey.hotkeyableDefinableReference.id,
          );
          return (
            battleState.values.itemInstanceIDs.some(
              (battleItemInstanceID: string): boolean =>
                getDefinable(ItemInstance, battleItemInstanceID).itemID ===
                item.id,
            ) && canUseAbility(item.ability.id)
          );
        }
        default:
          throw new Error(
            "hotkeyableDefinableReference.className is not valid",
          );
      }
    };
    const bindHotkey = (): void => {
      const battleState: State<BattleStateSchema> = getBattleState();
      if (battleState.values.bindAction === null) {
        throw new Error("bindAction is null");
      }
      switch (
        battleState.values.bindAction.hotkeyableDefinableReference.className
      ) {
        case "Ability":
          emitToSocketioServer<BattleBindAbilityRequest>({
            data: {
              abilityID:
                battleState.values.bindAction.hotkeyableDefinableReference.id,
              index: i,
            },
            event: "battle/bind-ability",
          });
          break;
        case "Item": {
          emitToSocketioServer<BattleBindItemRequest>({
            data: {
              index: i,
              itemID:
                battleState.values.bindAction.hotkeyableDefinableReference.id,
            },
            event: "battle/bind-item",
          });
          break;
        }
      }
      battleState.setValues({
        bindAction: null,
      });
    };
    const unbindHotkey = (): void => {
      emitToSocketioServer<BattleUnbindHotkeyRequest>({
        data: {
          index: i,
        },
        event: "battle/unbind-hotkey",
      });
    };
    const useHotkey = (): void => {
      const battleState: State<BattleStateSchema> = getBattleState();
      const hotkey: BattleStateHotkey = getSlotHotkey();
      switch (hotkey.hotkeyableDefinableReference.className) {
        case "Ability":
          useAbility(hotkey.hotkeyableDefinableReference.id);
          break;
        case "Item": {
          const itemInstanceID: string | undefined = [
            ...battleState.values.itemInstanceIDs,
          ]
            .reverse()
            .find(
              (battleItemInstanceID: string): boolean =>
                getDefinable(ItemInstance, battleItemInstanceID).itemID ===
                hotkey.hotkeyableDefinableReference.id,
            );
          if (typeof itemInstanceID === "undefined") {
            throw new Error("itemInstanceID is undefined");
          }
          useItemInstance(itemInstanceID);
          break;
        }
      }
    };
    hudElementReferences.push(
      createSlot({
        condition: (): boolean =>
          getBattleState().values.phase === BattlePhase.Selection,
        icons: [
          {
            condition: isSlotFilled,
            imagePath: (): string => {
              const hotkey: BattleStateHotkey = getSlotHotkey();
              switch (hotkey.hotkeyableDefinableReference.className) {
                case "Ability": {
                  const ability: Ability = getDefinable(
                    Ability,
                    hotkey.hotkeyableDefinableReference.id,
                  );
                  return ability.iconImagePath;
                }
                case "Item": {
                  const item: Item = getDefinable(
                    Item,
                    hotkey.hotkeyableDefinableReference.id,
                  );
                  return item.iconImagePath;
                }
                default:
                  throw new Error(
                    "hotkeyableDefinableReference.className is not valid",
                  );
              }
            },
            palette: (): string[] => {
              if (canUseHotkey() === false) {
                return [...grayColors];
              }
              return [];
            },
          },
        ],
        imagePath: "slots/basic",
        x: 68 + i * 18,
        y: 179,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean => {
            const battler: Battler = getBattler();
            return (
              getBattleState().values.phase === BattlePhase.Selection &&
              getBattleState().values.menuState === BattleMenuState.Default &&
              ((isSlotFilled() && (canUseHotkey() || isUnbindingHotkey())) ||
                isBindingHotkey()) &&
              isTargeting() === false &&
              battler.resources.hp > 0 &&
              battler.battleCharacter.hasSubmittedMove() === false
            );
          },
          x: 68 + i * 18,
          y: 179,
        },
        height: 16,
        onClick: (): void => {
          if (isBindingHotkey()) {
            bindHotkey();
          } else if (isUnbindingHotkey()) {
            unbindHotkey();
          } else {
            useHotkey();
          }
        },
        width: 16,
      }),
    );
    quadrilateralIDs.push(
      createQuadrilateral({
        color: Color.VeryDarkGray,
        coordinates: {
          condition: (): boolean => {
            const battler: Battler = getBattler();
            return (
              getBattleState().values.phase === BattlePhase.Selection &&
              ((isSlotFilled() &&
                canUseHotkey() &&
                !isBindingHotkey() &&
                !isUnbindingHotkey()) ||
                (isBindingHotkey() && areBindHotkeyLabelsVisible()) ||
                (isSlotFilled() &&
                  isUnbindingHotkey() &&
                  areUnbindHotkeyLabelsVisible())) &&
              isTargeting() === false &&
              battler.resources.hp > 0 &&
              battler.battleCharacter.hasSubmittedMove() === false
            );
          },
          x: 71 + i * 18,
          y: 190,
        },
        height: 9,
        width: 9,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean => {
            const battler: Battler = getBattler();
            return (
              getBattleState().values.phase === BattlePhase.Selection &&
              ((isSlotFilled() &&
                canUseHotkey() &&
                !isBindingHotkey() &&
                !isUnbindingHotkey()) ||
                (isBindingHotkey() && areBindHotkeyLabelsVisible()) ||
                (isSlotFilled() &&
                  isUnbindingHotkey() &&
                  areUnbindHotkeyLabelsVisible())) &&
              isTargeting() === false &&
              battler.resources.hp > 0 &&
              battler.battleCharacter.hasSubmittedMove() === false
            );
          },
          x: 76 + i * 18,
          y: 191,
        },
        horizontalAlignment: "center",
        text: {
          value: label,
        },
      }),
    );
    inputPressHandlerIDs.push(
      createInputPressHandler({
        condition: (): boolean => {
          const battler: Battler = getBattler();
          return (
            getBattleState().values.phase === BattlePhase.Selection &&
            getBattleState().values.menuState === BattleMenuState.Default &&
            ((isSlotFilled() && canUseHotkey()) ||
              isBindingHotkey() ||
              isUnbindingHotkey()) &&
            isTargeting() === false &&
            battler.resources.hp > 0 &&
            battler.battleCharacter.hasSubmittedMove() === false
          );
        },
        inputCollectionID,
        onInput: (): void => {
          if (isBindingHotkey()) {
            bindHotkey();
          } else if (isUnbindingHotkey()) {
            unbindHotkey();
          } else {
            useHotkey();
          }
        },
      }),
    );
  }
  // Hotkeys unbind button
  hudElementReferences.push(
    createImage({
      condition: (): boolean => {
        const battler: Battler = getBattler();
        return (
          getBattleState().values.phase === BattlePhase.Selection &&
          getBattleState().values.menuState === BattleMenuState.Default &&
          battler.resources.hp > 0 &&
          battler.battleCharacter.hasSubmittedMove() === false
        );
      },
      height: 11,
      imagePath: "x",
      onClick: (): void => {
        getBattleState().setValues({
          bindAction: null,
          menuState: BattleMenuState.Default,
          queuedAction: null,
          selectedAbilityIndex: null,
          selectedItemInstanceIndex: null,
          unbindStartedAt: getCurrentTime(),
        });
      },
      width: 10,
      x: 286,
      y: 182,
    }),
  );
  inputPressHandlerIDs.push(
    createInputPressHandler({
      condition: (): boolean => {
        const battler: Battler = getBattler();
        return (
          getBattleState().values.phase === BattlePhase.Selection &&
          getBattleState().values.menuState === BattleMenuState.Default &&
          battler.battleCharacter.hasSubmittedMove() === false
        );
      },
      inputCollectionID: unbindBattleHotkeyInputCollectionID,
      onInput: (): void => {
        getBattleState().setValues({
          bindAction: null,
          menuState: BattleMenuState.Default,
          queuedAction: null,
          selectedAbilityIndex: null,
          selectedItemInstanceIndex: null,
          unbindStartedAt: getCurrentTime(),
        });
      },
    }),
  );
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
  const attackButtonCondition = (): boolean => {
    const battler: Battler = getBattler();
    return (
      getBattleState().values.phase === BattlePhase.Selection &&
      isTargeting() === false &&
      isBindingHotkey() === false &&
      isUnbindingHotkey() === false &&
      canUseAbility("attack") &&
      battler.isAlive &&
      battler.battleCharacter.hasSubmittedMove() === false
    );
  };
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
  const abilityButtonCondition = (): boolean => {
    const battler: Battler = getBattler();
    return (
      getBattleState().values.phase === BattlePhase.Selection &&
      isTargeting() === false &&
      isBindingHotkey() === false &&
      isUnbindingHotkey() === false &&
      battler.isAlive &&
      battler.battleCharacter.hasSubmittedMove() === false
    );
  };
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
        bindAction: null,
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
  const itemButtonCondition = (): boolean => {
    const battler: Battler = getBattler();
    return (
      getBattleState().values.phase === BattlePhase.Selection &&
      isTargeting() === false &&
      isBindingHotkey() === false &&
      isUnbindingHotkey() === false &&
      battler.isAlive &&
      battler.battleCharacter.hasSubmittedMove() === false
    );
  };
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
        bindAction: null,
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
  const passButtonCondition = (): boolean => {
    const battler: Battler = getBattler();
    return (
      getBattleState().values.phase === BattlePhase.Selection &&
      isTargeting() === false &&
      isBindingHotkey() === false &&
      isUnbindingHotkey() === false &&
      canUseAbility("pass") &&
      battler.isAlive &&
      battler.battleCharacter.hasSubmittedMove() === false
    );
  };
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
  const escapeButtonCondition = (): boolean => {
    const battler: Battler = getBattler();
    return (
      getBattleState().values.phase === BattlePhase.Selection &&
      isTargeting() === false &&
      isBindingHotkey() === false &&
      isUnbindingHotkey() === false &&
      canUseAbility("escape") &&
      battler.isAlive &&
      battler.battleCharacter.hasSubmittedMove() === false
    );
  };
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
      condition: (): boolean =>
        isTargeting() || isBindingHotkey() || isUnbindingHotkey(),
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
        getBattleState().setValues({
          bindAction: null,
          queuedAction: null,
          unbindStartedAt: null,
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
        isTargeting() || isBindingHotkey() || isUnbindingHotkey(),
      inputCollectionID: cancelBattleActionInputCollectionID,
      onInput: (): void => {
        getBattleState().setValues({
          bindAction: null,
          queuedAction: null,
          unbindStartedAt: null,
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
        const battler: Battler = getBattler();
        if (
          battler.battleCharacter.hasSubmittedMove() ||
          battler.isAlive === false
        ) {
          return { value: "Waiting for other players." };
        }
        if (isBindingHotkey()) {
          return { value: "Select a slot to bind." };
        }
        if (isUnbindingHotkey()) {
          return { value: "Select a slot to unbind." };
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
          value: `${getFormattedInteger(ability.mpCost)} MP`,
        };
      },
    }),
  );
  // Selected ability use button
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean => {
        if (selectedAbilityCondition()) {
          const battler: Battler = getBattler();
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
        const battleState: State<BattleStateSchema> = getBattleState();
        battleState.setValues({
          abilitiesPage: 0,
          bindAction: {
            bindStartedAt: getCurrentTime(),
            hotkeyableDefinableReference: getSelectedAbility().getReference(),
          },
          menuState: BattleMenuState.Default,
          selectedAbilityIndex: null,
        });
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
        const battleState: State<BattleStateSchema> = getBattleState();
        battleState.setValues({
          bindAction: {
            bindStartedAt: getCurrentTime(),
            hotkeyableDefinableReference:
              getSelectedItemInstance().item.getReference(),
          },
          itemsPage: 0,
          menuState: BattleMenuState.Default,
          selectedItemInstanceIndex: null,
        });
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
          const battleEventInstance: BattleStateRoundEventInstance | undefined =
            battleState.values.round.eventInstances.find(
              (
                roundBattleEventInstance: BattleStateRoundEventInstance,
              ): boolean =>
                roundBattleEventInstance.event.channel === i &&
                elapsedServerTime >= roundBattleEventInstance.event.startedAt &&
                elapsedServerTime <
                  roundBattleEventInstance.event.startedAt +
                    roundBattleEventInstance.event.duration,
            );
          if (typeof battleEventInstance !== "undefined") {
            const battler: Battler = getBattler();
            switch (battleEventInstance.event.type) {
              case BattleEventType.Approach:
                return {
                  value:
                    battleState.values.enemyBattlersCount > 1
                      ? "Enemies approach."
                      : "An enemy approaches.",
                };
              case BattleEventType.Crit: {
                return {
                  value: "An excellent move!",
                };
              }
              case BattleEventType.Damage: {
                const damageBattleEvent: BattleDamageEvent =
                  battleEventInstance.event as BattleDamageEvent;
                if (damageBattleEvent.isRedirected === true) {
                  return {
                    value: `${damageBattleEvent.target.name} guards for ${damageBattleEvent.amount} damage.`,
                  };
                }
                return {
                  value: `${damageBattleEvent.target.name} takes ${damageBattleEvent.amount} damage.`,
                };
              }
              case BattleEventType.Death: {
                const deathBattleEvent: BattleDeathEvent =
                  battleEventInstance.event as BattleDeathEvent;
                return {
                  value: `${deathBattleEvent.target.name} is defeated!`,
                };
              }
              case BattleEventType.Defeat: {
                const defeatBattleEvent: BattleDefeatEvent =
                  battleEventInstance.event as BattleDefeatEvent;
                if (
                  defeatBattleEvent.winningTeamIndex ===
                  battleState.values.teamIndex
                ) {
                  if (battleState.values.enemyBattlersCount > 1) {
                    return { value: "The enemies are defeated..." };
                  }
                  return { value: "The enemy is defeated..." };
                }
                return {
                  value: "You are defeated...",
                };
              }
              case BattleEventType.Experience: {
                const experienceBattleEvent: BattleExperienceEvent =
                  battleEventInstance.event as BattleExperienceEvent;
                return {
                  value: `You gain ${getFormattedInteger(
                    experienceBattleEvent.amount,
                  )} experience.`,
                };
              }
              case BattleEventType.Gold: {
                const goldBattleEvent: BattleGoldEvent =
                  battleEventInstance.event as BattleGoldEvent;
                return {
                  value: `You ${
                    goldBattleEvent.winningTeamIndex ===
                    battleState.values.teamIndex
                      ? "find"
                      : "lose"
                  } ${
                    goldBattleEvent.winningTeamIndex ===
                    battleState.values.teamIndex
                      ? getFormattedInteger(goldBattleEvent.amount)
                      : battler.gold
                  } gold.`,
                };
              }
              case BattleEventType.FriendlyTargetFailure: {
                const friendlyTargetFailureBattleEvent: BattleFriendlyTargetFailureEvent =
                  battleEventInstance.event as BattleFriendlyTargetFailureEvent;
                return {
                  value: `...but ${friendlyTargetFailureBattleEvent.target.name} is defeated.`,
                };
              }
              case BattleEventType.Heal: {
                const damageBattleEvent: BattleDamageEvent =
                  battleEventInstance.event as BattleDamageEvent;
                return {
                  value: `${
                    damageBattleEvent.target.name
                  } recovers ${getFormattedInteger(
                    damageBattleEvent.amount,
                  )} HP.`,
                };
              }
              case BattleEventType.Instakill: {
                const instakillBattleEvent: BattleInstakillEvent =
                  battleEventInstance.event as BattleInstakillEvent;
                return {
                  value: `${instakillBattleEvent.target.name} is drawn into the light.`,
                };
              }
              case BattleEventType.Miss: {
                return { value: "...but it misses." };
              }
              case BattleEventType.Rejuvenate: {
                const rejuvenateEvent: BattleRejuvenateEvent =
                  battleEventInstance.event as BattleRejuvenateEvent;
                return {
                  value: `${
                    rejuvenateEvent.target.name
                  } recovers ${getFormattedInteger(
                    rejuvenateEvent.amount,
                  )} MP.`,
                };
              }
              case BattleEventType.UseAbility: {
                const useAbilityBattleEvent: BattleUseAbilityEvent =
                  battleEventInstance.event as BattleUseAbilityEvent;
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
              case BattleEventType.UseItem: {
                const useItemBattleEvent: BattleUseItemEvent =
                  battleEventInstance.event as BattleUseItemEvent;
                const item: Item = getDefinable(
                  Item,
                  useItemBattleEvent.itemID,
                );
                if (typeof useItemBattleEvent.target !== "undefined") {
                  return {
                    value: `${useItemBattleEvent.caster.name} uses ${item.name} on ${useItemBattleEvent.target.name}.`,
                  };
                }
                return {
                  value: `${useItemBattleEvent.caster.name} uses ${item.name}.`,
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
      spriteIDs,
    },
    ...hudElementReferences,
  ]);
};
