import {useEffect} from 'react';
import events from '../lib/events';

export default function useCommentEventEffect({
    refreshComment,
    removeComment,
    updateComment,
    enabled
}) {
  useEffect(() => {
    if (!enabled) {
        return;
    }
    events.addListener('refreshComment', refreshComment);
    events.addListener('removeComment', removeComment);
    events.addListener('updateComment', updateComment);
    return () => {
      events.removeListener('refreshComment', refreshComment);
      events.removeListener('removeComment', removeComment);
      events.removeListener('updateComment', updateComment);
    };
  }, [refreshComment, removeComment, updateComment, enabled]);
}