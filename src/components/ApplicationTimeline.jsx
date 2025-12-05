import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ApplicationTimeline = ({ application }) => {
  const events = [
    {
      date: application.createdAt,
      title: 'Applied',
      description: `Applied for ${application.job?.title}`,
      status: 'completed'
    }
  ];

  if (application.status === 'SHORTLISTED') {
    events.push({
      date: application.shortlistedAt,
      title: 'Shortlisted',
      description: 'Your application was shortlisted',
      status: 'completed'
    });
  }

  if (application.status === 'REVIEWING') {
    events.push({
      date: application.shortlistedAt,
      title: 'Shortlisted',
      description: 'Your application was shortlisted',
      status: 'completed'
    });
    events.push({
      date: application.reviewingAt,
      title: 'Under Review',
      description: 'Your application is being reviewed',
      status: 'current'
    });
  }

  if (application.status === 'ACCEPTED') {
    events.push({
      date: application.shortlistedAt,
      title: 'Shortlisted',
      status: 'completed'
    });
    events.push({
      date: application.reviewingAt,
      title: 'Under Review',
      status: 'completed'
    });
    events.push({
      date: application.acceptedAt,
      title: 'Accepted',
      description: 'Congratulations! Your application was accepted',
      status: 'completed'
    });
  }

  if (application.status === 'REJECTED') {
    events.push({
      date: application.rejectedAt,
      title: 'Rejected',
      description: 'Unfortunately, your application was not selected',
      status: 'completed'
    });
  }

  return (
    <div className="timeline">
      {events.map((event, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-marker">
            {event.status === 'completed' && <CheckCircle size={24} />}
            {event.status === 'current' && <Clock size={24} />}
          </div>
          <div className="timeline-content">
            <h4>{event.title}</h4>
            {event.description && <p>{event.description}</p>}
            <span className="timeline-date">
              {new Date(event.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationTimeline;
