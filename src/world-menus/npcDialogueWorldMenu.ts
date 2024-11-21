import { Color } from "retrommo-types";
import {
  HUDElementReferences,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { NPC } from "../classes/NPC";
import { WorldMenu } from "../classes/WorldMenu";
import { createClickableImage } from "../functions/ui/components/createClickableImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { getDefinable } from "definables";

export interface NPCDialogueWorldMenuOpenOptions {
  readonly npcID: string;
}
export const npcDialogueWorldMenu: WorldMenu<NPCDialogueWorldMenuOpenOptions> =
  new WorldMenu<NPCDialogueWorldMenuOpenOptions>({
    create: (
      options: NPCDialogueWorldMenuOpenOptions,
    ): HUDElementReferences => {
      const labelIDs: string[] = [];
      const hudElementReferences: HUDElementReferences[] = [];
      const npc: NPC = getDefinable(NPC, options.npcID);
      // Background panel
      hudElementReferences.push(
        createPanel({
          height: 62,
          imagePath: "panels/basic",
          width: 256,
          x: 24,
          y: 136,
        }),
      );
      // Close button
      hudElementReferences.push(
        createClickableImage({
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            npcDialogueWorldMenu.close();
          },
          width: 10,
          x: 263,
          y: 143,
        }),
      );
      // Name
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            x: 34,
            y: 146,
          },
          horizontalAlignment: "left",
          maxLines: 1,
          maxWidth: 304,
          size: 1,
          text: {
            value: npc.name,
          },
        }),
      );
      // Dialogue
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            x: 34,
            y: 159,
          },
          horizontalAlignment: "left",
          maxLines: 3,
          maxWidth: 236,
          size: 1,
          text: {
            value: npc.dialogue,
          },
        }),
      );
      return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
    },
    preventsWalking: true,
  });
