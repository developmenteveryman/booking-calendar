import { useEventTimesTableContext } from '../providers/EventTimesTable/context';
import type { SelectableCar, SelectionRequired } from '../types/component';
import type { AppliedSelection } from '../types/reservation';
import { sortOrder } from '../utils/sort';

type DisableInfo = { disabled: boolean; title?: string };

export const useIsSlotDisabled = (
    cars: SelectableCar[],
    selectionRequired: SelectionRequired[],
) => {
    const {
        state: { appliedSelection },
    } = useEventTimesTableContext();

    const isSlotDisabled = (carId: number, timeId: number, slotStatus: string): DisableInfo => {
        if (slotStatus === 'fullyBooked') {
            return { disabled: true, title: 'Fully booked' };
        }

        const car = cars.find((c) => c.componentId === carId);

        if (!car) return { disabled: false };

        // Find the selection this car belongs to
        const selection = selectionRequired
            .sort(sortOrder('desc'))
            .find((sel) => car.componentPosition?.includes(sel.position));
        if (!selection) return { disabled: false };

        const selectionIndex = selection.index;
        const currentSelection: AppliedSelection[0] = appliedSelection[selectionIndex] || {
            carIds: [],
            timeIds: [],
        };

        const carSelectedTimes = currentSelection.timeIds;
        const maxSlots = car.componentPosition?.length || 1;

        if (carSelectedTimes.includes(timeId)) {
            return { disabled: false };
        }

        if (carSelectedTimes.length >= maxSlots) {
            return { disabled: true, title: `Max slots for ${car.websiteTitle}` };
        }

        const otherCars = currentSelection.carIds.filter((id) => id !== carId);
        const conflict = otherCars.some((otherCarId) => {
            const otherCar = cars.find((c) => c.componentId === otherCarId);
            if (!otherCar) return false;
            return otherCar.componentPosition.some((pos) => car.componentPosition.includes(pos));
        });

        if (conflict) {
            return { disabled: true, title: `Selection made` };
        }
        return { disabled: false };
    };
    return { isSlotDisabled };
};
