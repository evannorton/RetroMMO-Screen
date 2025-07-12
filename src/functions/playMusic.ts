import { BattleDefeatEvent, BattleEventType, BattleType } from "retrommo-types";
import { BattleStateRoundEventInstance, state } from "../state";
import { MusicTrack } from "../classes/MusicTrack";
import { Reachable } from "../classes/Reachable";
import { getDefinable } from "definables";
import { musicVolumeChannelID } from "../volumeChannels";
import { playAudioSource, stopAudioSource } from "pixel-pigeon";

interface MusicPlayData {
  musicTrackID: string;
  resumePoint: number;
}
const getMusicPlayData = (): MusicPlayData | null => {
  if (state.values.worldState !== null) {
    const reachable: Reachable = getDefinable(
      Reachable,
      state.values.worldState.values.reachableID,
    );
    const resumePoint: number =
      state.values.mapMusicPause !== null &&
      state.values.mapMusicPause.musicTrackID === reachable.mapMusicTrackID
        ? state.values.mapMusicPause.resumePoint
        : 0;
    return {
      musicTrackID: reachable.mapMusicTrackID,
      resumePoint,
    };
  }
  if (state.values.battleState !== null) {
    if (
      state.values.serverTime !== null &&
      state.values.battleState.values.round !== null
    ) {
      const elapsedServerTime: number =
        state.values.serverTime -
        state.values.battleState.values.round.serverTime;
      const eventInstance: BattleStateRoundEventInstance | undefined =
        state.values.battleState.values.round.eventInstances.find(
          (battleEventInstance: BattleStateRoundEventInstance): boolean =>
            elapsedServerTime >= battleEventInstance.event.startedAt &&
            battleEventInstance.isProcessed === false,
        );
      if (
        typeof eventInstance !== "undefined" &&
        eventInstance.event.type === BattleEventType.Defeat
      ) {
        const defeatEvent: BattleDefeatEvent =
          eventInstance.event as BattleDefeatEvent;
        if (
          defeatEvent.winningTeamIndex ===
          state.values.battleState.values.teamIndex
        ) {
          return {
            musicTrackID: "victory",
            resumePoint: 0,
          };
        }
        return {
          musicTrackID: "defeat",
          resumePoint: 0,
        };
      }
    }
    const reachable: Reachable = getDefinable(
      Reachable,
      state.values.battleState.values.reachableID,
    );
    switch (state.values.battleState.values.type) {
      case BattleType.Boss:
      case BattleType.Encounter:
        return {
          musicTrackID: reachable.pveMusicTrackID,
          resumePoint: 0,
        };
      case BattleType.Duel:
        return {
          musicTrackID: "square-up-adventurer-showdown",
          resumePoint: 0,
        };
    }
  }
  return null;
};

export const playMusic = (): void => {
  const musicPlayData: MusicPlayData | null = getMusicPlayData();
  if (state.values.musicTrackID !== musicPlayData?.musicTrackID) {
    if (state.values.musicTrackID !== null) {
      const musicTrack: MusicTrack = getDefinable(
        MusicTrack,
        state.values.musicTrackID,
      );
      stopAudioSource(musicTrack.audioPath);
    }
    if (musicPlayData !== null) {
      const musicTrack: MusicTrack = getDefinable(
        MusicTrack,
        musicPlayData.musicTrackID,
      );
      playAudioSource(musicTrack.audioPath, {
        loopPoint: musicTrack.hasLoopPoint() ? musicTrack.loopPoint : undefined,
        startPoint: musicPlayData.resumePoint,
        volumeChannelID: musicVolumeChannelID,
      });
    }
    state.setValues({
      musicTrackID: musicPlayData !== null ? musicPlayData.musicTrackID : null,
    });
  }
};
