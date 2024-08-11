import { create } from 'zustand';

export type State = {
  kanbanKey: number;
};

export type Actions = {
  setKey: () => void;
};

export const useTaskStore = create<State & Actions>()((set) => ({
  kanbanKey: 0,
  setKey() {
    set((state) => ({ kanbanKey: state.kanbanKey + 1 }));
  }
}));
