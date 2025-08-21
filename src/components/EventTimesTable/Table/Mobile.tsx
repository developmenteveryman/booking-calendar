import type { FC } from 'react';
import { getSlotClass, type TableProps } from '.';

const getBtnClass = (statusClass: string) => {
    let statusBtnClass = '';
    switch (statusClass) {
        case 'available':
            statusBtnClass = 'btn btn-success btn-sm m-1 flex-fill';
            break;
        case 'selected':
            statusBtnClass = 'btn btn-secondary btn-sm m-1 flex-fill';
            break;
        case 'fullyBooked':
            statusBtnClass = 'btn btn-danger btn-sm m-1 flex-fill';
            break;
        case 'nearlyFull':
            statusBtnClass = 'btn btn-nearlyfull btn-sm m-1 flex-fill';
            break;
        default:
            statusBtnClass = 'btn btn-outline-secondary btn-sm m-1 disabled flex-fill';
    }

    return `booking-calendar_slot-btn ${statusBtnClass} btn-sm m-1 position-relative`;
};

const Mobile: FC<TableProps> = ({
    eventCars,
    selectedSlotTimes,
    handleSlotClick,
    handleCarView,
}) => {
    const cars = eventCars.map((car) => ({
        ...car,
        componentTimes: car.componentTimes.map((slot) => ({
            ...slot,
            btnClass: getBtnClass(getSlotClass(slot, car.componentId, selectedSlotTimes)),
        })),
    }));

    return (
        <div className="d-block d-md-none booking-calendar_mobile-cards-wrapper">
            {cars.map((car) => (
                <div key={car.componentId} className="col-12 mb-3 p-0">
                    <div className="card booking-calendar_car-card">
                        <div
                            className="position-relative"
                            style={{ height: '200px', cursor: 'pointer' }}
                            data-componentid={car.componentId}
                            onClick={handleCarView}
                        >
                            {car.image && (
                                <img
                                    src={`${car.image}`}
                                    className="card-img-top car-card-img"
                                    alt={car.websiteTitle}
                                />
                            )}
                            <div className="booking-calendar_car-card-overlay" />
                            {car.supplement && (
                                <span className="badge badge-danger booking-calendar_upgrade-badge">
                                    {car.supplement}
                                </span>
                            )}
                            <div className="booking-calendar_car-card-title">
                                {car.websiteTitle} ⓘ
                            </div>
                        </div>
                        <div className="card-body booking-calendar_car-card-body p-2">
                            <div className="booking-calendar_slots-grid-mobile">
                                {car.componentTimes.map((slot, idx) => (
                                    <button
                                        key={idx}
                                        className={`booking-calendar_slot-btn ${slot.btnClass}`}
                                        onClick={handleSlotClick}
                                        data-selectionindex={idx}
                                        disabled={slot.componentTimeStatus === 'fullyBooked'}
                                    >
                                        {slot.componentTime}
                                        {slot.supplement && (
                                            <div className="booking-calendar_slot-upgrade">
                                                {slot.supplement}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Mobile;
