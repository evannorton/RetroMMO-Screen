import {
  ItemInstanceUpdate,
  MainMenuCharacterSelectDeleteCharacterUpdate,
  MainMenuCharacterSelectSelectCharacterUpdate,
  MainMenuCharacterSelectSortCharacterLeftUpdate,
  MainMenuCharacterSelectSortCharacterRightUpdate,
} from "retrommo-types";
import { MainMenuCharacter } from "../../../classes/MainMenuCharacter";
import {
  MainMenuCharacterSelectStateSchema,
  MainMenuStateSchema,
  state,
} from "../../../state";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { createWorldState } from "../../state/createWorldState";
import { getDefinable, getDefinables } from "definables";
import { getLastPlayableCharacterIndex } from "../../getLastPlayableCharacterIndex";
import { getMainMenuCharacterSelectState } from "../../state/main-menu/getMainMenuCharacterSelectState";
import { getMainMenuState } from "../../state/main-menu/getMainMenuState";
import { loadItemInstanceUpdate } from "../../load-updates/loadItemInstanceUpdate";
import { loadWorldCharacterUpdate } from "../../load-updates/loadWorldCharacterUpdate";
import { loadWorldNPCUpdate } from "../../load-updates/loadWorldNPCUpdate";
import { loadWorldPartyUpdate } from "../../load-updates/loadWorldPartyUpdate";
import { mainMenuCharactersPerPage } from "../../../constants";
import { selectWorldCharacter } from "../../selectWorldCharacter";

export const listenForMainMenuCharacterSelectUpdates = (): void => {
  listenToSocketioEvent<MainMenuCharacterSelectDeleteCharacterUpdate>({
    event: "main-menu/character-select/delete-character",
    onMessage: (update: MainMenuCharacterSelectDeleteCharacterUpdate): void => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      const characterSelectState: State<MainMenuCharacterSelectStateSchema> =
        getMainMenuCharacterSelectState();
      const character: MainMenuCharacter = getDefinable(
        MainMenuCharacter,
        update.mainMenuCharacterID,
      );
      character.remove();
      const mainMenuCharacterIDs: string[] =
        mainMenuState.values.mainMenuCharacterIDs.filter(
          (mainMenuCharacterID: string): boolean =>
            mainMenuCharacterID !== update.mainMenuCharacterID,
        );
      const thresholdCharactersAmount: number =
        characterSelectState.values.page * mainMenuCharactersPerPage;
      const page: number = Math.max(
        mainMenuCharacterIDs.length <= thresholdCharactersAmount
          ? characterSelectState.values.page - 1
          : characterSelectState.values.page,
        0,
      );
      characterSelectState.setValues({
        isDeleting: false,
        mainMenuCharacterIDToDelete: null,
        page,
      });
      mainMenuState.setValues({
        mainMenuCharacterIDs,
      });
    },
  });
  listenToSocketioEvent<MainMenuCharacterSelectSelectCharacterUpdate>({
    event: "main-menu/character-select/select-character",
    onMessage: (update: MainMenuCharacterSelectSelectCharacterUpdate): void => {
      getDefinables(MainMenuCharacter).forEach(
        (mainMenuCharacter: MainMenuCharacter): void => {
          mainMenuCharacter.remove();
        },
      );
      state.setValues({
        mainMenuState: null,
        worldState: createWorldState({
          bagItemInstanceIDs: update.bagItemInstances.map(
            (itemInstance: ItemInstanceUpdate): string => itemInstance.id,
          ),
          bodyItemInstanceID: update.bodyItemInstance?.id,
          clothesDyeItemInstanceID: update.clothesDyeItemInstance?.id,
          hairDyeItemInstanceID: update.hairDyeItemInstance?.id,
          headItemInstanceID: update.headItemInstance?.id,
          inventoryGold: update.inventoryGold,
          mainHandItemInstanceID: update.mainHandItemInstance?.id,
          maskItemInstanceID: update.maskItemInstance?.id,
          offHandItemInstanceID: update.offHandItemInstance?.id,
          outfitItemInstanceID: update.outfitItemInstance?.id,
          worldCharacterID: update.worldCharacterID,
        }),
      });
      for (const worldCharacterUpdate of update.worldCharacters) {
        loadWorldCharacterUpdate(worldCharacterUpdate);
      }
      for (const worldPartyUpdate of update.parties) {
        loadWorldPartyUpdate(worldPartyUpdate);
      }
      for (const worldNPCUpdate of update.npcs) {
        loadWorldNPCUpdate(worldNPCUpdate);
      }
      for (const bagItemInstanceUpdate of update.bagItemInstances) {
        loadItemInstanceUpdate(bagItemInstanceUpdate);
      }
      if (typeof update.bodyItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.bodyItemInstance);
      }
      if (typeof update.headItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.headItemInstance);
      }
      if (typeof update.mainHandItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.mainHandItemInstance);
      }
      if (typeof update.offHandItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.offHandItemInstance);
      }
      if (typeof update.clothesDyeItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.clothesDyeItemInstance);
      }
      if (typeof update.hairDyeItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.hairDyeItemInstance);
      }
      if (typeof update.maskItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.maskItemInstance);
      }
      if (typeof update.outfitItemInstance !== "undefined") {
        loadItemInstanceUpdate(update.outfitItemInstance);
      }
      selectWorldCharacter(update.worldCharacterID);
    },
  });
  listenToSocketioEvent<MainMenuCharacterSelectSortCharacterLeftUpdate>({
    event: "main-menu/character-select/sort-character-left",
    onMessage: (
      update: MainMenuCharacterSelectSortCharacterLeftUpdate,
    ): void => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      const characterIndex: number =
        mainMenuState.values.mainMenuCharacterIDs.indexOf(
          update.mainMenuCharacterID,
        );
      const targetIndex: number =
        characterIndex === 0
          ? getLastPlayableCharacterIndex()
          : characterIndex - 1;
      const targetCharacterID: string | undefined =
        mainMenuState.values.mainMenuCharacterIDs[targetIndex];
      if (typeof targetCharacterID === "undefined") {
        throw new Error("Out of bounds character IDs index");
      }
      const mainMenuCharacterIDs: string[] = [
        ...mainMenuState.values.mainMenuCharacterIDs,
      ];
      mainMenuCharacterIDs[targetIndex] = update.mainMenuCharacterID;
      mainMenuCharacterIDs[characterIndex] = targetCharacterID;
      mainMenuState.setValues({ mainMenuCharacterIDs });
    },
  });
  listenToSocketioEvent<MainMenuCharacterSelectSortCharacterRightUpdate>({
    event: "main-menu/character-select/sort-character-right",
    onMessage: (
      update: MainMenuCharacterSelectSortCharacterRightUpdate,
    ): void => {
      const mainMenuState: State<MainMenuStateSchema> = getMainMenuState();
      const characterIndex: number =
        mainMenuState.values.mainMenuCharacterIDs.indexOf(
          update.mainMenuCharacterID,
        );
      const targetIndex: number =
        characterIndex === getLastPlayableCharacterIndex()
          ? 0
          : characterIndex + 1;
      const targetCharacterID: string | undefined =
        mainMenuState.values.mainMenuCharacterIDs[targetIndex];
      if (typeof targetCharacterID === "undefined") {
        throw new Error("Out of bounds character IDs index");
      }
      const mainMenuCharacterIDs: string[] = [
        ...mainMenuState.values.mainMenuCharacterIDs,
      ];
      mainMenuCharacterIDs[targetIndex] = update.mainMenuCharacterID;
      mainMenuCharacterIDs[characterIndex] = targetCharacterID;
      mainMenuState.setValues({ mainMenuCharacterIDs });
    },
  });
};
