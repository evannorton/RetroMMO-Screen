import { Character } from "../../classes/Character";
import { InitialUpdate, MainState } from "retrommo-types";
import { ItemInstance } from "../../classes/ItemInstance";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { createWorldState } from "../state/createWorldState";
import { getDefinable, getDefinables } from "../../definables";
import { listenForBattleUpdates } from "./listenForBattleUpdates";
import { listenForMainMenuUpdates } from "./main-menu/listenForMainMenuUpdates";
import { listenForUpdate } from "./listenForUpdate";
import { listenForWorldUpdates } from "./listenForWorldUpdates";
import { loadSavefile } from "../loadSavefile";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { state } from "../../state";

export const listenForUpdates = (): void => {
  listenForMainMenuUpdates();
  listenForWorldUpdates();
  listenForBattleUpdates();
  listenForUpdate<InitialUpdate>(
    "initial-update",
    (update: InitialUpdate): void => {
      for (const itemInstance of getDefinables(ItemInstance).values()) {
        itemInstance.remove();
      }
      for (const character of getDefinables(Character).values()) {
        character.remove();
      }
      state.setValues({
        battleState: null,
        isSubscribed: update.isSubscribed,
        mainMenuState: null,
        userID: update.userID,
        username: update.username,
        worldState: null,
      });
      loadSavefile(update.savefile);
      switch (update.mainState) {
        case MainState.Battle:
          state.setValues({
            battleState: createBattleState(),
          });
          break;
        case MainState.MainMenu:
          state.setValues({
            mainMenuState: createMainMenuState(),
          });
          break;
        case MainState.World: {
          if (typeof update.world === "undefined") {
            throw new Error(
              "Initial update in World MainState is missing world.",
            );
          }
          state.setValues({
            worldState: createWorldState(update.world.characterID),
          });
          const character: Character = getDefinable(
            Character,
            update.world.characterID,
          );
          character.selectCharacter();
          for (const characterUpdate of update.world.characters) {
            loadWorldCharacterUpdate(characterUpdate);
          }
          break;
        }
      }
    },
  );
};
