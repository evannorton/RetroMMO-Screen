import { Stat } from "retrommo-types";

export const getStatAbbreviation = (stat: Stat): string => {
  switch (stat) {
    case Stat.Agility:
      return "AGI";
    case Stat.Defense:
      return "DEF";
    case Stat.Intelligence:
      return "INT";
    case Stat.Luck:
      return "LCK";
    case Stat.Strength:
      return "STR";
    case Stat.Wisdom:
      return "WIS";
  }
};
