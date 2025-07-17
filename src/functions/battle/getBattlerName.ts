import { Monster } from "../../classes/Monster";
import { MonsterNameData } from "retrommo-types/lib/MonsterNameData";
import { getDefinable } from "definables";

export interface GetBattlerNameOptions {
  readonly monsterName?: MonsterNameData;
  readonly username?: string;
}
export const getBattlerName = (options: GetBattlerNameOptions): string => {
  if (typeof options.username !== "undefined") {
    return options.username;
  }
  if (typeof options.monsterName !== "undefined") {
    const monster: Monster = getDefinable(
      Monster,
      options.monsterName.monsterID,
    );
    if (options.monsterName.count === 1) {
      return monster.name;
    }
    return `${monster.name}-${options.monsterName.index + 1}`;
  }
  throw new Error("Either monsterName or username must be provided.");
};
