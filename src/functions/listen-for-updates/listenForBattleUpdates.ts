import {
  BattleCancelSubmittedMoveUpdate,
  BattleSubmitAbilityUpdate,
} from "retrommo-types";
import { BattleStateSchema } from "../../state";
import { Battler } from "../../classes/Battler";
import { State, listenToSocketioEvent } from "pixel-pigeon";
import { getBattleState } from "../state/getBattleState";
import { getDefinable } from "definables";
import { loadBattleSubmittedAbilityUpdate } from "../load-updates/loadBattleSubmittedAbilityUpdate";

export const listenForBattleUpdates = (): void => {
  listenToSocketioEvent<BattleCancelSubmittedMoveUpdate>({
    event: "battle/cancel-submitted-move",
    onMessage: (update: BattleCancelSubmittedMoveUpdate): void => {
      const battler: Battler = getDefinable(Battler, update.battlerID);
      battler.battleCharacter.submittedMove = null;
    },
  });
  listenToSocketioEvent<BattleSubmitAbilityUpdate>({
    event: "battle/submit-ability",
    onMessage: (update: BattleSubmitAbilityUpdate): void => {
      const battleState: State<BattleStateSchema> = getBattleState();
      loadBattleSubmittedAbilityUpdate(update.submittedAbility);
      if (
        update.submittedAbility.casterBattlerID === battleState.values.battlerID
      ) {
        battleState.setValues({
          queuedAction: null,
        });
      }
    },
  });
};
