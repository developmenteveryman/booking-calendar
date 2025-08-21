import type { FC } from 'react';
import type { ComponentTime, SelectableCar } from '../../../types/component';
import Desktop from './Desktop';
import Mobile from './Mobile';
import Empty from './Empty';

export type TableProps = {
    eventCars: SelectableCar[];
    selectedSlotTimes: Record<number, string[]>;
    getBtnClass: (slot: ComponentTime, carId: number) => string;
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

export const getBtnClass = (statusClass: string) => {
    let statusBtnClass = '';
    switch (statusClass) {
        case 'available':
            statusBtnClass = 'btn btn-success';
            break;
        case 'selected':
            statusBtnClass = 'btn btn-secondary';
            break;
        case 'fullyBooked':
            statusBtnClass = 'btn btn-danger';
            break;
        case 'nearlyFull':
            statusBtnClass = 'btn btn-nearlyfull';
            break;
        default:
            statusBtnClass = 'btn btn-outline-secondary disabled';
    }

    return `booking-calendar_slot-btn ${statusBtnClass} btn-sm m-1 position-relative`;
};

const Table: FC<TableProps> = ({
    eventCars,
    selectedSlotTimes,
    getBtnClass,
    handleSlotClick,
    handleCarView,
}) => {
    if (eventCars.length === 0) return <Empty />;

    return (
        <>
            {/* Desktop Table */}
            <Desktop
                eventCars={eventCars}
                selectedSlotTimes={selectedSlotTimes}
                getBtnClass={getBtnClass}
                handleSlotClick={handleSlotClick}
                handleCarView={handleCarView}
            />

            {/* Mobile Card Layout */}
            <Mobile
                eventCars={eventCars}
                selectedSlotTimes={selectedSlotTimes}
                getBtnClass={getBtnClass}
                handleSlotClick={handleSlotClick}
                handleCarView={handleCarView}
            />
        </>
    );
};

export default Table;
