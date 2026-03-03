import { Color } from "retrommo-types";
import { CreateLabelOptionsText, State, createLabel } from "pixel-pigeon";
import {
  WorldStateCombatRoundEventInstance,
  WorldStateSchema,
  state,
} from "../../../state";
import { createPanel } from "../components/createPanel";
import { getCombatEventText } from "../../combat/getCombatEventText";
import { getWorldState } from "../../state/getWorldState";
import { isWorldCombatInProgress } from "../../isWorldCombatInProgress";

export const createWorldCombatUI = (): void => {
  const condition = (): boolean => {
    if (state.values.worldState === null) {
      return false;
    }
    return isWorldCombatInProgress();
  };
  createPanel({
    condition,
    height: 60,
    imagePath: "panels/basic",
    width: 244,
    x: 30,
    y: 136,
  });
  for (let i: number = 0; i < 2; i++) {
    createLabel({
      color: Color.White,
      coordinates: {
        condition: (): boolean =>
          condition() && state.values.serverTime !== null,
        x: 38,
        y: 144 + i * 22,
      },
      horizontalAlignment: "left",
      maxLines: 2,
      maxWidth: 229,
      text: (): CreateLabelOptionsText => {
        if (state.values.serverTime === null) {
          throw new Error("serverTime is null");
        }
        const worldState: State<WorldStateSchema> = getWorldState();
        if (worldState.values.combatRound === null) {
          throw new Error("round is null");
        }
        const elapsedServerTime: number =
          state.values.serverTime - worldState.values.combatRound.serverTime;
        const combatEventInstance:
          | WorldStateCombatRoundEventInstance
          | undefined = worldState.values.combatRound.eventInstances.find(
          (
            roundWorldStateCombatRoundEventInstance: WorldStateCombatRoundEventInstance,
          ): boolean =>
            roundWorldStateCombatRoundEventInstance.event.channel === i &&
            elapsedServerTime >=
              roundWorldStateCombatRoundEventInstance.event.startedAt &&
            elapsedServerTime <
              roundWorldStateCombatRoundEventInstance.event.startedAt +
                roundWorldStateCombatRoundEventInstance.event.duration,
        );
        if (typeof combatEventInstance === "undefined") {
          return { value: "" };
        }
        return getCombatEventText(combatEventInstance.event);
      },
    });
  }
};
