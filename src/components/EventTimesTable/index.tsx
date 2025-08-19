import { type FunctionalComponent } from 'preact';
import { useState, useMemo } from 'preact/hooks';
import './eventTimesTable.css';

type SlotStatus = 'available' | 'nearlyFull' | 'fullyBooked';
type Slot = {
  time: string;
  status: SlotStatus;
  upgrade?: string;
};

type CarSlotGroup = {
  id: number;
  name: string;
  fromPrice?: number;
  upgrade?: string;
  image?: string;
  slots: Slot[];
  maxSlots?: number;
};

interface Props {
  cars: CarSlotGroup[];
  selectedEvent?: string;
  onBack: () => void;
}

interface SelectionState {
  slotTimes: { [carId: number]: string[] };
}

const EventTimesTable: FunctionalComponent<Props> = ({ cars, selectedEvent, onBack }) => {
  const [selection, setSelection] = useState<SelectionState>({ slotTimes: {} });
  const [showBackWarning, setShowBackWarning] = useState(false);
  // Quick lookup for cars
  const carMap = useMemo(() => {
    const map = new Map<number, CarSlotGroup>();
    cars.forEach((car) => map.set(car.id, car));
    return map;
  }, [cars]);

  const parseUpgrade = (upgrade?: string | number): number => {
    if (!upgrade) return 0;
    if (typeof upgrade === 'number') return upgrade;
    const parsed = parseFloat(upgrade.replace(/[^\d.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const getCarAdditionalCost = (car: CarSlotGroup): number => {
    const carUpgrade = parseUpgrade(car.upgrade);
    const slotUpgrades = (selection.slotTimes[car.id] || []).reduce((sum, time) => {
      const slot = car.slots.find((s) => s.time === time);
      return sum + parseUpgrade(slot?.upgrade);
    }, 0);
    return carUpgrade + slotUpgrades;
  };

  const getMaxSlots = (carId: number) => {
    const car = carMap.get(carId);
    if (!car) return 1;
    return car.maxSlots ?? car.slots.length;
  };

  const handleSlotClick = (carId: number, time: string, status: SlotStatus) => {
    if (status === 'fullyBooked') return;

    setSelection((prev) => {
      const slotTimes = { ...prev.slotTimes };
      const carSlots = slotTimes[carId] ? [...slotTimes[carId]] : [];

      if (carSlots.includes(time)) {
        // remove time
        const updatedSlots = carSlots.filter((t) => t !== time);
        if (updatedSlots.length > 0) {
          slotTimes[carId] = updatedSlots;
        } else {
          delete slotTimes[carId];
        }
      } else {
        if (carSlots.length >= getMaxSlots(carId)) return prev;
        slotTimes[carId] = [...carSlots, time];
      }

      return { slotTimes };
    });
  };

  const getSlotClass = (carId: number, slot: Slot): SlotStatus | 'selected' => {
    if (selection.slotTimes[carId]?.includes(slot.time)) return 'selected';
    return slot.status;
  };

  const isSlotDisabled = (carId: number, slot: Slot): boolean => {
    if (slot.status === 'fullyBooked') return true;
    const selected = selection.slotTimes[carId] || [];
    return selected.length >= getMaxSlots(carId) && !selected.includes(slot.time);
  };

  const getBtnClass = (carId: number, slot: Slot) => {
    const statusClass = getSlotClass(carId, slot);
    const disabled = isSlotDisabled(carId, slot);

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
        statusBtnClass = 'btn btn-outline-secondary';
    }

    return `booking-calendar_slot-btn ${statusBtnClass} btn-sm m-1 position-relative ${
      disabled ? 'not-allowed' : ''
    }`;
  };

  const handleRemoveCar = (carId: number) => {
    setSelection((prev) => {
      const copy = { ...prev, slotTimes: { ...prev.slotTimes } };
      delete copy.slotTimes[carId];
      return copy;
    });
  };

  // Duplicate slot detection
  const duplicateSlotTimes = useMemo(() => {
    const duplicates: string[] = [];
    const allTimes: string[] = [];
    Object.values(selection.slotTimes).forEach((times) =>
      times.forEach((time) => {
        if (allTimes.includes(time) && !duplicates.includes(time)) {
          duplicates.push(time);
        } else {
          allTimes.push(time);
        }
      }),
    );
    return duplicates;
  }, [selection]);
  return (
    <div className="container my-4 booking-calendar_table-wrapper">
      {showBackWarning && (
        <div className="alert alert-warning mb-3">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-center">
            <span className="mb-2 mb-lg-0">Going back will reset your selection. Continue?</span>
            <div className="d-flex flex-wrap">
              <button
                className="btn btn-sm btn-danger mr-2"
                onClick={() => {
                  setSelection({ slotTimes: {} });
                  setShowBackWarning(false);
                  onBack();
                }}
              >
                Confirm
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setShowBackWarning(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {(selectedEvent || Object.keys(selection.slotTimes).length > 0) && (
        <div className="mb-3 p-3 booking-calendar_selection-summary">
          {selectedEvent && (
            <div className="mb-2 d-flex justify-content-between align-items-flex-start">
              <div className="text-left">
                <strong>You have selected the following venue:</strong> {selectedEvent}
              </div>
              <button
                className="btn btn-sm btn-outline-secondary mb-3"
                onClick={() => setShowBackWarning(true)}
              >
                Back
              </button>
            </div>
          )}

          {Object.keys(selection.slotTimes).length > 0 && (
            <div className="d-flex flex-column text-left">
              <strong className="mb-1">You have selected the following car(s):</strong>
              <ul className="list-unstyled mb-0">
                {Object.keys(selection.slotTimes).map((carIdStr) => {
                  const carId = parseInt(carIdStr, 10);
                  const car = carMap.get(carId);
                  if (!car) return null;
                  return (
                    <li
                      key={carId}
                      className="d-flex justify-content-between align-items-center mb-1"
                    >
                      <div>
                        {car.name}
                        {selection.slotTimes[carId]?.length > 0 &&
                          getCarAdditionalCost(car) > 0 && (
                            <span className="ml-2 text-muted">
                              (Additional Costs: £{getCarAdditionalCost(car).toFixed(2)})
                            </span>
                          )}
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleRemoveCar(carId)}
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {duplicateSlotTimes.length > 0 && (
        <div className="alert alert-warning mb-2">
          You have selected the same time for multiple cars: {duplicateSlotTimes.join(', ')}
        </div>
      )}

      <div className="mt-3 d-flex flex-wrap align-items-center booking-calendar_legend-container mb-3">
        <div className="booking-calendar_legend booking-calendar_legend-fullybooked flex-fill">
          Fully booked
        </div>
        <div className="booking-calendar_legend booking-calendar_legend-nearlyfull flex-fill">
          Nearly full
        </div>
        <div className="booking-calendar_legend booking-calendar_legend-available flex-fill">
          Available
        </div>
        <div className="booking-calendar_legend booking-calendar_legend-selected flex-fill">
          Selected
        </div>
      </div>

      {cars.length === 0 ? (
        <div className="alert alert-warning">No cars or times available.</div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="table-responsive d-none d-md-block">
            <table className="table table-bordered align-middle text-center mb-0">
              <thead className="thead-dark sticky-top">
                <tr>
                  <th style={{ width: '220px' }}>Car</th>
                  <th>Time Slots</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td className="p-0 align-top booking-calendar_car-cell">
                      <div className="position-relative text-white booking-calendar_car-wrapper">
                        {car.image && (
                          <img
                            src={`/images/${car.image}`}
                            alt={car.name}
                            className="img-fluid w-100 h-100"
                            style={{ objectFit: 'cover', borderRadius: 0 }}
                          />
                        )}
                        <div className="booking-calendar_car-overlay" />
                        {car.upgrade && (
                          <div className="booking-calendar_car-price">From {car.upgrade}</div>
                        )}
                        <div className="booking-calendar_car-name">{car.name}</div>
                      </div>
                    </td>
                    <td className="p-0 align-middle">
                      <div className="d-flex flex-wrap align-items-center booking-calendar_slots-container">
                        {car.slots.map((slot, idx) => (
                          <button
                            key={idx}
                            className={getBtnClass(car.id, slot)}
                            onClick={() => handleSlotClick(car.id, slot.time, slot.status)}
                            disabled={isSlotDisabled(car.id, slot)}
                            title={
                              isSlotDisabled(car.id, slot) &&
                              !selection.slotTimes[car.id]?.includes(slot.time)
                                ? 'Max slots selected'
                                : ''
                            }
                          >
                            {slot.time}
                            {slot.upgrade && (
                              <div className="booking-calendar_slot-upgrade">+{slot.upgrade}</div>
                            )}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="d-block d-md-none booking-calendar_mobile-cards-wrapper">
            {cars.map((car) => (
              <div key={car.id} className="col-12 mb-3 p-0">
                <div className="card booking-calendar_car-card">
                  <div className="position-relative">
                    {car.image && (
                      <img
                        src={`/images/${car.image}`}
                        className="card-img-top car-card-img"
                        alt={car.name}
                      />
                    )}
                    <div className="booking-calendar_car-card-overlay" />
                    {car.upgrade && (
                      <span className="badge badge-danger booking-calendar_upgrade-badge">
                        {car.upgrade}
                      </span>
                    )}
                    <div className="booking-calendar_car-card-title">{car.name}</div>
                  </div>
                  <div className="card-body booking-calendar_car-card-body p-2">
                    <div className="booking-calendar_slots-grid-mobile">
                      {car.slots.map((slot, idx) => (
                        <button
                          key={idx}
                          className={getBtnClass(car.id, slot)}
                          onClick={() => handleSlotClick(car.id, slot.time, slot.status)}
                          disabled={isSlotDisabled(car.id, slot)}
                          title={
                            isSlotDisabled(car.id, slot) &&
                            !selection.slotTimes[car.id]?.includes(slot.time)
                              ? 'Max slots selected'
                              : ''
                          }
                        >
                          {slot.time}
                          {slot.upgrade && (
                            <div className="booking-calendar_slot-upgrade">+{slot.upgrade}</div>
                          )}
                        </button>
                      ))}
                    </div>

                    {selection.slotTimes[car.id]?.length > 0 && getCarAdditionalCost(car) > 0 && (
                      <div className="mt-2">
                        <strong>Additional Costs:</strong> £{getCarAdditionalCost(car).toFixed(2)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default EventTimesTable;
