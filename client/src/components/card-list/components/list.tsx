import React from "react";

import { DroppableProvided } from "@hello-pangea/dnd";

import { type Card } from "../../../common/types/types";
import { DropZone } from "../styled/drop-zone";
import { Cards } from "./cards";

type Props = {
  id: string
  dropProvided: DroppableProvided;
  cards: Card[];
};

const List = ({ id, cards, dropProvided }: Props) => {
  return (
    <div className="list-container">
      <DropZone ref={dropProvided.innerRef}>
        <Cards id={id} cards={cards} />
        {dropProvided.placeholder}
      </DropZone>
    </div>
  );
};

export { List };
