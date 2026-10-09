import { Achievement } from "../../classes/Achievement";
import { AchievementUpdate } from "retrommo-types";
import { getDefinable } from "definables";

export const loadAchievementUpdate = (
  achievementUpdate: AchievementUpdate,
): void => {
  const achievement: Achievement = getDefinable(
    Achievement,
    achievementUpdate.achievementID,
  );
  achievement.unlockedAtServerTime = achievementUpdate.unlockedAtServerTime;
};
