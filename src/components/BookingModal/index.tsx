import type { Experience } from '@/mock/types/experience';
import './bookingModal.css';
import EventTable from '@/components/EventTable';

type Props = {
  selectedExperience: Experience | null;
  onClose: () => void;
};

const BookingModal = ({ selectedExperience, onClose }: Props) => {
  if (!selectedExperience) return null;

  return (
    <div
      className="modal fade show  booking-calendar_modal"
      style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
      tabIndex={-1}
      aria-labelledby="bookingModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content booking-calendar_modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title mb-3" id="bookingModalLabel">
              Choose your preferred date and venue to see available cars
            </h5>
            <button type="button" className="close" onClick={onClose} aria-label="Close">
              &times;
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body">
            <EventTable />
          </div>

          {/* Modal Footer */}
          <div className="modal-footer booking-calendar_modal-footer">
            <button type="button" className="btn booking-calendar_btn-primary" onClick={onClose}>
              Apply Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
