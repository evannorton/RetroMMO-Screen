import { Stat } from "retrommo-types";

export const getStatName = (stat: Stat): string => {
  switch (stat) {
    case Stat.Agility:
      return "Agility";
    case Stat.Defense:
      return "Defense";
    case Stat.Intelligence:
      return "Intelligence";
    case Stat.Luck:
      return "Luck";
    case Stat.Strength:
      return "Strength";
    case Stat.Wisdom:
      return "Wisdom";
  }
};
