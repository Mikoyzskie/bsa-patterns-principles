import { randomUUID } from "crypto";

class Card {
  public id: string;

  public name: string;

  public description: string;

  public createdAt: Date;

  public constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.createdAt = new Date();
    this.id = randomUUID();
  }

  //PATTERN: Prototype
  public duplicate() {
    const newCard = `new ${this.name}`;
    return new Card(newCard, this.description);
  }
}

export { Card };
