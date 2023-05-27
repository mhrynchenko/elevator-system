import type { Passenger } from './Passenger';
import { ElevatorCarParams, ElevatorState, Direction } from './types';
import { Elevator } from './Elevator';

export class ElevatorSystem {
    private maxFloor: number;
    private elevators: Array<Elevator> = [];
    private requests: Array<Passenger> = [];
    
    constructor(maxFloor = 20) {
        this.maxFloor = maxFloor;
    }

    get elevatorsList(): ReadonlyArray<Elevator> {
        return this.elevators;
    }

    addElevatorCar({ floor, speed, cb }: ElevatorCarParams): void {
        const newElevatorCar = new Elevator(
            this.elevators.length + 1,
            floor,
            speed,
            this.scheduleRequests.bind(this),
            cb
        );

        this.elevators.push(newElevatorCar);
    }

    removeElevatorCar(id: number): void {
        const index = this.elevators.findIndex(({ elevatorId }) => elevatorId === id);

        if (index !== -1) {
            this.elevators.splice(index, 1);
        }
    }

    removeAllElevatorCars(): void {
        this.elevators.forEach(elevatorCar => elevatorCar.terminate());
        this.elevators = [];
    }

    callElevator(passanger: Passenger): void {        
        this.requests.push(passanger);
        this.scheduleRequests();
    }

    private scheduleRequests(): void {
        const unhandledRequests: Array<Passenger> = [];

        while (this.requests.length > 0) {
            const nextRequest = this.requests.shift();

            if (!nextRequest) {
                break;
            }

            const { currentFloor, direction } = nextRequest;

            let selectedElevatorCar: Elevator | null = null;
            let elevators = this.getMovingSameDirectionElevatorCars(direction, currentFloor);

            if (elevators.length === 0) {
                elevators = this.getIdleElevatorCars();
            }

            if (elevators.length === 0) {
                unhandledRequests.push(nextRequest);
            } else {
                selectedElevatorCar = this.getClosestElevatorCar(
                    elevators,
                    currentFloor,
                );
            }

            if (selectedElevatorCar) {
                selectedElevatorCar.addStop(nextRequest);
            }
        }

        if (unhandledRequests.length > 0) {
            this.requests.push(...unhandledRequests);
        }
    }

    private getIdleElevatorCars(): Array<Elevator> {
        return this.elevators.filter(
            ({ elevatorState }) => elevatorState === ElevatorState.IDLE
        );
    }

    private getMovingSameDirectionElevatorCars(
        direction: Direction,
        currentFloor: number
    ): Array<Elevator> {
        return this.elevators.filter(
            ({ elevatorCurrentFloor, elevatorState }) => {
                const isCarBeforeTargetFloor = direction === Direction.DOWN ? 
                    elevatorCurrentFloor > currentFloor : 
                    elevatorCurrentFloor < currentFloor;
                
                if (
                    elevatorState.toString() === direction.toString() &&
                    isCarBeforeTargetFloor
                ) {
                    return true;
                }

                return false;
            }
        );
    }

    private getClosestElevatorCar(
        elevators: Array<Elevator>,
        currentFloor: number,
    ): Elevator {
        if (elevators.length === 1) {
            return elevators[0];
        }

        let closestElemevatorPath = Infinity;
        let closestElevator = elevators[0];

        elevators.forEach(elevator => {
            const min = currentFloor > elevator.elevatorCurrentFloor ? 
                currentFloor - elevator.elevatorCurrentFloor : 
                elevator.elevatorCurrentFloor - currentFloor;

            if (min < closestElemevatorPath) {
                closestElemevatorPath = min;
                closestElevator = elevator;
            }
        });

        return closestElevator;
    }
};
