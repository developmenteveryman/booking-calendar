import './experiences.css';
import experiencesData from '@/data/experiences.json';
import supercarBanner from '@/assets/images/Supercar_Banner.jpg';

export const Experiences = () => {
  return (
    <div className="react-calendar">
      {/* Banner */}
      <div className="react-calendar__banner">
        <img
          src={supercarBanner}
          alt="Special Offers Banner"
          className="react-calendar__banner-image"
        />
        <div className="react-calendar__banner-title">Browse Our Range Of Experiences</div>
      </div>

      {/* Experiences Grid */}
      <div className="react-calendar__grid">
        {experiencesData.map((exp, index) => (
          <div className="react-calendar__card" key={index}>
            <img
              src={new URL(`../../assets/images/${exp.image}`, import.meta.url).href} // for now, to support vite image import
              alt={exp.title}
              className="react-calendar__card-image"
            />
            <div className="react-calendar__card-body">
              <h3 className="react-calendar__card-title">{exp.title}</h3>
              <p className="react-calendar__card-description">{exp.description}</p>
            </div>
            <div className="react-calendar__card-footer">
              <span className="react-calendar__card-price">
                {exp.price ? `£${exp.price}` : 'Price on request'}
              </span>
              <div className="react-calendar__card-actions">
                <button className="react-calendar__button react-calendar__button--primary">
                  Book now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
