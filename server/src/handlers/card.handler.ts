import type { Socket } from "socket.io";

import { CardEvent } from "../common/enums/enums";
import { Card } from "../data/models/card";
import { SocketHandler } from "./socket.handler";

class CardHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(CardEvent.CREATE, this.createCard.bind(this));
    socket.on(CardEvent.REORDER, this.reorderCards.bind(this));
    socket.on(CardEvent.DELETE, this.deleteCard.bind(this));
    socket.on(CardEvent.RENAME, this.renameCard.bind(this));
    socket.on(
      CardEvent.CHANGE_DESCRIPTION,
      this.changeCardDesription.bind(this)
    );
    socket.on(CardEvent.DUPLICATE, this.duplicateCard.bind(this));
  }

  public createCard(listId: string, cardName: string): void {
    const newCard = new Card(cardName, "");
    const lists = this.db.getData();

    const updatedLists = lists.map((list) =>
      list.id === listId ? list.setCards(list.cards.concat(newCard)) : list
    );

    this.db.setData(updatedLists);
    this.updateLists();

    //log this
  }

  private reorderCards({
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): void {
    const lists = this.db.getData();
    const reordered = this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
    this.db.setData(reordered);
    this.updateLists();
  }

  public deleteCard(listId: string, cardId: string): void {
    const data = this.db.getData();

    const filterData = data.map((item) => {
      if (item.id === listId) {
        const newCards = item.cards.filter((card) => card.id !== cardId);
        return item.setCards(newCards);
      } else {
        return item;
      }
    });

    this.db.setData(filterData);
    this.updateLists();

    //log something here
  }

  public renameCard(listId: string, cardId: string, newName: string): void {
    const data = this.db.getData();

    const filterData = data.find((list) => list.id === listId);
    const filterCards = filterData.cards.find((card) => card.id === cardId);

    filterCards.name === newName;

    this.db.setData(data);
    this.updateLists();

    //log something here
  }

  public changeCardDesription(
    listId: string,
    cardId: string,
    newDescription: string
  ): void {
    const data = this.db.getData();

    const filterData = data.find((list) => list.id === listId);
    const filterCards = filterData.cards.find((card) => card.id === cardId);

    filterCards.name === newDescription;

    this.db.setData(data);
    this.updateLists();

    //log something here
  }

  public duplicateCard(listId: string, cardId: string): void {
    const data = this.db.getData();

    const filterData = data.find((list) => list.id === listId);
    const filterCards = filterData.cards.find((card) => card.id === cardId);

    const duplicated = filterCards.duplicate();

    filterData.cards.push(duplicated);

    this.db.setData(data);
    this.updateLists();
  }
}

export { CardHandler };
