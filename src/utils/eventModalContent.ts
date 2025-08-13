export type EventType = 'premium' | 'fullLicence' | 'junior';

type Feature = {
  icon: string;
  label: string;
};

export type EventModalContentData = {
  title: string;
  description: string;
  features: Feature[];
  image: string;
  link?: string;
  showButtons: boolean;
};

export const getEventModalContent = (type: EventType): EventModalContentData => {
  const contentMap: Record<EventType, EventModalContentData> = {
    premium: {
      title: 'Premium Events',
      description:
        'Premium Events are focussed on giving you more access and more time with the cars, all while allowing you to drive the most prestigious circuits in the country. With limited driver numbers, these exclusive events mean you can utilise the full capacity of the cars and circuits at the fraction of the cost of a track day package from the venues themselves.',
      features: [
        { icon: 'black-flag.svg', label: 'Iconic Circuits' },
        { icon: 'black-star.svg', label: 'Limited Driver Numbers' },
        { icon: 'black-car.svg', label: 'More Time on track' },
      ],
      image: 'Premium_Lightbox.jpg',
      link: '/premium-events',
      showButtons: true,
    },
    fullLicence: {
      title: 'Full Licence Events',
      description:
        'Full licence events are selected events whereby the venue operators require all drivers to hold a full car driving licence. We accept both UK and international driving licences as long as they enable you to drive a car legally on UK roads.',
      features: [],
      image: 'Full_Licence_Lightbox.jpg',
      showButtons: false,
    },
    junior: {
      title: 'Junior Events',
      description:
        'Junior events are selected events that are dedicated to young drivers and non-licence holders. Drivers can be as young as 10 years old, providing they can reach the pedals with the padding we provide. Minimum height restriction for junior drivers is 135cm. With ARDS and ADI qualified instructors, we provide a safe, exciting first driving experience for young petrolheads.',
      features: [],
      image: 'Junior_Lightbox.jpg',
      showButtons: false,
    },
  };

  return contentMap[type];
};
