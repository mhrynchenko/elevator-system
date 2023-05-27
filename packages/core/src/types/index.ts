import type { Passenger } from '../Passenger';

export enum Direction {
    UP = 'UP',
    DOWN = 'DOWN',
}

export enum ElevatorState {
    UP = 'UP',
    DOWN = 'DOWN',
    IDLE = 'IDLE',
}

export type CarState = {
    id: number;
    floor: number;
    passangers: Array<Passenger>;
};

export type ElevatorCarCallback = (carState: CarState) => void;

export type ElevatorCarParams = {
    floor: number,
    capacity?: number,
    cb?: ElevatorCarCallback,
    speed?: number,
};