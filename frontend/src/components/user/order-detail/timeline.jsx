import React from 'react';
import moment from 'moment';
import OrderTimelineType from '~/constants/order-timeline-type';

const formatDate = (timeString) => {
    return moment(timeString).format('HH:mm:ss DD-MM-YYYY');
};

const Timeline = ({ timeline = [] }) => {
    if (!timeline || timeline.length === 0) {
        return <div className="text-center text-muted">Không có dữ liệu</div>;
    }

    const sortedTimeline = [...timeline].sort((a, b) =>
        formatDate(b.created_at) - formatDate(a.created_at)
    );


    const classColor = (type) => {
        switch (type) {
            case OrderTimelineType.COMPLETED:
                return 'success';
            case OrderTimelineType.PAID:
                return 'success';
            case OrderTimelineType.FAILED:
                return 'danger';
            case OrderTimelineType.PENDING:
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
                            <small className="text-muted">{formatDate(item.created_at)}</small>
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