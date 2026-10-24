import {
  WorldBindAbilityUpdate,
  WorldBindItemUpdate,
  WorldUnbindHotkeyUpdate,
} from "retrommo-types";
import {
  clearWorldCombatHotkey,
  setWorldCombatAbilityHotkey,
  setWorldCombatItemHotkey,
} from "../../worldCombatHotkeys";
import { getWorldState } from "../../state/getWorldState";
import { listenToSocketioEvent } from "pixel-pigeon";

export const listenForWorldCombatHotkeyUpdates = (): void => {
  listenToSocketioEvent<WorldBindAbilityUpdate>({
    event: "world/bind-ability",
    onMessage: (update: WorldBindAbilityUpdate): void => {
      setWorldCombatAbilityHotkey(update.abilityID, update.index);
    },
  });
  listenToSocketioEvent<WorldBindItemUpdate>({
    event: "world/bind-item",
    onMessage: (update: WorldBindItemUpdate): void => {
      setWorldCombatItemHotkey(update.itemID, update.index);
    },
  });
  listenToSocketioEvent<WorldUnbindHotkeyUpdate>({
    event: "world/unbind-hotkey",
    onMessage: (update: WorldUnbindHotkeyUpdate): void => {
      clearWorldCombatHotkey(update.index);
      getWorldState().setValues({
        unbindStartedAt: null,
      });
    },
  });
};
