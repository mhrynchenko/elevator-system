import { Direction } from './types';

export class Passenger {
    private floorStart: number;
    private floorEnd: number;

    constructor(
        floorStart: number,
        floorEnd: number,
    ) {
        this.floorStart = floorStart;
        this.floorEnd = floorEnd;
    }

    get direction(): Direction {
        if (this.floorStart < this.floorEnd) 
            return Direction.UP;
        
        return Direction.DOWN;
    }

    get targetFloor(): number {
        return this.floorEnd;
    }

    get currentFloor(): number {
        return this.floorStart;
    }
}
