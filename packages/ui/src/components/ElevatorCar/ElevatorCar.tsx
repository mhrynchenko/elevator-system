import { memo } from 'react';
import { ElevatorState } from '@elevator-dispatcher/core';
import {
    FaArrowAltCircleDown,
    FaArrowAltCircleUp,
    FaStop,
    FaBomb,
} from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import { useElevatorCar } from './useElevatorCar';
import './styles.css';

type ElevatorProps = {
    id: number;
    floor: number;
    state: ElevatorState;
    handleRemove: (id: number) => void;
};

const ElevatorCar = ({ id, floor, state, handleRemove }: ElevatorProps) => {
    const {
        isShowRemove,
        handleChangeVisability,
        handleItemRemove,
    } = useElevatorCar({ id, handleRemove });
    const stateIcons = {
        [ElevatorState.DOWN]: <FaArrowAltCircleDown />,
        [ElevatorState.UP]: <FaArrowAltCircleUp />,
        [ElevatorState.IDLE]: <FaStop />,
    };

    return (
        <div
            className="elevator-car"
            onMouseEnter={handleChangeVisability}
            onMouseLeave={handleChangeVisability}
        >
            <div className="dial">
                <div>
                    {`#${id} `}
                </div>
                <div className="floor">
                    <b>{floor}</b>
                </div>
                <div className="indicator">
                    {stateIcons[state]}
                </div>
            </div>
            {isShowRemove && (
                <div className="remove">
                    <Button variant="light" onClick={handleItemRemove}>
                        <FaBomb />
                    </Button>
                </div>
            )}
        </div>
    );
}

export const MemoElevatorCar = memo(ElevatorCar);