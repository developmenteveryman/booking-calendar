import { type FC, useCallback, useEffect, useMemo, useState } from 'react';
import './eventTimesTable.css';
import useEventComponents from '../../hooks/useEventComponents';
import type { EventRow } from '../../types/event';
import Summary from './Summary';
import Legend from './Legend';
import Table from './Table';
import type { AppliedSelection } from '../../types/reservation';
import useApi from '../../hooks/useApi';
import debounce from '../../utils/debounce';
import { objectToSortedArray, sortOrder } from '../../utils/sort';
import { useEventTimesTableContext } from '../../providers/EventTimesTable/context';
import { onlyDuplicates } from '../../utils/filter';
import Tooltip from '../Tooltip';

type Props = {
    date?: number;
    selectedEvent: EventRow;
    uuid: string;
    onBackToEvents: React.MouseEventHandler<HTMLButtonElement>;
};

const getTargetIndex = (
    prev: AppliedSelection,
    carId: number,
    possiblePositions: number[],
): [index: number | null, action: string] => {
    // If already selected in a possible position, return that index to remove from
    const existingPos = possiblePositions
        .sort(sortOrder('desc'))
        .find((pos) => (prev[pos] || { carIds: [], timeIds: [] }).carIds.includes(carId));
    if (existingPos !== undefined) return [existingPos, 'remove'];

    // Otherwise, return the first possible position to add to
    const nextPos = possiblePositions.find(
        (pos) => !(prev[pos] || { carIds: [], timeIds: [] }).carIds.includes(carId),
    );
    return nextPos === undefined ? [null, 'add'] : [nextPos, 'add'];
};

const EventTimesTable: FC<Props> = ({ uuid, selectedEvent, onBackToEvents }) => {
    const { api } = useApi({ uuid });
    const { cars, requiredPositions, isLoading, loadCars } = useEventComponents({
        uuid,
        venueDateId: Number(selectedEvent.venuedateid),
    });

    const [confirming, setConfirming] = useState(false);
    const [selectedSlotTimes, setSelectedSlotTimes] = useState<{ [carId: number]: string[] }>({});
    const {
        state: { appliedSelection },
        actions: { clearAppliedSelection, setAppliedSelection },
    } = useEventTimesTableContext();

    const duplicateSlotTimes: string[] = useMemo(
        () => Object.values(selectedSlotTimes).flat().filter(onlyDuplicates),
        [selectedSlotTimes],
    );

    const confirmButtonState = useMemo(() => {
        const selectedTimeIds = Object.values(appliedSelection)
            .map((selection) => selection.timeIds)
            .flat();

        const isDisabled = () => {
            if (requiredPositions.length > selectedTimeIds.length) return true;
            if (duplicateSlotTimes.length > 0) return true;
            return false;
        };

        const tooltip = () => {
            if (requiredPositions.length > selectedTimeIds.length) {
                return 'Please fill all required positions.';
            }
            if (duplicateSlotTimes.length > 0) {
                return 'Some slot times are duplicated.';
            }
            return '';
        };

        return {
            disabled: isDisabled(),
            tooltip: tooltip(),
        };
    }, [duplicateSlotTimes, requiredPositions, appliedSelection]);

    const handleSlotClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            const carId = Number(e.currentTarget.dataset.componentid);
            const timeId = Number(e.currentTarget.dataset.componenttimeid);
            const slotTime = e.currentTarget.dataset.componenttime as string;
            const status = e.currentTarget.dataset.componenttimestatus as string;
            // const selectionIndex = Number(e.currentTarget.dataset.selectionindex);
            const selectionPositions = JSON.parse(
                e.currentTarget.dataset.selectionposition || '[]',
            ) as number[];

            if (status === 'fullyBooked') return;

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
                const [selectionIndex, action] = getTargetIndex(prev, carId, selectionPositions);
                if (selectionIndex === null) {
                    console.warn('All positions have been filled');
                    return prev;
                }

                const prevSelection = prev[selectionIndex] || { carIds: [], timeIds: [] };
                const updateCarIds =
                    action === 'remove'
                        ? prevSelection.carIds.filter((id) => id !== carId)
                        : [...prevSelection.carIds, carId];

                const updatedTimeIds =
                    action === 'remove'
                        ? prevSelection.timeIds.filter((id) => id !== timeId)
                        : [...prevSelection.timeIds, timeId];

                return {
                    ...prev,
                    [selectionIndex]: {
                        carIds: Array.from(new Set(updateCarIds)),
                        timeIds: Array.from(new Set(updatedTimeIds)),
                    },
                };
            });
        },
        [selectedEvent, requiredPositions, setAppliedSelection],
    );

    const handleRefresh = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            setSelectedSlotTimes({});
            clearAppliedSelection();
            loadCars();
        },
        [loadCars, clearAppliedSelection],
    );

    const handleRemoveCar = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            const carId = Number(e.currentTarget.dataset.carid);
            const positions: number[] = JSON.parse(
                e.currentTarget.dataset.selectionposition || '[]',
            );

            setAppliedSelection((prev) => {
                const next = { ...prev };
                positions.forEach((pos) => {
                    const prevSelection = next[pos] || { carIds: [], timeIds: [] };
                    next[pos] = {
                        carIds: prevSelection.carIds.filter((id) => id !== carId),
                        timeIds: prevSelection.timeIds.filter(
                            (_, idx) => prevSelection.carIds[idx] !== carId,
                        ),
                    };
                });
                return next;
            });

            setSelectedSlotTimes((prev) => {
                const copy = { ...prev };
                delete copy[carId];
                return copy;
            });
        },
        [setAppliedSelection, setSelectedSlotTimes],
    );

    const handleCarView: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        event.preventDefault();
        const carId = event.currentTarget.dataset.componentid;
        if (carId) globalThis.showComponent(carId);
    };

    const handleConfirm = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
        (e) => {
            e.preventDefault();
            const sortedSelections = objectToSortedArray<AppliedSelection[0]>(
                appliedSelection,
                'asc',
            );

            const appliedCarIds = sortedSelections.map((item) => item.carIds).flat();

            const appliedTimeIds = sortedSelections.map((item) => item.timeIds).flat();

            let timeStart = Math.min(
                ...cars
                    .map((car) =>
                        car.componentTimes.filter((time) =>
                            appliedTimeIds.includes(Number(time.componentTimeId)),
                        ),
                    )
                    .flat()
                    .map((item) => item.componentStartTime),
            );

            setConfirming(true);
            api?.confirmReservation(
                appliedCarIds,
                appliedTimeIds,
                selectedEvent.date,
                timeStart,
                moment().utcOffset() * 60,
                (data) => {
                    setConfirming(false);
                    if (!data) {
                        setSelectedSlotTimes({});
                        clearAppliedSelection();
                        loadCars();
                    }
                },
            );
        },
        [api, appliedSelection, cars],
    );

    useEffect(() => {
        const debouncedApplySelection = debounce((selection) => {
            const flattenedSelection = objectToSortedArray<AppliedSelection[0]>(selection, 'asc')
                .map((item) => item.carIds)
                .flat();
            try {
                api?.applySelections(flattenedSelection, true);
            } catch (err) {
                console.error('Failed to apply selection', err);
            }
        }, 300);

        debouncedApplySelection(appliedSelection);
    }, [appliedSelection]);

    return (
        <div className="container my-4 py-2 booking-calendar_table-wrapper">
            {/* Selection Summary */}
            {selectedEvent && (
                <Summary
                    eventCars={cars}
                    selectionRequired={requiredPositions}
                    selectedEvent={selectedEvent}
                    actions={{
                        onBackToEvents,
                        onRefresh: handleRefresh,
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
            {isLoading ? (
                <div className="alert alert-info">Loading data, please wait...</div>
            ) : (
                <Table
                    uuid={uuid}
                    eventCars={cars}
                    selectedSlotTimes={selectedSlotTimes}
                    selectionRequired={requiredPositions}
                    handleSlotClick={handleSlotClick}
                    handleCarView={handleCarView}
                />
            )}

            {/* Confirm reservation */}
            <Tooltip tooltip={confirmButtonState.tooltip}>
                <button
                    className="btn btn-success confirm-button"
                    onClick={handleConfirm}
                    disabled={confirmButtonState.disabled}
                >
                    Confirm
                </button>
            </Tooltip>

            {/* Overlay for confirmation */}
            <div
                className={`overlay position-absolute justify-content-center align-items-center w-100 h-100 ${confirming ? 'd-flex' : 'd-none'}`}
                style={{
                    top: 0,
                    left: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.4)',
                }}
            >
                <div className="d-flex flex-column align-items-center">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="text-light">Confirming reservation, please wait...</p>
                </div>
            </div>
        </div>
    );
};

export default EventTimesTable;
