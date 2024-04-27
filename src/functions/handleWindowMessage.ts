import { InitialUpdate, MainState } from "retrommo-types";
import { connectToSocketioServer, listenToSocketioEvent } from "pixel-pigeon";
import { createBattleState } from "./state/createBattleState";
import { createMainMenuState } from "./state/main-menu/createMainMenuState";
import { createWorldState } from "./state/createWorldState";
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
          eventName: "initial-update",
          onMessage: (data: unknown): void => {
            const initialUpdate: InitialUpdate = data as InitialUpdate;
            state.setValues({
              savefile: initialUpdate.savefile,
            });
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
        break;
      }
    }
  } else {
    throw new Error("Invalid message type");
  }
};
