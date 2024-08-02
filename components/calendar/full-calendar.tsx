'use client';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useSidebar } from '@/hooks/useSidebar';
import { useEffect, useRef } from 'react';
import { delay } from '@/lib/utils';

export default function FullCalendar({
  setOpenCreate
}: Readonly<{
  setOpenCreate: (state: boolean) => void;
}>) {
  const ref = useRef<Calendar>(null);
  const isMinimized = useSidebar((state) => state.isMinimized);

  async function updateSize() {
    if (!ref.current) return;

    // await sidebar finish animate
    await delay(500);

    ref.current.getApi().updateSize();
  }

  useEffect(() => {
    updateSize();
  }, [isMinimized]);

  return (
    <Calendar
      ref={ref}
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      aspectRatio={2}
      fixedWeekCount={false}
      customButtons={{
        createButton: {
          text: 'Xin nghỉ phép',
          click() {
            setOpenCreate(true);
          }
        }
      }}
      headerToolbar={{
        right: 'today prev,next createButton'
      }}
    />
  );
}
