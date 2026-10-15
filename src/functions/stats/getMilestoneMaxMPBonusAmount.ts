import { MilestoneChoice } from "../../classes/MilestoneChoice";
import { State } from "pixel-pigeon";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { WorldStateSchema } from "../../state";
import { getDefinable } from "definables";
import { getUnlockedMilestoneChoices } from "./getUnlockedMilestoneChoices";
import { getWorldState } from "../state/getWorldState";

export const getMilestoneMaxMPBonusAmount = (): number => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  const milestoneMaxMPIncreaseCount: number =
    getUnlockedMilestoneChoices().filter(
      (milestoneChoice: MilestoneChoice): boolean => milestoneChoice.maxMP,
    ).length;
  const milestoneMaxMPIncreasePerLevel: number = 1;
  return (
    milestoneMaxMPIncreasePerLevel *
    worldCharacter.player.character.level *
    milestoneMaxMPIncreaseCount
  );
};
