import { HUDElementReferences, mergeHUDElementReferences } from "pixel-pigeon";
import { WorldMenu } from "../classes/WorldMenu";
import { createPanel } from "../functions/ui/components/createPanel";

export interface PianoWorldMenuOpenOptions {}
export const pianoWorldMenu: WorldMenu<PianoWorldMenuOpenOptions> =
  new WorldMenu<PianoWorldMenuOpenOptions>({
    create: (): HUDElementReferences => {
      const panelHUDElementReferences: HUDElementReferences = createPanel({
        height: 72,
        imagePath: "panels/piano",
        width: 296,
        x: 4,
        y: 132,
      });
      return mergeHUDElementReferences([panelHUDElementReferences]);
    },
    preventsWalking: true,
  });
