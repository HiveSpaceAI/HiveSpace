declare namespace Express {
  interface Request {
    user?: import('./core/auth/current-user').CurrentUser;
    sid?: string;
  }
}

declare type PrimitiveType =
  | string
  | number
  | boolean
  | symbol
  | null
  | undefined;

declare type ConstructorOf<T> = {
  new (): T;
};

declare type DeepPartial<T> =
  T extends Array<infer U>
    ? DeepPartial<U>[]
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends object
        ? {
            [K in keyof T]?: DeepPartial<T[K]>;
          }
        : T;

declare type HiveSpaceModule =
  | import('@nestjs/common').Type
  | import('@nestjs/common').DynamicModule;
