import { validate } from 'uuid';

const assertValidUUID = (uuid: unknown): string => {
  if (typeof uuid === 'string') {
    const isUuidValid = validate(uuid);

    if (isUuidValid) {
      return uuid;
    }
  }

  throw new TypeError();
};

export { assertValidUUID };
