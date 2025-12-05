import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConversation } from '../store/slices/application.slice';
import { MessageCircle } from 'lucide-react';

const ConversationThread = ({ applicationId }) => {
  const dispatch = useDispatch();
  const { currentConversation, messageLoading } = useSelector(state => state.application || {});
  const { user } = useSelector(state => state.user || {});

  useEffect(() => {
    if (applicationId) {
      dispatch(getConversation(applicationId));
    }
  }, [dispatch, applicationId]);

  if (messageLoading) {
    return (
      <div className="conversation-loading">
        <p>Loading messages...</p>
      </div>
    );
  }

  if (!currentConversation?.messages || currentConversation.messages.length === 0) {
    return (
      <div className="conversation-empty">
        <MessageCircle size={32} />
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="conversation-thread">
      {currentConversation.messages.map((msg, idx) => {
        const isOwn = msg.sender?._id === user?._id;
        return (
          <div
            key={idx}
            className={`message ${isOwn ? 'message--own' : 'message--other'}`}
          >
            <div className="message-sender">
              {msg.sender?.fullName || 'Anonymous'}
            </div>
            <div className="message-content">
              {msg.content}
            </div>
            <div className="message-time">
              {new Date(msg.createdAt).toLocaleString()}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationThread;
