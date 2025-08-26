import type { FC } from 'react';

const Legend: FC = () => {
    return (
        <div className="mt-3 d-flex flex-wrap align-items-center booking-calendar_legend-container mb-3">
            <div className="booking-calendar_legend booking-calendar_legend-fullybooked text-center flex-fill">
                Fully booked
            </div>
            <div className="booking-calendar_legend booking-calendar_legend-nearlyfull text-center flex-fill">
                Nearly full
            </div>
            <div className="booking-calendar_legend booking-calendar_legend-available text-center flex-fill">
                Available
            </div>
            <div className="booking-calendar_legend booking-calendar_legend-selected text-center flex-fill">
                Selected
            </div>
        </div>
    );
};

export default Legend;
