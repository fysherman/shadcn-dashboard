import { Report } from '@/types';
import { create } from 'zustand';

export type State = {
  openDetail: boolean;
  reportDetail?: Report;
};

export type Actions = {
  setOpenDetail: (payload: Report) => void;
  closeDetail: () => void;
};

export const useReportStore = create<State & Actions>()((set) => ({
  openDetail: false,
  reportDetail: undefined,
  setOpenDetail(payload) {
    set(() => ({ openDetail: true, reportDetail: payload }));
  },
  closeDetail() {
    set(() => ({ openDetail: false, reportDetail: undefined }));
  }
}));
