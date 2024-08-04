'use client';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useSidebar } from '@/hooks/useSidebar';
import { useEffect, useRef } from 'react';
import { delay } from '@/lib/utils';
import { EventClickArg, EventSourceInput } from '@fullcalendar/core/index.js';

export default function FullCalendar({
  events,
  dateClick,
  eventClick,
  setOpenCreate
}: Readonly<{
  events?: EventSourceInput;
  dateClick: (arg?: DateClickArg) => void;
  eventClick: (arg: EventClickArg) => void;
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

  function handleDateClick(arg: DateClickArg) {
    if (!ref.current) return;

    dateClick(arg);
    ref.current.getApi().select({
      start: arg.date,
      allDay: true
    });
  }

  useEffect(() => {
    updateSize();
  }, [isMinimized]);

  return (
    <Calendar
      ref={ref}
      plugins={[dayGridPlugin, interactionPlugin]}
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
      events={events}
      eventBackgroundColor="hsl(142.1 76.2% 36.3%)"
      eventBorderColor="hsl(142.1 76.2% 36.3%)"
      eventClassNames=" cursor-pointer"
      eventClick={eventClick}
      dateClick={handleDateClick}
      unselectAuto={false}
      unselect={() => dateClick()}
    />
  );
}
