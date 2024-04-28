import { Character } from "../classes/Character";
import { InitialUpdate, MainState } from "retrommo-types";
import { ItemInstance } from "../classes/ItemInstance";
import { connectToSocketioServer, listenToSocketioEvent } from "pixel-pigeon";
import { createBattleState } from "./state/createBattleState";
import { createMainMenuState } from "./state/main-menu/createMainMenuState";
import { createWorldState } from "./state/createWorldState";
import { getDefinable, getDefinables } from "../definables";
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
              characterIDs: [],
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
              case MainState.World:
                state.setValues({
                  worldState: createWorldState(),
                });
                break;
            }
          },
        });
        listenToSocketioEvent({
          event: "character-select/delete-character",
          onMessage: (data: unknown): void => {
            const characterIndex: number = data as number;
            const character: Character = getDefinable(
              Character,
              state.values.characterIDs[characterIndex],
            );
            character.remove();
            state.setValues({
              characterIDs: state.values.characterIDs.filter(
                (characterID: string): boolean => characterID !== character.id,
              ),
            });
          },
        });
        listenToSocketioEvent({
          event: "character-select/select-character",
          onMessage: (data: unknown): void => {
            const characterIndex: number = data as number;
            state.setValues({
              mainMenuState: null,
            });
            console.log(`Selected character ${characterIndex}`);
          },
        });
        listenToSocketioEvent({
          event: "character-select/sort-character-left",
          onMessage: (data: unknown): void => {
            const characterIndex: number = data as number;
            const targetIndex: number =
              characterIndex === 0
                ? state.values.characterIDs.length - 1
                : characterIndex - 1;
            const characterID: string =
              state.values.characterIDs[characterIndex];
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
            const characterIndex: number = data as number;
            const targetIndex: number =
              characterIndex === state.values.characterIDs.length - 1
                ? 0
                : characterIndex + 1;
            const characterID: string =
              state.values.characterIDs[characterIndex];
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
          },
        });
        break;
      }
    }
  } else {
    throw new Error("Invalid message type");
  }
};
