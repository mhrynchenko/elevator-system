import type { Passenger } from './Passenger';
import {
    ElevatorCarCallback,
    ElevatorState,
    Direction,
} from './types';

export class Elevator {
    private id: number;
    private loopId: NodeJS.Timer;
    private currentFloor: number;
    private state: ElevatorState = ElevatorState.IDLE;
    private passangers: Array<Passenger> = [];
    private schedule: number[] = [];
    
    constructor (
        id: number,
        currentFloor = 0,
        speed = 100,
        handleWaitingRequests: () => void,
        cb?: ElevatorCarCallback,
    ) {
        this.id = id;
        this.currentFloor = currentFloor;
        this.state = ElevatorState.IDLE;

        this.loopId = setInterval(() => {
            if (this.schedule.length > 0) {
                this.move();

                if (this.schedule.length === 0) {
                    this.stop(handleWaitingRequests);
                }

                cb && cb({
                    id,
                    floor: this.currentFloor,
                    passangers: this.passangers
                });
            }
        }, speed);
    }

    get elevatorId(): number {
        return this.id;
    }

    get elevatorCurrentFloor(): number {
        return this.currentFloor;
    }

    get elevatorState(): ElevatorState {
        return this.state;
    }

    get elevatorSchedule(): number[] {
        return this.schedule;
    }

    addStop({ currentFloor, targetFloor, direction }: Passenger): void {
        this.schedule.push(currentFloor, targetFloor);
        this.schedule = direction === Direction.UP ? 
            this.schedule.sort((a, b) => a - b) :
            this.schedule.sort((a, b) => b - a);        
    }

    terminate(): void {
        clearInterval(this.loopId);
    }

    private move(): void {
        const nextStop = this.schedule[0];
        const isMovingDown = this.currentFloor - this.schedule[0] > 0;

        this.state = isMovingDown ? ElevatorState.DOWN : ElevatorState.UP;

        if (this.elevatorCurrentFloor === nextStop) {
            this.schedule.shift();
        } else {
            if (this.state === ElevatorState.UP) { 
                this.currentFloor++;
            } else {
                this.currentFloor--;
            }
        }
    }

    private stop(handleWaitingRequests: () => void): void {
        this.state = ElevatorState.IDLE;
        handleWaitingRequests();
    }
};
