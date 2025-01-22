import { Color } from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createButton,
  createLabel,
  createSprite,
  mergeHUDElementReferences,
  postWindowMessage,
} from "pixel-pigeon";
import { Emote } from "../classes/Emote";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema, state } from "../state";
import { createImage } from "../functions/ui/components/createImage";
import { createPanel } from "../functions/ui/components/createPanel";
import { createSlot } from "../functions/ui/components/createSlot";
import { emotesPerPage } from "../constants";
import { getCyclicIndex } from "../functions/getCyclicIndex";
import { getDefinables } from "definables";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";
import { useEmote } from "../functions/useEmote";

enum EmotesTab {
  Free = "free",
  Subscriber = "subscriber",
}

export interface EmotesWorldMenuOpenOptions {}
export interface EmotesWorldMenuStateSchema {
  freePage: number;
  subscriberPage: number;
  tab: EmotesTab;
}
export const emotesWorldMenu: WorldMenu<
  EmotesWorldMenuOpenOptions,
  EmotesWorldMenuStateSchema
> = new WorldMenu<EmotesWorldMenuOpenOptions, EmotesWorldMenuStateSchema>({
  create: (): HUDElementReferences => {
    const hudElementReferences: HUDElementReferences[] = [];
    const buttonIDs: string[] = [];
    const labelIDs: string[] = [];
    const spriteIDs: string[] = [];
    const freeTabCondition = (): boolean =>
      emotesWorldMenu.state.values.tab === EmotesTab.Free;
    const subscriberTabCondition = (): boolean =>
      emotesWorldMenu.state.values.tab === EmotesTab.Subscriber;
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
    // Tabs
    spriteIDs.push(
      createSprite({
        animationID: (): string => {
          switch (emotesWorldMenu.state.values.tab) {
            case EmotesTab.Free:
              return "1";
            case EmotesTab.Subscriber:
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
          condition: (): boolean => isWorldCombatInProgress() === false,
          x: 178,
          y: 26,
        },
        imagePath: "tabs/2",
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 16,
        imagePath: "tab-icons/emotes/free",
        width: 16,
        x: 197,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 16,
        imagePath: "tab-icons/emotes/subscriber",
        width: 16,
        x: 250,
        y: 29,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean =>
            subscriberTabCondition() && isWorldCombatInProgress() === false,
          x: 179,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          emotesWorldMenu.state.setValues({
            tab: EmotesTab.Free,
          });
        },
        width: 52,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean =>
            freeTabCondition() && isWorldCombatInProgress() === false,
          x: 232,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          emotesWorldMenu.state.setValues({
            tab: EmotesTab.Subscriber,
          });
        },
        width: 51,
      }),
    );
    // X button
    hudElementReferences.push(
      createImage({
        condition: (): boolean => isWorldCombatInProgress() === false,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          emotesWorldMenu.close();
        },
        width: 10,
        x: 287,
        y: 31,
      }),
    );
    const getEmotes = (): readonly Emote[] => {
      const emotes: Emote[] = [];
      for (const emote of getDefinables(Emote).values()) {
        switch (emotesWorldMenu.state.values.tab) {
          case EmotesTab.Free:
            if (emote.requiresSubscription === false) {
              emotes.push(emote);
            }
            break;
          case EmotesTab.Subscriber:
            if (emote.requiresSubscription) {
              emotes.push(emote);
            }
            break;
        }
      }
      return emotes;
    };
    const getPage = (): number => {
      switch (emotesWorldMenu.state.values.tab) {
        case EmotesTab.Free:
          return emotesWorldMenu.state.values.freePage;
        case EmotesTab.Subscriber:
          return emotesWorldMenu.state.values.subscriberPage;
      }
    };
    const setPage = (page: number): void => {
      switch (emotesWorldMenu.state.values.tab) {
        case EmotesTab.Free:
          emotesWorldMenu.state.setValues({
            freePage: page,
          });
          break;
        case EmotesTab.Subscriber:
          emotesWorldMenu.state.setValues({
            subscriberPage: page,
          });
          break;
      }
    };
    for (let i: number = 0; i < emotesPerPage; i++) {
      const getEmote = (): Emote | undefined => {
        const page: number = getPage();
        const order: number = i + page * emotesPerPage;
        return getEmotes().find(
          (emote: Emote): boolean => emote.order === order,
        );
      };
      hudElementReferences.push(
        createSlot({
          button: {
            onClick: (): void => {
              const worldState: State<WorldStateSchema> | null =
                getWorldState();
              const emote: Emote | undefined = getEmote();
              if (typeof emote === "undefined") {
                throw new Error("Emote is undefined.");
              }
              if (
                emote.requiresSubscription === false ||
                state.values.isSubscribed
              ) {
                emotesWorldMenu.close();
                useEmote(emote.id);
                worldState.setValues({
                  lastUsedEmoteID: emote.id,
                });
              } else {
                postWindowMessage({ event: "subscribe/emote" });
              }
            },
          },
          condition: (): boolean =>
            typeof getEmote() !== "undefined" &&
            isWorldCombatInProgress() === false,
          icons: [
            {
              imagePath: (): string => {
                const emote: Emote | undefined = getEmote();
                if (typeof emote === "undefined") {
                  throw new Error("Emote is undefined.");
                }
                return emote.backgroundImagePath;
              },
            },
            {
              condition: (): boolean => {
                const emote: Emote | undefined = getEmote();
                if (typeof emote === "undefined") {
                  throw new Error("Emote is undefined.");
                }
                return (
                  emote.hasForegroundImagePath() &&
                  isWorldCombatInProgress() === false
                );
              },
              imagePath: (): string => {
                const emote: Emote | undefined = getEmote();
                if (typeof emote === "undefined") {
                  throw new Error("Emote is undefined.");
                }
                return emote.foregroundImagePath;
              },
            },
          ],
          imagePath: "slots/basic",
          x: 184 + 24 * (i % 5),
          y: 54 + 24 * Math.floor(i / 5),
        }),
      );
    }
    const isPaginated = (): boolean => getEmotes().length > emotesPerPage;
    const getLastPage = (): number =>
      Math.max(Math.floor((getEmotes().length - 1) / emotesPerPage), 0);
    const page = (offset: number): void => {
      const pages: number[] = [];
      for (let i: number = 0; i < getLastPage() + 1; i++) {
        pages.push(i);
      }
      setPage(getCyclicIndex(pages.indexOf(getPage()) + offset, pages));
    };
    // Page left arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          isPaginated() && isWorldCombatInProgress() === false,
        height: 14,
        imagePath: "arrows/left",
        onClick: (): void => {
          page(-1);
        },
        width: 14,
        x: 190,
        y: 176,
      }),
    );
    // Page right arrow
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          isPaginated() && isWorldCombatInProgress() === false,
        height: 14,
        imagePath: "arrows/right",
        onClick: (): void => {
          page(1);
        },
        width: 14,
        x: 275,
        y: 176,
      }),
    );
    // Page number
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: (): boolean =>
            isPaginated() && isWorldCombatInProgress() === false,
          x: 296,
          y: 193,
        },
        horizontalAlignment: "right",
        text: (): CreateLabelOptionsText => ({
          value: String(getPage() + 1),
        }),
      }),
    );
    return mergeHUDElementReferences([
      {
        buttonIDs,
        labelIDs,
        spriteIDs,
      },
      ...hudElementReferences,
    ]);
  },
  initialStateValues: {
    freePage: 0,
    subscriberPage: 0,
    tab: EmotesTab.Free,
  },
  preventsWalking: false,
});
