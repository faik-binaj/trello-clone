import { create } from "zustand";
import { Board, Column, TypedColumn } from "@/typing";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";

interface BoardState {
  board: Board;
  getBoard: () => void;
}

const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
}));

export default useBoardStore;
