import { Ability } from "../classes/Ability";
import { ClassAbilityUnlock } from "../classes/Class";
import { Color, TargetType, WorldUseAbilityRequest } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createInputPressHandler,
  createLabel,
  emitToSocketioServer,
  getCurrentTime,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { createIconListItem } from "../functions/ui/components/createIconListItem";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { createSlot } from "../functions/ui/components/createSlot";
import { getDefinable } from "definables";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";
import { spellbookAbilitiesPerPage } from "../constants";
import {
  targetWorldPartyCharacter1InputCollectionID,
  targetWorldPartyCharacter2InputCollectionID,
  targetWorldPartyCharacter3InputCollectionID,
} from "../input";

export interface SpellbookWorldMenuOpenOptions {}
export interface SpellbookWorldMenuStateSchema {
  isAwaitingWorldCombat: boolean;
  selectedAbilityIndex: number | null;
  startedTargetingAt: number | null;
}
const getAbilityIDs = (): string[] => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  return worldCharacter.class.abilityUnlocks
    .filter(
      (abilityUnlock: ClassAbilityUnlock): boolean =>
        abilityUnlock.level <= worldCharacter.level,
    )
    .map(
      (abilityUnlock: ClassAbilityUnlock): string => abilityUnlock.abilityID,
    );
};

export const getSpellbookAbility = (i: number): Ability => {
  const abilityIDs: string[] = getAbilityIDs();
  const abilityID: string | undefined = abilityIDs[i];
  if (typeof abilityID === "undefined") {
    throw new Error("Ability ID not found");
  }
  return getDefinable(Ability, abilityID);
};
export const spellbookWorldMenu: WorldMenu<
  SpellbookWorldMenuOpenOptions,
  SpellbookWorldMenuStateSchema
> = new WorldMenu<SpellbookWorldMenuOpenOptions, SpellbookWorldMenuStateSchema>(
  {
    create: (): HUDElementReferences => {
      const hudElementReferences: HUDElementReferences[] = [];
      const buttonIDs: string[] = [];
      const inputPressHandlerIDs: string[] = [];
      const labelIDs: string[] = [];
      const spriteIDs: string[] = [];
      const worldState: State<WorldStateSchema> = getWorldState();
      const worldCharacter: WorldCharacter = getDefinable(
        WorldCharacter,
        worldState.values.worldCharacterID,
      );
      // Background panel
      hudElementReferences.push(
        createPanel({
          condition: (): boolean =>
            spellbookWorldMenu.state.values.startedTargetingAt === null &&
            isWorldCombatInProgress() === false,
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
          condition: (): boolean =>
            spellbookWorldMenu.state.values.startedTargetingAt === null &&
            isWorldCombatInProgress() === false,
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            spellbookWorldMenu.close();
          },
          width: 10,
          x: 287,
          y: 31,
        }),
      );
      const selectedAbilityCondition = (): boolean =>
        spellbookWorldMenu.state.values.selectedAbilityIndex !== null &&
        spellbookWorldMenu.state.values.startedTargetingAt === null &&
        isWorldCombatInProgress() === false;
      // Abilities
      for (let i: number = 0; i < spellbookAbilitiesPerPage; i++) {
        const y: number = 49 + i * 18;
        hudElementReferences.push(
          createIconListItem({
            condition: (): boolean =>
              spellbookWorldMenu.state.values.startedTargetingAt === null &&
              i < getAbilityIDs().length &&
              isWorldCombatInProgress() === false,
            icons: [
              {
                imagePath: (): string =>
                  `ability-icons/${getSpellbookAbility(i).id}`,
              },
            ],
            isSelected: (): boolean =>
              spellbookWorldMenu.state.values.selectedAbilityIndex === i,
            onClick: (): void => {
              if (spellbookWorldMenu.state.values.selectedAbilityIndex === i) {
                spellbookWorldMenu.state.setValues({
                  selectedAbilityIndex: null,
                });
              } else {
                spellbookWorldMenu.state.setValues({
                  selectedAbilityIndex: i,
                });
              }
            },
            slotImagePath: "slots/basic",
            text: (): CreateLabelOptionsText => ({
              value: getSpellbookAbility(i).name,
            }),
            width: 116,
            x: 182,
            y,
          }),
        );
      }
      // Selected ability panel
      hudElementReferences.push(
        createPanel({
          condition: selectedAbilityCondition,
          height: 76,
          imagePath: "panels/basic",
          width: 176,
          x: 0,
          y: 132,
        }),
      );
      // Selected ability icon
      hudElementReferences.push(
        createSlot({
          condition: selectedAbilityCondition,
          icons: [
            {
              imagePath: (): string => {
                if (
                  spellbookWorldMenu.state.values.selectedAbilityIndex === null
                ) {
                  throw new Error("Selected ability index is null");
                }
                return `ability-icons/${
                  getSpellbookAbility(
                    spellbookWorldMenu.state.values.selectedAbilityIndex,
                  ).id
                }`;
              },
            },
          ],
          imagePath: "slots/basic",
          x: 7,
          y: 139,
        }),
      );
      // Selected ability name
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: selectedAbilityCondition,
            x: 27,
            y: 144,
          },
          horizontalAlignment: "left",
          text: (): CreateLabelOptionsText => {
            if (spellbookWorldMenu.state.values.selectedAbilityIndex === null) {
              throw new Error("Selected ability index is null");
            }
            return {
              value: getSpellbookAbility(
                spellbookWorldMenu.state.values.selectedAbilityIndex,
              ).name,
            };
          },
        }),
      );
      // Selected ability close button
      hudElementReferences.push(
        createImage({
          condition: selectedAbilityCondition,
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            spellbookWorldMenu.state.setValues({
              selectedAbilityIndex: null,
            });
          },
          width: 10,
          x: 159,
          y: 139,
        }),
      );
      // Selected ability description
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: selectedAbilityCondition,
            x: 8,
            y: 159,
          },
          horizontalAlignment: "left",
          maxLines: 3,
          maxWidth: 160,
          text: (): CreateLabelOptionsText => {
            if (spellbookWorldMenu.state.values.selectedAbilityIndex === null) {
              throw new Error("Selected ability index is null");
            }
            return {
              value: getSpellbookAbility(
                spellbookWorldMenu.state.values.selectedAbilityIndex,
              ).description,
            };
          },
        }),
      );
      // Selected ability mp cost
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: (): boolean => {
              if (selectedAbilityCondition()) {
                if (
                  spellbookWorldMenu.state.values.selectedAbilityIndex === null
                ) {
                  throw new Error("Selected ability index is null");
                }
                return (
                  getSpellbookAbility(
                    spellbookWorldMenu.state.values.selectedAbilityIndex,
                  ).mpCost > 0
                );
              }
              return false;
            },
            x: 131,
            y: 186,
          },
          horizontalAlignment: "right",
          text: (): CreateLabelOptionsText => {
            if (spellbookWorldMenu.state.values.selectedAbilityIndex === null) {
              throw new Error("Selected ability index is null");
            }
            return {
              value: `${
                getSpellbookAbility(
                  spellbookWorldMenu.state.values.selectedAbilityIndex,
                ).mpCost
              } MP`,
            };
          },
        }),
      );
      // Selected ability use button
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => {
            if (selectedAbilityCondition()) {
              if (
                spellbookWorldMenu.state.values.selectedAbilityIndex === null
              ) {
                throw new Error("Selected ability index is null");
              }
              const ability: Ability = getSpellbookAbility(
                spellbookWorldMenu.state.values.selectedAbilityIndex,
              );
              if (ability.canBeUsedInWorld) {
                const mp: number = worldCharacter.resources.mp ?? 0;
                return mp >= ability.mpCost;
              }
            }
            return false;
          },
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            if (spellbookWorldMenu.state.values.selectedAbilityIndex === null) {
              throw new Error("Selected ability index is null");
            }
            const ability: Ability = getSpellbookAbility(
              spellbookWorldMenu.state.values.selectedAbilityIndex,
            );
            switch (ability.targetType) {
              case TargetType.AllAllies:
                emitToSocketioServer<WorldUseAbilityRequest>({
                  data: {
                    abilityID: ability.id,
                  },
                  event: "world/use-ability",
                });
                spellbookWorldMenu.state.setValues({
                  isAwaitingWorldCombat: true,
                });
                break;
              case TargetType.None:
                emitToSocketioServer<WorldUseAbilityRequest>({
                  data: {
                    abilityID: ability.id,
                  },
                  event: "world/use-ability",
                });
                spellbookWorldMenu.state.setValues({
                  isAwaitingWorldCombat: true,
                });
                break;
              case TargetType.Self:
                emitToSocketioServer<WorldUseAbilityRequest>({
                  data: {
                    abilityID: ability.id,
                  },
                  event: "world/use-ability",
                });
                spellbookWorldMenu.state.setValues({
                  isAwaitingWorldCombat: true,
                });
                break;
              case TargetType.SingleAlly:
                spellbookWorldMenu.state.setValues({
                  startedTargetingAt: getCurrentTime(),
                });
                break;
            }
          },
          text: { value: "Use" },
          width: 34,
          x: 135,
          y: 185,
        }),
      );
      // Targeting background panel
      hudElementReferences.push(
        createPanel({
          condition: (): boolean =>
            spellbookWorldMenu.state.values.startedTargetingAt !== null &&
            isWorldCombatInProgress() === false,
          height: 44,
          imagePath: "panels/basic",
          width: 147,
          x: 0,
          y: 164,
        }),
      );
      // Targeting ability icon
      hudElementReferences.push(
        createSlot({
          condition: (): boolean =>
            spellbookWorldMenu.state.values.startedTargetingAt !== null &&
            isWorldCombatInProgress() === false,
          icons: [
            {
              imagePath: (): string => {
                if (
                  spellbookWorldMenu.state.values.selectedAbilityIndex === null
                ) {
                  throw new Error("Selected ability index is null");
                }
                const ability: Ability = getSpellbookAbility(
                  spellbookWorldMenu.state.values.selectedAbilityIndex,
                );
                return `ability-icons/${ability.id}`;
              },
            },
          ],
          imagePath: "slots/basic",
          x: 7,
          y: 171,
        }),
      );
      // Targeting ability name
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: (): boolean =>
              spellbookWorldMenu.state.values.startedTargetingAt !== null &&
              isWorldCombatInProgress() === false,
            x: 27,
            y: 176,
          },
          horizontalAlignment: "left",
          text: (): CreateLabelOptionsText => {
            if (spellbookWorldMenu.state.values.selectedAbilityIndex === null) {
              throw new Error("Selected ability index is null");
            }
            const ability: Ability = getSpellbookAbility(
              spellbookWorldMenu.state.values.selectedAbilityIndex,
            );
            return {
              value: ability.name,
            };
          },
        }),
      );
      // Targeting close button
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            spellbookWorldMenu.state.values.startedTargetingAt !== null &&
            isWorldCombatInProgress() === false,
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            spellbookWorldMenu.state.setValues({
              startedTargetingAt: null,
            });
          },
          width: 10,
          x: 130,
          y: 171,
        }),
      );
      // Targeting instructions text
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: (): boolean =>
              spellbookWorldMenu.state.values.startedTargetingAt !== null &&
              isWorldCombatInProgress() === false,
            x: 74,
            y: 191,
          },
          horizontalAlignment: "center",
          maxLines: 1,
          maxWidth: 304,
          text: (): CreateLabelOptionsText => ({
            value: "Select a target.",
          }),
        }),
      );
      // Targeting keys
      [
        targetWorldPartyCharacter1InputCollectionID,
        targetWorldPartyCharacter2InputCollectionID,
        targetWorldPartyCharacter3InputCollectionID,
      ].forEach(
        (inputCollectionID: string, inputCollectionIndex: number): void => {
          inputPressHandlerIDs.push(
            createInputPressHandler({
              condition: (): boolean =>
                spellbookWorldMenu.state.values.startedTargetingAt !== null &&
                worldCharacter.party.worldCharacterIDs.length >
                  inputCollectionIndex &&
                isWorldCombatInProgress() === false,
              inputCollectionID,
              onInput: (): void => {
                if (
                  spellbookWorldMenu.state.values.selectedAbilityIndex === null
                ) {
                  throw new Error("Selected ability index is null");
                }
                const ability: Ability = getSpellbookAbility(
                  spellbookWorldMenu.state.values.selectedAbilityIndex,
                );
                const partyMemberWorldCharacter: WorldCharacter | undefined =
                  worldCharacter.party.worldCharacters[inputCollectionIndex];
                if (typeof partyMemberWorldCharacter === "undefined") {
                  throw new Error("No party member world character.");
                }
                emitToSocketioServer<WorldUseAbilityRequest>({
                  data: {
                    abilityID: ability.id,
                    playerID: partyMemberWorldCharacter.playerID,
                  },
                  event: "world/use-ability",
                });
                spellbookWorldMenu.state.setValues({
                  isAwaitingWorldCombat: true,
                });
              },
            }),
          );
        },
      );
      return mergeHUDElementReferences([
        {
          buttonIDs,
          inputPressHandlerIDs,
          labelIDs,
          spriteIDs,
        },
        ...hudElementReferences,
      ]);
    },
    initialStateValues: {
      isAwaitingWorldCombat: false,
      selectedAbilityIndex: null,
      startedTargetingAt: null,
    },
    preventsWalking: false,
  },
);
