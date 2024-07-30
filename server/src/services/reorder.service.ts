import { Card } from "../data/models/card";
import { List } from "../data/models/list";
import { Observer } from "../common/observer.type";
import { ObserverService } from "./observer.service";

const observer = new ObserverService();

class ReorderService {
  public reorder<T>(items: T[], startIndex: number, endIndex: number): T[] {
    const card = items[startIndex];
    const listWithRemoved = this.remove(items, startIndex);
    const result = this.insert(listWithRemoved, endIndex, card);

    return result;
  }

  public reorderCards({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    const target: Card = lists.find((list) => list.id === sourceListId)
      ?.cards?.[sourceIndex];

    if (!target) {
      return lists;
    }

    const newLists = lists.map((list) => {
      if (list.id === sourceListId) {
        list.setCards(this.remove(list.cards, sourceIndex));
      }

      if (list.id === destinationListId) {
        list.setCards(this.insert(list.cards, destinationIndex, target));
      }

      return list;
    });

    return newLists;
  }

  private remove<T>(items: T[], index: number): T[] {
    return [...items.slice(0, index), ...items.slice(index + 1)];
  }

  private insert<T>(items: T[], index: number, value: T): T[] {
    return [...items.slice(0, index), value, ...items.slice(index)];
  }
}

// PATTERN: Proxy

class ReorderProxy {
  private reorderService: ReorderService;
  private observers: Observer[] = [];
  constructor(reorderService: ReorderService) {
    this.reorderService = reorderService;
  }

  // PATTERN: Observer

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private logger(data: any): void {
    this.observers.forEach((observer) => observer.update(data));
  }

  public add(observer: Observer): void {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
    }
  }

  public remove(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  public reorder<T>(items: T[], initial: number, end: number): T[] {
    this.add(observer);
    this.logger(`Reorder Cards ${items}`);

    return this.reorderService.reorder(items, initial, end);
  }

  public reorderList({
    lists,
    sourceIndex,
    destinationIndex,
    sourceListId,
    destinationListId,
  }: {
    lists: List[];
    sourceIndex: number;
    destinationIndex: number;
    sourceListId: string;
    destinationListId: string;
  }): List[] {
    this.add(observer);
    this.logger(`Reorder List ${lists}`);
    return this.reorderService.reorderCards({
      lists,
      sourceIndex,
      destinationIndex,
      sourceListId,
      destinationListId,
    });
  }
}

export { ReorderService, ReorderProxy };
