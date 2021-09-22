interface IPizzaSharingStrategy {
  share(pizza: IPizza): void;
}

interface IPizza {
  get topping(): string;
  set strategy(value: IPizzaSharingStrategy);
  share(): void;
}

class Pizza implements IPizza {
  private readonly _topping: string;
  private _strategy: IPizzaSharingStrategy;

  constructor(topping: string, strategy: IPizzaSharingStrategy) {
    this._topping = topping;
    this._strategy = strategy;
  }

  get topping(): string {
    return this._topping;
  }

  set strategy(value: IPizzaSharingStrategy) {
    this._strategy = value;
  }

  share(): void {
    this._strategy.share(this);
  }
}

class SlicedPizzaStrategy implements IPizzaSharingStrategy {
  private readonly numberOfSlices: number;

  constructor(numberOfSlices: number) {
    this.numberOfSlices = numberOfSlices;
  }

  share(pizza: IPizza): void {
    console.log(
      `Sliced a ${pizza.topping} pizza into ${this.numberOfSlices} slices`
    );
  }
}

class DropPizzaStrategy implements IPizzaSharingStrategy {
  share(pizza: IPizza): void {
    console.log(
      `Accidentally dropped a ${pizza.topping} pizza on the floor. What a waste!`
    );
  }
}

const pizzaA: IPizza = new Pizza('salami', new SlicedPizzaStrategy(8));
const pizzaB: IPizza = new Pizza('mozzarella', new DropPizzaStrategy());

pizzaA.share();
pizzaB.share();

pizzaB.strategy = new SlicedPizzaStrategy(4);
pizzaB.share();
