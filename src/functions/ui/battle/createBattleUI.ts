import { Reachable } from "../../../classes/Reachable";
import { createImage } from "../components/createImage";
import { getBattleState } from "../../state/getBattleState";
import { getDefinable } from "definables";
import { getGameHeight, getGameWidth } from "pixel-pigeon";
import { state } from "../../../state";

export const createBattleUI = (): void => {
  const gameWidth: number = getGameWidth();
  const gameHeight: number = getGameHeight();
  createImage({
    condition: (): boolean => state.values.battleState !== null,
    height: gameHeight,
    imagePath: (): string =>
      getDefinable(Reachable, getBattleState().values.reachableID).landscape
        .imagePath,
    width: gameWidth,
    x: 0,
    y: 0,
  });
};
