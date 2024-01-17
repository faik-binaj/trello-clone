import { create } from "zustand";
import { Board, Column, Image, Todo, TypedColumn } from "@/typing";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import { database, ID } from "@/appwrite";
import uploadImage from "@/lib/uploadImage";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  newTaskInput: string;
  newTaskType: TypedColumn;
  image: File | null;

  searchString: string;
  setSearchString: (searchString: string) => void;

  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;

  setNewTaskInput: (input: string) => void;
  setNewTaskType: (columnId: TypedColumn) => void;
  setImage: (image: File | null) => void;
}

const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
  searchString: "",
  newTaskInput: "",
  setSearchString: (searchString) => set({ searchString }),
  newTaskType: "todo",
  image: null,

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),

  setNewTaskInput: (input) => set({ newTaskInput: input }),

  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  setImage: (image) => set({ image }),
  updateTodoInDB: async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,
      },
    );
  },

  addTask: async (todo, columnId, image?: File | null) => {
    let file: Image | undefined;

    const fileUploaded = await uploadImage(image);
    if (fileUploaded) {
      file = {
        bucketId: fileUploaded.bucketId,
        fileId: fileUploaded.$id,
      };
    }

    const { $id } = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        // Include image if exist
        ...(file && { images: JSON.stringify(file) }),
      },
    );

    set({ newTaskInput: "" });
    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        // include image if exist
        ...(file && { images: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));

export default useBoardStore;
