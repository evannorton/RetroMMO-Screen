import { State } from "pixel-pigeon";
import { WorldStateCombatRound, WorldStateSchema, state } from "../state";
import { getWorldState } from "./state/getWorldState";

export const isWorldCombatInProgress = (): boolean => {
  const worldState: State<WorldStateSchema> = getWorldState();
  if (
    worldState.values.combatRound !== null &&
    state.values.serverTime !== null
  ) {
    const combatRound: WorldStateCombatRound = worldState.values.combatRound;
    if (
      state.values.serverTime <
      combatRound.serverTime + combatRound.duration
    ) {
      return true;
    }
  }
  return false;
};
