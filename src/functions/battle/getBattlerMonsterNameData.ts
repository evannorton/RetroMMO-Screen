import { Battler } from "../../classes/Battler";
import { BattlerType, MonsterNameData } from "retrommo-types";
import { getDefinable } from "definables";

export const getBattlerMonsterNameData = (
  battlerID: string,
  teamBattlerIDs: readonly string[],
): MonsterNameData => {
  const battler: Battler = getDefinable(Battler, battlerID);
  const sameMonstersOnTeam: Battler[] = teamBattlerIDs
    .map(
      (teamBattlerID: string): Battler => getDefinable(Battler, teamBattlerID),
    )
    .filter(
      (teamBattler: Battler): boolean =>
        teamBattler.type === BattlerType.Monster &&
        teamBattler.monsterID === battler.monsterID,
    );
  const count: number = sameMonstersOnTeam.length;
  const index: number = sameMonstersOnTeam.findIndex(
    (teamBattler: Battler): boolean => teamBattler.id === battlerID,
  );
  return {
    count,
    index,
    monsterID: battler.monsterID,
  };
};
