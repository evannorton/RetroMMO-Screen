import { Character } from "../../classes/Character";
import { InitialUpdate, MainState } from "retrommo-types";
import { ItemInstance } from "../../classes/ItemInstance";
import { Party } from "../../classes/Party";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { createWorldState } from "../state/createWorldState";
import { getDefinables } from "../../definables";
import { listenForBattleUpdates } from "./listenForBattleUpdates";
import { listenForMainMenuUpdates } from "./main-menu/listenForMainMenuUpdates";
import { listenForWorldUpdates } from "./listenForWorldUpdates";
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadSavefile } from "../loadSavefile";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { selectCharacter } from "../selectCharacter";
import { state } from "../../state";
import { updateCharacterParty } from "../updateCharacterParty";

export const listenForUpdates = (): void => {
  listenForMainMenuUpdates();
  listenForWorldUpdates();
  listenForBattleUpdates();
  listenToSocketioEvent<InitialUpdate>({
    event: "initial-update",
    onMessage: (update: InitialUpdate): void => {
      for (const itemInstance of getDefinables(ItemInstance).values()) {
        itemInstance.remove();
      }
      for (const character of getDefinables(Character).values()) {
        character.remove();
      }
      for (const party of getDefinables(Party).values()) {
        party.remove();
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
          selectCharacter(update.world.characterID);
          updateCharacterParty(update.world.characterID, update.world.partyID);
          for (const characterUpdate of update.world.characters) {
            loadWorldCharacterUpdate(characterUpdate);
          }
          break;
        }
      }
    },
  });
};
