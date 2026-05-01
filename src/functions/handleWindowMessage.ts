import {
  connectToSocketioServer,
  onError,
  setMainVolume,
  setScreenshotClipboard,
  setScreenshotScale,
  setVolumeChannelVolume,
  takeScreenshot,
} from "pixel-pigeon";
import { handleError } from "./handleError";
import { listenForUpdates } from "./listen-for-updates/listenForUpdates";
import { musicVolumeChannelID, sfxVolumeChannelID } from "../volumeChannels";
import { state } from "../state";

export const handleWindowMessage = (message: unknown): void => {
  if (
    typeof message !== "object" ||
    message === null ||
    !("type" in message) ||
    typeof message.type !== "string"
  ) {
    return;
  }
  switch (message.type) {
    case "auth": {
      if (!("value" in message)) {
        return;
      }
      if (typeof message.value !== "string") {
        return;
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
      onError(handleError);
      listenForUpdates();
      break;
    }
    case "main-volume": {
      if (!("value" in message)) {
        return;
      }
      if (typeof message.value !== "number") {
        return;
      }
      setMainVolume({
        volume: message.value,
      });
      break;
    }
    case "music-volume": {
      if (!("value" in message)) {
        return;
      }
      if (typeof message.value !== "number") {
        return;
      }
      setVolumeChannelVolume({
        id: musicVolumeChannelID,
        volume: message.value,
      });
      break;
    }
    case "screenshot": {
      takeScreenshot();
      break;
    }
    case "screenshot-clipboard": {
      if (!("value" in message)) {
        return;
      }
      if (typeof message.value !== "boolean") {
        return;
      }
      setScreenshotClipboard(message.value);
      break;
    }
    case "screenshot-scale": {
      if (!("value" in message)) {
        return;
      }
      if (typeof message.value !== "boolean") {
        return;
      }
      setScreenshotScale(message.value ? 3 : 1);
      break;
    }
    case "sfx-volume": {
      if (!("value" in message)) {
        return;
      }
      if (typeof message.value !== "number") {
        return;
      }
      setVolumeChannelVolume({
        id: sfxVolumeChannelID,
        volume: message.value,
      });
      break;
    }
  }
};
