import {
  AuthDownstreamWindowMessage,
  JoystickDownstreamWindowMessage,
  LimitFpsDownstreamWindowMessage,
  MainVolumeDownstreamWindowMessage,
  MusicVolumeDownstreamWindowMessage,
  SFXVolumeDownstreamWindowMessage,
  ScreenshotClipboardDownstreamWindowMessage,
  ScreenshotScaleDownstreamWindowMessage,
} from "retrommo-types";
import {
  clearMaxFPS,
  connectToSocketioServer,
  onError,
  setMainVolume,
  setMaxFPS,
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
  if (typeof message !== "object" || message === null) {
    return;
  }
  if ("event" in message === false) {
    return;
  }
  if (typeof message.event !== "string") {
    return;
  }
  if ("data" in message === false) {
    return;
  }
  const data: unknown = message.data;
  switch (message.event) {
    case "retrommo/auth": {
      if (typeof data !== "object" || data === null) {
        return;
      }
      if ("token" in data === false) {
        return;
      }
      if (typeof data.token !== "string") {
        return;
      }
      const authData: AuthDownstreamWindowMessage = { token: data.token };
      const url: string | null = state.values.serverURL;
      if (url === null) {
        throw new Error(
          "Attempted to connect to socket.io server with no server URL.",
        );
      }
      connectToSocketioServer({
        auth: { token: authData.token },
        url,
      });
      onError(handleError);
      listenForUpdates();
      break;
    }
    case "retrommo/joystick": {
      if (typeof data !== "object" || data === null) {
        return;
      }
      if ("isJoystickEnabled" in data === false) {
        return;
      }
      if (typeof data.isJoystickEnabled !== "boolean") {
        return;
      }
      const joystickData: JoystickDownstreamWindowMessage = {
        isJoystickEnabled: data.isJoystickEnabled,
      };
      state.setValues({ isJoystickEnabled: joystickData.isJoystickEnabled });
      break;
    }
    case "retrommo/limit-fps": {
      if (typeof data !== "object" || data === null) {
        return;
      }
      if ("limitFps" in data === false) {
        return;
      }
      if (typeof data.limitFps !== "boolean") {
        return;
      }
      const limitFpsData: LimitFpsDownstreamWindowMessage = {
        limitFps: data.limitFps,
      };
      if (limitFpsData.limitFps) {
        setMaxFPS(60);
      } else {
        clearMaxFPS();
      }
      break;
    }
    case "retrommo/main-volume": {
      if (typeof data !== "object" || data === null) {
        return;
      }
      if ("volume" in data === false) {
        return;
      }
      if (typeof data.volume !== "number") {
        return;
      }
      const mainVolumeData: MainVolumeDownstreamWindowMessage = {
        volume: data.volume,
      };
      setMainVolume({
        volume: mainVolumeData.volume,
      });
      break;
    }
    case "retrommo/music-volume": {
      if (typeof data !== "object" || data === null) {
        return;
      }
      if ("volume" in data === false) {
        return;
      }
      if (typeof data.volume !== "number") {
        return;
      }
      const musicVolumeData: MusicVolumeDownstreamWindowMessage = {
        volume: data.volume,
      };
      setVolumeChannelVolume({
        id: musicVolumeChannelID,
        volume: musicVolumeData.volume,
      });
      break;
    }
    case "retrommo/screenshot": {
      takeScreenshot();
      break;
    }
    case "retrommo/screenshot-clipboard": {
      if (typeof data !== "object" || data === null) {
        return;
      }
      if ("saveToClipboard" in data === false) {
        return;
      }
      if (typeof data.saveToClipboard !== "boolean") {
        return;
      }
      const screenshotClipboardData: ScreenshotClipboardDownstreamWindowMessage =
        { saveToClipboard: data.saveToClipboard };
      setScreenshotClipboard(screenshotClipboardData.saveToClipboard);
      break;
    }
    case "retrommo/screenshot-scale": {
      if (typeof data !== "object" || data === null) {
        return;
      }
      if ("scaleOutput" in data === false) {
        return;
      }
      if (typeof data.scaleOutput !== "boolean") {
        return;
      }
      const screenshotScaleData: ScreenshotScaleDownstreamWindowMessage = {
        scaleOutput: data.scaleOutput,
      };
      setScreenshotScale(screenshotScaleData.scaleOutput ? 3 : 1);
      break;
    }
    case "retrommo/sfx-volume": {
      if (typeof data !== "object" || data === null) {
        return;
      }
      if ("volume" in data === false) {
        return;
      }
      if (typeof data.volume !== "number") {
        return;
      }
      const sfxVolumeData: SFXVolumeDownstreamWindowMessage = {
        volume: data.volume,
      };
      setVolumeChannelVolume({
        id: sfxVolumeChannelID,
        volume: sfxVolumeData.volume,
      });
      break;
    }
  }
};
