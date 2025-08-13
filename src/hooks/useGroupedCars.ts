import { useMemo } from 'react';
import VenueDateComponentModel from '@/domain/models/VenueDateComponent';
import { secondsToTimeString } from '@/utils/helpers';
import type { CarSlotGroup } from '@/components/EventTimesTable/types';

const SLOT_SIZE_SECONDS = 3600;
const roundDownToSlot = (time: number) => Math.floor(time / SLOT_SIZE_SECONDS) * SLOT_SIZE_SECONDS;
const roundUpToSlot = (time: number) => Math.ceil(time / SLOT_SIZE_SECONDS) * SLOT_SIZE_SECONDS;

const getSlotStatus = (used: number, remaining: number) => {
  if (remaining === 0) return 'full';
  if (used > 0 && remaining > 0) return 'alreadyBooked';
  if (used === 0 && remaining > 0) return 'available';
  return 'unavailable';
};

const formatTimeBucketLabel = (bucketStart: number) => {
  const end = bucketStart + SLOT_SIZE_SECONDS;
  return `${secondsToTimeString(bucketStart)} - ${secondsToTimeString(end)}`;
};

export const useGroupedCars = (dateComponents?: VenueDateComponentModel[]): CarSlotGroup[] => {
  return useMemo(() => {
    if (!dateComponents?.length) return [];

    let globalStart = Infinity;
    let globalFinish = 0;

    dateComponents.forEach(({ properties }) => {
      (properties.componentTimes ?? []).forEach(({ startTime, finishTime }) => {
        if (startTime < globalStart) globalStart = startTime;
        if (finishTime > globalFinish) globalFinish = finishTime;
      });
    });

    if (globalStart === Infinity) return [];

    const roundedStart = roundDownToSlot(globalStart);
    const roundedFinish = roundUpToSlot(globalFinish);
    const timeBuckets: number[] = [];
    for (let t = roundedStart; t < roundedFinish; t += SLOT_SIZE_SECONDS) timeBuckets.push(t);

    const carMap = new Map<number, CarSlotGroup>();

    for (const { properties, component } of dateComponents) {
      const id = component?.properties?.id;
      if (!id) continue;

      const name = component.properties?.description ?? 'Unknown';
      const fromPrice = component?.fromPrice;

      if (!carMap.has(id)) {
        carMap.set(id, { id, name, fromPrice, slots: [] });
      }

      const carSlots = carMap.get(id)!.slots;
      const slotMap = new Map<number, { timeUsed: number; timeRemaining: number }>();

      const sortedTimes = [...(properties.componentTimes ?? [])].sort(
        (a, b) => a.startTime - b.startTime,
      );
      for (const { startTime, timeUsed, timeRemaining } of sortedTimes) {
        const slotStart = roundDownToSlot(startTime);
        slotMap.set(slotStart, { timeUsed, timeRemaining });
      }

      for (const bucketStart of timeBuckets) {
        if (slotMap.has(bucketStart)) {
          const slot = slotMap.get(bucketStart)!;
          carSlots.push({
            time: formatTimeBucketLabel(bucketStart),
            status: getSlotStatus(slot.timeUsed, slot.timeRemaining),
          });
        } else {
          carSlots.push({
            time: formatTimeBucketLabel(bucketStart),
            status: 'unavailable',
          });
        }
      }
    }

    return Array.from(carMap.values());
  }, [dateComponents]);
};
