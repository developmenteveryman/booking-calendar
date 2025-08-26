import { useCallback, useMemo, useState } from 'react';
import type { SelectableCar, SelectionRequired } from '../types/component';
import type { MatrixAvailability } from '../types/matrix';
import debounce from '../utils/debounce';

type HookArguments = {
    uuid: string;
    venueDateId: number;
};

type HookReturn = {
    cars: SelectableCar[];
    requiredPositions: SelectionRequired[];
    isLoading: boolean;
    loadCars: () => Promise<void>;
};

export default function useEventComponents({ uuid, venueDateId }: HookArguments): HookReturn {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [cars, setCars] = useState<SelectableCar[]>([]);
    const [requiredPositions, setRequiredPositions] = useState<SelectionRequired[]>([]);

    const useApi = useMemo<MatrixAvailability | undefined>(
        () => globalThis.matrixAvailabilityInstances?.[uuid],
        [uuid],
    );

    const loadCars = useCallback(async () => {
        if (!useApi) {
            return;
        }

        try {
            setIsLoading(true);
            const response = await useApi.getEventComponents(venueDateId);
            setCars(response.components || []);
            setRequiredPositions(response.selectionsRequired || []);
            setIsLoading(false);
        } catch (error) {
            console.warn('Error loading events:', error);
            setIsLoading(false);
        }
    }, [useApi]);

    useMemo(() => {
        const debouncedLoader = debounce(loadCars, 500);
        debouncedLoader();
        return () => {
            debouncedLoader.cancel();
        };
    }, [loadCars]);

    return { cars, requiredPositions, loadCars, isLoading };
}
