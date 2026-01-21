import { Bank } from "../classes/Bank";
import {
  Color,
  Constants,
  WorldBankDepositGoldRequest,
  WorldBankDepositItemRequest,
  WorldBankWithdrawGoldRequest,
  WorldBankWithdrawItemRequest,
} from "retrommo-types";
import {
  CreateLabelOptionsText,
  HUDElementReferences,
  State,
  createButton,
  createLabel,
  createSprite,
  emitToSocketioServer,
  getCurrentTime,
  getGameWidth,
  mergeHUDElementReferences,
  playAudioSource,
} from "pixel-pigeon";
import { ItemInstance } from "../classes/ItemInstance";
import { WorldMenu } from "../classes/WorldMenu";
import { WorldStateSchema, state } from "../state";
import { createIconListItem } from "../functions/ui/components/createIconListItem";
import { createImage } from "../functions/ui/components/createImage";
import { createItemDisplay } from "../functions/ui/components/createItemDisplay";
import { createPanel } from "../functions/ui/components/createPanel";
import { createPressableButton } from "../functions/ui/components/createPressableButton";
import { getConstants } from "../functions/getConstants";
import { getCyclicIndex } from "../functions/getCyclicIndex";
import { getDefinable } from "definables";
import { getFormattedInteger } from "../functions/getFormattedInteger";
import { getWorldState } from "../functions/state/getWorldState";
import { isWorldCombatInProgress } from "../functions/isWorldCombatInProgress";
import { postWindowMessage } from "../functions/postWindowMessage";
import { sfxVolumeChannelID } from "../volumeChannels";

enum BankSection {
  Gold = "gold",
  Items = "items",
}
enum BankStorageTab {
  Withdraw = "withdraw",
  Deposit = "deposit",
}
const hasFreePageWithRoom = (): boolean => {
  const constants: Constants = getConstants();
  const worldState: State<WorldStateSchema> = getWorldState();
  const storageItemsPerPage: number = constants["bank-storage-page-size"];
  for (
    let pageIndex: number = 0;
    pageIndex < constants["bank-storage-free-pages"];
    pageIndex++
  ) {
    const page: readonly string[] | undefined =
      worldState.values.bankItemInstanceIDs[pageIndex];
    if (typeof page === "undefined") {
      return true;
    }
    if (page.length < storageItemsPerPage) {
      return true;
    }
  }
  return false;
};
const hasSubscriberPageWithRoom = (): boolean => {
  const constants: Constants = getConstants();
  const worldState: State<WorldStateSchema> = getWorldState();
  for (
    let pageIndex: number = constants["bank-storage-free-pages"];
    pageIndex < worldState.values.bankItemInstanceIDs.length;
    pageIndex++
  ) {
    const page: readonly string[] | undefined =
      worldState.values.bankItemInstanceIDs[pageIndex];
    if (typeof page === "undefined") {
      return true;
    }
    if (page.length < constants["bank-storage-page-size"]) {
      return true;
    }
  }
  return false;
};

export interface BankWorldMenuOpenOptions {
  readonly bankID: string;
}
export interface BankWorldMenuStateSchema {
  storagePage: number;
  storageTab: BankStorageTab;
  section: BankSection;
  selectedDepositIndex: number | null;
  selectedWithdrawIndex: number | null;
  vaultDepositQueuedGold: number;
  vaultWithdrawQueuedGold: number;
}
export const bankWorldMenu: WorldMenu<
  BankWorldMenuOpenOptions,
  BankWorldMenuStateSchema
> = new WorldMenu<BankWorldMenuOpenOptions, BankWorldMenuStateSchema>({
  create: (): HUDElementReferences => {
    const constants: Constants = getConstants();
    const buttonIDs: string[] = [];
    const hudElementReferences: HUDElementReferences[] = [];
    const labelIDs: string[] = [];
    const spriteIDs: string[] = [];
    const worldState: State<WorldStateSchema> = getWorldState();
    const maximumBagItems: number = constants["maximum-bag-items"];
    const maximumGold: number = constants["maximum-gold"];
    const isSubscribed: boolean = state.values.isSubscribed;
    const gameWidth: number = getGameWidth();
    const condition = (): boolean => isWorldCombatInProgress() === false;
    const storageCondition = (): boolean =>
      condition() && bankWorldMenu.state.values.section === BankSection.Items;
    const vaultCondition = (): boolean =>
      condition() && bankWorldMenu.state.values.section === BankSection.Gold;
    const withdrawTabCondition = (): boolean =>
      bankWorldMenu.state.values.storageTab === BankStorageTab.Withdraw;
    const depositTabCondition = (): boolean =>
      bankWorldMenu.state.values.storageTab === BankStorageTab.Deposit;
    const hasSelectedWithdrawItemInstance = (): boolean => {
      if (bankWorldMenu.state.values.selectedWithdrawIndex === null) {
        return false;
      }
      const currentPage: readonly string[] | undefined =
        worldState.values.bankItemInstanceIDs[
          bankWorldMenu.state.values.storagePage
        ];
      if (typeof currentPage === "undefined") {
        return false;
      }
      return (
        bankWorldMenu.state.values.selectedWithdrawIndex >= 0 &&
        bankWorldMenu.state.values.selectedWithdrawIndex < currentPage.length
      );
    };
    const getSelectedWithdrawItemInstance = (): ItemInstance => {
      if (bankWorldMenu.state.values.selectedWithdrawIndex === null) {
        throw new Error("selectedWithdrawIndex is null");
      }
      const currentPage: readonly string[] | undefined =
        worldState.values.bankItemInstanceIDs[
          bankWorldMenu.state.values.storagePage
        ];
      if (typeof currentPage === "undefined") {
        throw new Error("Current page is undefined");
      }
      const itemInstanceID: string | undefined =
        currentPage[bankWorldMenu.state.values.selectedWithdrawIndex];
      if (typeof itemInstanceID === "undefined") {
        throw new Error("Selected withdraw item instance ID is undefined");
      }
      return getDefinable(ItemInstance, itemInstanceID);
    };
    const hasSelectedDepositItemInstance = (): boolean => {
      if (bankWorldMenu.state.values.selectedDepositIndex === null) {
        return false;
      }
      return (
        bankWorldMenu.state.values.selectedDepositIndex >= 0 &&
        bankWorldMenu.state.values.selectedDepositIndex <
          worldState.values.bagItemInstanceIDs.length
      );
    };
    const getSelectedDepositItemInstance = (): ItemInstance => {
      if (bankWorldMenu.state.values.selectedDepositIndex === null) {
        throw new Error("selectedDepositIndex is null");
      }
      const itemInstanceID: string | undefined =
        worldState.values.bagItemInstanceIDs[
          bankWorldMenu.state.values.selectedDepositIndex
        ];
      if (typeof itemInstanceID === "undefined") {
        throw new Error("Selected deposit item instance ID is undefined");
      }
      return getDefinable(ItemInstance, itemInstanceID);
    };
    const adjustVaultDepositQueuedGold = (amount: number): void => {
      const inventoryGold: number = worldState.values.inventoryGold;
      const bankGold: number = worldState.values.bankGold;
      let queuedGold: number =
        bankWorldMenu.state.values.vaultDepositQueuedGold + amount;
      if (queuedGold < 0) {
        queuedGold = 0;
      }
      if (queuedGold > inventoryGold) {
        queuedGold = inventoryGold;
      }
      const room: number = maximumGold - bankGold;
      if (queuedGold > room) {
        queuedGold = room;
      }
      bankWorldMenu.state.setValues({
        vaultDepositQueuedGold: queuedGold,
      });
    };
    const adjustVaultWithdrawQueuedGold = (amount: number): void => {
      const inventoryGold: number = worldState.values.inventoryGold;
      const bankGold: number = worldState.values.bankGold;
      let queuedGold: number =
        bankWorldMenu.state.values.vaultWithdrawQueuedGold + amount;
      if (queuedGold < 0) {
        queuedGold = 0;
      }
      if (queuedGold > bankGold) {
        queuedGold = bankGold;
      }
      const room: number = maximumGold - inventoryGold;
      if (queuedGold > room) {
        queuedGold = room;
      }
      bankWorldMenu.state.setValues({
        vaultWithdrawQueuedGold: queuedGold,
      });
    };
    // Section toggle panel
    hudElementReferences.push(
      createPanel({
        condition,
        height: 24,
        imagePath: "panels/basic",
        width: 80,
        x: 176,
        y: 0,
      }),
    );
    // Section toggle button image
    hudElementReferences.push(
      createImage({
        condition,
        height: 12,
        imagePath: "bank-section-toggle",
        onClick: (): void => {
          const nextSection: BankSection =
            bankWorldMenu.state.values.section === BankSection.Gold
              ? BankSection.Items
              : BankSection.Gold;
          bankWorldMenu.state.setValues({
            section: nextSection,
            selectedDepositIndex: null,
            selectedWithdrawIndex: null,
          });
        },
        width: 68,
        x: 182,
        y: 6,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition,
          x: 216,
          y: 8,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value:
            bankWorldMenu.state.values.section === BankSection.Gold
              ? "Storage"
              : "Vault",
        }),
      }),
    );
    // Vault withdraw panel
    hudElementReferences.push(
      createPanel({
        condition: vaultCondition,
        height: 184,
        imagePath: "panels/basic",
        width: 128,
        x: 16,
        y: 24,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: vaultCondition,
          x: 80,
          y: 32,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: { value: "Bank:" },
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: vaultCondition,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          bankWorldMenu.close();
        },
        width: 10,
        x: 127,
        y: 31,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: vaultCondition,
          x: 80,
          y: 43,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: `${getFormattedInteger(worldState.values.bankGold)}g`,
        }),
      }),
    );
    [1, 10, 100, 1000, 10000, 100000].forEach(
      (increment: number, key: number): void => {
        hudElementReferences.push(
          createImage({
            condition: vaultCondition,
            height: 10,
            imagePath: "minus",
            onClick: (): void => {
              adjustVaultWithdrawQueuedGold(increment * -1);
            },
            width: 10,
            x: 34,
            y: 68 + key * 18,
          }),
        );
        labelIDs.push(
          createLabel({
            color: Color.White,
            coordinates: {
              condition: vaultCondition,
              x: 102,
              y: 72 + key * 18,
            },
            horizontalAlignment: "right",
            maxLines: 1,
            maxWidth: gameWidth,
            size: 1,
            text: (): CreateLabelOptionsText => ({
              value: getFormattedInteger(increment),
            }),
          }),
        );
        hudElementReferences.push(
          createImage({
            condition: vaultCondition,
            height: 10,
            imagePath: "plus",
            onClick: (): void => {
              adjustVaultWithdrawQueuedGold(increment);
            },
            width: 10,
            x: 116,
            y: 68 + key * 18,
          }),
        );
      },
    );
    hudElementReferences.push(
      createPressableButton({
        condition: vaultCondition,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          const amount: number =
            bankWorldMenu.state.values.vaultWithdrawQueuedGold;
          if (amount > 0) {
            emitToSocketioServer<WorldBankWithdrawGoldRequest>({
              data: {
                amount,
              },
              event: "world/bank/withdraw-gold",
            });
          }
        },
        text: (): CreateLabelOptionsText => ({
          value: `Withdraw ${getFormattedInteger(
            bankWorldMenu.state.values.vaultWithdrawQueuedGold,
          )}g`,
        }),
        width: 114,
        x: 23,
        y: 185,
      }),
    );
    // Vault deposit panel
    hudElementReferences.push(
      createPanel({
        condition: vaultCondition,
        height: 184,
        imagePath: "panels/basic",
        width: 128,
        x: 160,
        y: 24,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: vaultCondition,
          x: 224,
          y: 32,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: { value: "On hand:" },
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: vaultCondition,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          bankWorldMenu.close();
        },
        width: 10,
        x: 271,
        y: 31,
      }),
    );
    labelIDs.push(
      createLabel({
        color: Color.White,
        coordinates: {
          condition: vaultCondition,
          x: 224,
          y: 43,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: `${getFormattedInteger(worldState.values.inventoryGold)}g`,
        }),
      }),
    );
    [1, 10, 100, 1000, 10000, 100000].forEach(
      (increment: number, key: number): void => {
        hudElementReferences.push(
          createImage({
            condition: vaultCondition,
            height: 10,
            imagePath: "minus",
            onClick: (): void => {
              adjustVaultDepositQueuedGold(increment * -1);
            },
            width: 10,
            x: 178,
            y: 68 + key * 18,
          }),
        );
        labelIDs.push(
          createLabel({
            color: Color.White,
            coordinates: {
              condition: vaultCondition,
              x: 246,
              y: 72 + key * 18,
            },
            horizontalAlignment: "right",
            maxLines: 1,
            maxWidth: gameWidth,
            size: 1,
            text: (): CreateLabelOptionsText => ({
              value: getFormattedInteger(increment),
            }),
          }),
        );
        hudElementReferences.push(
          createImage({
            condition: vaultCondition,
            height: 10,
            imagePath: "plus",
            onClick: (): void => {
              adjustVaultDepositQueuedGold(increment);
            },
            width: 10,
            x: 260,
            y: 68 + key * 18,
          }),
        );
      },
    );
    hudElementReferences.push(
      createPressableButton({
        condition: vaultCondition,
        height: 16,
        imagePath: "pressable-buttons/gray",
        onClick: (): void => {
          const amount: number =
            bankWorldMenu.state.values.vaultDepositQueuedGold;
          if (amount > 0) {
            emitToSocketioServer<WorldBankDepositGoldRequest>({
              data: {
                amount,
              },
              event: "world/bank/deposit-gold",
            });
          }
        },
        text: (): CreateLabelOptionsText => ({
          value: `Deposit ${getFormattedInteger(
            bankWorldMenu.state.values.vaultDepositQueuedGold,
          )}g`,
        }),
        width: 114,
        x: 167,
        y: 185,
      }),
    );
    // Storage background panel
    hudElementReferences.push(
      createPanel({
        condition: storageCondition,
        height: 184,
        imagePath: "panels/basic",
        width: 128,
        x: 176,
        y: 24,
      }),
    );
    // Storage gold label
    labelIDs.push(
      createLabel({
        color: Color.LightYellow,
        coordinates: {
          condition: storageCondition,
          x: 240,
          y: 193,
        },
        horizontalAlignment: "center",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: `${getFormattedInteger(worldState.values.inventoryGold)}g`,
        }),
      }),
    );
    // Storage tabs
    spriteIDs.push(
      createSprite({
        animationID: (): string => {
          switch (bankWorldMenu.state.values.storageTab) {
            case BankStorageTab.Withdraw:
              return "1";
            case BankStorageTab.Deposit:
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
          condition: storageCondition,
          x: 178,
          y: 26,
        },
        imagePath: "tabs/2",
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: storageCondition,
        height: 16,
        imagePath: "tab-icons/bank/items",
        width: 16,
        x: 197,
        y: 29,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: storageCondition,
        height: 16,
        imagePath: "tab-icons/bank/gold",
        width: 16,
        x: 250,
        y: 29,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean => storageCondition() && depositTabCondition(),
          x: 179,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          bankWorldMenu.state.setValues({
            selectedDepositIndex: null,
            selectedWithdrawIndex: null,
            storageTab: BankStorageTab.Withdraw,
          });
        },
        width: 52,
      }),
    );
    buttonIDs.push(
      createButton({
        coordinates: {
          condition: (): boolean =>
            storageCondition() && withdrawTabCondition(),
          x: 232,
          y: 27,
        },
        height: 20,
        onClick: (): void => {
          bankWorldMenu.state.setValues({
            selectedDepositIndex: null,
            selectedWithdrawIndex: null,
            storageTab: BankStorageTab.Deposit,
          });
        },
        width: 51,
      }),
    );
    // Storage close button
    hudElementReferences.push(
      createImage({
        condition: storageCondition,
        height: 11,
        imagePath: "x",
        onClick: (): void => {
          bankWorldMenu.close();
        },
        width: 10,
        x: 287,
        y: 31,
      }),
    );
    // Withdraw items list
    for (let i: number = 0; i < constants["bank-storage-page-size"]; i++) {
      const yOffset: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean => {
            if (
              storageCondition() === false ||
              withdrawTabCondition() === false
            ) {
              return false;
            }
            const currentPage: readonly string[] | undefined =
              worldState.values.bankItemInstanceIDs[
                bankWorldMenu.state.values.storagePage
              ];
            if (typeof currentPage === "undefined") {
              return false;
            }
            return i < currentPage.length;
          },
          icons: [
            {
              imagePath: (): string => {
                const currentPage: readonly string[] | undefined =
                  worldState.values.bankItemInstanceIDs[
                    bankWorldMenu.state.values.storagePage
                  ];
                if (typeof currentPage === "undefined") {
                  throw new Error("Current page is undefined");
                }
                const itemInstanceID: string | undefined = currentPage[i];
                if (typeof itemInstanceID === "undefined") {
                  throw new Error("Bank item instance ID is undefined");
                }
                return getDefinable(ItemInstance, itemInstanceID).item
                  .iconImagePath;
              },
            },
          ],
          isSelected: (): boolean =>
            bankWorldMenu.state.values.selectedWithdrawIndex === i,
          onClick: (): void => {
            bankWorldMenu.state.setValues({
              selectedDepositIndex: null,
              selectedWithdrawIndex:
                bankWorldMenu.state.values.selectedWithdrawIndex === i
                  ? null
                  : i,
            });
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => {
            const currentPage: readonly string[] | undefined =
              worldState.values.bankItemInstanceIDs[
                bankWorldMenu.state.values.storagePage
              ];
            if (typeof currentPage === "undefined") {
              throw new Error("Current page is undefined");
            }
            const itemInstanceID: string | undefined = currentPage[i];
            if (typeof itemInstanceID === "undefined") {
              throw new Error("Bank item instance ID is undefined");
            }
            return {
              value: getDefinable(ItemInstance, itemInstanceID).item.name,
            };
          },
          width: 116,
          x: 182,
          y: yOffset,
        }),
      );
    }
    // Deposit items list
    for (let i: number = 0; i < maximumBagItems; i++) {
      const yOffset: number = 49 + i * 18;
      hudElementReferences.push(
        createIconListItem({
          condition: (): boolean =>
            storageCondition() &&
            depositTabCondition() &&
            i < worldState.values.bagItemInstanceIDs.length,
          icons: [
            {
              imagePath: (): string => {
                const itemInstanceID: string | undefined =
                  worldState.values.bagItemInstanceIDs[i];
                if (typeof itemInstanceID === "undefined") {
                  throw new Error("Bag item instance ID is undefined");
                }
                return getDefinable(ItemInstance, itemInstanceID).item
                  .iconImagePath;
              },
            },
          ],
          isSelected: (): boolean =>
            bankWorldMenu.state.values.selectedDepositIndex === i,
          onClick: (): void => {
            bankWorldMenu.state.setValues({
              selectedDepositIndex:
                bankWorldMenu.state.values.selectedDepositIndex === i
                  ? null
                  : i,
              selectedWithdrawIndex: null,
            });
          },
          slotImagePath: "slots/basic",
          text: (): CreateLabelOptionsText => {
            const itemInstanceID: string | undefined =
              worldState.values.bagItemInstanceIDs[i];
            if (typeof itemInstanceID === "undefined") {
              throw new Error("Bag item instance ID is undefined");
            }
            return {
              value: getDefinable(ItemInstance, itemInstanceID).item.name,
            };
          },
          width: 116,
          x: 182,
          y: yOffset,
        }),
      );
    }
    // Withdraw selected item display
    hudElementReferences.push(
      createItemDisplay({
        buttons: [
          {
            condition: (): boolean => {
              if (hasSelectedWithdrawItemInstance()) {
                return (
                  worldState.values.bagItemInstanceIDs.length < maximumBagItems
                );
              }
              return false;
            },
            onClick: (): void => {
              emitToSocketioServer<WorldBankWithdrawItemRequest>({
                data: {
                  itemInstanceID: getSelectedWithdrawItemInstance().id,
                },
                event: "world/bank/withdraw-item",
              });
              bankWorldMenu.state.setValues({
                selectedWithdrawIndex: null,
              });
            },
            text: "Withdraw",
            width: 54,
            x: 115,
          },
        ],
        condition: (): boolean =>
          storageCondition() &&
          withdrawTabCondition() &&
          hasSelectedWithdrawItemInstance(),
        itemID: (): string => getSelectedWithdrawItemInstance().itemID,
        onClose: (): void => {
          bankWorldMenu.state.setValues({
            selectedWithdrawIndex: null,
          });
        },
      }),
    );
    // Deposit selected item display
    hudElementReferences.push(
      createItemDisplay({
        buttons: [
          {
            condition: (): boolean =>
              hasSelectedDepositItemInstance() &&
              (hasFreePageWithRoom() || hasSubscriberPageWithRoom()),
            onClick: (): void => {
              const currentPageIsSubscriberOnly: boolean =
                bankWorldMenu.state.values.storagePage >=
                constants["bank-storage-free-pages"];
              const needsSubscription: boolean =
                isSubscribed === false &&
                (currentPageIsSubscriberOnly ||
                  hasFreePageWithRoom() === false);
              if (needsSubscription) {
                postWindowMessage({ event: "subscribe/item-storage" });
              } else {
                emitToSocketioServer<WorldBankDepositItemRequest>({
                  data: {
                    itemInstanceID: getSelectedDepositItemInstance().id,
                    page: bankWorldMenu.state.values.storagePage,
                  },
                  event: "world/bank/deposit-item",
                });
                bankWorldMenu.state.setValues({
                  selectedDepositIndex: null,
                });
              }
            },
            text: "Deposit",
            width: 50,
            x: 117,
          },
        ],
        condition: (): boolean =>
          storageCondition() &&
          depositTabCondition() &&
          hasSelectedDepositItemInstance(),
        itemID: (): string => getSelectedDepositItemInstance().itemID,
        onClose: (): void => {
          bankWorldMenu.state.setValues({
            selectedDepositIndex: null,
          });
        },
      }),
    );
    const setPage = (page: number): void => {
      bankWorldMenu.state.setValues({
        selectedWithdrawIndex: null,
        storagePage: page,
      });
    };
    const getLastPage = (): number =>
      Math.max(worldState.values.bankItemInstanceIDs.length - 1, 0);
    const isPaginated = (): boolean =>
      worldState.values.bankItemInstanceIDs.length > 1;
    const page = (offset: number): void => {
      const pages: number[] = [];
      for (let i: number = 0; i < getLastPage() + 1; i++) {
        pages.push(i);
      }
      setPage(
        getCyclicIndex(
          pages.indexOf(bankWorldMenu.state.values.storagePage) + offset,
          pages,
        ),
      );
    };
    // Page arrows and label
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          storageCondition() && withdrawTabCondition() && isPaginated(),
        height: 14,
        imagePath: "arrows/left-double",
        onClick: (): void => {
          page(-10);
        },
        width: 16,
        x: 183,
        y: 176,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          storageCondition() && withdrawTabCondition() && isPaginated(),
        height: 14,
        imagePath: "arrows/left-short",
        onClick: (): void => {
          page(-1);
        },
        width: 11,
        x: 202,
        y: 176,
      }),
    );
    labelIDs.push(
      createLabel({
        color:
          isSubscribed ||
          bankWorldMenu.state.values.storagePage <
            constants["bank-storage-free-pages"]
            ? Color.White
            : Color.BrightRed,
        coordinates: {
          condition: (): boolean =>
            storageCondition() && withdrawTabCondition() && isPaginated(),
          x: 296,
          y: 193,
        },
        horizontalAlignment: "right",
        maxLines: 1,
        maxWidth: gameWidth,
        size: 1,
        text: (): CreateLabelOptionsText => ({
          value: String(bankWorldMenu.state.values.storagePage + 1),
        }),
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          storageCondition() && withdrawTabCondition() && isPaginated(),
        height: 14,
        imagePath: "arrows/right-short",
        onClick: (): void => {
          page(1);
        },
        width: 11,
        x: 267,
        y: 176,
      }),
    );
    hudElementReferences.push(
      createImage({
        condition: (): boolean =>
          storageCondition() && withdrawTabCondition() && isPaginated(),
        height: 14,
        imagePath: "arrows/right-double",
        onClick: (): void => {
          page(10);
        },
        width: 16,
        x: 281,
        y: 176,
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
    section: BankSection.Gold,
    selectedDepositIndex: null,
    selectedWithdrawIndex: null,
    storagePage: 0,
    storageTab: BankStorageTab.Withdraw,
    vaultDepositQueuedGold: 0,
    vaultWithdrawQueuedGold: 0,
  },
  onClose: (openOptions?: BankWorldMenuOpenOptions): void => {
    if (typeof openOptions === "undefined") {
      throw new Error("No open options");
    }
    const bank: Bank = getDefinable(Bank, openOptions.bankID);
    bank.isOpen = false;
    bank.toggledAt = getCurrentTime();
    playAudioSource("sfx/close-chest", {
      volumeChannelID: sfxVolumeChannelID,
    });
  },
  preventsWalking: true,
});
