import React from 'react';
import moment from 'moment';

const parseDate = (timeString) => {
    return moment(timeString, 'HH:mm DD-MM-YYYY');
};


const Timeline = ({ timeline }) => {
    const sortedTimeline = [...timeline].sort((a, b) =>
        parseDate(b.time) - parseDate(a.time)
    );


    const classColor = (type) => {
        switch (type) {
            case 'completed':
                return 'success';
            case 'failed':
                return 'danger';
            case 'pending':
            default:
                return 'secondary';
        }
    }

    return (
        <>
            {sortedTimeline.map((item, index) => (
                <div key={index} className="d-flex mb-3">
                    <div className="flex-shrink-0 me-3">
                        <div
                            className={`
                rounded-circle d-flex align-items-center justify-content-center
                bg-${classColor(item.type)}
              `}
                            style={{ width: '12px', height: '12px' }}
                        />
                        {index < sortedTimeline.length - 1 && (
                            <div
                                className="mx-auto"
                                style={{ width: '2px', height: '40px', marginTop: '4px', backgroundColor: 'lightgray' }}
                            />
                        )}
                    </div>
                    <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start mb-1">
                            <small className="text-muted">{item.time}</small>
                            <small className={`fw-bold text-${classColor(item.type)}`}>
                                {item.note}
                            </small>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default Timeline;