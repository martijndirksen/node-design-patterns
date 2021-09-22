interface IPizzaSharingStrategy {
  share(pizza: IPizza): void;
}

interface IPizza {
  get topping(): string;
  share(strategy: IPizzaSharingStrategy): void;
}

class Pizza implements IPizza {
  private readonly _topping: string;

  constructor(topping: string) {
    this._topping = topping;
  }

  get topping(): string {
    return this._topping;
  }

  share(strategy: IPizzaSharingStrategy) {
    strategy.share(this);
  }
}

class SlicedPizzaStrategy implements IPizzaSharingStrategy {
  private readonly numberOfSlices: number;

  constructor(numberOfSlices: number) {
    this.numberOfSlices = numberOfSlices;
  }

  share(pizza: IPizza): void {
    console.log(
      `Sliced ${pizza.topping} pizza into ${this.numberOfSlices} slices`
    );
  }
}

class DropPizzaStrategy implements IPizzaSharingStrategy {
  share(pizza: IPizza): void {
    console.log(
      `Accidentally dropped ${pizza.topping} pizza on the floor. What a waste!`
    );
  }
}

const pizzaA: IPizza = new Pizza('salami');
const pizzaB: IPizza = new Pizza('mozzarella');

pizzaA.share(new SlicedPizzaStrategy(8));
pizzaB.share(new DropPizzaStrategy());
