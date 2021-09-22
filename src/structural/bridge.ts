interface IList<T> {
  insert(index: number, value: T): void;
  remove(index: number): void;
  elementAt(index: number): T;
  length(): number;
  contains(value: T): boolean;
}

interface IOrderedCollection<T> {
  isEmpty(): boolean;
  pop(): T | null;
  push(value: T): void;
}

abstract class OrderedCollection<T> implements IOrderedCollection<T> {
  protected readonly list: IList<T>;

  constructor(list: IList<T>) {
    this.list = list;
  }

  isEmpty(): boolean {
    return !!this.list.length();
  }

  abstract pop(): T | null;
  abstract push(value: T): void;
}

class Queue<T> extends OrderedCollection<T> {
  pop(): T | null {
    if (!this.list.length()) return null;
    const value = this.list.elementAt(0);
    this.list.remove(0);
    return value;
  }

  push(value: T): void {
    this.list.insert(this.list.length(), value);
  }
}

class Stack<T> extends OrderedCollection<T> {
  pop(): T | null {
    const length = this.list.length();
    if (!length) return null;
    const value = this.list.elementAt(length - 1);
    this.list.remove(length - 1);
    return value;
  }

  push(value: T): void {
    this.list.insert(this.list.length(), value);
  }
}

class SimpleArrayList<T> implements IList<T> {
  private readonly items: T[] = [];

  insert(index: number, value: T): void {
    this.items.splice(index, 1, value);
  }

  remove(index: number): void {
    this.items.splice(index, 1);
  }

  elementAt(index: number): T {
    return this.items[index];
  }

  length(): number {
    return this.items.length;
  }

  contains(value: T): boolean {
    return this.items.includes(value);
  }
}

// General idea of the bridge is linkage of two (or more) hierarchical structures.
// In this example we would otherwise need a StackSimpleArrayList and a QueueSimpleArrayList.
// With every orthogonal dimension, the number of required classes would increase dramatically.

const listA = new Stack(new SimpleArrayList<number>());
listA.push(4);
listA.push(8);
listA.push(12);
console.log(listA.pop());
console.log(listA.pop());
listA.push(16);
console.log(listA.pop());
console.log(listA.pop());

const listB = new Queue(new SimpleArrayList<string>());
listB.push('A');
listB.push('B');
listB.push('C');
console.log(listB.pop());
console.log(listB.pop());
listB.push('D');
console.log(listB.pop());
console.log(listB.pop());
