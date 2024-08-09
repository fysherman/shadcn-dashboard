'use client';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { useSidebar } from '@/hooks/useSidebar';
import { useEffect, useRef } from 'react';
import { delay } from '@/lib/utils';
import { EventClickArg, EventSourceInput } from '@fullcalendar/core/index.js';
import { useUserStore } from '@/store/user-store';
import { ROLES } from '@/constants';

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
  const role = useUserStore((state) => state.role);
  const ref = useRef<Calendar>(null);
  const isMinimized = useSidebar((state) => state.isMinimized);

  async function updateSize() {
    // await sidebar finish animate
    await delay(500);

    if (!ref.current) return;

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
        right:
          role === ROLES.COLLABORATOR
            ? 'today prev,next createButton'
            : 'today prev,next'
      }}
      events={events}
      eventClassNames=" cursor-pointer"
      eventClick={eventClick}
      dateClick={handleDateClick}
      unselectAuto={false}
      unselect={() => dateClick()}
    />
  );
}
