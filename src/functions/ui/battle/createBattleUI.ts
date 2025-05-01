import { Ability } from "../../../classes/Ability";
import { BattleCharacter } from "../../../classes/BattleCharacter";
import { BattleMenuState, BattleStateSchema, state } from "../../../state";
import {
  BattleUseAbilityRequest,
  BattleUseItemInstanceRequest,
  Color,
  Constants,
  Direction,
  ResourcePool,
  TargetType,
} from "retrommo-types";
import { ClassAbilityUnlock } from "../../../classes/Class";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createButton,
  createEllipse,
  createLabel,
  createQuadrilateral,
  emitToSocketioServer,
  getCurrentTime,
  getGameHeight,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { ItemInstance } from "../../../classes/ItemInstance";
import { Reachable } from "../../../classes/Reachable";
import { battleAbilitiesPerPage, battleItemsPerPage } from "../../../constants";
import { createCharacterSprite } from "../components/createCharacterSprite";
import { createIconListItem } from "../components/createIconListItem";
import { createImage } from "../components/createImage";
import { createPanel } from "../components/createPanel";
import { createPressableButton } from "../components/createPressableButton";
import { createResourceBar } from "../components/createResourceBar";
import { createSlot } from "../components/createSlot";
import { getBattleState } from "../../state/getBattleState";
import { getConstants } from "../../getConstants";
import { getCyclicIndex } from "../../getCyclicIndex";
import { getDefaultedClothesDye } from "../../defaulted-cosmetics/getDefaultedClothesDye";
import { getDefaultedHairDye } from "../../defaulted-cosmetics/getDefaultedHairDye";
import { getDefaultedMask } from "../../defaulted-cosmetics/getDefaultedMask";
import { getDefaultedOutfit } from "../../defaulted-cosmetics/getDefaultedOutfit";
import { getDefinable } from "definables";
import { getSumOfNumbers } from "../../getSumOfNumbers";

const targetBlinkDuration: number = 750;
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
const useAction = (playerID?: string): void => {
  const action: Ability | ItemInstance = getQueuedAction();
  if (action instanceof Ability) {
    emitToSocketioServer<BattleUseAbilityRequest>({
      data: {
        abilityID: action.id,
        playerID,
      },
      event: "battle/use-ability",
    });
  } else if (action instanceof ItemInstance) {
    emitToSocketioServer<BattleUseItemInstanceRequest>({
      data: {
        itemInstanceID: action.id,
        playerID,
      },
      event: "battle/use-item-instance",
    });
  }
};
const useAbility = (abilityID: string): void => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const ability: Ability = getDefinable(Ability, abilityID);
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
const getAbilityIDs = (): readonly string[] => {
  const battleState: State<BattleStateSchema> = getBattleState();
  const battleCharacter: BattleCharacter = getDefinable(
    BattleCharacter,
    battleState.values.battleCharacterID,
  );
  return battleCharacter.player.character.class.abilityUnlocks
    .filter(
      (abilityUnlock: ClassAbilityUnlock): boolean =>
        getDefinable(Ability, abilityUnlock.abilityID).canBeUsedInBattle &&
        abilityUnlock.level <= battleCharacter.player.character.level,
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
  readonly enemyBattleCharacterIDs: readonly string[];
  readonly friendlyBattleCharacterIDs: readonly string[];
}
export const createBattleUI = ({
  enemyBattleCharacterIDs,
  friendlyBattleCharacterIDs,
}: CreateBattleUIOptions): HUDElementReferences => {
  const buttonIDs: string[] = [];
  const ellipseIDs: string[] = [];
  const labelIDs: string[] = [];
  const quadrilateralIDs: string[] = [];
  const hudElementReferences: HUDElementReferences[] = [];
  const gameWidth: number = getGameWidth();
  const gameHeight: number = getGameHeight();
  const constants: Constants = getConstants();
  // Landscape BG
  hudElementReferences.push(
    createImage({
      condition: (): boolean => state.values.battleState !== null,
      height: gameHeight,
      imagePath: (): string =>
        getDefinable(Reachable, getBattleState().values.reachableID).landscape
          .imagePath,
      width: gameWidth,
      x: 0,
      y: 0,
    }),
  );
  // Friendly characters
  for (let i: number = 0; i < constants["maximum-party-size"]; i++) {
    const partyMemberCondition = (): boolean => {
      if (state.values.battleState !== null) {
        return typeof friendlyBattleCharacterIDs[i] !== "undefined";
      }
      return false;
    };
    const getBattleCharacter = (): BattleCharacter => {
      const friendlyBattleCharacterID: string | undefined =
        friendlyBattleCharacterIDs[i];
      if (typeof friendlyBattleCharacterID === "undefined") {
        throw new Error("friendlyBattleCharacterID is undefined");
      }
      return getDefinable(BattleCharacter, friendlyBattleCharacterID);
    };
    // Battler panel
    hudElementReferences.push(
      createPanel({
        condition: partyMemberCondition,
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
          condition: partyMemberCondition,
          x: 101 + i * 81,
          y: 206,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: 64,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: getBattleCharacter().player.username,
        }),
      }),
    );
    // Battler player sprite
    hudElementReferences.push(
      createCharacterSprite({
        clothesDyeID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedClothesDye(
            battleCharacter.hasClothesDyeItem()
              ? battleCharacter.clothesDyeItemID
              : undefined,
          ).id;
        },
        coordinates: {
          condition: partyMemberCondition,
          x: 73 + i * 81,
          y: 216,
        },
        direction: Direction.Down,
        figureID: (): string => getBattleCharacter().figureID,
        hairDyeID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedHairDye(
            battleCharacter.hasHairDyeItem()
              ? battleCharacter.hairDyeItemID
              : undefined,
          ).id;
        },
        maskID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedMask(
            battleCharacter.hasMaskItem()
              ? battleCharacter.maskItemID
              : undefined,
          ).id;
        },
        outfitID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedOutfit(
            battleCharacter.hasOutfitItem()
              ? battleCharacter.outfitItemID
              : undefined,
          ).id;
        },
        skinColorID: (): string => getBattleCharacter().skinColorID,
      }),
    );
    // Battler HP bar
    hudElementReferences.push(
      createResourceBar({
        condition: partyMemberCondition,
        iconImagePath: "resource-bar-icons/hp",
        maxValue: (): number => getBattleCharacter().resources.maxHP,
        primaryColor: Color.BrightRed,
        secondaryColor: Color.DarkPink,
        value: (): number => getBattleCharacter().resources.hp,
        x: 97 + i * 81,
        y: 216,
      }),
    );
    // Battler MP bar
    hudElementReferences.push(
      createResourceBar({
        condition: (): boolean =>
          partyMemberCondition() &&
          getBattleCharacter().player.character.class.resourcePool ===
            ResourcePool.MP,
        iconImagePath: "resource-bar-icons/mp",
        maxValue: (): number => {
          const maxMP: number | null = getBattleCharacter().resources.maxMP;
          if (maxMP === null) {
            throw new Error("maxMP is null");
          }
          return maxMP;
        },
        primaryColor: Color.PureBlue,
        secondaryColor: Color.StrongBlue,
        value: (): number => {
          const mp: number | null = getBattleCharacter().resources.mp;
          if (mp === null) {
            throw new Error("mp is null");
          }
          return mp;
        },
        x: 97 + i * 81,
        y: 226,
      }),
    );
  }
  // Enemy characters
  for (let i: number = 0; i < enemyBattleCharacterIDs.length; i++) {
    const getBattleCharacter = (): BattleCharacter => {
      const enemyBattleCharacterID: string | undefined =
        enemyBattleCharacterIDs[i];
      if (typeof enemyBattleCharacterID === "undefined") {
        throw new Error("enemyBattleCharacterID is undefined");
      }
      return getDefinable(BattleCharacter, enemyBattleCharacterID);
    };
    const getX = (): number => {
      const width: number = 32;
      const leftWidths: number[] = [];
      const rightWidths: number[] = [];
      for (let j: number = 0; j < enemyBattleCharacterIDs.length; j++) {
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
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedClothesDye(
            battleCharacter.hasClothesDyeItem()
              ? battleCharacter.clothesDyeItemID
              : undefined,
          ).id;
        },
        coordinates: {
          x: (): number => getX(),
          y: 96,
        },
        direction: Direction.Down,
        figureID: (): string => getBattleCharacter().figureID,
        hairDyeID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedHairDye(
            battleCharacter.hasHairDyeItem()
              ? battleCharacter.hairDyeItemID
              : undefined,
          ).id;
        },
        maskID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedMask(
            battleCharacter.hasMaskItem()
              ? battleCharacter.maskItemID
              : undefined,
          ).id;
        },
        outfitID: (): string => {
          const battleCharacter: BattleCharacter = getBattleCharacter();
          return getDefaultedOutfit(
            battleCharacter.hasOutfitItem()
              ? battleCharacter.outfitItemID
              : undefined,
          ).id;
        },
        scale: 2,
        skinColorID: (): string => getBattleCharacter().skinColorID,
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
          useAction(getBattleCharacter().playerID);
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
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean => isTargeting() === false,
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
  // Commands ability button
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean => isTargeting() === false,
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
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
            menuState: BattleMenuState.Abilities,
          });
        }
      },
      text: { value: "Ability" },
      width: 49,
      x: 6,
      y: 164,
    }),
  );
  // Commands item button
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean => isTargeting() === false,
      height: 16,
      imagePath: "pressable-buttons/gray",
      onClick: (): void => {
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
            menuState: BattleMenuState.Items,
          });
        }
      },
      text: { value: "Item" },
      width: 49,
      x: 6,
      y: 182,
    }),
  );
  // Commands pass button
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean => isTargeting() === false,
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
  // Commands escape button
  hudElementReferences.push(
    createPressableButton({
      condition: (): boolean => isTargeting() === false,
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
  // Commands cancel button
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
  // Instructions panel
  hudElementReferences.push(
    createPanel({
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
        condition: (): boolean => true,
        x: 69,
        y: 148,
      },
      horizontalAlignment: "left",
      maxLines: 1,
      maxWidth: 229,
      size: 1,
      text: (): CreateLabelOptionsText => {
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
          const battleCharacter: BattleCharacter = getDefinable(
            BattleCharacter,
            battleState.values.battleCharacterID,
          );
          const mp: number = battleCharacter.resources.mp ?? 0;
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
        getSelectedItemInstance().item.ability.canBeUsedInBattle,
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
  return mergeHUDElementReferences([
    {
      buttonIDs,
      ellipseIDs,
      labelIDs,
      quadrilateralIDs,
    },
    ...hudElementReferences,
  ]);
};
