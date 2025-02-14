import { childLogger, Logger } from "@foxxmd/logging";
import { SimpleIntervalJob, Task, ToadScheduler } from "toad-scheduler";

const RT_TICK = 500;

export abstract class RealtimePlayer {

    //logger: Logger;
    scheduler: ToadScheduler = new ToadScheduler();

    protected position: number = 0;

    protected constructor(/* logger: Logger */) {
        //this.logger = childLogger(logger, `RT`);
        const job = new SimpleIntervalJob({
            milliseconds: RT_TICK,
            runImmediately: true
        }, new Task('updatePos', () => this.position += RT_TICK), { id: 'rt' });
        this.scheduler.addSimpleIntervalJob(job);
        this.scheduler.stop();
        this.position = 0;
    }

    public play(position?: number) {
        if (position !== undefined) {
            this.position = position;
        }
        this.scheduler.startById('rt');
    }

    public pause() {
        this.scheduler.stop();
    }

    public stop() {
        this.pause();
        this.position = 0;
    }

    public seek(position: number) {
        this.position = position;
    }

    public getPosition(asSeconds: boolean = false) {
        return !asSeconds ? this.position : this.position / 1000;
    }

    public setPosition(time: number) {
        this.position = time;
    }
}

export class GenericRealtimePlayer extends RealtimePlayer {
    constructor(/* logger: Logger */) {
        super();
    }
}