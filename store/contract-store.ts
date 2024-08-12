import { Contract } from '@/types';
import { create } from 'zustand';

export type State = {
  openDetail: boolean;
  reportDetail?: Contract;
};

export type Actions = {
  setOpenDetail: (payload: Contract) => void;
  closeDetail: () => void;
};

export const useContractStore = create<State & Actions>()((set) => ({
  openDetail: false,
  contractDetail: undefined,
  setOpenDetail(payload) {
    set(() => ({ openDetail: true, contractDetail: payload }));
  },
  closeDetail() {
    set(() => ({ openDetail: false, contractDetail: undefined }));
  }
}));
