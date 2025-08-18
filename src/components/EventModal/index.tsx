import { type FunctionalComponent } from 'preact';
import moment from 'moment';
import { type EventType } from '@/mock/types/eventType';

type EventModalProps = {
  show: boolean;
  onHide: () => void;
  event: EventType | null;
};

const EventModal: FunctionalComponent<EventModalProps> = ({ show, onHide, event }) => {
  if (!show || !event) return null;

  return (
    <div
      className={`modal fade ${show ? 'show d-block' : ''}`}
      tabIndex={-1}
      role="dialog"
      style={{ background: 'rgba(0,0,0,0.5)' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header bg-dark text-white">
            <h5 className="modal-title">{event.event}</h5>
            <button type="button" className="close text-white" aria-label="Close" onClick={onHide}>
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          {/* Body */}
          <div className="modal-body p-0">
            <div className="row m-0 align-items-stretch">
              {/* Left column */}
              <div className="col-12 col-md-3 bg-dark text-white p-3">
                <h5>{moment.unix(event.date).format("Do MMM 'YY")}</h5>
                <div>
                  <h6>Location</h6>
                  <p>{event.location}</p>
                </div>
                <div>
                  <h6>Directions</h6>
                  <p>
                    <a
                      href={event.directionsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white"
                      style={{ textDecoration: 'underline' }}
                    >
                      {event.directionsText}
                    </a>
                  </p>
                </div>
              </div>

              {/* Middle column (image) */}
              <div className="col-12 col-md d-flex justify-content-center align-items-center p-4">
                <img src={event.image} alt={event.event} className="img-fluid rounded shadow-sm" />
              </div>

              {/* Right column (details) */}
              <div className="col-12 col-md-3 bg-dark text-white p-3">
                <h5>Track Details</h5>
                <p>{event.details}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
