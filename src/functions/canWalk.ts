import { State } from "pixel-pigeon";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema, state } from "../state";
import { getDefinable, getDefinables } from "definables";
import { getWorldState } from "./state/getWorldState";

export const canWalk = (): boolean => {
  if (state.values.worldState === null) {
    return false;
  }
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  const partyLeaderWorldCharacterID: string | undefined =
    worldCharacter.party.worldCharacterIDs[0];
  if (typeof partyLeaderWorldCharacterID === "undefined") {
    throw new Error("No party leader.");
  }
  if (partyLeaderWorldCharacterID !== worldCharacter.id) {
    return false;
  }
  for (const worldMenu of getDefinables(WorldMenu).values()) {
    if (worldMenu.preventsWalking && worldMenu.isOpen()) {
      return false;
    }
  }
  return true;
};
