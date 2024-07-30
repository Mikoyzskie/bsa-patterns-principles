import { Server, Socket } from "socket.io";

import { ListEvent } from "../common/enums/enums";
import { Database } from "../data/database";
import { ReorderService, ReorderProxy } from "../services/services";
import { Observer } from "../common/observer.type";

abstract class SocketHandler {
  protected db: Database;

  protected reorderService: ReorderService;

  protected io: Server;

  protected observers: Observer[] = [];

  protected reorderProxy: ReorderProxy;

  public constructor(
    io: Server,
    db: Database,
    reorderService: ReorderService,
    reorderProxy: ReorderProxy
  ) {
    this.io = io;
    this.db = db;
    this.reorderService = reorderService;
    this.reorderProxy = reorderProxy;
  }

  public abstract handleConnection(socket: Socket): void;

  protected updateLists(): void {
    this.io.emit(ListEvent.UPDATE, this.db.getData());
  }

  //TODO logging events
  // PATTERN: Observer

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected logger(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }

  protected add(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  protected remove(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }
}

export { SocketHandler };
