import { GenericPlayerState } from "./GenericPlayerState.js";
import {Logger} from "@foxxmd/logging";
import { PlayPlatformId, ReportedPlayerStatus } from "../../common/infrastructure/Atomic.js";
import { PlayerStateOptions } from "./AbstractPlayerState.js";
import { PlayObject } from "../../../core/Atomic.js";

export class JellyfinPlayerState extends GenericPlayerState {
    constructor(logger: Logger, platformId: PlayPlatformId, opts?: PlayerStateOptions) {
        super(logger, platformId, opts);
    }

    setState(status?: ReportedPlayerStatus, play?: PlayObject) {
        let stat: ReportedPlayerStatus = status;
        if(status === undefined && play.meta?.event === 'PlaybackProgress') {
            stat = 'playing';
        }
        return super.setState(stat, play);
    }
}
