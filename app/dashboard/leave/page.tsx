'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import FullCalendar from '@/components/calendar/full-calendar';
import PageContainer from '@/components/main-layout/page-container';
import { useMemo, useState } from 'react';
import { EventClickArg, EventInput } from '@fullcalendar/core/index.js';
import { DateClickArg } from '@fullcalendar/interaction/index.js';
import { CreateDialog } from './create-dialog';
import { DetailDialog } from './detail-dialog';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';
import { Leave } from '@/types';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Quản lí nghỉ phép', link: '/dashboard/leave' }
];

export default function Page() {
  const fetcher = useFetcher({
    url: ENDPOINT.TICKETS,
    method: 'GET',
    triggerOnMount: true
  });
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date>();
  const [clickedEvent, setClickedEvent] = useState<Leave>();

  const eventColorMapping: Record<
    NonNullable<Leave['status']>,
    { text: string; background: string }
  > = {
    PENDING: {
      text: 'hsl(var(--secondary-foreground))',
      background: 'hsl(var(--secondary))'
    },
    APPROVED: {
      text: 'hsl(var(--primary-foreground))',
      background: 'hsl(var(--primary))'
    },
    REJECTED: {
      text: 'hsl(var(--destructive-foreground))',
      background: 'hsl(var(--destructive))'
    }
  };

  const events = useMemo(() => {
    const results: Leave[] = fetcher.data?.results ?? [];

    return results
      .map<EventInput | undefined>((item) => {
        if (!item) return undefined;

        const {
          id,
          title,
          status,
          from_date,
          to_date,
          approved_by,
          submitted_by,
          submitted_by_name
        } = item;

        if (
          [
            id,
            title,
            status,
            from_date,
            to_date,
            approved_by,
            submitted_by
          ].some((value) => value === null || value === undefined)
        )
          return undefined;

        const colorMapping =
          eventColorMapping[status as NonNullable<Leave['status']>];

        return {
          id: id?.toString(),
          title: `${title} - ${submitted_by_name}`,
          start: new Date(from_date as string),
          allDay: true,
          extendedProps: item,
          backgroundColor: colorMapping.background,
          borderColor: colorMapping.background,
          textColor: colorMapping.text
        };
      })
      .filter((item): item is EventInput => item !== undefined);
  }, [fetcher.data]);

  function eventClick(arg: EventClickArg) {
    setClickedEvent(arg.event.extendedProps as Leave);
    setOpenDetail(true);
  }

  function dateClick(arg?: DateClickArg) {
    setClickedDate(arg?.date);
  }

  return (
    <PageContainer scrollable={true}>
      <div className="space-y-4">
        <Breadcrumbs items={breadcrumbItems} />
        <FullCalendar
          events={events}
          dateClick={dateClick}
          eventClick={eventClick}
          setOpenCreate={setOpenCreate}
        />
        <CreateDialog
          open={openCreate}
          clickedDate={clickedDate}
          setOpen={setOpenCreate}
          reloadCalendar={fetcher.trigger}
        />
        <DetailDialog
          open={openDetail}
          event={clickedEvent}
          setOpen={setOpenDetail}
          reloadCalendar={fetcher.trigger}
        />
      </div>
    </PageContainer>
  );
}
