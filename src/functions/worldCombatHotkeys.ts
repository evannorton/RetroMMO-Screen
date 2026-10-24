import { Ability } from "../classes/Ability";
import { DefinableReference, getDefinable } from "definables";
import { Item } from "../classes/Item";
import { ItemInstance } from "../classes/ItemInstance";
import { State, emitToSocketioServer, getCurrentTime } from "pixel-pigeon";
import {
  TargetType,
  WorldAbilityHotkeyUpdate,
  WorldBindAbilityRequest,
  WorldBindItemRequest,
  WorldItemHotkeyUpdate,
  WorldUnbindHotkeyRequest,
  WorldUseAbilityRequest,
  WorldUseItemInstanceRequest,
} from "retrommo-types";
import { WorldCharacter } from "../classes/WorldCharacter";
import {
  WorldStateBindAction,
  WorldStateHotkey,
  WorldStateHotkeyTarget,
  WorldStateSchema,
  state,
} from "../state";
import { closeWorldMenus } from "./world-menus/closeWorldMenus";
import { getWorldState } from "./state/getWorldState";
import { hotkeyLabelBlinkDuration, targetBlinkDuration } from "../constants";
import { isAWorldMenuOpen } from "./world-menus/isAWorldMenuOpen";
import { isForcedWorldUIVisible } from "./isForcedWorldUIVisible";
import { isWorldCombatInProgress } from "./isWorldCombatInProgress";
import { submitStarwatchEvent } from "./starwatch/submitStarwatchEvent";

const isWorldCombatAbilityTargetValid = (targetType: TargetType): boolean =>
  targetType === TargetType.AllAllies ||
  targetType === TargetType.None ||
  targetType === TargetType.SingleAlly;
const getWorldCombatHotkey = (index: number): WorldStateHotkey | undefined => {
  const worldState: State<WorldStateSchema> = getWorldState();
  return worldState.values.hotkeys.find(
    (hotkey: WorldStateHotkey): boolean => hotkey.index === index,
  );
};
const getBagItemInstanceID = (itemID: string): string | undefined => {
  const bagItemInstanceIDs: readonly string[] = [
    ...getWorldState().values.bagItemInstanceIDs,
  ].reverse();
  return bagItemInstanceIDs.find(
    (bagItemInstanceID: string): boolean =>
      getDefinable(ItemInstance, bagItemInstanceID).itemID === itemID,
  );
};
const canUseWorldCombatAbility = (ability: Ability): boolean => {
  if (isWorldCombatAbilityTargetValid(ability.targetType) === false) {
    return false;
  }
  if (ability.canBeUsedInWorld === false) {
    return false;
  }
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    getWorldState().values.worldCharacterID,
  );
  const mp: number = worldCharacter.resources.mp ?? 0;
  return mp >= ability.mpCost;
};
const canUseWorldCombatItem = (item: Item): boolean => {
  if (item.hasAbility() === false) {
    return false;
  }
  if (item.ability.canBeUsedInWorld === false) {
    return false;
  }
  if (isWorldCombatAbilityTargetValid(item.ability.targetType) === false) {
    return false;
  }
  return typeof getBagItemInstanceID(item.id) !== "undefined";
};

export const getWorldStateHotkeys = ({
  abilityHotkeys,
  itemHotkeys,
}: {
  readonly abilityHotkeys: readonly WorldAbilityHotkeyUpdate[];
  readonly itemHotkeys: readonly WorldItemHotkeyUpdate[];
}): WorldStateHotkey[] => {
  const hotkeys: WorldStateHotkey[] = [];
  for (const abilityHotkey of abilityHotkeys) {
    hotkeys.push({
      hotkeyableDefinableReference: getDefinable(
        Ability,
        abilityHotkey.abilityID,
      ).getReference(),
      index: abilityHotkey.index,
    });
  }
  for (const itemHotkey of itemHotkeys) {
    hotkeys.push({
      hotkeyableDefinableReference: getDefinable(
        Item,
        itemHotkey.itemID,
      ).getReference(),
      index: itemHotkey.index,
    });
  }
  return hotkeys;
};
export const isWorldCombatHotkeyBarVisible = (): boolean => {
  if (
    state.values.worldState !== null &&
    state.values.worldState.values.queuedBattle === null &&
    isAWorldMenuOpen() === false &&
    (state.values.worldState.values.hotkeys.length > 0 ||
      state.values.worldState.values.bindAction !== null)
  ) {
    return isForcedWorldUIVisible() === false;
  }
  return false;
};
export const isWorldCombatHotkeyBinding = (): boolean => {
  if (state.values.worldState !== null) {
    return state.values.worldState.values.bindAction !== null;
  }
  return false;
};
export const isWorldCombatHotkeyUnbinding = (): boolean => {
  if (state.values.worldState !== null) {
    return state.values.worldState.values.unbindStartedAt !== null;
  }
  return false;
};
export const isWorldCombatHotkeyTargeting = (): boolean => {
  if (state.values.worldState !== null) {
    return state.values.worldState.values.hotkeyTarget !== null;
  }
  return false;
};
export const isWorldCombatHotkeyTargetIndicatorVisible = (): boolean => {
  if (state.values.worldState === null) {
    return false;
  }
  const hotkeyTarget: WorldStateHotkeyTarget | null =
    state.values.worldState.values.hotkeyTarget;
  if (hotkeyTarget === null || isWorldCombatInProgress()) {
    return false;
  }
  const elapsed: number = getCurrentTime() - hotkeyTarget.startedTargetingAt;
  return (elapsed % targetBlinkDuration) * 2 < targetBlinkDuration;
};
export const areWorldCombatHotkeyBindLabelsVisible = (): boolean => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const bindAction: WorldStateBindAction | null = worldState.values.bindAction;
  if (bindAction === null) {
    throw new Error("bindAction is null");
  }
  const elapsed: number = getCurrentTime() - bindAction.bindStartedAt;
  return elapsed % (hotkeyLabelBlinkDuration * 2) < hotkeyLabelBlinkDuration;
};
export const areWorldCombatHotkeyUnbindLabelsVisible = (): boolean => {
  const worldState: State<WorldStateSchema> = getWorldState();
  if (worldState.values.unbindStartedAt === null) {
    throw new Error("unbindStartedAt is null");
  }
  const elapsed: number = getCurrentTime() - worldState.values.unbindStartedAt;
  return elapsed % (hotkeyLabelBlinkDuration * 2) < hotkeyLabelBlinkDuration;
};
export const beginWorldCombatHotkeyBind = (
  hotkeyableDefinableReference: DefinableReference,
): void => {
  getWorldState().setValues({
    bindAction: {
      bindStartedAt: getCurrentTime(),
      hotkeyableDefinableReference,
    },
    hotkeyTarget: null,
    unbindStartedAt: null,
  });
};
export const toggleWorldCombatHotkeyUnbind = (): void => {
  const worldState: State<WorldStateSchema> = getWorldState();
  if (
    worldState.values.bindAction !== null ||
    worldState.values.unbindStartedAt !== null
  ) {
    worldState.setValues({
      bindAction: null,
      hotkeyTarget: null,
      unbindStartedAt: null,
    });
  } else {
    worldState.setValues({
      bindAction: null,
      hotkeyTarget: null,
      unbindStartedAt: getCurrentTime(),
    });
  }
};
export const cancelWorldCombatHotkeyTarget = (): void => {
  getWorldState().setValues({
    hotkeyTarget: null,
  });
};
export const isWorldCombatHotkeySlotFilled = (index: number): boolean =>
  typeof getWorldCombatHotkey(index) !== "undefined";
export const getWorldCombatHotkeyAtIndex = (
  index: number,
): WorldStateHotkey => {
  const hotkey: WorldStateHotkey | undefined = getWorldCombatHotkey(index);
  if (typeof hotkey === "undefined") {
    throw new Error("World combat hotkey is undefined.");
  }
  return hotkey;
};
export const canUseWorldCombatHotkey = (index: number): boolean => {
  if (state.values.worldState === null || isWorldCombatInProgress()) {
    return false;
  }
  const hotkey: WorldStateHotkey = getWorldCombatHotkeyAtIndex(index);
  switch (hotkey.hotkeyableDefinableReference.className) {
    case "Ability":
      return canUseWorldCombatAbility(
        getDefinable(Ability, hotkey.hotkeyableDefinableReference.id),
      );
    case "Item":
      return canUseWorldCombatItem(
        getDefinable(Item, hotkey.hotkeyableDefinableReference.id),
      );
    default:
      throw new Error("hotkeyableDefinableReference.className is not valid");
  }
};
export const bindWorldCombatHotkey = (index: number): void => {
  const worldState: State<WorldStateSchema> = getWorldState();
  if (worldState.values.bindAction === null) {
    throw new Error("bindAction is null");
  }
  switch (worldState.values.bindAction.hotkeyableDefinableReference.className) {
    case "Ability":
      emitToSocketioServer<WorldBindAbilityRequest>({
        data: {
          abilityID:
            worldState.values.bindAction.hotkeyableDefinableReference.id,
          index,
        },
        event: "world/bind-ability",
      });
      break;
    case "Item":
      emitToSocketioServer<WorldBindItemRequest>({
        data: {
          index,
          itemID: worldState.values.bindAction.hotkeyableDefinableReference.id,
        },
        event: "world/bind-item",
      });
      break;
    default:
      throw new Error("hotkeyableDefinableReference.className is not valid");
  }
  worldState.setValues({
    bindAction: null,
  });
};
export const unbindWorldCombatHotkey = (index: number): void => {
  emitToSocketioServer<WorldUnbindHotkeyRequest>({
    data: {
      index,
    },
    event: "world/unbind-hotkey",
  });
};
export const useWorldCombatHotkey = (index: number): boolean => {
  const hotkey: WorldStateHotkey = getWorldCombatHotkeyAtIndex(index);
  switch (hotkey.hotkeyableDefinableReference.className) {
    case "Ability": {
      const ability: Ability = getDefinable(
        Ability,
        hotkey.hotkeyableDefinableReference.id,
      );
      if (ability.targetType === TargetType.SingleAlly) {
        getWorldState().setValues({
          bindAction: null,
          hotkeyTarget: {
            hotkeyableDefinableReference: ability.getReference(),
            itemInstanceID: null,
            startedTargetingAt: getCurrentTime(),
          },
          unbindStartedAt: null,
        });
        closeWorldMenus({});
        return true;
      }
      if (
        ability.targetType === TargetType.AllAllies ||
        ability.targetType === TargetType.None
      ) {
        emitToSocketioServer<WorldUseAbilityRequest>({
          data: {
            abilityID: ability.id,
          },
          event: "world/use-ability",
        });
        submitStarwatchEvent({
          event: "ability",
          extraDetails: {
            abilityID: ability.id,
          },
        });
        return false;
      }
      throw new Error(
        "Ability target type is not valid for world combat hotkeys.",
      );
    }
    case "Item": {
      const item: Item = getDefinable(
        Item,
        hotkey.hotkeyableDefinableReference.id,
      );
      const itemInstanceID: string | undefined = getBagItemInstanceID(item.id);
      if (typeof itemInstanceID === "undefined") {
        throw new Error("itemInstanceID is undefined");
      }
      if (item.ability.targetType === TargetType.SingleAlly) {
        getWorldState().setValues({
          bindAction: null,
          hotkeyTarget: {
            hotkeyableDefinableReference: item.getReference(),
            itemInstanceID,
            startedTargetingAt: getCurrentTime(),
          },
          unbindStartedAt: null,
        });
        closeWorldMenus({});
        return true;
      }
      if (
        item.ability.targetType === TargetType.AllAllies ||
        item.ability.targetType === TargetType.None
      ) {
        emitToSocketioServer<WorldUseItemInstanceRequest>({
          data: {
            itemInstanceID,
          },
          event: "world/use-item-instance",
        });
        submitStarwatchEvent({
          event: "item",
          extraDetails: {
            itemID: item.id,
          },
        });
        return false;
      }
      throw new Error(
        "Item target type is not valid for world combat hotkeys.",
      );
    }
    default:
      throw new Error("hotkeyableDefinableReference.className is not valid");
  }
};
export const useWorldCombatHotkeyTargetOnPlayer = (playerID: string): void => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const hotkeyTarget: WorldStateHotkeyTarget | null =
    worldState.values.hotkeyTarget;
  if (hotkeyTarget === null) {
    throw new Error("hotkeyTarget is null");
  }
  switch (hotkeyTarget.hotkeyableDefinableReference.className) {
    case "Ability":
      emitToSocketioServer<WorldUseAbilityRequest>({
        data: {
          abilityID: hotkeyTarget.hotkeyableDefinableReference.id,
          playerID,
        },
        event: "world/use-ability",
      });
      submitStarwatchEvent({
        event: "ability",
        extraDetails: {
          abilityID: hotkeyTarget.hotkeyableDefinableReference.id,
        },
      });
      break;
    case "Item":
      if (hotkeyTarget.itemInstanceID === null) {
        throw new Error("itemInstanceID is null");
      }
      emitToSocketioServer<WorldUseItemInstanceRequest>({
        data: {
          itemInstanceID: hotkeyTarget.itemInstanceID,
          playerID,
        },
        event: "world/use-item-instance",
      });
      submitStarwatchEvent({
        event: "item",
        extraDetails: {
          itemID: hotkeyTarget.hotkeyableDefinableReference.id,
        },
      });
      break;
    default:
      throw new Error("hotkeyableDefinableReference.className is not valid");
  }
  worldState.setValues({
    hotkeyTarget: null,
  });
};
export const setWorldCombatAbilityHotkey = (
  abilityID: string,
  index: number,
): void => {
  const worldState: State<WorldStateSchema> = getWorldState();
  worldState.setValues({
    hotkeys: [
      ...worldState.values.hotkeys.filter(
        (hotkey: WorldStateHotkey): boolean => hotkey.index !== index,
      ),
      {
        hotkeyableDefinableReference: getDefinable(
          Ability,
          abilityID,
        ).getReference(),
        index,
      },
    ],
  });
};
export const setWorldCombatItemHotkey = (
  itemID: string,
  index: number,
): void => {
  const worldState: State<WorldStateSchema> = getWorldState();
  worldState.setValues({
    hotkeys: [
      ...worldState.values.hotkeys.filter(
        (hotkey: WorldStateHotkey): boolean => hotkey.index !== index,
      ),
      {
        hotkeyableDefinableReference: getDefinable(Item, itemID).getReference(),
        index,
      },
    ],
  });
};
export const clearWorldCombatHotkey = (index: number): void => {
  const worldState: State<WorldStateSchema> = getWorldState();
  worldState.setValues({
    hotkeys: worldState.values.hotkeys.filter(
      (hotkey: WorldStateHotkey): boolean => hotkey.index !== index,
    ),
  });
};
