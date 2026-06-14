import {
  AuthDownstreamWindowMessage,
  CheckoutRequest,
  ClientErrorDownstreamWindowMessage,
  ClientErrorRequest,
  CustomerPortalRequest,
  JoystickDownstreamWindowMessage,
  LimitFpsDownstreamWindowMessage,
  LogOutRequest,
  MainVolumeDownstreamWindowMessage,
  MessageDownstreamWindowMessage,
  MessageRequest,
  MusicVolumeDownstreamWindowMessage,
  SFXVolumeDownstreamWindowMessage,
  ScreenshotClipboardDownstreamWindowMessage,
  ScreenshotScaleDownstreamWindowMessage,
  UnlinkDiscordRequest,
} from "retrommo-types";
import {
  clearMaxFPS,
  connectToSocketioServer,
  emitToSocketioServer,
  getCurrentTime,
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
      const authData: AuthDownstreamWindowMessage =
        data as AuthDownstreamWindowMessage;
      const url: string | null = state.values.serverURL;
      if (url === null) {
        throw new Error(
          "Attempted to connect to socket.io server with no server URL.",
        );
      }
      connectToSocketioServer({
        auth: { token: authData.token },
        onConnect: (): void => {
          state.setValues({
            disconnectedAt: null,
          });
        },
        onDisconnect: (): void => {
          state.setValues({
            disconnectedAt: getCurrentTime(),
          });
        },
        url,
      });
      onError(handleError);
      listenForUpdates();
      break;
    }
    case "retrommo/checkout": {
      emitToSocketioServer<CheckoutRequest>({
        data: {},
        event: "checkout",
      });
      break;
    }
    case "retrommo/client-error": {
      const clientErrorData: ClientErrorDownstreamWindowMessage =
        data as ClientErrorDownstreamWindowMessage;
      emitToSocketioServer<ClientErrorRequest>({
        data: {
          message: clientErrorData.message,
          stack: clientErrorData.stack,
        },
        event: "client-error",
      });
      break;
    }
    case "retrommo/customer-portal": {
      emitToSocketioServer<CustomerPortalRequest>({
        data: {},
        event: "customer-portal",
      });
      break;
    }
    case "retrommo/joystick": {
      const joystickData: JoystickDownstreamWindowMessage =
        data as JoystickDownstreamWindowMessage;
      state.setValues({ isJoystickEnabled: joystickData.isJoystickEnabled });
      break;
    }
    case "retrommo/limit-fps": {
      const limitFpsData: LimitFpsDownstreamWindowMessage =
        data as LimitFpsDownstreamWindowMessage;
      if (limitFpsData.limitFps) {
        setMaxFPS(60);
      } else {
        clearMaxFPS();
      }
      break;
    }
    case "retrommo/log-out": {
      emitToSocketioServer<LogOutRequest>({
        data: {},
        event: "log-out",
      });
      break;
    }
    case "retrommo/main-volume": {
      const mainVolumeData: MainVolumeDownstreamWindowMessage =
        data as MainVolumeDownstreamWindowMessage;
      setMainVolume({
        volume: mainVolumeData.volume,
      });
      break;
    }
    case "retrommo/message": {
      const messageData: MessageDownstreamWindowMessage =
        data as MessageDownstreamWindowMessage;
      emitToSocketioServer<MessageRequest>({
        data: {
          channel: messageData.channel,
          contents: messageData.contents,
        },
        event: "message",
      });
      break;
    }
    case "retrommo/music-volume": {
      const musicVolumeData: MusicVolumeDownstreamWindowMessage =
        data as MusicVolumeDownstreamWindowMessage;
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
      const screenshotClipboardData: ScreenshotClipboardDownstreamWindowMessage =
        data as ScreenshotClipboardDownstreamWindowMessage;
      setScreenshotClipboard(screenshotClipboardData.saveToClipboard);
      break;
    }
    case "retrommo/screenshot-scale": {
      const screenshotScaleData: ScreenshotScaleDownstreamWindowMessage =
        data as ScreenshotScaleDownstreamWindowMessage;
      setScreenshotScale(screenshotScaleData.scaleOutput ? 3 : 1);
      break;
    }
    case "retrommo/sfx-volume": {
      const sfxVolumeData: SFXVolumeDownstreamWindowMessage =
        data as SFXVolumeDownstreamWindowMessage;
      setVolumeChannelVolume({
        id: sfxVolumeChannelID,
        volume: sfxVolumeData.volume,
      });
      break;
    }
    case "retrommo/unlink-discord": {
      emitToSocketioServer<UnlinkDiscordRequest>({
        data: {},
        event: "unlink-discord",
      });
      break;
    }
  }
};
