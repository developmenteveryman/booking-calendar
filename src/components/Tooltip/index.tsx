import type { FC } from 'react';

type TooltipProps = {
    children: React.ReactNode;
    tooltip?: string;
};

const Tooltip: FC<TooltipProps> = ({ children, tooltip }) => {
    return (
        <div className="booking-calendar_tooltip-wrapper">
            {children}
            {tooltip && tooltip !== '' && (
                <div className="tooltip booking-calendar_tooltip" role="tooltip">
                    <div className="booking-calendar_tooltip-inner">{tooltip}</div>
                    <div className="booking-calendar_tooltip-arrow" />
                </div>
            )}
        </div>
    );
};

export default Tooltip;
