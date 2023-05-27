import { useState, useCallback } from 'react';

type UseElevatorCarProps = {
    id: number;
    handleRemove: (id: number) => void;
};

export const useElevatorCar = ({ id, handleRemove }: UseElevatorCarProps) => {
    const [isShowRemove, setIsShowRemove] = useState(false);

    const handleChangeVisability = useCallback(() => {
        setIsShowRemove(!isShowRemove);
    }, [isShowRemove, setIsShowRemove]);

    const handleItemRemove = useCallback(() => {
        handleRemove(id);
    }, [handleRemove, id]);

    return {
        isShowRemove,
        handleChangeVisability,
        handleItemRemove,
    };
};