import { type FunctionalComponent } from 'preact';
import moment from 'moment';

type Slot = {
  time: string;
  status: string;
};

type CarSlotGroup = {
  id: number;
  name: string;
  fromPrice?: number;
  image?: string;
  slots: Slot[];
};

interface Props {
  cars: CarSlotGroup[];
  date?: number;
  selectedEvent?: string;
}

const EventTimesTable: FunctionalComponent<Props> = ({ cars, date, selectedEvent }) => {
  const formattedDate = date
    ? moment.unix(date).format('dddd Do MMMM YYYY').toLocaleUpperCase()
    : '';
  const singleCarMode = cars.length === 1;

  return (
    <div className="container my-4">
      {selectedEvent && (
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
          <div
            className="p-2 mb-2"
            style={{
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              textAlign: 'left',
            }}
          >
            Available time slots for <strong>{formattedDate}</strong> at{' '}
            <strong>{selectedEvent}</strong>
          </div>
        </div>
      )}

      {cars.length === 0 ? (
        <div className="alert alert-warning">No cars or times available.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center mb-0">
            <thead className="thead-dark">
              <tr>
                <th style={{ width: '220px' }}>Car</th>
                <th colSpan={6}>Time Slots</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => {
                const isDisabled = singleCarMode && cars[0].id !== car.id;

                return (
                  <tr key={car.id} className={isDisabled ? 'table-secondary' : ''}>
                    <td className="p-0 align-top" style={{ width: '220px' }}>
                      <div className="position-relative text-white" style={{ height: '120px' }}>
                        <img
                          src={`/images/${car.image}`}
                          alt={car.name}
                          className="img-fluid w-100 h-100"
                          style={{ objectFit: 'cover', borderRadius: 0 }}
                        />

                        <div
                          className="position-absolute w-100 h-100"
                          style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            top: 0,
                            left: 0,
                          }}
                        />

                        {car.fromPrice && (
                          <div
                            className="position-absolute bg-success text-white px-2 py-1 font-weight-bold"
                            style={{ fontSize: '0.8rem', top: 0, left: 0 }}
                          >
                            From £{car.fromPrice}
                          </div>
                        )}

                        <div
                          className="position-absolute text-center font-weight-bold"
                          style={{
                            padding: '4px',
                            fontSize: '0.9rem',
                            bottom: 0,
                            left: 0,
                            width: '100%',
                          }}
                        >
                          {car.name}
                        </div>
                      </div>
                    </td>

                    <td colSpan={6} style={{ padding: 0 }}>
                      <div
                        className="d-flex flex-row"
                        style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}
                      >
                        {car.slots.map((slot, idx) => {
                          const [start, end] = slot.time.split(' - ');
                          const label = `${start} - ${end}`;

                          const btnClass =
                            slot.status === 'available' && !isDisabled
                              ? 'btn btn-success btn-sm m-1'
                              : 'btn btn-outline-secondary btn-sm m-1 disabled';

                          return (
                            <button
                              key={idx}
                              className={btnClass}
                              disabled={slot.status !== 'available'}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventTimesTable;
