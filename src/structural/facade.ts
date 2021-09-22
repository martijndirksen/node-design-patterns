import { createHmac } from 'crypto';

const NOT_SO_RANDOM_HASH = 'c25dda249cdece9d908cc33adcd16aa05e20290f';

interface IStorableUser {
  name: string;
  email: string;
  passwordHash: string;
  activationToken: string | null;
  isActivated: boolean;
}

interface IUserStoreModule {
  add(user: IStorableUser): void;
  getByEmail(email: string): IStorableUser | undefined;
}

class UserStoreModule implements IUserStoreModule {
  private readonly users: IStorableUser[] = [];

  add(user: IStorableUser): void {
    this.users.push(user);
  }

  getByEmail(email: string): IStorableUser | undefined {
    return this.users.find((x) => x.email === email);
  }
}

interface IHasherModule {
  hashPassword(password: string): string;
  randomHash(): string;
}

class InsecureHasherModule implements IHasherModule {
  hashPassword(password: string): string {
    return createHmac('sha256', NOT_SO_RANDOM_HASH)
      .update(password)
      .digest('hex');
  }

  randomHash(): string {
    return NOT_SO_RANDOM_HASH;
  }
}

interface IEmailSenderModule {
  send(email: string, content: string): void;
}

class FakeEmailSenderModule implements IEmailSenderModule {
  send(email: string, content: string): void {
    console.log(`Sending mail to ${email} with content: ${content}`);
  }
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
}

export interface IActivateUser {
  email: string;
  activationToken: string;
}

export interface IUserManager {
  login(user: ILoginUser): boolean;
  register(user: IRegisterUser): boolean;
  activate(user: IActivateUser): boolean;
}

class UserManager implements IUserManager {
  private readonly userStore: IUserStoreModule;
  private readonly hasher: IHasherModule;
  private readonly emailSender: IEmailSenderModule;

  constructor(
    userStore: IUserStoreModule,
    hasher: IHasherModule,
    emailSender: IEmailSenderModule
  ) {
    this.userStore = userStore;
    this.hasher = hasher;
    this.emailSender = emailSender;
  }

  login(user: ILoginUser): boolean {
    const actual = this.userStore.getByEmail(user.email);

    if (!actual?.isActivated) return false; // user not found or not activated
    if (actual.passwordHash !== this.hasher.hashPassword(user.password))
      return false;

    this.emailSender.send(user.email, 'Someone logged into your account');

    return true;
  }

  register(user: IRegisterUser): boolean {
    if (this.userStore.getByEmail(user.email)) return false; // user already exists

    const activationToken = this.hasher.randomHash();

    this.userStore.add({
      name: user.name,
      email: user.email,
      passwordHash: this.hasher.hashPassword(user.password),
      activationToken: activationToken,
      isActivated: false,
    });

    this.emailSender.send(user.email, `Welcome! Token: ${activationToken}`);

    return true;
  }

  activate(user: IActivateUser): boolean {
    const actual = this.userStore.getByEmail(user.email);

    if (!actual || actual.activationToken !== user.activationToken)
      return false;

    actual.activationToken = null;
    actual.isActivated = true;

    this.emailSender.send(user.email, 'Your account has been activated');

    return true;
  }
}

export function createUserManager(): IUserManager {
  return new UserManager(
    new UserStoreModule(),
    new InsecureHasherModule(),
    new FakeEmailSenderModule()
  );
}

const userManager = createUserManager();
userManager.register({
  name: 'Bob',
  email: 'bob@example.com',
  password: 'SOME_PASSWORD',
});

userManager.activate({
  email: 'bob@example.com',
  activationToken: NOT_SO_RANDOM_HASH,
});

userManager.login({ email: 'bob@example.com', password: 'SOME_PASSWORD' });
