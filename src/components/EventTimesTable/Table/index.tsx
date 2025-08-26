import type { FC } from 'react';
import type { ComponentTime, SelectableCar, SelectionRequired } from '../../../types/component';
import Desktop from './Desktop';
import Mobile from './Mobile';
import Empty from './Empty';

export type TableProps = {
    uuid: string;
    selectionRequired: SelectionRequired[];
    eventCars: SelectableCar[];
    selectedSlotTimes: Record<number, string[]>;
    handleSlotClick: React.MouseEventHandler<HTMLButtonElement>;
    handleCarView: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
};

export const getSlotClass = (
    slot: ComponentTime,
    carId: number,
    selectedSlotTimes: Record<number, string[]>,
): ComponentTime['componentTimeStatus'] | 'selected' => {
    if (selectedSlotTimes[carId]?.includes(slot.componentTime)) return 'selected';
    return slot.componentTimeStatus;
};

const Table: FC<TableProps> = ({
    uuid,
    eventCars,
    selectedSlotTimes,
    selectionRequired,
    handleSlotClick,
    handleCarView,
}) => {
    if (eventCars.length === 0) return <Empty />;

    return (
        <>
            {/* Desktop Table */}
            <Desktop
                uuid={uuid}
                eventCars={eventCars}
                selectedSlotTimes={selectedSlotTimes}
                selectionRequired={selectionRequired}
                handleSlotClick={handleSlotClick}
                handleCarView={handleCarView}
            />

            {/* Mobile Card Layout */}
            <Mobile
                uuid={uuid}
                eventCars={eventCars}
                selectedSlotTimes={selectedSlotTimes}
                selectionRequired={selectionRequired}
                handleSlotClick={handleSlotClick}
                handleCarView={handleCarView}
            />
        </>
    );
};

export default Table;
