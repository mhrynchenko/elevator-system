import type { Elevator, ElevatorSystem } from '@elevator-dispatcher/core';

export enum Actions {
    INIT = 'INIT',
    UPDATE_ELEVATORS = 'UPDATE_ELEVATORS',
    CLEAR = 'CLEAR'
};

type State = {
    elevators: ReadonlyArray<Elevator>,
    floors: number | null,
    system: ElevatorSystem | null,
};

type ActionInit = {
    type: Actions.INIT;
    payload: {
        floors: number;
        elevators?: ReadonlyArray<Elevator>;
        system: ElevatorSystem;
    }
};

type ActionAddElevator = {
    type: Actions.UPDATE_ELEVATORS;
    payload: {
        elevators: ReadonlyArray<Elevator>;
    }
};

type ActionClear = { type: Actions.CLEAR };

type Action = ActionInit | ActionAddElevator | ActionClear;

export const initialState = {
    elevators: [],
    floors: null,
    system: null,
};

const initReducer = (state: State, action: ActionInit) => {
    const { floors, system, elevators } = action.payload;
    return {
        ...state,
        floors,
        system,
        elevators: elevators || [],
    };
};

const addElevatorReducer = (state: State, action: ActionAddElevator) => {
    const { elevators } = action.payload;
    return {
        ...state,
        elevators,
    };
}

const clearReducer = (state: State, action: ActionClear) => {
    return initialState;
}

export const reducer = (state: State, action: Action) => {
    switch (action.type) {
        case Actions.INIT: 
            return initReducer(state, action);
        case Actions.UPDATE_ELEVATORS:
            return addElevatorReducer(state, action);
        case Actions.CLEAR:
            return clearReducer(state, action);
        default:
            return state;
    }
};