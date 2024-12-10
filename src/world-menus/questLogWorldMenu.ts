import {
  HUDElementReferences,
  createButton,
  createSprite,
  mergeHUDElementReferences,
} from "pixel-pigeon";
import { WorldMenu } from "../classes/WorldMenu";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { questLogQuestsPerPage } from "../constants/questLogQuestsPerPage";

enum QuestLogTab {
  Completed = "completed",
  InProgress = "in-progress",
}

export interface QuestLogWorldMenuOpenOptions {}
export interface QuestLogWorldMenuStateSchema {
  tab: QuestLogTab;
}
export const questLogWorldMenu: WorldMenu<
  QuestLogWorldMenuOpenOptions,
  QuestLogWorldMenuStateSchema
> = new WorldMenu<QuestLogWorldMenuOpenOptions, QuestLogWorldMenuStateSchema>({
  create: (): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const buttonIDs: string[] = [];
    const spriteIDs: string[] = [];
    const inProgressTabCondition = (): boolean =>
      questLogWorldMenu.state.values.tab === QuestLogTab.InProgress;
    const completedTabCondition = (): boolean =>
      questLogWorldMenu.state.values.tab === QuestLogTab.Completed;
    // Background panel
    hudElementReferences.push(
      createPanel({
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
          switch (questLogWorldMenu.state.values.tab) {
            case QuestLogTab.InProgress:
              return "1";
            case QuestLogTab.Completed:
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
          x: 178,
          y: 26,
        },
        imagePath: "tabs/2",
      }),
    );
    hudElementReferences.push(
      createImage({
        height: 16,
        imagePath: "tab-icons/quest-log/in-progress",
        width: 16,
        x: 197,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
        height: 16,
        imagePath: "tab-icons/quest-log/completed",
        width: 16,
        x: 250,
        y: 29,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: completedTabCondition,
          x: 179,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            tab: QuestLogTab.InProgress,
          });
        },
        width: 52,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: inProgressTabCondition,
          x: 232,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          questLogWorldMenu.state.setValues({
            tab: QuestLogTab.Completed,
          });
        },
        width: 51,
      }),
    );
    // X button
    hudElementReferences.push(
      createImage({
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          questLogWorldMenu.close();
        },
        width: 10,
        x: 287,
        y: 31,
      }),
    );
    for (let i: number = 0; i < questLogQuestsPerPage; i++) {
      const y: number = 56 + i * 20;
      console.log(y);
    }
    return mergeHUDElementReferences([
      {
        buttonIDs,
        spriteIDs,
      },
      ...hudElementReferences,
    ]);
  },
  initialStateValues: {
    tab: QuestLogTab.InProgress,
  },
  preventsWalking: false,
});
