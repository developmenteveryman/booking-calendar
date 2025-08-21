import { type FC, useCallback, useState } from 'react';
import './eventTimesTable.css';
import useEventComponents from '../../hooks/useEventComponents';
import type { EventRow } from '../../types/event';
import type { ComponentTime } from '../../types/component';
import Summary from './Summary';
import Legend from './Legend';
import Table from './Table';
import type { AppliedSelection } from '../../types/reservation';
import useApi from '../../hooks/useApi';

interface Props {
    date?: number;
    selectedEvent: EventRow;
    uuid: string;
    onBackToEvents: React.MouseEventHandler<HTMLButtonElement>;
}

const EventTimesTable: FC<Props> = ({ uuid, selectedEvent, onBackToEvents }) => {
    const { api } = useApi({ uuid });
    const { cars, selectionRequired } = useEventComponents({
        uuid,
        venueDateId: Number(selectedEvent.venuedateid),
    });

    const [selectedCarIds, setSelectedCarIds] = useState<number[]>([]);
    const [selectedSlotTimes, setSelectedSlotTimes] = useState<{ [carId: number]: string[] }>({});
    const [appliedSelection, setAppliedSelection] = useState<AppliedSelection>({});

    const handleSlotClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
        e.preventDefault();
        const carId = Number(e.currentTarget.dataset.componentid);
        const slotTime = e.currentTarget.dataset.componenttime as string;
        const status = e.currentTarget.dataset.componenttimestatus as string;
        const selectionIndex = Number(e.currentTarget.dataset.selectionindex);

        if (status === 'fullyBooked') return;

        setSelectedCarIds((prev) => (prev.includes(carId) ? prev : [...prev, carId]));

        setSelectedSlotTimes((prev) => {
            const times = prev[carId] || [];
            return {
                ...prev,
                [carId]: times.includes(slotTime)
                    ? times.filter((t) => t !== slotTime)
                    : [...times, slotTime],
            };
        });

        setAppliedSelection((prev) => {
            const prevSelection = prev[selectionIndex] || [];
            const updatedSelection = prevSelection.includes(carId)
                ? prevSelection.filter((id) => id !== carId)
                : [...prevSelection, carId];

            try {
                api?.applySelections({
                    selectionIndex,
                    carIds: updatedSelection,
                });
            } catch (err) {
                console.error('Failed to apply selection', err);
            }

            return {
                ...prev,
                [selectionIndex]: updatedSelection,
            };
        });
    }, []);

    const getSlotClass = (
        slot: ComponentTime,
        carId: number,
    ): ComponentTime['componentTimeStatus'] | 'selected' => {
        if (selectedSlotTimes[carId]?.includes(slot.componentTime)) return 'selected';
        return slot.componentTimeStatus;
    };

    const getBtnClass = (slot: ComponentTime, carId: number) => {
        const statusClass = getSlotClass(slot, carId);

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

    const handleRemoveVenue = useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
        e.preventDefault();
        setSelectedCarIds([]);
        setSelectedSlotTimes({});
    }, []);

    const handleRemoveCar = useCallback<React.MouseEventHandler<HTMLButtonElement>>((e) => {
        const carId = Number(e.currentTarget.dataset.carid);
        e.preventDefault();
        setSelectedCarIds((prev) => prev.filter((id) => id !== carId));
        setSelectedSlotTimes((prev) => {
            const copy = { ...prev };
            delete copy[carId];
            return copy;
        });
    }, []);

    const handleCarView: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        const carId = event.currentTarget.dataset.componentid;
        if (carId) globalThis.showComponent(carId);
    };

    const duplicateSlotTimes: string[] = [];
    const allSelectedTimes: string[] = [];

    Object.values(selectedSlotTimes).forEach((times) => {
        times.forEach((time) => {
            if (allSelectedTimes.includes(time) && !duplicateSlotTimes.includes(time)) {
                duplicateSlotTimes.push(time);
            } else {
                allSelectedTimes.push(time);
            }
        });
    });

    return (
        <div className="container my-4 py-2 booking-calendar_table-wrapper">
            {/* Selection Summary */}
            {(selectedEvent || selectedCarIds.length > 0) && (
                <Summary
                    eventCars={cars}
                    selectionRequired={selectionRequired}
                    selectedEvent={selectedEvent}
                    selectedCarIds={selectedCarIds}
                    actions={{
                        onBackToEvents,
                        onRemoveVenue: handleRemoveVenue,
                        onRemoveCar: handleRemoveCar,
                    }}
                />
            )}

            {/* Duplicate Time Warning */}
            {duplicateSlotTimes.length > 0 && (
                <div className="alert alert-warning mb-2">
                    You have selected the same time for multiple cars:{' '}
                    {duplicateSlotTimes.join(', ')}
                </div>
            )}

            {/* Legend */}
            <Legend />

            {/* Cars Table */}
            <Table
                eventCars={cars}
                selectedSlotTimes={selectedSlotTimes}
                getBtnClass={getBtnClass}
                handleSlotClick={handleSlotClick}
                handleCarView={handleCarView}
            />
        </div>
    );
};

export default EventTimesTable;
