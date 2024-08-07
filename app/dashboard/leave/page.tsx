'use client';
import { Breadcrumbs } from '@/components/breadcrumbs';
import FullCalendar from '@/components/calendar/full-calendar';
import PageContainer from '@/components/main-layout/page-container';
import { useState } from 'react';
import { EventClickArg, EventSourceInput } from '@fullcalendar/core/index.js';
import { DateClickArg } from '@fullcalendar/interaction/index.js';
import { EventImpl } from '@fullcalendar/core/internal';
import { CreateDialog } from './create-dialog';
import { DetailDialog } from './detail-dialog';
import useFetcher from '@/lib/fetcher';
import { ENDPOINT } from '@/constants/endpoint';

const breadcrumbItems = [
  { title: 'Dashboard', link: '/dashboard' },
  { title: 'Quản lí nghỉ phép', link: '/dashboard/leave' }
];

export default function Page() {
  const { data } = useFetcher({
    url: ENDPOINT.TICKETS,
    method: 'GET',
    triggerOnMount: true
  });
  console.log('data', data);
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date>();
  const [clickedEvent, setClickedEvent] = useState<EventImpl>();
  // const events: EventSourceInput = [
  //   {
  //     id: '1',
  //     title: 'Nghỉ phép 34232423432',
  //     display: 'block',
  //     start: Date.now(),
  //     allDay: true
  //   }
  // ];
  const events = data?.results ?? [];

  function eventClick(arg: EventClickArg) {
    console.log(arg);
    setClickedEvent(arg.event);
    setOpenDetail(true);
  }

  function dateClick(arg?: DateClickArg) {
    console.log(arg);
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
        />
        <DetailDialog open={openDetail} setOpen={setOpenDetail} />
      </div>
    </PageContainer>
  );
}
