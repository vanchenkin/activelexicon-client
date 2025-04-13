import React from 'react';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

interface NotificationTimePickerModalProps {
  visible: boolean;
  currentTime: Date;
  onChange: (event: DateTimePickerEvent, selectedDate?: Date) => void;
}

export default function NotificationTimePickerModal({
  visible,
  currentTime,
  onChange,
}: NotificationTimePickerModalProps) {
  if (!visible) return null;

  return (
    <DateTimePicker
      value={currentTime}
      mode="time"
      is24Hour={true}
      display="default"
      onChange={onChange}
    />
  );
}
