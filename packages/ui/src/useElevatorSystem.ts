import { useReducer, useState, useEffect, useCallback } from 'react';
import { ElevatorSystem, Passenger } from '@elevator-dispatcher/core';
import { initialState, reducer, Actions } from './store/index';
import { getRndInteger, getDefaultVariableAsInt } from './utils';

const DEFAULT_FLOOR = getDefaultVariableAsInt(process.env.REACT_APP_FLOOR);
const DEFAULT_SPEED = getDefaultVariableAsInt(process.env.REACT_APP_SPEED);
const DEFAULT_EXECUTION_TIME = getDefaultVariableAsInt(process.env.REACT_APP_EXECUTION_TIME);

export const useElevatorSystem = () => {
    const [isRandomMode, setIsRandomMode] = useState(false);
    const [isLoopStarted, setIsLoopStarted] = useState(false);
    const [currentFloor, setCurrentFloor] = useState(0);
    const [targetFloor, setTargetFloor] = useState(0);
    const [floors, setFloors] = useState(0);
    const [executionTime, setExecutionTime] = useState<number | null>(null);
    const [building, dispatch] = useReducer(reducer, initialState);

    const handleElevatorChangedFloor = () => {
        if (building.system === null) {
            return;
        }

        dispatch({
            type: Actions.UPDATE_ELEVATORS,
            payload: {
                elevators: building.system.elevatorsList
            }
        });
    };

    const handleAddElevatorCar = (): void => {
        if (building.system === null) {
            return;
        }

        building.system.addElevatorCar({
            floor: DEFAULT_FLOOR,
            speed: DEFAULT_SPEED,
            cb: handleElevatorChangedFloor,
        });

        dispatch({
            type: Actions.UPDATE_ELEVATORS,
            payload: {
                elevators: building.system.elevatorsList,
            },
        });
    };

    const handleDestroyBuilding = (): void => {
        setCurrentFloor(0);
        setTargetFloor(0);
        setFloors(0);
        
        building.system && building.system.removeAllElevatorCars();

        dispatch({ type: Actions.CLEAR });
    };

    const handleCreateBuilding = (): void => {
        if (!floors || floors < 0) {
            alert('Incorrect imput');
            return;
        }

        const system = new ElevatorSystem(floors);

        dispatch({
            type: Actions.INIT,
            payload: {
                floors,
                system,
            }
        });
    };

    const handleCallElevator = (): void => {
        if (
            !currentFloor ||
            !targetFloor ||
            !building.system ||
            !floors
        ) {
            return;
        }

        if (
            currentFloor > floors ||
            targetFloor > floors ||
            currentFloor < 1 ||
            targetFloor < 1 || 
            currentFloor === targetFloor
        ) {
            alert('Incorrect imput');
            return;
        }

        const passenger = new Passenger(currentFloor, targetFloor);
        building.system?.callElevator(passenger);
    };

    const handleRandomData = (): void => {
        building.system && building.system.removeAllElevatorCars();

        const randomFloors = getRndInteger(10, 100);
        const system = new ElevatorSystem(randomFloors);
        
        dispatch({
            type: Actions.INIT,
            payload: {
                floors: randomFloors,
                system,
                elevators: [],
            }
        });

        setIsLoopStarted(false);
        setFloors(randomFloors);
        setIsRandomMode(true);
    };

    const handleRemoveElevatorCar = useCallback((id: number) => {
        if (!building.system) {
            return;
        }

        building.system.removeElevatorCar(id);

        dispatch({
            type: Actions.UPDATE_ELEVATORS,
            payload: {
                elevators: building.system.elevatorsList,
            },
        });
    }, [building.system]);

    const createRandomElevators = () => {
        if (!building.system) {
            return;
        }
        const elevatorCarsNumber = getRndInteger(18, 36);
                
        for (let i = 0; i < elevatorCarsNumber; i++) {
            building.system.addElevatorCar({
                floor: DEFAULT_FLOOR,
                speed: DEFAULT_SPEED,
                cb: handleElevatorChangedFloor,
            });
        }

        dispatch({
            type: Actions.UPDATE_ELEVATORS,
            payload: {
                elevators: building.system.elevatorsList,
            },
        });
    };

    const runRandomElevatorCalls = (counter = 0) => {
        if (!floors || !executionTime || !building.system) {
            return;
        }

        const requestCount = getRndInteger(5, 10);

        for (let i = 0; i < requestCount; i++) {
            const randFloor =  getRndInteger(1, floors);
            let randDestination;

            if (randFloor > 1 && randFloor < floors) {
                randDestination = getRndInteger(1, floors);
            } else if (randFloor === floors)  {
                randDestination = getRndInteger(1, randFloor - 1);
            } else {
                randDestination = getRndInteger(2, randFloor);
            }

            const passanger = new Passenger(randFloor, randDestination);
            building.system.callElevator(passanger);
        }

        if (counter < executionTime) {
            setTimeout(() => {
                runRandomElevatorCalls(counter + DEFAULT_EXECUTION_TIME);
            }, DEFAULT_EXECUTION_TIME);
        } else {
            setIsRandomMode(false);
        }
    };

    useEffect(() => {
        if (isRandomMode && building.system) {
            if (building.elevators.length === 0) {
                createRandomElevators();
            }

            if (!isLoopStarted) {
                setIsLoopStarted(true);
                runRandomElevatorCalls();
            }
        }
    }, [building, isRandomMode, isLoopStarted]);

    return {
        building,
        handleAddElevatorCar,
        handleDestroyBuilding,
        handleCreateBuilding,
        handleCallElevator,
        handleRandomData,
        handleRemoveElevatorCar,
        setFloors,
        setCurrentFloor,
        setTargetFloor,
        setExecutionTime,
        currentFloor,
        targetFloor,
        executionTime,
        floors,
        isRandomMode,
    };
}
