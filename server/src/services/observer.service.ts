import { Observer as IObserver } from "../common/observer.type";
import { appendFile } from "fs";
import { resolve } from "path";

// PATTERN: Observer

export class ObserverService implements IObserver {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public update(data: any): void {
    appendFile(resolve(__dirname, "../data/data.log"), data, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}
