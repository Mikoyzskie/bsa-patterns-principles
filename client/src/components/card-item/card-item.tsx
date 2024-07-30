import React, { useContext } from "react";

import type { DraggableProvided } from "@hello-pangea/dnd";

import { type Card } from "../../common/types/types";
import { CopyButton } from "../primitives/copy-button";
import { DeleteButton } from "../primitives/delete-button";
import { Splitter } from "../primitives/styled/splitter";
import { Text } from "../primitives/text";
import { Title } from "../primitives/title";
import { Container } from "./styled/container";
import { Content } from "./styled/content";
import { Footer } from "./styled/footer";

import { SocketContext } from "../../context/socket";

import { CardEvent } from "../../common/enums/card-event.enum";

type Props = {

  card: Card;
  isDragging: boolean;
  provided: DraggableProvided;
  id: string
};

export const CardItem = ({ card, isDragging, provided, id }: Props) => {

  const socket = useContext(SocketContext);

  const content = (text: string) => text.trim() === "";

  const handleDeleteButton = () => {
    socket.emit(CardEvent.DELETE, id, card.id);
  }

  const handleDescriptionChanged = (description: string) => {
    if (content(description)) {
      return
    } else {
      socket.emit(CardEvent.CHANGE_DESCRIPTION, id, card.id, description);
    }
  }
  const handleNameChange = (name: string) => {
    if (content(name)) {
      return
    } else {
      socket.emit(CardEvent.RENAME, id, card.id, name);
    }
  }

  const handleDuplicateButton = () => {
    socket.emit(CardEvent.DUPLICATE, id, card.id);
  }

  return (
    <Container
      className="card-container"
      isDragging={isDragging}
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      data-is-dragging={isDragging}
      data-testid={card.id}
      aria-label={card.name}
    >
      <Content>
        <Title onChange={handleNameChange} title={card.name} fontSize="large" isBold />
        <Text text={card.description} onChange={handleDescriptionChanged} />
        <Footer>
          <DeleteButton onClick={handleDeleteButton} />
          <Splitter />
          <CopyButton onClick={handleDuplicateButton} />
        </Footer>
      </Content>
    </Container>
  );
};
