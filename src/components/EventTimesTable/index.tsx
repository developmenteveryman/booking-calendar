import { type FunctionalComponent } from 'preact';
import { useState } from 'preact/hooks';
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
};

interface Props {
  cars: CarSlotGroup[];
  date?: number;
  selectedEvent?: string;
}

const EventTimesTable: FunctionalComponent<Props> = ({ cars, selectedEvent }) => {
  const [selectedCarIds, setSelectedCarIds] = useState<number[]>([]);
  const [selectedSlotTimes, setSelectedSlotTimes] = useState<{ [carId: number]: string[] }>({});

  const handleSlotClick = (carId: number, slotTime: string, status: SlotStatus) => {
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
  };

  const getSlotClass = (slot: Slot, carId: number): SlotStatus | 'selected' => {
    if (selectedSlotTimes[carId]?.includes(slot.time)) return 'selected';
    return slot.status;
  };

  const getBtnClass = (slot: Slot, carId: number) => {
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

  const handleRemoveVenue = () => {
    setSelectedCarIds([]);
    setSelectedSlotTimes({});
  };

  const handleRemoveCar = (carId: number) => {
    setSelectedCarIds((prev) => prev.filter((id) => id !== carId));
    setSelectedSlotTimes((prev) => {
      const copy = { ...prev };
      delete copy[carId];
      return copy;
    });
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
    <div className="container my-4 booking-calendar_table-wrapper">
      {/* Selection Summary */}
      {(selectedEvent || selectedCarIds.length > 0) && (
        <div className="mb-3 p-3 booking-calendar_selection-summary">
          {selectedEvent && (
            <div className="mb-2 d-flex justify-content-between align-items-center">
              <div>
                <strong>You have selected the following venue:</strong> {selectedEvent}
              </div>
              <button className="btn btn-sm btn-outline-danger" onClick={handleRemoveVenue}>
                Remove
              </button>
            </div>
          )}

          {selectedCarIds.length > 0 && (
            <div className="d-flex flex-column text-left">
              <strong className="mb-1">You have selected the following car(s):</strong>
              <ul className="list-unstyled mb-0">
                {selectedCarIds.map((carId) => {
                  const car = cars.find((c) => c.id === carId);
                  if (!car) return null;
                  return (
                    <li
                      key={carId}
                      className="d-flex justify-content-between align-items-center mb-1"
                    >
                      <span>{car.name}</span>
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

      {/* Duplicate Time Warning */}
      {duplicateSlotTimes.length > 0 && (
        <div className="alert alert-warning mb-2">
          You have selected the same time for multiple cars: {duplicateSlotTimes.join(', ')}
        </div>
      )}

      {/* Legend */}
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

      {/* Cars Table */}
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
                  <th colSpan={6}>Time Slots</th>
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
                            className={`flex-fill ${getBtnClass(slot, car.id)}`}
                            onClick={() => handleSlotClick(car.id, slot.time, slot.status)}
                            disabled={slot.status === 'fullyBooked'}
                          >
                            {slot.time}
                            {slot.upgrade && (
                              <div className="booking-calendar_slot-upgrade">{slot.upgrade}</div>
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

          {/* Mobile Card Layout */}
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
                      {car.slots.map((slot, idx) => {
                        const statusClass = getSlotClass(slot, car.id);

                        const btnClass =
                          statusClass === 'available'
                            ? 'btn btn-success btn-sm m-1 flex-fill'
                            : statusClass === 'selected'
                              ? 'btn btn-secondary btn-sm m-1 flex-fill'
                              : statusClass === 'fullyBooked'
                                ? 'btn btn-danger btn-sm m-1 flex-fill'
                                : statusClass === 'nearlyFull'
                                  ? 'btn btn-nearlyfull btn-sm m-1 flex-fill'
                                  : 'btn btn-outline-secondary btn-sm m-1 disabled flex-fill';

                        return (
                          <button
                            key={idx}
                            className={`${btnClass} booking-calendar_slot-btn`}
                            onClick={() => handleSlotClick(car.id, slot.time, slot.status)}
                            disabled={slot.status === 'fullyBooked'}
                          >
                            {slot.time}
                            {slot.upgrade && (
                              <div className="booking-calendar_slot-upgrade">{slot.upgrade}</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
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
