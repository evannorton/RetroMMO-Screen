import { WorldExitToMainMenuRequest } from "retrommo-types";
import { createImage } from "../components/createImage";
import { createPanel } from "../components/createPanel";
import { emitToSocketioServer } from "pixel-pigeon";
import { state } from "../../../state";

export const createWorldLogoutUI = (): void => {
  const condition = (): boolean => state.values.worldState !== null;
  createPanel({
    condition,
    height: 24,
    imagePath: "panels/basic",
    width: 48,
    x: 256,
    y: 0,
  });
  createImage({
    condition,
    height: 14,
    imagePath: "arrows/logout",
    onClick: (): void => {
      emitToSocketioServer<WorldExitToMainMenuRequest>({
        data: {},
        event: "world/exit-to-main-menu",
      });
    },
    width: 28,
    x: 266,
    y: 5,
  });
};
