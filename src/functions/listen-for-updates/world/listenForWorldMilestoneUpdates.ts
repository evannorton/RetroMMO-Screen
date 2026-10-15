import { State, listenToSocketioEvent } from "pixel-pigeon";
import { WorldCharacter } from "../../../classes/WorldCharacter";
import { WorldStateSchema } from "../../../state";
import { WorldUnlockMilestoneChoiceUpdate } from "retrommo-types";
import { getDefinable } from "definables";
import { getWorldState } from "../../state/getWorldState";

export const listenForWorldMilestoneUpdates = (): void => {
  listenToSocketioEvent<WorldUnlockMilestoneChoiceUpdate>({
    event: "world/unlock-milestone-choice",
    onMessage: (update: WorldUnlockMilestoneChoiceUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      worldCharacter.player.character.milestoneChoiceIDs[update.level] =
        update.milestoneChoiceID;
      worldCharacter.resources = {
        hp: update.resources.hp,
        maxHP: update.resources.maxHP,
        maxMP: update.resources.maxMP ?? null,
        mp: update.resources.mp ?? null,
      };
    },
  });
};
