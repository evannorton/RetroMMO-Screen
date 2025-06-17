import { BattleStateSchema } from "../../state";
import { Battler } from "../../classes/Battler";
import { State } from "pixel-pigeon";
import { getBattleState } from "../state/getBattleState";
import { getDefinable } from "definables";

export const isBattleMultiplayer = (): boolean => {
  const battleState: State<BattleStateSchema> = getBattleState();
  return (
    [
      ...battleState.values.friendlyBattlerIDs,
      ...battleState.values.enemyBattlerIDs,
    ].filter((battlerID: string): boolean =>
      getDefinable(Battler, battlerID).hasBattleCharacter(),
    ).length > 1
  );
};
