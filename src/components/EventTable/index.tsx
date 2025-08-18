import { useState } from 'preact/hooks';
import moment from 'moment';
import { type EventType } from '@/mock/types/eventType';
import events from '@/mock/data/events.json';
import cars from '@/mock/data/cars.json';
import './eventTable.css';
import EventModal from '@/components/EventModal';
import EventTimesTable from '@/components/EventTimesTable';

const EventTable = () => {
  const [viewMore, setViewMore] = useState<EventType | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleView = (event: EventType) => {
    setViewMore(event);
    setShowModal(true);
  };

  if (selectedEvent) {
    return (
      <div className="p-3">
        <button className="btn btn-outline-secondary mb-3" onClick={() => setSelectedEvent(null)}>
          ← Back to Events
        </button>

        <EventTimesTable
          cars={cars}
          date={selectedEvent.date}
          selectedEvent={selectedEvent.event}
        />
      </div>
    );
  }
  return (
    <>
      {/* Desktop Table */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-sm table-striped table-bordered text-center">
          <thead className="thead-dark">
            <tr>
              <th>Date</th>
              <th>Event Details</th>
              <th>Location</th>
              <th>Start Time</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {events.map((event, index) => (
              <tr key={index}>
                <td>{moment.unix(event.date).format("Do MMM 'YY")}</td>
                <td>{event.event}</td>
                <td>{event.location}</td>
                <td>{event.time}</td>
                <td>
                  <button
                    className="btn booking-calendar_btn-secondary mr-2"
                    data-toggle="modal"
                    data-target="#eventModal"
                    onClick={() => handleView(event)}
                  >
                    View
                  </button>
                  <button
                    className="btn booking-calendar_btn-success"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="d-md-none">
        {events.map((event, index) => (
          <div key={index} className="mobile-event-card">
            <h5 className="mobile-event-title">{event.event}</h5>
            <div className="mobile-event-details">
              <div>
                <strong>Date:</strong> {moment.unix(event.date).format("Do MMM 'YY")}
              </div>
              <div>
                <strong>Location:</strong> {event.location}
              </div>
              <div>
                <strong>Start Time:</strong> {event.time}
              </div>
              <div className="mobile-event-buttons">
                <button
                  className="btn booking-calendar_btn-secondary mr-2"
                  data-toggle="modal"
                  data-target="#eventModal"
                  onClick={() => handleView(event)}
                >
                  View
                </button>
                <button
                  className="btn booking-calendar_btn-success"
                  onClick={() => setSelectedEvent(event)}
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Event Modal */}
      <EventModal event={viewMore} show={showModal} onHide={() => setShowModal(false)} />
    </>
  );
};

export default EventTable;
