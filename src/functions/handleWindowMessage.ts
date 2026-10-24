import {
  AuthDownstreamWindowMessage,
  BindGamepadKeybindDownstreamWindowMessage,
  BindKeyboardKeybindDownstreamWindowMessage,
  BindMouseKeybindDownstreamWindowMessage,
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
  ReportIssueDownstreamWindowMessage,
  ReportIssueRequest,
  ResetKeybindsDownstreamWindowMessage,
  SFXVolumeDownstreamWindowMessage,
  ScreenshotClipboardDownstreamWindowMessage,
  ScreenshotScaleDownstreamWindowMessage,
  SubscribeToEmailsDownstreamWindowMessage,
  SubscribeToEmailsRequest,
  UnlinkDiscordRequest,
  VideoRecordingScaleDownstreamWindowMessage,
} from "retrommo-types";
import {
  NumLock,
  bindInputCollectionGamepadButton,
  bindInputCollectionKeyboardButton,
  bindInputCollectionMouseButton,
  clearInputCollection,
  clearMaxFPS,
  connectToSocketioServer,
  emitToSocketioServer,
  getCurrentTime,
  onError,
  resetInputCollection,
  setMainVolume,
  setMaxFPS,
  setScreenshotClipboard,
  setScreenshotScale,
  setVideoRecordingScale,
  setVolumeChannelVolume,
  startVideoRecording,
  stopVideoRecording,
  takeScreenshot,
} from "pixel-pigeon";
import { getStarwatchLevel } from "./starwatch/getStarwatchLevel";
import { handleError } from "./handleError";
import { listenForUpdates } from "./listen-for-updates/listenForUpdates";
import { musicVolumeChannelID, sfxVolumeChannelID } from "../volumeChannels";
import { state } from "../state";
import { submitChatEvent, submitIssueReport } from "starwatch-sdk";

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
    case "retrommo/bind-gamepad-keybind": {
      const bindGamepadKeybindData: BindGamepadKeybindDownstreamWindowMessage =
        data as BindGamepadKeybindDownstreamWindowMessage;
      clearInputCollection({
        inputCollectionID: bindGamepadKeybindData.inputCollectionID,
      });
      bindInputCollectionGamepadButton({
        inputCollectionID: bindGamepadKeybindData.inputCollectionID,
        value: bindGamepadKeybindData.value,
      });
      break;
    }
    case "retrommo/bind-keyboard-keybind": {
      const bindKeyboardKeybindData: BindKeyboardKeybindDownstreamWindowMessage =
        data as BindKeyboardKeybindDownstreamWindowMessage;
      let numLock: NumLock | null = null;
      if (bindKeyboardKeybindData.numLock === "default") {
        numLock = NumLock.Default;
      } else if (bindKeyboardKeybindData.numLock === "with") {
        numLock = NumLock.With;
      } else if (bindKeyboardKeybindData.numLock === "without") {
        numLock = NumLock.Without;
      }
      if (numLock === null) {
        throw new Error(
          `Unexpected num lock "${bindKeyboardKeybindData.numLock}".`,
        );
      }
      clearInputCollection({
        inputCollectionID: bindKeyboardKeybindData.inputCollectionID,
      });
      bindInputCollectionKeyboardButton({
        inputCollectionID: bindKeyboardKeybindData.inputCollectionID,
        numLock,
        value: bindKeyboardKeybindData.value,
      });
      break;
    }
    case "retrommo/bind-mouse-keybind": {
      const bindMouseKeybindData: BindMouseKeybindDownstreamWindowMessage =
        data as BindMouseKeybindDownstreamWindowMessage;
      clearInputCollection({
        inputCollectionID: bindMouseKeybindData.inputCollectionID,
      });
      bindInputCollectionMouseButton({
        inputCollectionID: bindMouseKeybindData.inputCollectionID,
        value: bindMouseKeybindData.value,
      });
      break;
    }
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
    case "retrommo/reset-keybinds": {
      const resetKeybindsData: ResetKeybindsDownstreamWindowMessage =
        data as ResetKeybindsDownstreamWindowMessage;
      resetInputCollection({
        inputCollectionID: resetKeybindsData.inputCollectionID,
      });
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
      if (state.values.isStarwatchInitialized) {
        if (state.values.starwatchUserID === null) {
          throw new Error("StarWatch user ID is null");
        }
        submitChatEvent({
          level: getStarwatchLevel(),
          message: messageData.contents,
          tag: `${messageData.channel}:${
            state.values.worldState !== null
              ? "world"
              : state.values.battleState !== null
                ? "battle"
                : "main-menu"
          }`,
          userID: state.values.starwatchUserID,
        });
      }
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
    case "retrommo/report-issue": {
      const reportIssueData: ReportIssueDownstreamWindowMessage =
        data as ReportIssueDownstreamWindowMessage;
      emitToSocketioServer<ReportIssueRequest>({
        data: {
          description: reportIssueData.description,
          subject: reportIssueData.subject,
        },
        event: "report-issue",
      });
      if (state.values.isStarwatchInitialized) {
        if (state.values.starwatchUserID === null) {
          throw new Error("StarWatch user ID is null");
        }
        submitIssueReport({
          description: reportIssueData.description,
          subject: reportIssueData.subject,
          userID: state.values.starwatchUserID,
        }).catch(handleError);
      }
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
    case "retrommo/start-recording": {
      startVideoRecording({});
      break;
    }
    case "retrommo/stop-recording": {
      stopVideoRecording();
      break;
    }
    case "retrommo/subscribe-to-emails": {
      const subscribeToEmailsData: SubscribeToEmailsDownstreamWindowMessage =
        data as SubscribeToEmailsDownstreamWindowMessage;
      emitToSocketioServer<SubscribeToEmailsRequest>({
        data: {
          isSubscribedToEmails: subscribeToEmailsData.isSubscribedToEmails,
        },
        event: "subscribe-to-emails",
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
    case "retrommo/video-recording-scale": {
      const videoRecordingScaleData: VideoRecordingScaleDownstreamWindowMessage =
        data as VideoRecordingScaleDownstreamWindowMessage;
      setVideoRecordingScale(videoRecordingScaleData.scaleOutput ? 3 : 1);
      break;
    }
  }
};
