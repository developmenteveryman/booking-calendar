import { type FunctionalComponent } from 'preact';
import moment from 'moment';
import { type EventType } from '@/mock/types/eventType';
import './eventModal.css';

type EventModalProps = {
  show: boolean;
  onHide: () => void;
  event: EventType | null;
};

const EventModal: FunctionalComponent<EventModalProps> = ({ show, onHide, event }) => {
  if (!show || !event) return null;

  return (
    <>
      {show && <div className="booking-calendar_custom-backdrop" onClick={onHide}></div>}
      <div
        className={`modal booking-calendar_modal fade ${show ? 'show d-block' : ''}`}
        tabIndex={-1}
        role="dialog"
        data-id={event.event}
      >
        <div
          className="modal-dialog booking-calendar_modal-event-dialog  modal-lg modal-dialog-centered b-0"
          role="document"
        >
          <div
            className="modal-content venue-item venue-block"
            style={{ backgroundColor: 'transparent', border: 'none', borderRadius: 0 }}
          >
            {/* Header */}
            <div className="modal-header bg-dark text-white" style={{ borderRadius: 0 }}>
              <h5 className="modal-title booking-calendar_modal-event-title">{event.event}</h5>
              <button
                type="button"
                className="close text-white"
                aria-label="Close"
                onClick={onHide}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {/* Body */}
            <div className="modal-body p-0" data-id={event.event}>
              <div className="row m-0 align-items-stretch">
                {/* Left column */}
                <div className="col-12 p-0 col-md-3 bg-dark text-white">
                  <div className="p-3 text-left">
                    <h3 className="text-truncate text-center">
                      <span>{event.location.split(' ')[0]}</span>
                    </h3>
                    <div>
                      <h6>Date</h6>
                      <p>{moment.unix(event.date).format("Do MMM 'YY")}</p>
                    </div>
                    <div>
                      <h6>Location</h6>
                      <p>{event.location}</p>
                    </div>
                    <div>
                      <h6>Directions</h6>
                      {event.directionsUrl && (
                        <p>
                          <a
                            href={event.directionsUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'white', fontSize: '12px' }}
                          >
                            {event.directionsText}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Middle column (image) */}
                <div className="col-12 p-0 col-md">
                  <div className="track-bg h-100 d-flex justify-content-center p-4">
                    <img
                      alt={event.event}
                      src={event.image}
                      className="img-fluid"
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </div>

                {/* Right column (track details) */}
                <div className="col-12 p-0 col-md-3 bg-dark text-white">
                  <div className="p-3 text-left">
                    <h3 className="inverse text-center">
                      <span>Track</span>
                    </h3>
                    <div className="details section">
                      <h6>Details</h6>
                      <p>{event.details}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventModal;
