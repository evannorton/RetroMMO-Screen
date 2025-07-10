import { BattleDefeatEvent, BattleEventType, BattleType } from "retrommo-types";
import { BattleStateRoundEventInstance, state } from "../state";
import { MusicTrack } from "../classes/MusicTrack";
import { Reachable } from "../classes/Reachable";
import { getDefinable } from "definables";
import { musicVolumeChannelID } from "../volumeChannels";
import { playAudioSource, stopAudioSource } from "pixel-pigeon";

const getMusicTrackID = (): string | null => {
  if (state.values.worldState !== null) {
    const reachable: Reachable = getDefinable(
      Reachable,
      state.values.worldState.values.reachableID,
    );
    return reachable.mapMusicTrackID;
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
          return "victory";
        }
        return "defeat";
      }
    }
    const reachable: Reachable = getDefinable(
      Reachable,
      state.values.battleState.values.reachableID,
    );
    switch (state.values.battleState.values.type) {
      case BattleType.Boss:
      case BattleType.Encounter:
        return reachable.pveMusicTrackID;
      case BattleType.Duel:
        return "square-up-adventurer-showdown";
    }
  }
  return null;
};

export const playMusic = (): void => {
  const musicTrackID: string | null = getMusicTrackID();
  if (state.values.musicTrackID !== musicTrackID) {
    if (state.values.musicTrackID !== null) {
      const musicTrack: MusicTrack = getDefinable(
        MusicTrack,
        state.values.musicTrackID,
      );
      stopAudioSource(musicTrack.audioPath);
    }
    if (musicTrackID !== null) {
      const musicTrack: MusicTrack = getDefinable(MusicTrack, musicTrackID);
      playAudioSource(musicTrack.audioPath, {
        loopPoint: musicTrack.hasLoopPoint() ? musicTrack.loopPoint : undefined,
        volumeChannelID: musicVolumeChannelID,
      });
    }
    state.setValues({
      musicTrackID,
    });
  }
};
