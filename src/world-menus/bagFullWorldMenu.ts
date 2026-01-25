import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createLabel,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { getDefinable } from "definables";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";

export interface BagFullWorldMenuOpenOptions {}
export interface BagFullWorldMenuStateSchema {}
export const bagFullWorldMenu: WorldMenu<
  BagFullWorldMenuOpenOptions,
  BagFullWorldMenuStateSchema
> = new WorldMenu<BagFullWorldMenuOpenOptions, BagFullWorldMenuStateSchema>({
  create: (): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const worldState: State<WorldStateSchema> = getWorldState();
    const worldCharacter: WorldCharacter = getDefinable(
      WorldCharacter,
      worldState.values.worldCharacterID,
    );
    const isPartied: boolean =
      worldCharacter.player.character.party.playerIDs.length > 1;
    const shouldShowMenu = (): boolean => isWorldCombatInProgress() === false;
    const panelHeight: number = isPartied ? 48 : 37;
    hudElementReferences.push(
      createPanel({
        condition: shouldShowMenu,
        height: panelHeight,
        imagePath: "panels/basic",
        width: 208,
        x: 48,
        y: 136,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: shouldShowMenu,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          bagFullWorldMenu.close();
        },
        width: 10,
        x: 239,
        y: 143,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: shouldShowMenu,
          x: 152,
          y: 151,
        },
        horizontalAlignment: "center",
        maxLines: 2,
        maxWidth: 152,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: isPartied
            ? "A party member's inventory is full."
            : "Your inventory is full.",
        }),
      }),
    );
    return mergeHUDElementReferences([{ labelIDs }, ...hudElementReferences]);
  },
  initialStateValues: {},
  preventsWalking: false,
});
