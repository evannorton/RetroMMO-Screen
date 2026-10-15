import { ClassMilestone } from "../../classes/Class";
import { MilestoneChoice } from "../../classes/MilestoneChoice";
import { State } from "pixel-pigeon";
import { WorldCharacter } from "../../classes/WorldCharacter";
import { WorldStateSchema } from "../../state";
import { definableExists, getDefinable } from "definables";
import { getWorldState } from "../state/getWorldState";

export const getUnlockedMilestoneChoices = (): readonly MilestoneChoice[] => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  const unlockedMilestoneChoices: MilestoneChoice[] = [];
  Object.entries(worldCharacter.player.character.milestoneChoiceIDs).forEach(
    ([milestoneLevelKey, milestoneChoiceID]: [string, string]): void => {
      const milestoneLevel: number = Number(milestoneLevelKey);
      if (
        Number.isInteger(milestoneLevel) &&
        milestoneLevel <= worldCharacter.player.character.level &&
        definableExists(MilestoneChoice, milestoneChoiceID)
      ) {
        const classMilestone: ClassMilestone | undefined =
          worldCharacter.player.character.class.milestones.find(
            (milestone: ClassMilestone): boolean =>
              milestone.level === milestoneLevel,
          );
        if (
          typeof classMilestone !== "undefined" &&
          classMilestone.choiceIDs.includes(milestoneChoiceID)
        ) {
          unlockedMilestoneChoices.push(
            getDefinable(MilestoneChoice, milestoneChoiceID),
          );
        }
      }
    },
  );
  return unlockedMilestoneChoices;
};
