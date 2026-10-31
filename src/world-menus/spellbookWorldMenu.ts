import { Ability } from "../classes/Ability";
import { ClassAbilityUnlock, ClassMilestone } from "../classes/Class";
import {
  Color,
  ResourcePool,
  TargetType,
  WorldUnlockMilestoneChoiceRequest,
  WorldUseAbilityRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createButton,
  createInputPressHandler,
  createLabel,
  createSprite,
  emitToSocketioServer,
  getCurrentTime,
  getGameWidth,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { MilestoneChoice } from "../classes/MilestoneChoice";
import { WorldCharacter } from "../classes/WorldCharacter";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema } from "../state";
import { beginWorldCombatHotkeyBind } from "../functions/worldCombatHotkeys";
import { closeWorldMenus } from "../functions/world-menus/closeWorldMenus";
import { createIconListItem } from "../functions/ui/components/createIconListItem";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { createSlot } from "../functions/ui/components/createSlot";
import { getCyclicIndex } from "../functions/getCyclicIndex";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getWorldState } from "../functions/state/getWorldState";
import {
  grayColors,
  spellbookAbilitiesPerPage,
  spellbookMilestonesPerPage,
} from "../constants";
import { isForcedWorldUIVisible } from "../functions/isForcedWorldUIVisible";
import { submitStarwatchEvent } from "../functions/starwatch/submitStarwatchEvent";
import {
  targetWorldPartyCharacter1InputCollectionID,
  targetWorldPartyCharacter2InputCollectionID,
  targetWorldPartyCharacter3InputCollectionID,
} from "../inputCollections";

enum SpellbookTab {
  Abilities = "abilities",
  Milestones = "milestones",
}

export interface SpellbookWorldMenuOpenOptions {}
export interface SpellbookWorldMenuStateSchema {
  isAwaitingWorldCombat: boolean;
  milestonesPage: number;
  selectedAbilityID: string | null;
  selectedMilestoneChoiceID: string | null;
  selectedMilestoneIndex: number | null;
  startedTargetingAt: number | null;
  tab: SpellbookTab;
}
const getAbilityIDs = (): string[] => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  return worldCharacter.player.character.class.abilityUnlocks
    .filter(
      (abilityUnlock: ClassAbilityUnlock): boolean =>
        abilityUnlock.level <= worldCharacter.player.character.level,
    )
    .map(
      (abilityUnlock: ClassAbilityUnlock): string => abilityUnlock.abilityID,
    );
};
const getClassMilestones = (): readonly ClassMilestone[] => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  return worldCharacter.player.character.class.milestones;
};
const getMilestoneChoiceIDs = (): readonly string[] => {
  const milestoneChoiceIDs: string[] = [];
  getClassMilestones().forEach((milestone: ClassMilestone): void => {
    milestone.choiceIDs.forEach((choiceID: string): void => {
      milestoneChoiceIDs.push(choiceID);
    });
  });
  return milestoneChoiceIDs;
};
const getPlayerMilestoneChoiceID = (
  milestoneLevel: number,
): string | undefined => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  return worldCharacter.player.character.milestoneChoiceIDs[milestoneLevel];
};
const getMilestoneTextColor = (milestoneLevel: number): Color => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  let color: Color = Color.DarkGray;
  if (worldCharacter.player.character.level >= milestoneLevel) {
    if (typeof getPlayerMilestoneChoiceID(milestoneLevel) === "undefined") {
      color = Color.VeryLightBlue;
    } else {
      color = Color.White;
    }
  }
  return color;
};
const getMilestoneChoiceTextColor = (
  milestoneLevel: number,
  choiceID: string,
): Color => {
  const selectedChoiceID: string | undefined =
    getPlayerMilestoneChoiceID(milestoneLevel);
  let color: Color = getMilestoneTextColor(milestoneLevel);
  if (
    typeof selectedChoiceID !== "undefined" &&
    selectedChoiceID !== choiceID
  ) {
    color = Color.DarkGray;
  }
  return color;
};
const getMilestoneChoiceIconPalette = (
  milestoneLevel: number,
  choiceID: string,
): Color[] => {
  const worldState: State<WorldStateSchema> = getWorldState();
  const worldCharacter: WorldCharacter = getDefinable(
    WorldCharacter,
    worldState.values.worldCharacterID,
  );
  const selectedChoiceID: string | undefined =
    getPlayerMilestoneChoiceID(milestoneLevel);
  let palette: Color[] = grayColors;
  if (
    worldCharacter.player.character.level >= milestoneLevel &&
    (typeof selectedChoiceID === "undefined" || selectedChoiceID === choiceID)
  ) {
    palette = [];
  }
  return palette;
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
      const gameWidth: number = getGameWidth();
      const menuCondition = (): boolean =>
        spellbookWorldMenu.state.values.startedTargetingAt === null &&
        isForcedWorldUIVisible() === false;
      const abilitiesTabCondition = (): boolean =>
        spellbookWorldMenu.state.values.tab === SpellbookTab.Abilities;
      const milestonesTabCondition = (): boolean =>
        spellbookWorldMenu.state.values.tab === SpellbookTab.Milestones;
      // Background panel
      hudElementReferences.push(
        createPanel({
          condition: menuCondition,
          height: 184,
          imagePath: "panels/basic",
          width: 128,
          x: 176,
          y: 24,
        }),
      );
      // Tabs
      spriteIDs.push(
        createSprite({
          animationID: (): string => {
            switch (spellbookWorldMenu.state.values.tab) {
              case SpellbookTab.Abilities:
                return "1";
              case SpellbookTab.Milestones:
                return "2";
            }
          },
          animations: [
            {
              frames: [
                {
                  height: 21,
                  sourceHeight: 21,
                  sourceWidth: 124,
                  sourceX: 0,
                  sourceY: 0,
                  width: 124,
                },
              ],
              id: "1",
            },
            {
              frames: [
                {
                  height: 21,
                  sourceHeight: 21,
                  sourceWidth: 124,
                  sourceX: 124,
                  sourceY: 0,
                  width: 124,
                },
              ],
              id: "2",
            },
          ],
          coordinates: {
            condition: menuCondition,
            x: 178,
            y: 26,
          },
          imagePath: "tabs/2",
        }),
      );
      hudElementReferences.push(
        createImage({
          condition: menuCondition,
          height: 16,
          imagePath: "tab-icons/spellbook/abilities",
          width: 16,
          x: 197,
          y: 29,
        }),
      );
      hudElementReferences.push(
        createImage({
          condition: menuCondition,
          height: 16,
          imagePath: "tab-icons/spellbook/milestones",
          width: 16,
          x: 250,
          y: 29,
        }),
      );
      buttonIDs.push(
        createButton({
          coordinates: {
            condition: (): boolean =>
              menuCondition() && milestonesTabCondition(),
            x: 179,
            y: 27,
          },
          height: 20,
          onClick: (): void => {
            spellbookWorldMenu.state.setValues({
              selectedMilestoneChoiceID: null,
              selectedMilestoneIndex: null,
              tab: SpellbookTab.Abilities,
            });
          },
          width: 52,
        }),
      );
      buttonIDs.push(
        createButton({
          coordinates: {
            condition: (): boolean =>
              menuCondition() && abilitiesTabCondition(),
            x: 232,
            y: 27,
          },
          height: 20,
          onClick: (): void => {
            spellbookWorldMenu.state.setValues({
              selectedAbilityID: null,
              tab: SpellbookTab.Milestones,
            });
          },
          width: 51,
        }),
      );
      // X button
      hudElementReferences.push(
        createImage({
          condition: menuCondition,
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            spellbookWorldMenu.close({});
          },
          width: 10,
          x: 287,
          y: 31,
        }),
      );
      const selectedAbilityCondition = (): boolean =>
        abilitiesTabCondition() &&
        spellbookWorldMenu.state.values.selectedAbilityID !== null &&
        getAbilityIDs().includes(
          spellbookWorldMenu.state.values.selectedAbilityID,
        ) &&
        spellbookWorldMenu.state.values.startedTargetingAt === null &&
        isForcedWorldUIVisible() === false;
      // Abilities
      for (let i: number = 0; i < spellbookAbilitiesPerPage; i++) {
        const y: number = 49 + i * 18;
        hudElementReferences.push(
          createIconListItem({
            condition: (): boolean =>
              abilitiesTabCondition() &&
              spellbookWorldMenu.state.values.startedTargetingAt === null &&
              i < getAbilityIDs().length &&
              isForcedWorldUIVisible() === false,
            icons: [
              {
                imagePath: (): string => getSpellbookAbility(i).iconImagePath,
              },
            ],
            isSelected: (): boolean => {
              const slotAbilityID: string = getSpellbookAbility(i).id;
              return (
                spellbookWorldMenu.state.values.selectedAbilityID ===
                slotAbilityID
              );
            },
            onClick: (): void => {
              const slotAbilityID: string = getSpellbookAbility(i).id;
              if (
                spellbookWorldMenu.state.values.selectedAbilityID ===
                slotAbilityID
              ) {
                spellbookWorldMenu.state.setValues({
                  selectedAbilityID: null,
                });
              } else {
                spellbookWorldMenu.state.setValues({
                  selectedAbilityID: slotAbilityID,
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
      const isMilestonesPaginated = (): boolean =>
        getClassMilestones().length > spellbookMilestonesPerPage;
      const getMilestonesLastPage = (): number =>
        Math.max(
          Math.floor(
            (getClassMilestones().length - 1) / spellbookMilestonesPerPage,
          ),
          0,
        );
      const pageMilestones = (offset: number): void => {
        const pages: number[] = [];
        for (let i: number = 0; i < getMilestonesLastPage() + 1; i++) {
          pages.push(i);
        }
        spellbookWorldMenu.state.setValues({
          milestonesPage: getCyclicIndex(
            pages.indexOf(spellbookWorldMenu.state.values.milestonesPage) +
              offset,
            pages,
          ),
        });
      };
      const milestones: readonly ClassMilestone[] = getClassMilestones();
      const milestonesPageCount: number = Math.max(
        Math.ceil(milestones.length / spellbookMilestonesPerPage),
        1,
      );
      for (
        let pageIndex: number = 0;
        pageIndex < milestonesPageCount;
        pageIndex++
      ) {
        let milestoneContentY: number = 50;
        const milestonesOnPage: readonly ClassMilestone[] = milestones.slice(
          pageIndex * spellbookMilestonesPerPage,
          pageIndex * spellbookMilestonesPerPage + spellbookMilestonesPerPage,
        );
        const isMilestonePageVisible = (): boolean =>
          milestonesTabCondition() &&
          spellbookWorldMenu.state.values.milestonesPage === pageIndex &&
          isForcedWorldUIVisible() === false;
        milestonesOnPage.forEach(
          (milestone: ClassMilestone, milestoneOnPageIndex: number): void => {
            const milestoneIndex: number =
              pageIndex * spellbookMilestonesPerPage + milestoneOnPageIndex;
            const milestoneHeaderY: number = milestoneContentY;
            labelIDs.push(
              createLabel({
                color: (): Color => getMilestoneTextColor(milestone.level),
                coordinates: {
                  condition: isMilestonePageVisible,
                  x: 183,
                  y: milestoneHeaderY + 4,
                },
                horizontalAlignment: "left",
                text: (): CreateLabelOptionsText => ({
                  value: `Level ${getFormattedInteger(milestone.level)}`,
                }),
              }),
            );
            milestoneContentY += 17;
            milestone.choiceIDs.forEach((choiceID: string): void => {
              const choiceY: number = milestoneContentY;
              hudElementReferences.push(
                createIconListItem({
                  color: (): Color =>
                    getMilestoneChoiceTextColor(milestone.level, choiceID),
                  condition: isMilestonePageVisible,
                  icons: [
                    {
                      imagePath: (): string =>
                        getDefinable(MilestoneChoice, choiceID).imagePath,
                      palette: (): Color[] =>
                        getMilestoneChoiceIconPalette(
                          milestone.level,
                          choiceID,
                        ),
                    },
                  ],
                  isSelected: (): boolean =>
                    spellbookWorldMenu.state.values
                      .selectedMilestoneChoiceID === choiceID &&
                    spellbookWorldMenu.state.values.selectedMilestoneIndex ===
                      milestoneIndex,
                  onClick: (): void => {
                    if (
                      spellbookWorldMenu.state.values
                        .selectedMilestoneChoiceID === choiceID &&
                      spellbookWorldMenu.state.values.selectedMilestoneIndex ===
                        milestoneIndex
                    ) {
                      spellbookWorldMenu.state.setValues({
                        selectedMilestoneChoiceID: null,
                        selectedMilestoneIndex: null,
                      });
                    } else {
                      spellbookWorldMenu.state.setValues({
                        selectedMilestoneChoiceID: choiceID,
                        selectedMilestoneIndex: milestoneIndex,
                      });
                    }
                  },
                  slotImagePath: "slots/basic",
                  text: (): CreateLabelOptionsText => ({
                    value: getDefinable(MilestoneChoice, choiceID).name,
                  }),
                  width: 116,
                  x: 182,
                  y: choiceY,
                }),
              );
              milestoneContentY += 18;
            });
            milestoneContentY += 1;
          },
        );
      }
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            milestonesTabCondition() &&
            isMilestonesPaginated() &&
            isForcedWorldUIVisible() === false,
          height: 14,
          imagePath: "arrows/left",
          onClick: (): void => {
            pageMilestones(-1);
          },
          width: 14,
          x: 190,
          y: 176,
        }),
      );
      hudElementReferences.push(
        createImage({
          condition: (): boolean =>
            milestonesTabCondition() &&
            isMilestonesPaginated() &&
            isForcedWorldUIVisible() === false,
          height: 14,
          imagePath: "arrows/right",
          onClick: (): void => {
            pageMilestones(1);
          },
          width: 14,
          x: 275,
          y: 176,
        }),
      );
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: (): boolean =>
              milestonesTabCondition() &&
              isMilestonesPaginated() &&
              isForcedWorldUIVisible() === false,
            x: 296,
            y: 193,
          },
          horizontalAlignment: "right",
          text: (): CreateLabelOptionsText => ({
            value: String(spellbookWorldMenu.state.values.milestonesPage + 1),
          }),
        }),
      );
      const getSelectedMilestone = (): ClassMilestone => {
        if (spellbookWorldMenu.state.values.selectedMilestoneIndex === null) {
          throw new Error("Selected milestone index is null");
        }
        const selectedMilestone: ClassMilestone | undefined =
          getClassMilestones()[
            spellbookWorldMenu.state.values.selectedMilestoneIndex
          ];
        if (typeof selectedMilestone === "undefined") {
          throw new Error("Selected milestone is undefined");
        }
        return selectedMilestone;
      };
      const isSelectedMilestoneLevelReached = (): boolean =>
        worldCharacter.player.character.level >= getSelectedMilestone().level;
      const selectedMilestoneChoiceCondition = (): boolean =>
        milestonesTabCondition() &&
        spellbookWorldMenu.state.values.selectedMilestoneChoiceID !== null &&
        spellbookWorldMenu.state.values.selectedMilestoneIndex !== null &&
        getMilestoneChoiceIDs().includes(
          spellbookWorldMenu.state.values.selectedMilestoneChoiceID,
        ) &&
        isForcedWorldUIVisible() === false;
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
                  spellbookWorldMenu.state.values.selectedAbilityID === null
                ) {
                  throw new Error("Selected ability ID is null");
                }
                return getDefinable(
                  Ability,
                  spellbookWorldMenu.state.values.selectedAbilityID,
                ).iconImagePath;
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
            if (spellbookWorldMenu.state.values.selectedAbilityID === null) {
              throw new Error("Selected ability ID is null");
            }
            return {
              value: getDefinable(
                Ability,
                spellbookWorldMenu.state.values.selectedAbilityID,
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
              selectedAbilityID: null,
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
            if (spellbookWorldMenu.state.values.selectedAbilityID === null) {
              throw new Error("Selected ability ID is null");
            }
            return {
              value: getDefinable(
                Ability,
                spellbookWorldMenu.state.values.selectedAbilityID,
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
                  spellbookWorldMenu.state.values.selectedAbilityID === null
                ) {
                  throw new Error("Selected ability ID is null");
                }
                return (
                  worldCharacter.player.character.class.resourcePool ===
                    ResourcePool.MP &&
                  getDefinable(
                    Ability,
                    spellbookWorldMenu.state.values.selectedAbilityID,
                  ).mpCost > 0
                );
              }
              return false;
            },
            x: 7,
            y: 194,
          },
          horizontalAlignment: "left",
          text: (): CreateLabelOptionsText => {
            if (spellbookWorldMenu.state.values.selectedAbilityID === null) {
              throw new Error("Selected ability ID is null");
            }
            return {
              value: `${getFormattedInteger(
                getDefinable(
                  Ability,
                  spellbookWorldMenu.state.values.selectedAbilityID,
                ).mpCost,
              )} MP`,
            };
          },
        }),
      );
      // Selected ability will cost
      labelIDs.push(
        createLabel({
          color: Color.White,
          coordinates: {
            condition: (): boolean => {
              if (selectedAbilityCondition()) {
                if (
                  spellbookWorldMenu.state.values.selectedAbilityID === null
                ) {
                  throw new Error("Selected ability ID is null");
                }
                return (
                  worldCharacter.player.character.class.resourcePool ===
                    ResourcePool.Will &&
                  getDefinable(
                    Ability,
                    spellbookWorldMenu.state.values.selectedAbilityID,
                  ).willCost > 0
                );
              }
              return false;
            },
            x: 7,
            y: 194,
          },
          horizontalAlignment: "left",
          text: (): CreateLabelOptionsText => {
            if (spellbookWorldMenu.state.values.selectedAbilityID === null) {
              throw new Error("Selected ability ID is null");
            }
            return {
              value: `${getFormattedInteger(
                getDefinable(
                  Ability,
                  spellbookWorldMenu.state.values.selectedAbilityID,
                ).willCost,
              )} FP`,
            };
          },
        }),
      );
      // Selected ability use button
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => {
            if (selectedAbilityCondition()) {
              if (spellbookWorldMenu.state.values.selectedAbilityID === null) {
                throw new Error("Selected ability ID is null");
              }
              const ability: Ability = getDefinable(
                Ability,
                spellbookWorldMenu.state.values.selectedAbilityID,
              );
              if (ability.canBeUsedInWorld) {
                switch (worldCharacter.player.character.class.resourcePool) {
                  case ResourcePool.MP: {
                    const mp: number = worldCharacter.resources.mp ?? 0;
                    return mp >= ability.mpCost;
                  }
                }
              }
            }
            return false;
          },
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            if (spellbookWorldMenu.state.values.selectedAbilityID === null) {
              throw new Error("Selected ability ID is null");
            }
            const ability: Ability = getDefinable(
              Ability,
              spellbookWorldMenu.state.values.selectedAbilityID,
            );
            switch (ability.targetType) {
              case TargetType.AllAllies:
                emitToSocketioServer<WorldUseAbilityRequest>({
                  data: {
                    abilityID: ability.id,
                  },
                  event: "world/use-ability",
                });
                submitStarwatchEvent({
                  event: "ability",
                  extraDetails: {
                    abilityID: ability.id,
                  },
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
                submitStarwatchEvent({
                  event: "ability",
                  extraDetails: {
                    abilityID: ability.id,
                  },
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
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => {
            if (selectedAbilityCondition()) {
              if (spellbookWorldMenu.state.values.selectedAbilityID === null) {
                throw new Error("Selected ability ID is null");
              }
              const ability: Ability = getDefinable(
                Ability,
                spellbookWorldMenu.state.values.selectedAbilityID,
              );
              return (
                ability.canBeUsedInWorld &&
                (ability.targetType === TargetType.AllAllies ||
                  ability.targetType === TargetType.None ||
                  ability.targetType === TargetType.SingleAlly)
              );
            }
            return false;
          },
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            if (spellbookWorldMenu.state.values.selectedAbilityID === null) {
              throw new Error("Selected ability ID is null");
            }
            beginWorldCombatHotkeyBind(
              getDefinable(
                Ability,
                spellbookWorldMenu.state.values.selectedAbilityID,
              ).getReference(),
            );
            closeWorldMenus({});
          },
          text: { value: "Bind" },
          width: 34,
          x: 98,
          y: 185,
        }),
      );
      // Selected milestone choice panel
      hudElementReferences.push(
        createPanel({
          condition: selectedMilestoneChoiceCondition,
          height: 76,
          imagePath: "panels/basic",
          width: 176,
          x: 0,
          y: 132,
        }),
      );
      hudElementReferences.push(
        createSlot({
          condition: selectedMilestoneChoiceCondition,
          icons: [
            {
              imagePath: (): string => {
                if (
                  spellbookWorldMenu.state.values.selectedMilestoneChoiceID ===
                  null
                ) {
                  throw new Error("Selected milestone choice ID is null");
                }
                return getDefinable(
                  MilestoneChoice,
                  spellbookWorldMenu.state.values.selectedMilestoneChoiceID,
                ).imagePath;
              },
              palette: (): Color[] => {
                if (
                  spellbookWorldMenu.state.values.selectedMilestoneChoiceID ===
                  null
                ) {
                  throw new Error("Selected milestone choice ID is null");
                }
                return getMilestoneChoiceIconPalette(
                  getSelectedMilestone().level,
                  spellbookWorldMenu.state.values.selectedMilestoneChoiceID,
                );
              },
            },
          ],
          imagePath: "slots/basic",
          x: 7,
          y: 139,
        }),
      );
      labelIDs.push(
        createLabel({
          color: (): Color => {
            if (
              spellbookWorldMenu.state.values.selectedMilestoneChoiceID === null
            ) {
              throw new Error("Selected milestone choice ID is null");
            }
            return getMilestoneChoiceTextColor(
              getSelectedMilestone().level,
              spellbookWorldMenu.state.values.selectedMilestoneChoiceID,
            );
          },
          coordinates: {
            condition: selectedMilestoneChoiceCondition,
            x: 27,
            y: 144,
          },
          horizontalAlignment: "left",
          text: (): CreateLabelOptionsText => {
            if (
              spellbookWorldMenu.state.values.selectedMilestoneChoiceID === null
            ) {
              throw new Error("Selected milestone choice ID is null");
            }
            const milestoneChoice: MilestoneChoice = getDefinable(
              MilestoneChoice,
              spellbookWorldMenu.state.values.selectedMilestoneChoiceID,
            );
            let value: string = milestoneChoice.name;
            if (milestoneChoice.hasUnlockAbilityIDs()) {
              value += ` (Ability)`;
            }
            return {
              value,
            };
          },
        }),
      );
      hudElementReferences.push(
        createImage({
          condition: selectedMilestoneChoiceCondition,
          height: 11,
          imagePath: "x",
          onClick: (): void => {
            spellbookWorldMenu.state.setValues({
              selectedMilestoneChoiceID: null,
              selectedMilestoneIndex: null,
            });
          },
          width: 10,
          x: 159,
          y: 139,
        }),
      );
      labelIDs.push(
        createLabel({
          color: (): Color => {
            if (
              spellbookWorldMenu.state.values.selectedMilestoneChoiceID === null
            ) {
              throw new Error("Selected milestone choice ID is null");
            }
            return getMilestoneChoiceTextColor(
              getSelectedMilestone().level,
              spellbookWorldMenu.state.values.selectedMilestoneChoiceID,
            );
          },
          coordinates: {
            condition: selectedMilestoneChoiceCondition,
            x: 8,
            y: 159,
          },
          horizontalAlignment: "left",
          maxLines: 3,
          maxWidth: 160,
          text: (): CreateLabelOptionsText => {
            if (
              spellbookWorldMenu.state.values.selectedMilestoneChoiceID === null
            ) {
              throw new Error("Selected milestone choice ID is null");
            }
            return {
              value: getDefinable(
                MilestoneChoice,
                spellbookWorldMenu.state.values.selectedMilestoneChoiceID,
              ).description,
            };
          },
        }),
      );
      hudElementReferences.push(
        createPressableButton({
          condition: (): boolean => {
            if (
              selectedMilestoneChoiceCondition() &&
              isSelectedMilestoneLevelReached()
            ) {
              return (
                typeof worldCharacter.player.character.milestoneChoiceIDs[
                  getSelectedMilestone().level
                ] === "undefined"
              );
            }
            return false;
          },
          height: 16,
          imagePath: "pressable-buttons/gray",
          onClick: (): void => {
            if (
              spellbookWorldMenu.state.values.selectedMilestoneChoiceID === null
            ) {
              throw new Error("Selected milestone choice ID is null");
            }
            emitToSocketioServer<WorldUnlockMilestoneChoiceRequest>({
              data: {
                level: getSelectedMilestone().level,
                milestoneChoiceID:
                  spellbookWorldMenu.state.values.selectedMilestoneChoiceID,
              },
              event: "world/unlock-milestone-choice",
            });
          },
          text: { value: "Unlock" },
          width: 48,
          x: 121,
          y: 185,
        }),
      );
      // Targeting background panel
      hudElementReferences.push(
        createPanel({
          condition: (): boolean =>
            spellbookWorldMenu.state.values.startedTargetingAt !== null &&
            isForcedWorldUIVisible() === false,
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
            isForcedWorldUIVisible() === false,
          icons: [
            {
              imagePath: (): string => {
                if (
                  spellbookWorldMenu.state.values.selectedAbilityID === null
                ) {
                  throw new Error("Selected ability ID is null");
                }
                const ability: Ability = getDefinable(
                  Ability,
                  spellbookWorldMenu.state.values.selectedAbilityID,
                );
                return ability.iconImagePath;
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
              isForcedWorldUIVisible() === false,
            x: 27,
            y: 176,
          },
          horizontalAlignment: "left",
          text: (): CreateLabelOptionsText => {
            if (spellbookWorldMenu.state.values.selectedAbilityID === null) {
              throw new Error("Selected ability ID is null");
            }
            const ability: Ability = getDefinable(
              Ability,
              spellbookWorldMenu.state.values.selectedAbilityID,
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
            isForcedWorldUIVisible() === false,
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
              isForcedWorldUIVisible() === false,
            x: 74,
            y: 191,
          },
          horizontalAlignment: "center",
          maxLines: 1,
          maxWidth: gameWidth,
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
                worldCharacter.player.character.party.playerIDs.length >
                  inputCollectionIndex &&
                isForcedWorldUIVisible() === false,
              inputCollectionID,
              onInput: (): void => {
                if (
                  spellbookWorldMenu.state.values.selectedAbilityID === null
                ) {
                  throw new Error("Selected ability ID is null");
                }
                const ability: Ability = getDefinable(
                  Ability,
                  spellbookWorldMenu.state.values.selectedAbilityID,
                );
                const partyMemberPlayerID: string | undefined =
                  worldCharacter.player.character.party.playerIDs[
                    inputCollectionIndex
                  ];
                if (typeof partyMemberPlayerID === "undefined") {
                  throw new Error("No party member player ID.");
                }
                emitToSocketioServer<WorldUseAbilityRequest>({
                  data: {
                    abilityID: ability.id,
                    playerID: partyMemberPlayerID,
                  },
                  event: "world/use-ability",
                });
                submitStarwatchEvent({
                  event: "ability",
                  extraDetails: {
                    abilityID: ability.id,
                  },
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
      milestonesPage: 0,
      selectedAbilityID: null,
      selectedMilestoneChoiceID: null,
      selectedMilestoneIndex: null,
      startedTargetingAt: null,
      tab: SpellbookTab.Abilities,
    },
  },
);
