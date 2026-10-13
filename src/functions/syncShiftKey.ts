import { canWalk } from "./canWalk";
import { emitToSocketioServer, getJoystickForce } from "pixel-pigeon";
import {
  joystickTurnMaximumForce,
  joystickTurnMinimumForce,
} from "../constants";

type JoystickDirectionKey =
  | "JoystickDown"
  | "JoystickLeft"
  | "JoystickRight"
  | "JoystickUp";
let heldJoystickDirectionKey: JoystickDirectionKey | null = null;
let isJoystickShiftHeld: boolean = false;
let isKeyboardShiftHeld: boolean = false;
let isShiftKeyDownSent: boolean = false;
let sentJoystickDirectionKey: JoystickDirectionKey | null = null;
const emitJoystickDirectionKeyDown = (key: JoystickDirectionKey): void => {
  emitToSocketioServer({
    data: {
      key,
      numlock: false,
    },
    event: "keydown",
  });
};
const emitJoystickDirectionKeyUp = (key: JoystickDirectionKey): void => {
  emitToSocketioServer({
    data: key as unknown as object,
    event: "keyup",
  });
};
const emitShiftKeyDown = (): void => {
  if (isShiftKeyDownSent === false) {
    emitToSocketioServer({
      data: {
        key: "ShiftLeft",
        numlock: false,
      },
      event: "keydown",
    });
    isShiftKeyDownSent = true;
  }
};
const emitShiftKeyUp = (): void => {
  if (isShiftKeyDownSent) {
    emitToSocketioServer({
      data: "ShiftLeft" as unknown as object,
      event: "keyup",
    });
    isShiftKeyDownSent = false;
  }
};
const releaseSentJoystickDirectionKey = (): void => {
  if (sentJoystickDirectionKey !== null) {
    emitJoystickDirectionKeyUp(sentJoystickDirectionKey);
    sentJoystickDirectionKey = null;
  }
};

export const holdJoystickDirection = (key: JoystickDirectionKey): void => {
  if (sentJoystickDirectionKey !== null && sentJoystickDirectionKey !== key) {
    emitJoystickDirectionKeyUp(sentJoystickDirectionKey);
    sentJoystickDirectionKey = null;
  }
  heldJoystickDirectionKey = key;
};
export const pressKeyboardShift = (): void => {
  isKeyboardShiftHeld = true;
  if (canWalk()) {
    emitShiftKeyDown();
  }
};
export const releaseJoystickDirection = (key: JoystickDirectionKey): void => {
  if (heldJoystickDirectionKey === key) {
    heldJoystickDirectionKey = null;
  }
  if (sentJoystickDirectionKey === key) {
    emitJoystickDirectionKeyUp(key);
    sentJoystickDirectionKey = null;
  }
};
export const releaseKeyboardShift = (): void => {
  isKeyboardShiftHeld = false;
  if (isJoystickShiftHeld === false) {
    emitShiftKeyUp();
  }
};
export const updateJoystickShift = (): void => {
  const joystickForce: number = getJoystickForce();
  const isJoystickPastMinimumForce: boolean =
    joystickForce > joystickTurnMinimumForce;
  if (
    isJoystickPastMinimumForce &&
    heldJoystickDirectionKey !== null &&
    sentJoystickDirectionKey !== heldJoystickDirectionKey &&
    canWalk()
  ) {
    releaseSentJoystickDirectionKey();
    emitJoystickDirectionKeyDown(heldJoystickDirectionKey);
    sentJoystickDirectionKey = heldJoystickDirectionKey;
  }
  if (
    isJoystickPastMinimumForce === false ||
    heldJoystickDirectionKey === null
  ) {
    releaseSentJoystickDirectionKey();
  }
  const isJoystickInTurnBand: boolean =
    isJoystickPastMinimumForce && joystickForce <= joystickTurnMaximumForce;
  if (isJoystickInTurnBand) {
    isJoystickShiftHeld = true;
    if (canWalk()) {
      emitShiftKeyDown();
    }
  }
  if (isJoystickInTurnBand === false) {
    isJoystickShiftHeld = false;
    if (isKeyboardShiftHeld === false) {
      emitShiftKeyUp();
    }
  }
};
