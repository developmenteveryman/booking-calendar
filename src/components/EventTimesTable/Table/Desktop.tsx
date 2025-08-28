import { type FC } from 'react';
import { getSlotClass, type TableProps } from '.';
import { useIsSlotDisabled } from '../../../hooks/useIsSlotDisabled';
import type { ComponentTypeStatus } from '../../../types/component';
// import { isSlotDisabled } from '..';

const getBtnClass = (statusClass: ComponentTypeStatus) => {
    let statusBtnClass = '';
    switch (statusClass) {
        case 'selected':
            statusBtnClass = 'btn btn-secondary';
            break;
        case 'full':
            statusBtnClass = 'btn btn-danger';
            break;
        case 'alreadyBooked':
            statusBtnClass = 'btn btn-nearlyfull';
            break;
        case 'available':
        default:
            statusBtnClass = 'btn btn-success';
    }

    return `booking-calendar_slot-btn ${statusBtnClass} btn-sm m-1 position-relative`;
};

const Desktop: FC<TableProps> = ({
    eventCars,
    handleSlotClick,
    handleCarView,
    selectedSlotTimes,
    selectionRequired,
}) => {
    const cars = eventCars.map((car) => ({
        ...car,
        componentTimes: car.componentTimes.map((slot) => ({
            ...slot,
            btnClass: getBtnClass(getSlotClass(slot, car.componentId, selectedSlotTimes)),
        })),
    }));

    const { isSlotDisabled } = useIsSlotDisabled(cars, selectionRequired);
    return (
        <div className="table-responsive d-none d-md-block">
            <table className="table table-bordered align-middle text-center mb-0 booking-calendar_times-table">
                <thead className="thead-dark">
                    <tr>
                        <th style={{ width: '220px' }}>Car</th>
                        <th colSpan={6}>Time Slots</th>
                    </tr>
                </thead>
                <tbody>
                    {cars.map((car) => (
                        <tr key={car.componentId}>
                            <td
                                className="p-0 align-top booking-calendar_car-cell"
                                data-componentid={car.componentId}
                                onClick={handleCarView}
                            >
                                <div className="position-relative text-dark booking-calendar_car-wrapper">
                                    {car.image && (
                                        <img
                                            src={`${car.image}`}
                                            alt={car.websiteTitle}
                                            className="img-fluid w-100 h-100"
                                            style={{
                                                objectFit: 'contain',
                                                borderRadius: 0,
                                            }}
                                        />
                                    )}
                                    {car.supplement && (
                                        <div className="booking-calendar_car-price">
                                            {car.supplement}
                                        </div>
                                    )}
                                    <div className="booking-calendar_car-name">
                                        {car.websiteTitle}
                                        {' ⓘ'}
                                    </div>
                                </div>
                            </td>
                            <td className="p-0 align-middle">
                                <div className="booking-calendar_slots-container">
                                    {car.componentTimes.map((slot, idx) => {
                                        const { disabled, title } = isSlotDisabled(
                                            Number(car.componentId),
                                            Number(slot.componentTimeId),
                                            slot.componentTimeStatus,
                                        );
                                        return (
                                            <button
                                                data-componentid={car.componentId}
                                                data-componenttime={slot.componentTime}
                                                data-componenttimestatus={slot.componentTimeStatus}
                                                data-selectionindex={idx}
                                                data-selectionposition={JSON.stringify(
                                                    car.componentPosition.map((item) => item - 1),
                                                )}
                                                data-componenttimeid={slot.componentTimeId}
                                                key={idx}
                                                className={slot.btnClass}
                                                onClick={handleSlotClick}
                                                disabled={disabled}
                                                title={title}
                                            >
                                                {slot.componentTime}
                                                {slot.supplement && (
                                                    <div className="booking-calendar_slot-upgrade">
                                                        {slot.supplement}
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Desktop;
