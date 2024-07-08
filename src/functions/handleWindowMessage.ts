import {
  connectToSocketioServer,
  setMainVolume,
  setVolumeChannelVolume,
} from "pixel-pigeon";
import { listenForUpdates } from "./updates/listenForUpdates";
import { musicVolumeChannelID, sfxVolumeChannelID } from "../volumeChannels";
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
        listenForUpdates();
        break;
      }
      case "main-volume": {
        if (typeof message.value !== "number") {
          throw new Error("Invalid main volume message value.");
        }
        setMainVolume({
          volume: message.value,
        });
        break;
      }
      case "music-volume": {
        if (typeof message.value !== "number") {
          throw new Error("Invalid music volume message value.");
        }
        setVolumeChannelVolume({
          id: musicVolumeChannelID,
          volume: message.value,
        });
        break;
      }
      case "sfx-volume": {
        if (typeof message.value !== "number") {
          throw new Error("Invalid sfx volume message value.");
        }
        setVolumeChannelVolume({
          id: sfxVolumeChannelID,
          volume: message.value,
        });
        break;
      }
    }
  } else {
    throw new Error("Invalid message type");
  }
};
