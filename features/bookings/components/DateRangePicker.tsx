import { useState } from 'react';
import { Calendar } from 'react-native-calendars';
import { Text, YStack } from 'tamagui';
import { toYYYYMMDD } from '../../../lib/date-utils';

interface Props {
  startDate: string | null;
  endDate: string | null;
  onRangeSelected: (start: string, end: string) => void;
}

export function DateRangePicker({ startDate, endDate, onRangeSelected }: Props) {
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  const today = toYYYYMMDD(new Date());

  function buildMarked() {
    if (!startDate) return {};
    const marked: Record<string, object> = {
      [startDate]: {
        startingDay: true,
        color: '#2563EB',
        textColor: 'white',
      },
    };
    if (endDate && endDate > startDate) {
      marked[endDate] = { endingDay: true, color: '#2563EB', textColor: 'white' };
      let cur = new Date(startDate);
      cur.setDate(cur.getDate() + 1);
      while (toYYYYMMDD(cur) < endDate) {
        marked[toYYYYMMDD(cur)] = { color: '#DBEAFE', textColor: '#1D4ED8' };
        cur.setDate(cur.getDate() + 1);
      }
    }
    return marked;
  }

  function handleDayPress(day: { dateString: string }) {
    if (selecting === 'start') {
      onRangeSelected(day.dateString, '');
      setSelecting('end');
    } else {
      if (startDate && day.dateString > startDate) {
        onRangeSelected(startDate, day.dateString);
        setSelecting('start');
      } else {
        onRangeSelected(day.dateString, '');
        setSelecting('end');
      }
    }
  }

  return (
    <YStack gap="$2">
      <Text fontSize="$3" color="$colorSubtle">
        {selecting === 'start' ? 'Select pickup date' : 'Select return date'}
      </Text>
      <Calendar
        minDate={today}
        markedDates={buildMarked()}
        markingType="period"
        onDayPress={handleDayPress}
        theme={{
          selectedDayBackgroundColor: '#2563EB',
          todayTextColor: '#2563EB',
          arrowColor: '#2563EB',
          textDayFontFamily: 'System',
          textMonthFontFamily: 'System',
          textDayHeaderFontFamily: 'System',
          textDayFontSize: 14,
          textMonthFontSize: 15,
          textDayHeaderFontSize: 13,
        }}
        style={{ borderRadius: 16, overflow: 'hidden' }}
      />
    </YStack>
  );
}
