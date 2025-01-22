import {
  HUDElementReferences,
  State,
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

export interface InventoryWorldMenuOpenOptions {}
export interface InventoryWorldMenuStateSchema {}
export const inventoryWorldMenu: WorldMenu<
  InventoryWorldMenuOpenOptions,
  InventoryWorldMenuStateSchema
> = new WorldMenu<InventoryWorldMenuOpenOptions, InventoryWorldMenuStateSchema>(
  {
    create: (): HUDElementReferences => {
      const hudElementReferences: HUDElementReferences[] = [];
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      console.log(worldCharacter);
      // Background panel
      hudElementReferences.push(
        createPanel({
          condition: (): boolean => isWorldCombatInProgress() === false,
          height: 184,
          imagePath: "panels/basic",
          width: 128,
          x: 176,
          y: 24,
        }),
      );
      // X button
      hudElementReferences.push(
        createImage({
          condition: (): boolean => isWorldCombatInProgress() === false,
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            inventoryWorldMenu.close();
          },
          width: 10,
          x: 287,
          y: 31,
        }),
      );
      return mergeHUDElementReferences([{}, ...hudElementReferences]);
    },
    initialStateValues: {},
    preventsWalking: false,
  },
);
