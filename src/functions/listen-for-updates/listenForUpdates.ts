import { InitialUpdate, ItemInstanceUpdate, MainState } from "retrommo-types";
import { ItemInstance } from "../../classes/ItemInstance";
import { MainMenuCharacter } from "../../classes/MainMenuCharacter";
import { Party } from "../../classes/Party";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { closeWorldMenus } from "../world-menus/closeWorldMenus";
import { createBattleState } from "../state/createBattleState";
import { createMainMenuState } from "../state/main-menu/createMainMenuState";
import { createWorldState } from "../state/createWorldState";
import { emotesWorldMenu } from "../../world-menus/emotesWorldMenu";
import { getDefinables } from "definables";
import { inventoryWorldMenu } from "../../world-menus/inventoryWorldMenu";
import { listenForBattleUpdates } from "./listenForBattleUpdates";
import { listenForMainMenuUpdates } from "./main-menu/listenForMainMenuUpdates";
import { listenForWorldUpdates } from "./listenForWorldUpdates";
import { listenToSocketioEvent } from "pixel-pigeon";
import { loadWorldBagItemInstanceUpdate } from "../load-updates/loadWorldBagItemInstanceUpdate";
import { loadWorldCharacterUpdate } from "../load-updates/loadWorldCharacterUpdate";
import { loadWorldNPCUpdate } from "../load-updates/loadWorldNPCUpdate";
import { loadWorldPartyUpdate } from "../load-updates/loadWorldPartyUpdate";
import { questLogWorldMenu } from "../../world-menus/questLogWorldMenu";
import { selectWorldCharacter } from "../selectWorldCharacter";
import { spellbookWorldMenu } from "../../world-menus/spellbookWorldMenu";
import { state } from "../../state";

export const listenForUpdates = (): void => {
  listenToSocketioEvent<InitialUpdate>({
    event: "initial-update",
    onMessage: (update: InitialUpdate): void => {
      for (const mainMenuCharacter of getDefinables(
        MainMenuCharacter,
      ).values()) {
        mainMenuCharacter.remove();
      }
      for (const worldCharacter of getDefinables(WorldCharacter).values()) {
        worldCharacter.remove();
      }
      for (const party of getDefinables(Party).values()) {
        party.remove();
      }
      for (const itemInstance of getDefinables(ItemInstance).values()) {
        itemInstance.remove();
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
            worldState: createWorldState(
              update.world.bagItemInstances.map(
                (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
              ),
              update.world.worldCharacterID,
            ),
          });
          for (const worldCharacterUpdate of update.world.worldCharacters) {
            loadWorldCharacterUpdate(worldCharacterUpdate);
          }
          for (const partyUpdate of update.world.parties) {
            loadWorldPartyUpdate(partyUpdate);
          }
          for (const npcUpdate of update.world.npcs) {
            loadWorldNPCUpdate(npcUpdate);
          }
          for (const bagItemInstanceUpdate of update.world.bagItemInstances) {
            loadWorldBagItemInstanceUpdate(bagItemInstanceUpdate);
          }
          selectWorldCharacter(update.world.worldCharacterID);
          break;
        }
      }
      listenForMainMenuUpdates();
      listenForWorldUpdates();
      listenForBattleUpdates();
      listenToSocketioEvent({
        event: "legacy/open-emotes",
        onMessage: (): void => {
          if (emotesWorldMenu.isOpen() === false) {
            closeWorldMenus();
            emotesWorldMenu.open({});
          }
        },
      });
      listenToSocketioEvent({
        event: "legacy/open-quest-log",
        onMessage: (): void => {
          if (questLogWorldMenu.isOpen() === false) {
            closeWorldMenus();
            questLogWorldMenu.open({});
          }
        },
      });
      listenToSocketioEvent({
        event: "legacy/open-spellbook",
        onMessage: (): void => {
          if (spellbookWorldMenu.isOpen() === false) {
            closeWorldMenus();
            spellbookWorldMenu.open({});
          }
        },
      });
      listenToSocketioEvent({
        event: "legacy/open-inventory",
        onMessage: (): void => {
          if (inventoryWorldMenu.isOpen() === false) {
            closeWorldMenus();
            inventoryWorldMenu.open({});
          }
        },
      });
    },
  });
};
