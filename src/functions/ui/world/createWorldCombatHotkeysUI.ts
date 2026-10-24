import { Ability } from "../../../classes/Ability";
import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  createButton,
  createInputPressHandler,
  createLabel,
  createQuadrilateral,
  getGameWidth,
} from "pixel-pigeon";
import { Item } from "../../../classes/Item";
import { WorldCharacter } from "../../../classes/WorldCharacter";
import { WorldStateHotkey, WorldStateHotkeyTarget } from "../../../state";
import {
  areWorldCombatHotkeyBindLabelsVisible,
  areWorldCombatHotkeyUnbindLabelsVisible,
  bindWorldCombatHotkey,
  canUseWorldCombatHotkey,
  cancelWorldCombatHotkeyTarget,
  getWorldCombatHotkeyAtIndex,
  isWorldCombatHotkeyBarVisible,
  isWorldCombatHotkeyBinding,
  isWorldCombatHotkeySlotFilled,
  isWorldCombatHotkeyTargeting,
  isWorldCombatHotkeyUnbinding,
  toggleWorldCombatHotkeyUnbind,
  unbindWorldCombatHotkey,
  useWorldCombatHotkey,
  useWorldCombatHotkeyTargetOnPlayer,
} from "../../worldCombatHotkeys";
import { createImage } from "../components/createImage";
import { createPanel } from "../components/createPanel";
import { createSlot } from "../components/createSlot";
import { getDefinable } from "definables";
import { getWorldState } from "../../state/getWorldState";
import { grayColors } from "../../../constants";
import { inventoryWorldMenu } from "../../../world-menus/inventoryWorldMenu";
import { spellbookWorldMenu } from "../../../world-menus/spellbookWorldMenu";
import {
  targetWorldPartyCharacter1InputCollectionID,
  targetWorldPartyCharacter2InputCollectionID,
  targetWorldPartyCharacter3InputCollectionID,
  unbindWorldCombatHotkeyInputCollectionID,
  useWorldCombatHotkey1InputCollectionID,
  useWorldCombatHotkey2InputCollectionID,
  useWorldCombatHotkey3InputCollectionID,
  useWorldCombatHotkey4InputCollectionID,
} from "../../../inputCollections";

const worldCombatHotkeySlots: readonly [string, string][] = [
  [useWorldCombatHotkey1InputCollectionID, "1"],
  [useWorldCombatHotkey2InputCollectionID, "2"],
  [useWorldCombatHotkey3InputCollectionID, "3"],
  [useWorldCombatHotkey4InputCollectionID, "4"],
];
const getWorldCombatHotkeySlotX = (index: number): number => 5 + index * 18;
const isWorldMenuTargeting = (): boolean => {
  if (
    inventoryWorldMenu.isOpen() &&
    inventoryWorldMenu.state.values.startedTargetingAt !== null
  ) {
    return true;
  }
  if (
    spellbookWorldMenu.isOpen() &&
    spellbookWorldMenu.state.values.startedTargetingAt !== null
  ) {
    return true;
  }
  return false;
};
const canActivateWorldCombatHotkeySlot = (index: number): boolean => {
  if (
    isWorldCombatHotkeyBarVisible() &&
    isWorldMenuTargeting() === false &&
    isWorldCombatHotkeyTargeting() === false
  ) {
    return (
      (isWorldCombatHotkeySlotFilled(index) &&
        (canUseWorldCombatHotkey(index) || isWorldCombatHotkeyUnbinding())) ||
      isWorldCombatHotkeyBinding()
    );
  }
  return false;
};
const isWorldCombatHotkeyLabelVisible = (index: number): boolean => {
  if (
    isWorldCombatHotkeyBarVisible() &&
    isWorldMenuTargeting() === false &&
    isWorldCombatHotkeyTargeting() === false
  ) {
    return (
      (isWorldCombatHotkeySlotFilled(index) &&
        canUseWorldCombatHotkey(index) &&
        isWorldCombatHotkeyBinding() === false &&
        isWorldCombatHotkeyUnbinding() === false) ||
      (isWorldCombatHotkeyBinding() &&
        areWorldCombatHotkeyBindLabelsVisible()) ||
      (isWorldCombatHotkeySlotFilled(index) &&
        isWorldCombatHotkeyUnbinding() &&
        areWorldCombatHotkeyUnbindLabelsVisible())
    );
  }
  return false;
};
const markOpenWorldMenusAwaitingCombat = (): void => {
  if (spellbookWorldMenu.isOpen()) {
    spellbookWorldMenu.state.setValues({
      isAwaitingWorldCombat: true,
    });
  }
  if (inventoryWorldMenu.isOpen()) {
    inventoryWorldMenu.state.setValues({
      isAwaitingWorldCombat: true,
    });
  }
};
const activateWorldCombatHotkeySlot = (index: number): void => {
  if (isWorldCombatHotkeyBinding()) {
    bindWorldCombatHotkey(index);
  } else if (isWorldCombatHotkeyUnbinding()) {
    unbindWorldCombatHotkey(index);
  } else {
    const didStartTargeting: boolean = useWorldCombatHotkey(index);
    if (didStartTargeting === false) {
      markOpenWorldMenusAwaitingCombat();
    }
  }
};
const getWorldCombatHotkeyIconImagePath = (index: number): string => {
  const hotkey: WorldStateHotkey = getWorldCombatHotkeyAtIndex(index);
  switch (hotkey.hotkeyableDefinableReference.className) {
    case "Ability":
      return getDefinable(Ability, hotkey.hotkeyableDefinableReference.id)
        .iconImagePath;
    case "Item":
      return getDefinable(Item, hotkey.hotkeyableDefinableReference.id)
        .iconImagePath;
    default:
      throw new Error("hotkeyableDefinableReference.className is not valid");
  }
};
const getWorldCombatHotkeyTarget = (): WorldStateHotkeyTarget => {
  const hotkeyTarget: WorldStateHotkeyTarget | null =
    getWorldState().values.hotkeyTarget;
  if (hotkeyTarget === null) {
    throw new Error("hotkeyTarget is null");
  }
  return hotkeyTarget;
};
const isWorldCombatHotkeyTargetPanelVisible = (): boolean =>
  isWorldCombatHotkeyBarVisible() && isWorldCombatHotkeyTargeting();
const getWorldCombatHotkeyTargetIconImagePath = (): string => {
  const hotkeyTarget: WorldStateHotkeyTarget = getWorldCombatHotkeyTarget();
  switch (hotkeyTarget.hotkeyableDefinableReference.className) {
    case "Ability":
      return getDefinable(Ability, hotkeyTarget.hotkeyableDefinableReference.id)
        .iconImagePath;
    case "Item":
      return getDefinable(Item, hotkeyTarget.hotkeyableDefinableReference.id)
        .iconImagePath;
    default:
      throw new Error("hotkeyableDefinableReference.className is not valid");
  }
};
const getWorldCombatHotkeyTargetName = (): string => {
  const hotkeyTarget: WorldStateHotkeyTarget = getWorldCombatHotkeyTarget();
  switch (hotkeyTarget.hotkeyableDefinableReference.className) {
    case "Ability":
      return getDefinable(Ability, hotkeyTarget.hotkeyableDefinableReference.id)
        .name;
    case "Item":
      return getDefinable(Item, hotkeyTarget.hotkeyableDefinableReference.id)
        .ability.name;
    default:
      throw new Error("hotkeyableDefinableReference.className is not valid");
  }
};

export const createWorldCombatHotkeysUI = (): void => {
  const gameWidth: number = getGameWidth();
  createPanel({
    condition: isWorldCombatHotkeyBarVisible,
    height: 26,
    imagePath: "panels/basic",
    width: 93,
    x: 0,
    y: 182,
  });
  for (let index: number = 0; index < worldCombatHotkeySlots.length; index++) {
    const worldCombatHotkeySlot: [string, string] | undefined =
      worldCombatHotkeySlots[index];
    if (typeof worldCombatHotkeySlot === "undefined") {
      throw new Error("World combat hotkey slot is undefined.");
    }
    const [inputCollectionID, label]: [string, string] = worldCombatHotkeySlot;
    const slotX: number = getWorldCombatHotkeySlotX(index);
    createSlot({
      condition: isWorldCombatHotkeyBarVisible,
      icons: [
        {
          condition: (): boolean => isWorldCombatHotkeySlotFilled(index),
          imagePath: (): string => getWorldCombatHotkeyIconImagePath(index),
          palette: (): string[] => {
            if (canUseWorldCombatHotkey(index) === false) {
              return grayColors;
            }
            return [];
          },
        },
      ],
      imagePath: "slots/basic",
      x: slotX,
      y: 187,
    });
    createButton({
      coordinates: {
        condition: (): boolean => canActivateWorldCombatHotkeySlot(index),
        x: slotX,
        y: 187,
      },
      height: 16,
      onClick: (): void => {
        activateWorldCombatHotkeySlot(index);
      },
      width: 16,
    });
    createQuadrilateral({
      color: Color.VeryDarkGray,
      coordinates: {
        condition: (): boolean => isWorldCombatHotkeyLabelVisible(index),
        x: slotX + 3,
        y: 198,
      },
      height: 9,
      width: 9,
    });
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean => isWorldCombatHotkeyLabelVisible(index),
        x: slotX + 8,
        y: 199,
      },
      horizontalAlignment: "center",
      text: {
        value: label,
      },
    });
    createInputPressHandler({
      condition: (): boolean => canActivateWorldCombatHotkeySlot(index),
      inputCollectionID,
      onInput: (): void => {
        activateWorldCombatHotkeySlot(index);
      },
    });
  }
  const hotkeyUnbindButtonCondition = (): boolean =>
    isWorldCombatHotkeyBarVisible() &&
    isWorldMenuTargeting() === false &&
    isWorldCombatHotkeyTargeting() === false;
  createImage({
    condition: hotkeyUnbindButtonCondition,
    height: 11,
    imagePath: "x",
    onClick: toggleWorldCombatHotkeyUnbind,
    width: 10,
    x: 77,
    y: 190,
  });
  createInputPressHandler({
    condition: hotkeyUnbindButtonCondition,
    inputCollectionID: unbindWorldCombatHotkeyInputCollectionID,
    onInput: toggleWorldCombatHotkeyUnbind,
  });
  createPanel({
    condition: isWorldCombatHotkeyTargetPanelVisible,
    height: 44,
    imagePath: "panels/basic",
    width: 147,
    x: 0,
    y: 164,
  });
  createSlot({
    condition: isWorldCombatHotkeyTargetPanelVisible,
    icons: [
      {
        imagePath: getWorldCombatHotkeyTargetIconImagePath,
      },
    ],
    imagePath: "slots/basic",
    x: 7,
    y: 171,
  });
  createLabel({
    color: Color.White,
    coordinates: {
      condition: isWorldCombatHotkeyTargetPanelVisible,
      x: 27,
      y: 176,
    },
    horizontalAlignment: "left",
    text: (): CreateLabelOptionsText => ({
      value: getWorldCombatHotkeyTargetName(),
    }),
  });
  createImage({
    condition: isWorldCombatHotkeyTargetPanelVisible,
    height: 11,
    imagePath: "x",
    onClick: cancelWorldCombatHotkeyTarget,
    width: 10,
    x: 130,
    y: 171,
  });
  createLabel({
    color: Color.White,
    coordinates: {
      condition: isWorldCombatHotkeyTargetPanelVisible,
      x: 74,
      y: 191,
    },
    horizontalAlignment: "center",
    maxLines: 1,
    maxWidth: gameWidth,
    text: {
      value: "Select a target.",
    },
  });
  [
    targetWorldPartyCharacter1InputCollectionID,
    targetWorldPartyCharacter2InputCollectionID,
    targetWorldPartyCharacter3InputCollectionID,
  ].forEach((inputCollectionID: string, inputCollectionIndex: number): void => {
    createInputPressHandler({
      condition: (): boolean => {
        if (isWorldCombatHotkeyTargetPanelVisible()) {
          return (
            getDefinable(
              WorldCharacter,
              getWorldState().values.worldCharacterID,
            ).player.character.party.playerIDs.length > inputCollectionIndex
          );
        }
        return false;
      },
      inputCollectionID,
      onInput: (): void => {
        const partyMemberPlayerID: string | undefined = getDefinable(
          WorldCharacter,
          getWorldState().values.worldCharacterID,
        ).player.character.party.playerIDs[inputCollectionIndex];
        if (typeof partyMemberPlayerID === "undefined") {
          throw new Error("No party member player ID.");
        }
        useWorldCombatHotkeyTargetOnPlayer(partyMemberPlayerID);
      },
    });
  });
};
