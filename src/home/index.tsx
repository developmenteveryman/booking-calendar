import { useState } from 'preact/hooks';
import './experiences.css';
import experiencesData from '@/mock/data/experiences.json';
import supercarBanner from '/public/images/Supercar_Banner.jpg';
import type { Experience } from '@/mock/types/experience';
import BookingModal from '@/components/BookingModal';

export const Experiences = () => {
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);
  return (
    <div className="booking-calendar">
      {/* Banner */}
      <div className="booking-calendar__banner">
        <img
          src={supercarBanner}
          alt="Special Offers Banner"
          className="booking-calendar__banner-image"
        />
        <div className="booking-calendar__banner-title">Browse Our Range Of Experiences</div>
      </div>

      {/* Experiences Grid */}
      <div className="booking-calendar__grid">
        {experiencesData.map((exp, index) => (
          <div className="booking-calendar__card" key={index}>
            <img
              src={`/images/${exp.image}`}
              alt={exp.title}
              className="booking-calendar__card-image"
            />
            <div className="booking-calendar__card-body">
              <h3 className="booking-calendar__card-title">{exp.title}</h3>
              <p className="booking-calendar__card-description">{exp.description}</p>
            </div>
            <div className="booking-calendar__card-footer">
              <span className="booking-calendar__card-price">
                {exp.price ? `£${exp.price}` : 'Price on request'}
              </span>
              <div className="booking-calendar__card-actions">
                <button className="btn btn-danger" onClick={() => setSelectedExperience(exp)}>
                  Book now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedExperience && (
        <BookingModal
          selectedExperience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
        />
      )}
    </div>
  );
};
