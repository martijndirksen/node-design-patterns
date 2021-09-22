interface IPricedArticle {
  get name(): string;
  get totalAmount(): number;
}

class BasePricedArticle implements IPricedArticle {
  private readonly _name: string;
  private readonly price: number;

  constructor(name: string, price: number) {
    this._name = name;
    this.price = price;
  }

  get name(): string {
    return this._name;
  }

  get totalAmount(): number {
    return this.price;
  }
}

abstract class PricedArticleDecorator implements IPricedArticle {
  protected readonly next: IPricedArticle;

  constructor(next: IPricedArticle) {
    this.next = next;
  }

  abstract get name(): string;
  abstract get totalAmount(): number;
}

class UppercaseNameDecorator extends PricedArticleDecorator {
  get name(): string {
    return this.next.name.toUpperCase();
  }

  get totalAmount(): number {
    return this.next.totalAmount;
  }
}

class ComponentDecorator extends PricedArticleDecorator {
  private readonly componentName: string;
  private readonly price: number;

  constructor(componentName: string, price: number, next: IPricedArticle) {
    super(next);
    this.componentName = componentName;
    this.price = price;
  }

  get name(): string {
    return `${this.componentName} ${this.next.name}`;
  }

  get totalAmount(): number {
    return this.price + this.next.totalAmount;
  }
}

class QuantityDecorator extends PricedArticleDecorator {
  private readonly quantity: number;

  constructor(quantity: number, next: IPricedArticle) {
    super(next);
    if (quantity < 0) throw new Error('Invalid quantity');
    this.quantity = quantity;
  }

  get name(): string {
    return `${this.quantity}x ${this.next.name}`;
  }

  get totalAmount(): number {
    return this.next.totalAmount * this.quantity;
  }
}

const coffee = new QuantityDecorator(
  4,
  new UppercaseNameDecorator(
    new ComponentDecorator(
      'Iced',
      2.5,
      new ComponentDecorator(
        'Pumpkin Spice',
        1,
        new BasePricedArticle('Latte', 2.95)
      )
    )
  )
);
console.log(coffee.name);
console.log(coffee.totalAmount);
