interface MyIterator<T> {
  next(): T | undefined;
  get isDone(): boolean;
  get currentItem(): T | undefined;
}

interface Collection<T> {
  get(index: number): T;
  add(item: T): void;
  get length(): number;
  get iterator(): MyIterator<T>;
}

class ArrayList<T> implements Collection<T> {
  private readonly items: T[] = [];

  get(index: number) {
    return this.items[index];
  }

  add(item: T): void {
    this.items.push(item);
  }

  get length(): number {
    return this.items.length;
  }

  get iterator(): MyIterator<T> {
    return new ArrayListIterator<T>(this);
  }
}

class ArrayListIterator<T> implements MyIterator<T> {
  private readonly collection: ArrayList<T>;
  private index: number = 0;

  constructor(collection: ArrayList<T>) {
    this.collection = collection;
  }

  next(): T | undefined {
    return this.collection.get(this.index++);
  }

  get isDone(): boolean {
    return this.index >= this.collection.length;
  }

  get currentItem(): T | undefined {
    return this.collection.get(this.index);
  }
}

class LinkedList<T> implements Collection<T> {
  private head: LinkedListNode<T> = new LinkedListNode<T>();

  firstNode(): LinkedListNode<T> | undefined {
    return this.head?.next;
  }

  get(index: number): T {
    if (index < 0) throw new Error('Index out of range');

    let current = this.head.next;
    while (current?.next && index) {
      current = current.next;
      index--;
    }

    if (!current?.value) throw new Error('Unexpected value');

    return current.value;
  }

  add(item: T): void {
    let current = this.head;
    while (current.next) {
      current = current.next;
    }
    current.next = new LinkedListNode<T>(item);
  }

  get length(): number {
    let length = 0;
    let current = this.head;
    while (current.next) {
      current = current.next;
      length++;
    }
    return length;
  }

  get iterator(): MyIterator<T> {
    return new LinkedListIterator<T>(this);
  }
}

class LinkedListNode<T> {
  next?: LinkedListNode<T>;
  value?: T;

  constructor(value?: T) {
    this.value = value;
  }
}

class LinkedListIterator<T> implements MyIterator<T> {
  private currentNode?: LinkedListNode<T>;

  constructor(collection: LinkedList<T>) {
    this.currentNode = collection.firstNode();
  }

  next(): T | undefined {
    const val = this.currentNode?.value;
    this.currentNode = this.currentNode?.next;
    return val;
  }

  get isDone(): boolean {
    return !this.currentNode;
  }

  get currentItem(): T | undefined {
    return this.currentNode?.value;
  }
}

const linkedList: Collection<number> = new LinkedList<number>();
linkedList.add(1);
linkedList.add(2);
linkedList.add(3);

const linkedListIterator = linkedList.iterator;
while (!linkedListIterator.isDone) {
  console.log(linkedListIterator.next());
}

const arrayList: Collection<string> = new ArrayList<string>();
arrayList.add('A');
arrayList.add('B');
arrayList.add('C');

const arrayListIterator = arrayList.iterator;
while (!arrayListIterator.isDone) {
  console.log(arrayListIterator.next());
}
