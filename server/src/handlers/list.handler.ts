import type { Socket } from "socket.io";

import { ListEvent } from "../common/enums/enums";
import { List } from "../data/models/list";
import { SocketHandler } from "./socket.handler";

class ListHandler extends SocketHandler {
  public handleConnection(socket: Socket): void {
    socket.on(ListEvent.CREATE, this.createList.bind(this));
    socket.on(ListEvent.GET, this.getLists.bind(this));
    socket.on(ListEvent.REORDER, this.reorderLists.bind(this));
    socket.on(ListEvent.RENAME, this.renameList.bind(this));
    socket.on(ListEvent.DELETE, this.deleteList.bind(this));
  }

  private getLists(callback: (cards: List[]) => void): void {
    callback(this.db.getData());
  }

  private reorderLists(sourceIndex: number, destinationIndex: number): void {
    const lists = this.db.getData();
    const reorderedLists = this.reorderService.reorder(
      lists,
      sourceIndex,
      destinationIndex
    );
    this.db.setData(reorderedLists);
    this.updateLists();
  }

  private createList(name: string): void {
    const lists = this.db.getData();
    const newList = new List(name);
    this.db.setData(lists.concat(newList));
    this.updateLists();
  }

  private renameList(listId: string, newName: string): void {
    if (newName.trim() === "") {
      return;
    }

    const data = this.db.getData();
    const filterLists = data.find((list) => list.id === listId);

    filterLists.name = newName;

    this.db.setData(data);
    this.updateLists();
  }

  private deleteList(listId: string) {
    if (listId.trim() === "") {
      return;
    }
    const data = this.db.getData();

    const filterLists = data.filter((list) => list.id !== listId);

    this.db.setData(filterLists);
    this.updateLists();
  }
}

export { ListHandler };
