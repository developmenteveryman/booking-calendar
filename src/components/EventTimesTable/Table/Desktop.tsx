import type { FC } from 'react';
import { getSlotClass, type TableProps } from '.';

const getBtnClass = (statusClass: string) => {
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

const Desktop: FC<TableProps> = ({
    eventCars,
    handleSlotClick,
    handleCarView,
    selectedSlotTimes,
}) => {
    const cars = eventCars.map((car) => ({
        ...car,
        componentTimes: car.componentTimes.map((slot) => ({
            ...slot,
            btnClass: getBtnClass(getSlotClass(slot, car.componentId, selectedSlotTimes)),
        })),
    }));

    return (
        <div className="table-responsive d-none d-md-block">
            <table className="table table-bordered align-middle text-center mb-0">
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
                                <div className="position-relative text-white booking-calendar_car-wrapper">
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
                                    <div className="booking-calendar_car-overlay" />
                                    {car.supplement && (
                                        <div className="booking-calendar_car-price">
                                            {car.supplement}
                                        </div>
                                    )}
                                    <div className="booking-calendar_car-name">
                                        {car.websiteTitle} ⓘ
                                    </div>
                                </div>
                            </td>
                            <td className="p-0 align-middle">
                                <div className="d-flex flex-wrap align-items-center booking-calendar_slots-container">
                                    {car.componentTimes.map((slot, idx) => {
                                        return (
                                            <button
                                                data-componentid={car.componentId}
                                                data-componenttime={slot.componentTime}
                                                data-componenttimestatus={slot.componentTimeStatus}
                                                data-selectionindex={idx}
                                                key={idx}
                                                className={`flex-fill ${slot.btnClass}`}
                                                onClick={handleSlotClick}
                                                disabled={
                                                    slot.componentTimeStatus === 'fullyBooked'
                                                }
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
