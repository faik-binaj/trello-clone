"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Todo, TypedColumn } from "@/typing";
import {
  DraggableProvidedDraggableProps,
  DraggableProvidedDragHandleProps,
} from "react-beautiful-dnd";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { getUrl } from "@/lib/getUrl";
import Image from "next/image";
import useBoardStore from "@/store/BoardStore";

interface Props {
  todo: Todo;
  index: number;
  id: TypedColumn;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}
const TodoCard = ({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (todo.images) {
      const fetchImage = async () => {
        const url = await getUrl(todo.images!);
        if (url) {
          setImageUrl(url.toString());
        }
      };

      fetchImage();
    }
  }, [todo]);

  const [deleteTask, board, setBoardState] = useBoardStore((state) => [
    state.deleteTask,
    state.board,
    state.setBoardState,
  ]);

  const deleteTodo = useCallback(() => {
    {
      const entries = Array.from(board.columns.entries());

      const idToRemove = todo.$id;

      const inProgressIndex = entries.findIndex(
        (item) => item[0] === todo.status,
      );

      if (inProgressIndex !== -1) {
        // Find the index of the todo with the given $id
        const todoIndex = entries[inProgressIndex][1].todos.findIndex(
          (todo) => todo["$id"] === idToRemove,
        );

        if (todoIndex !== -1) {
          // Remove the todo with the matching $id
          entries[inProgressIndex][1].todos.splice(todoIndex, 1);

          const rearrangedColumns = new Map(entries);
          setBoardState({
            ...board,
            columns: rearrangedColumns,
          });
          deleteTask(todo.$id);
        } else {
          console.log("Todo with the given $id not found.");
        }
      }
    }
  }, []);

  return (
    <div
      className="bg-white rounded-md space-y-2 drop-shadow-md"
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className="flex justify-between items-center p-5">
        <p>{todo.title}</p>
        <button
          className="text-red-500 hover:text-red-600"
          onClick={deleteTodo}
        >
          <XCircleIcon className="ml-5 h-8 w-8" />
        </button>
      </div>
      {imageUrl && (
        <div className="h-full w-full rounded-b-md">
          <Image
            src={imageUrl}
            alt="Task image"
            width={400}
            height={200}
            className="w-full object-contain rounded-b-md"
          />
        </div>
      )}
    </div>
  );
};

export default TodoCard;
