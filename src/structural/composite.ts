const INDENTATION = 2;

interface IDrawing {
  render(level?: number): void;
}

abstract class Drawing implements IDrawing {
  abstract render(level?: number): void;

  protected renderWithIndentation(level: number, value: string): void {
    console.log(' '.repeat(level) + value);
  }
}

class Triangle extends Drawing {
  render(level: number = 0): void {
    this.renderWithIndentation(level, 'Triangle');
  }
}

class Rectangle extends Drawing {
  render(level: number = 0): void {
    this.renderWithIndentation(level, 'Rectangle');
  }
}

class Circle extends Drawing {
  render(level: number = 0): void {
    this.renderWithIndentation(level, 'Circle');
  }
}

class Shape extends Drawing {
  private readonly name: string;
  private readonly items: IDrawing[];

  constructor(name: string, ...items: IDrawing[]) {
    super();
    this.name = name;
    this.items = items;
  }

  render(level: number = 0): void {
    this.renderWithIndentation(level, `Drawing ${this.name}`);
    for (const item of this.items) {
      item.render(level + INDENTATION);
    }
  }
}

const drawing: IDrawing = new Shape(
  'my pretty shapes',
  new Triangle(),
  new Rectangle(),
  new Shape('a shape within a shape', new Rectangle(), new Circle()),
  new Triangle()
);

drawing.render();
