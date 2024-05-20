import { Character } from "../classes/Character";
import { InitialUpdate, MainState, SavefileItemInstance } from "retrommo-types";
import { ItemInstance } from "../classes/ItemInstance";
import {
  connectToSocketioServer,
  exitLevel,
  listenToSocketioEvent,
} from "pixel-pigeon";
import { createBattleState } from "./state/createBattleState";
import { createCharacterSelectState } from "./state/main-menu/createCharacterSelectState";
import { createMainMenuState } from "./state/main-menu/createMainMenuState";
import { createWorldState } from "./state/createWorldState";
import { getCharacterSelectState } from "./state/main-menu/getCharacterSelectState";
import { getDefinable, getDefinables } from "../definables";
import { getLastPlayableCharacterIndex } from "./getLastPlayableCharacterIndex";
import { loadSavefile } from "./loadSavefile";
import { state } from "../state";

export const handleWindowMessage = (message: unknown): void => {
  if (typeof message !== "object" || message === null) {
    throw new Error("Invalid message.");
  }
  if ("type" in message && "value" in message) {
    if (typeof message.type !== "string") {
      throw new Error("Invalid message type.");
    }
    switch (message.type) {
      case "auth": {
        if (typeof message.value !== "string") {
          throw new Error("Invalid auth message value.");
        }
        const url: string | null = state.values.serverURL;
        if (url === null) {
          throw new Error(
            "Attempted to connect to socket.io server with no server URL.",
          );
        }
        connectToSocketioServer({
          auth: { token: message.value },
          url,
        });
        listenToSocketioEvent({
          event: "initial-update",
          onMessage: (data: unknown): void => {
            const initialUpdate: InitialUpdate = data as InitialUpdate;
            for (const itemInstance of getDefinables(ItemInstance).values()) {
              itemInstance.remove();
            }
            for (const character of getDefinables(Character).values()) {
              character.remove();
            }
            state.setValues({
              battleState: null,
              isSubscribed: initialUpdate.isSubscribed,
              mainMenuState: null,
              worldState: null,
            });
            loadSavefile(initialUpdate.savefile);
            switch (initialUpdate.mainState) {
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
                if (typeof initialUpdate.world === "undefined") {
                  throw new Error(
                    "Initial update in World MainState is missing world.",
                  );
                }
                state.setValues({
                  worldState: createWorldState(initialUpdate.world.characterID),
                });
                const character: Character = getDefinable(
                  Character,
                  initialUpdate.world.characterID,
                );
                character.selectCharacter();
                break;
              }
            }
          },
        });
        listenToSocketioEvent({
          event: "character-customize/create-character",
          onMessage: (data: unknown): void => {
            if (state.values.mainMenuState === null) {
              throw new Error("No main menu state.");
            }
            const {
              classID,
              clothesDyeSavefileItemInstance,
              figureID,
              hairDyeSavefileItemInstance,
              id,
              level,
              maskSavefileItemInstance,
              outfitSavefileItemInstance,
              skinColorID,
              tilemapID,
            } = data as {
              classID: string;
              clothesDyeSavefileItemInstance: SavefileItemInstance;
              figureID: string;
              hairDyeSavefileItemInstance: SavefileItemInstance;
              id: string;
              level: number;
              maskSavefileItemInstance: SavefileItemInstance;
              outfitSavefileItemInstance: SavefileItemInstance;
              skinColorID: string;
              tilemapID: string;
            };
            new ItemInstance({
              id: clothesDyeSavefileItemInstance.id,
              itemID: clothesDyeSavefileItemInstance.itemID,
            });
            new ItemInstance({
              id: hairDyeSavefileItemInstance.id,
              itemID: hairDyeSavefileItemInstance.itemID,
            });
            new ItemInstance({
              id: maskSavefileItemInstance.id,
              itemID: maskSavefileItemInstance.itemID,
            });
            new ItemInstance({
              id: outfitSavefileItemInstance.id,
              itemID: outfitSavefileItemInstance.itemID,
            });
            const characterID: string = new Character({
              classID,
              clothesDyeItemInstanceID: clothesDyeSavefileItemInstance.id,
              figureID,
              hairDyeItemInstanceID: hairDyeSavefileItemInstance.id,
              id,
              level,
              maskItemInstanceID: maskSavefileItemInstance.id,
              outfitItemInstanceID: outfitSavefileItemInstance.id,
              skinColorID,
              tilemapID,
            }).id;
            state.setValues({
              characterIDs: [...state.values.characterIDs, characterID],
            });
            state.values.mainMenuState.setValues({
              characterCustomizeState: null,
              characterSelectState: createCharacterSelectState(),
            });
          },
        });
        listenToSocketioEvent({
          event: "character-select/delete-character",
          onMessage: (data: unknown): void => {
            const characterID: string = data as string;
            const character: Character = getDefinable(Character, characterID);
            character.remove();
            state.setValues({
              characterIDs: state.values.characterIDs.filter(
                (loopedCharacterID: string): boolean =>
                  loopedCharacterID !== character.id,
              ),
            });
            getCharacterSelectState().setValues({
              characterIDToDelete: null,
              isDeleting: false,
            });
          },
        });
        listenToSocketioEvent({
          event: "character-select/select-character",
          onMessage: (data: unknown): void => {
            const characterID: string = data as string;
            state.setValues({
              mainMenuState: null,
              worldState: createWorldState(characterID),
            });
            const character: Character = getDefinable(Character, characterID);
            character.selectCharacter();
          },
        });
        listenToSocketioEvent({
          event: "character-select/sort-character-left",
          onMessage: (data: unknown): void => {
            const characterID: string = data as string;
            const characterIndex: number =
              state.values.characterIDs.indexOf(characterID);
            const targetIndex: number =
              characterIndex === 0
                ? getLastPlayableCharacterIndex()
                : characterIndex - 1;
            const targetCharacterID: string =
              state.values.characterIDs[targetIndex];
            const characterIDs: string[] = [...state.values.characterIDs];
            characterIDs[targetIndex] = characterID;
            characterIDs[characterIndex] = targetCharacterID;
            state.setValues({ characterIDs });
          },
        });
        listenToSocketioEvent({
          event: "character-select/sort-character-right",
          onMessage: (data: unknown): void => {
            const characterID: string = data as string;
            const characterIndex: number =
              state.values.characterIDs.indexOf(characterID);
            const targetIndex: number =
              characterIndex === getLastPlayableCharacterIndex()
                ? 0
                : characterIndex + 1;
            const targetCharacterID: string =
              state.values.characterIDs[targetIndex];
            const characterIDs: string[] = [...state.values.characterIDs];
            characterIDs[targetIndex] = characterID;
            characterIDs[characterIndex] = targetCharacterID;
            state.setValues({ characterIDs });
          },
        });
        listenToSocketioEvent({
          event: "world/exit-to-main-menu",
          onMessage: (): void => {
            state.setValues({
              mainMenuState: createMainMenuState(),
              worldState: null,
            });
            exitLevel();
          },
        });
        break;
      }
    }
  } else {
    throw new Error("Invalid message type");
  }
};
