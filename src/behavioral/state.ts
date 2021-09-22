interface IOrderState {
  addInfo(context: IOrderContext, name: string, amountDue: number): IOrderState;
  addPayment(context: IOrderContext, amount: number): IOrderState;
  export(context: IOrderContext): IOrderState;
}

interface IOrder {
  addInfo(name: string, amountDue: number): void;
  addPayment(amount: number): void;
  export(): void;
}

interface IOrderContext {
  get name(): string | undefined;
  get amountDue(): number;
  set name(value: string | undefined);
  set amountDue(value: number);
}

class Order implements IOrderContext, IOrder {
  private state: IOrderState;
  private _name: string | undefined;
  private _amountDue: number = 0;

  constructor(state: IOrderState) {
    this.state = state;
  }

  get name(): string | undefined {
    return this._name;
  }

  set name(value: string | undefined) {
    this._name = value;
  }

  get amountDue(): number {
    return this._amountDue;
  }

  set amountDue(value: number) {
    this._amountDue = value;
  }

  addInfo(name: string, amountDue: number): void {
    this.state = this.state.addInfo(this, name, amountDue);
  }

  addPayment(amount: number): void {
    this.state = this.state.addPayment(this, amount);
  }

  export(): void {
    this.state = this.state.export(this);
  }
}

class NewOrderState implements IOrderState {
  addInfo(
    context: IOrderContext,
    name: string,
    amountDue: number
  ): IOrderState {
    context.name = name;
    context.amountDue = amountDue;
    return new PayableOrderState();
  }

  addPayment(context: IOrderContext, amount: number): IOrderState {
    throw new Error('Info not added');
  }

  export(): IOrderState {
    throw new Error('Cannot export; info and payment not added');
  }
}

class PayableOrderState implements IOrderState {
  addInfo(
    context: IOrderContext,
    name: string,
    amountDue: number
  ): IOrderState {
    throw new Error('Info already added');
  }

  addPayment(context: IOrderContext, amount: number): IOrderState {
    if (context.amountDue - amount < 0)
      throw new Error('Payment would exceed amount due');
    context.amountDue -= amount;

    if (context.amountDue === 0) {
      return new PaidOrderState();
    }

    return this;
  }

  export(): IOrderState {
    throw new Error('Cannot export; payment insufficient');
  }
}

class PaidOrderState implements IOrderState {
  addInfo(
    context: IOrderContext,
    name: string,
    amountDue: number
  ): IOrderState {
    throw new Error('Info already added');
  }

  addPayment(context: IOrderContext, amount: number): IOrderState {
    throw new Error('Payment already fulfilled');
  }

  export(context: IOrderContext): IOrderState {
    console.log(`Exported order of ${context.name}`);
    return new ExportedOrderState();
  }
}

class ExportedOrderState implements IOrderState {
  addInfo(
    context: IOrderContext,
    name: string,
    amountDue: number
  ): IOrderState {
    throw new Error('Order already exported');
  }

  addPayment(context: IOrderContext, amount: number): IOrderState {
    throw new Error('Order already exported');
  }

  export(): IOrderState {
    throw new Error('Order already exported');
  }
}

const order: IOrder = new Order(new NewOrderState());
order.addInfo('Bob', 200);
order.addPayment(110);
order.addPayment(90);
order.export();
