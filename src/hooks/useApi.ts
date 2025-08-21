import { useEffect, useState } from 'react';
import type { MatrixAvailability } from '../types/matrix';

type HookArguments = {
    uuid: string;
};

type HookReturn = {
    api?: MatrixAvailability;
};

const CHECK_INTERVAL = 1000; // Check every 1s

export default function useApi({ uuid }: HookArguments): HookReturn {
    const [api, setApi] = useState<MatrixAvailability | undefined>(
        globalThis.matrixAvailabilityInstances?.[uuid],
    );

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        const checkInstance = () => {
            const instance = globalThis.matrixAvailabilityInstances?.[uuid];
            if (instance) {
                setApi(instance);
                if (interval) clearInterval(interval);
            }
        };

        // Poll every second if not found
        if (!api) {
            interval = setInterval(checkInstance, CHECK_INTERVAL);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [uuid]);

    return { api };
}
