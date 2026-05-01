import { InviteType } from "retrommo-types";
import { MarkerType } from "../types/MarkerType";

export const getInviteMarkerType = (inviteType: InviteType): MarkerType => {
  switch (inviteType) {
    case InviteType.Duel:
      return MarkerType.Duel;
    case InviteType.Party:
      return MarkerType.Party;
    case InviteType.Trade:
      return MarkerType.Trade;
  }
};
