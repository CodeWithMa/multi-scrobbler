import MemorySource from "./MemorySource.js";
import { FormatPlayObjectOptions, InternalConfig } from "../common/infrastructure/Atomic.js";
import {EventEmitter} from "events";
import { RecentlyPlayedOptions } from "./AbstractSource.js";
import { KodiSourceConfig } from "../common/infrastructure/config/source/kodi.js";
import { KodiApiClient } from "../common/vendor/KodiApiClient.js";
import { PlayObject } from "../../core/Atomic.js";

export class KodiSource extends MemorySource {
    declare config: KodiSourceConfig;

    client: KodiApiClient;
    clientReady: boolean = false;

    constructor(name: any, config: KodiSourceConfig, internal: InternalConfig, emitter: EventEmitter) {
        const {
            data,
        } = config;
        const {
            ...rest
        } = data || {};
        super('kodi', name, {...config, data: {...rest}}, internal, emitter);

        this.requiresAuth = true;
        this.canPoll = true;
        this.multiPlatform = true;
    }

    initialize = async () => {
        const {
            data: {
                url
            } = {}
        } = this.config;
        this.client = new KodiApiClient(this.name, this.config.data);
        this.logger.debug(`Config URL: '${url ?? '(None Given)'}' => Normalized: '${this.client.url.toString()}'`)
        this.initialized = true;
        return true;

        /*const connected = await this.client.testConnection();
        if(connected) {
            //this.logger.info('Connection OK');
            this.initialized = true;
            return true;
        } else {
            this.logger.error(`Could not connect.`);
            this.initialized = false;
            return false;
        }*/
    }

    doAuthentication = async () => {
        const resp = await this.client.testAuth();
        this.clientReady = resp;
        return resp;
    }

    static formatPlayObj(obj: any, options: FormatPlayObjectOptions = {}): PlayObject {
        return KodiApiClient.formatPlayObj(obj, options);
    }

    getRecentlyPlayed = async (options: RecentlyPlayedOptions = {}) => {
        if (!this.clientReady) {
            this.logger.warn('Cannot actively poll since client is not connected.');
            return [];
        }

        let play = await this.client.getRecentlyPlayed(options);

        return this.processRecentPlays(play);
    }

}
