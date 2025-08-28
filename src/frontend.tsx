import ReactDOM from 'react-dom/client';
import EventTable from './components/EventTable';
import type { BlockAttribute } from '@wordpress/blocks';

const wrapperClassName = 'booking-calendar-block';

document.addEventListener('DOMContentLoaded', function () {
    console.log('Booking Calendar Frontend Loaded');
    document.querySelectorAll(`.${wrapperClassName}`).forEach((div) => {
        const data = JSON.parse(div.querySelector('pre')?.innerText || '{}');
        const root = ReactDOM.createRoot(div);
        root.render(<BookingCalendar {...data} />);
        div.classList.remove(wrapperClassName);
    });
});

export type BookingCalendarProps = {
    commodityId: BlockAttribute<string>;
    className: BlockAttribute<string>;
    display: BlockAttribute<string>;
    id: BlockAttribute<string>;
    uuid: BlockAttribute<string>;
    reservationId?: BlockAttribute<string>;
};

export function BookingCalendar(props: BookingCalendarProps) {
    const classes = [wrapperClassName, props.className].filter(Boolean).join(' ');

    return (
        <div
            id={props.id.toString()}
            className={classes}
            style={{ display: props.display?.toString() || 'block' }}
        >
            <EventTable
                commodityId={props.commodityId.toString()}
                reservationId={props.reservationId?.toString()}
                uuid={props.uuid.toString()}
            />
        </div>
    );
}
