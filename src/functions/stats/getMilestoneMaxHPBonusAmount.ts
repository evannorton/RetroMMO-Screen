import { MilestoneChoice } from "../../classes/MilestoneChoice";
import { State } from "pixel-pigeon";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { WorldStateSchema } from "../../state";
import { getDefinable } from "definables";
import { getUnlockedMilestoneChoices } from "./getUnlockedMilestoneChoices";
import { getWorldState } from "../state/getWorldState";

export const getMilestoneMaxHPBonusAmount = (): number => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  const milestoneMaxHPIncreaseCount: number =
    getUnlockedMilestoneChoices().filter(
      (milestoneChoice: MilestoneChoice): boolean => milestoneChoice.maxHP,
    ).length;
  const milestoneMaxHPIncreasePerLevel: number = 1;
  return (
    milestoneMaxHPIncreasePerLevel *
    worldCharacter.player.character.level *
    milestoneMaxHPIncreaseCount
  );
};
