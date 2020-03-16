export class InvalidSeedError extends Error {
  public static INVALID_SEED_MESSAGE = "Provided seed string needs to be longer or equal than 32 characters";
  constructor() {
    super();
    this.name = "InvalidSeedError";
    this.message = InvalidSeedError.INVALID_SEED_MESSAGE;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/consistent-type-assertions
    this.stack = (<any> new Error()).stack;
  }
}