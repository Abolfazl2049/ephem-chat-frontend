class User {
  id: string;
  name: string;

  constructor(init: Record<string, any>) {
    this.id = init.id;
    this.name = init.name;
  }
}
export { User };
