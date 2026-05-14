import { Constants } from "retrommo-types";
import { State, getCurrentTime } from "pixel-pigeon";
import { WorldStateSchema } from "../state";
import { battleIntroBlackDurationPercentage } from "../constants";
import { getConstants } from "./getConstants";
import { getWorldState } from "./state/getWorldState";

export const getWorldDownsampleScale = (): number => {
  const constants: Constants = getConstants();
  const currentTime: number = getCurrentTime();
  const worldState: State<WorldStateSchema> = getWorldState();
  const blackDuration: number =
    constants["battle-intro-duration"] * battleIntroBlackDurationPercentage;
  const animatedDuration: number =
    constants["battle-intro-duration"] - blackDuration;
  if (worldState.values.queuedBattle !== null) {
    if (
      currentTime >=
      worldState.values.queuedBattle.queuedAt + animatedDuration * (3 / 4)
    ) {
      return 16;
    }
    if (
      currentTime >=
      worldState.values.queuedBattle.queuedAt + animatedDuration / 2
    ) {
      return 8;
    }
    if (
      currentTime >=
      worldState.values.queuedBattle.queuedAt + animatedDuration / 4
    ) {
      return 4;
    }
    return 2;
  }
  return 1;
};
