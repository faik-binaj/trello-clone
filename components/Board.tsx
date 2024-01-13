"use client";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useEffect } from "react";
import useBoardStore from "@/store/BoardStore";

const Board = () => {
  const getBoard = useBoardStore((state) => state.getBoard);
  useEffect(() => {
    getBoard();
  }, [getBoard]);
  return <></>;
  // <DragDropContext
  //   onDragEnd={(result, provided) => console.log(result, provided)}
  // >
  //   <Droppable droppableId="board" direction="horizontal" type="column">
  //     {(provided) => <div>{/* rendering all the columns */}</div>}
  //   </Droppable>
  // </DragDropContext>
};

export default Board;
