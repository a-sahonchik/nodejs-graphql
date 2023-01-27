import { FastifyInstance } from 'fastify';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';
import { errorMessage } from '../../../messages/errorMessages';

const assertMemberTypeExists = async (
  memberType: MemberTypeEntity | null,
  fastify: FastifyInstance,
  message: string = errorMessage.MEMBER_TYPE_NOT_FOUND,
): Promise<void> => {
  if (memberType === null) {
    throw fastify.httpErrors.notFound(message);
  }
};

export { assertMemberTypeExists };
