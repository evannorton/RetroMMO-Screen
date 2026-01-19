import { State, listenToSocketioEvent } from "pixel-pigeon";
import {
  WorldBankDepositGoldUpdate,
  WorldBankDepositItemUpdate,
  WorldBankWithdrawGoldUpdate,
  WorldBankWithdrawItemUpdate,
} from "retrommo-types";
import { WorldStateSchema } from "../../../state";
import { bankWorldMenu } from "../../../world-menus/bankWorldMenu";
import { getWorldState } from "../../state/getWorldState";

export const listenForWorldBankUpdates = (): void => {
  listenToSocketioEvent<WorldBankDepositGoldUpdate>({
    event: "world/bank/deposit-gold",
    onMessage: (update: WorldBankDepositGoldUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      worldState.setValues({
        bankGold: worldState.values.bankGold + update.amount,
        inventoryGold: worldState.values.inventoryGold - update.amount,
      });
      if (bankWorldMenu.isOpen()) {
        bankWorldMenu.state.setValues({
          vaultDepositQueuedGold: 0,
        });
      }
    },
  });
  listenToSocketioEvent<WorldBankDepositItemUpdate>({
    event: "world/bank/deposit-item",
    onMessage: (update: WorldBankDepositItemUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const bankItemInstanceIDs: (readonly string[])[] = [
        ...worldState.values.bankItemInstanceIDs,
      ];
      const depositPageIndex: number = update.page;
      while (bankItemInstanceIDs.length <= depositPageIndex) {
        bankItemInstanceIDs.push([]);
      }
      const depositPage: string[] = [
        ...(bankItemInstanceIDs[depositPageIndex] as readonly string[]),
      ];
      depositPage.push(update.itemInstanceID);
      bankItemInstanceIDs[depositPageIndex] = depositPage;
      worldState.setValues({
        bagItemInstanceIDs: worldState.values.bagItemInstanceIDs.filter(
          (bagItemInstanceID: string): boolean =>
            bagItemInstanceID !== update.itemInstanceID,
        ),
        bankItemInstanceIDs,
      });
    },
  });
  listenToSocketioEvent<WorldBankWithdrawGoldUpdate>({
    event: "world/bank/withdraw-gold",
    onMessage: (update: WorldBankWithdrawGoldUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      worldState.setValues({
        bankGold: worldState.values.bankGold - update.amount,
        inventoryGold: worldState.values.inventoryGold + update.amount,
      });
      if (bankWorldMenu.isOpen()) {
        bankWorldMenu.state.setValues({
          vaultWithdrawQueuedGold: 0,
        });
      }
    },
  });
  listenToSocketioEvent<WorldBankWithdrawItemUpdate>({
    event: "world/bank/withdraw-item",
    onMessage: (update: WorldBankWithdrawItemUpdate): void => {
      const worldState: State<WorldStateSchema> = getWorldState();
      const bankItemInstanceIDs: (readonly string[])[] = [
        ...worldState.values.bankItemInstanceIDs,
      ];
      let foundPageIndex: number = -1;
      let foundItemIndex: number = -1;
      for (let i: number = 0; i < bankItemInstanceIDs.length; i++) {
        const bankPage: readonly string[] | undefined = bankItemInstanceIDs[i];
        if (typeof bankPage === "undefined") {
          throw new Error("Bank page not found");
        }
        const itemIndex: number = bankPage.findIndex(
          (bankItemInstanceID: string): boolean =>
            bankItemInstanceID === update.itemInstanceID,
        );
        if (itemIndex !== -1) {
          foundPageIndex = i;
          foundItemIndex = itemIndex;
          break;
        }
      }
      if (foundPageIndex === -1 || foundItemIndex === -1) {
        throw new Error("Bank item instance not found");
      }
      const foundPage: string[] = [
        ...(bankItemInstanceIDs[foundPageIndex] as readonly string[]),
      ];
      foundItemIndex = foundPage.findIndex(
        (bankItemInstanceID: string): boolean =>
          bankItemInstanceID === update.itemInstanceID,
      );
      if (foundItemIndex === -1) {
        throw new Error("Item instance not found in page");
      }
      foundPage.splice(foundItemIndex, 1);
      bankItemInstanceIDs[foundPageIndex] = foundPage;
      worldState.setValues({
        bagItemInstanceIDs: [
          ...worldState.values.bagItemInstanceIDs,
          update.itemInstanceID,
        ],
        bankItemInstanceIDs,
      });
    },
  });
};
