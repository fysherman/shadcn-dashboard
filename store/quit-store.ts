import { Quit } from '@/types';
import { create } from 'zustand';

export type State = {
  openDetail: boolean;
  quitDetail?: Quit;
};

export type Actions = {
  setOpenDetail: (payload: Quit) => void;
  closeDetail: () => void;
};

export const useQuitStore = create<State & Actions>()((set) => ({
  openDetail: false,
  quitDetail: undefined,
  setOpenDetail(payload) {
    set(() => ({ openDetail: true, quitDetail: payload }));
  },
  closeDetail() {
    set(() => ({ openDetail: false, quitDetail: undefined }));
  }
}));
