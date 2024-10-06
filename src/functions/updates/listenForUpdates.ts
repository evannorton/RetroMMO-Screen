import { InitialUpdate, MainState } from "retrommo-types";
import { MainMenuCharacter } from "../../classes/MainMenuCharacter";
import { Party } from "../../classes/Party";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { createWorldState } from "../state/createWorldState";
import { getDefinables } from "definables";
import { listenForBattleUpdates } from "./listenForBattleUpdates";
import { listenForMainMenuUpdates } from "./main-menu/listenForMainMenuUpdates";
import { listenForWorldUpdates } from "./listenForWorldUpdates";
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadWorldCharacterUpdate } from "../loadWorldCharacterUpdate";
import { loadWorldPartyUpdate } from "../loadWorldPartyUpdate";
import { selectWorldCharacter } from "../selectWorldCharacter";
import { state } from "../../state";

export const listenForUpdates = (): void => {
  listenForMainMenuUpdates();
  listenForWorldUpdates();
  listenForBattleUpdates();
  listenToSocketioEvent<InitialUpdate>({
    event: "initial-update",
    onMessage: (update: InitialUpdate): void => {
      for (const character of getDefinables(MainMenuCharacter).values()) {
        character.remove();
      }
      for (const character of getDefinables(WorldCharacter).values()) {
        character.remove();
      }
      for (const party of getDefinables(Party).values()) {
        party.remove();
      }
      state.setValues({
        battleState: null,
        isSubscribed: update.isSubscribed,
        mainMenuState: null,
        worldState: null,
      });
      switch (update.mainState) {
        case MainState.Battle:
          state.setValues({
            battleState: createBattleState(),
          });
          break;
        case MainState.MainMenu: {
          if (typeof update.mainMenu === "undefined") {
            throw new Error(
              "Initial update in MainMenu MainState is missing mainMenu.",
            );
          }
          const mainMenuCharacterIDs: string[] = [];
          for (const mainMenuCharacterUpdate of update.mainMenu
            .mainMenuCharacters) {
            mainMenuCharacterIDs.push(
              new MainMenuCharacter({
                classID: mainMenuCharacterUpdate.classID,
                clothesDyeItemID: mainMenuCharacterUpdate.clothesDyeItemID,
                figureID: mainMenuCharacterUpdate.figureID,
                hairDyeItemID: mainMenuCharacterUpdate.hairDyeItemID,
                id: mainMenuCharacterUpdate.id,
                level: mainMenuCharacterUpdate.level,
                maskItemID: mainMenuCharacterUpdate.maskItemID,
                outfitItemID: mainMenuCharacterUpdate.outfitItemID,
                skinColorID: mainMenuCharacterUpdate.skinColorID,
              }).id,
            );
          }
          state.setValues({
            mainMenuState: createMainMenuState(mainMenuCharacterIDs),
          });
          break;
        }
        case MainState.World: {
          if (typeof update.world === "undefined") {
            throw new Error(
              "Initial update in World MainState is missing world.",
            );
          }
          state.setValues({
            worldState: createWorldState(update.world.worldCharacterID),
          });
          for (const worldCharacterUpdate of update.world.worldCharacters) {
            loadWorldCharacterUpdate(worldCharacterUpdate);
          }
          for (const partyUpdate of update.world.parties) {
            loadWorldPartyUpdate(partyUpdate);
          }
          selectWorldCharacter(update.world.worldCharacterID);
          break;
        }
      }
    },
  });
};
