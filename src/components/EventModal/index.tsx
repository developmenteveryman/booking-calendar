import React from 'react';
import type { Nullable } from '../../types/common';
import type { EventRow } from '../../types/event';
import './eventModal.css';

type EventModalProps = {
    show: boolean;
    onHide: () => void;
    event: Nullable<EventRow>;
};

const EventModal: React.FC<EventModalProps> = ({ show, onHide, event }) => {
    if (!show || !event) return null;

    return (
        <>
            {show && <div className="booking-calendar_custom-backdrop" onClick={onHide}></div>}
            <div
                className={`modal booking-calendar_modal fade ${show ? 'show d-block' : ''}`}
                tabIndex={-1}
                role="dialog"
                style={{ background: 'rgba(0,0,0,0.5)' }}
            >
                <div
                    className="modal-dialog booking-calendar_modal-event-dialog modal-lg modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content venue-item venue-block">
                        {/* Header */}
                        <div className="modal-header bg-dark text-white">
                            <h5 className="modal-title  booking-calendar_modal-event-title">
                                {event.venuedescription}
                            </h5>
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
                        <div className="modal-body p-0">
                            <div className="row m-0 align-items-stretch">
                                {/* Left column */}
                                <div className="col-12 col-md-3 bg-dark text-white p-3">
                                    <div className="p-3 text-left">
                                        <h3 className="text-truncate text-center">
                                            <span>{event.venuelocation.split(' ')[0]}</span>
                                        </h3>
                                        <div>
                                            <h6>Date</h6>
                                            <p>{event.dateString}</p>
                                        </div>
                                        <div>
                                            <h6>Location</h6>
                                            <p>{event.venuelocation}</p>
                                        </div>
                                        <div>
                                            <h6>Directions</h6>
                                            <p>
                                                <a
                                                    // href={event.directionsUrl}
                                                    href={'#'}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-white"
                                                    style={{
                                                        color: 'white',
                                                        fontSize: '12px',
                                                        textDecoration: 'underline',
                                                    }}
                                                >
                                                    {/* {event.directionsText} */}
                                                    Testing
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Middle column (image) */}
                                <div className="flex-grow-1">
                                    <div className="track-bg h-100 d-flex justify-content-center p-4">
                                        <img
                                            // src={event.trackimage}
                                            src={''}
                                            alt={event.venuedescription}
                                            className="img-fluid rounded shadow-sm"
                                            style={{ objectFit: 'contain' }}
                                        />
                                    </div>
                                </div>

                                {/* Right column (details) */}
                                <div className="col-12 col-md-3 bg-dark text-white p-3">
                                    <div className="p-3 text-left">
                                        <h3 className="inverse text-center">
                                            <span>Track</span>
                                        </h3>
                                        <div className="details section">
                                            <h6>Details</h6>
                                            {/* <p>{event.details}</p> */}
                                            <p>Testing</p>
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
