import { FastifyInstance } from 'fastify';
import { assertMemberTypeExists } from '../asserts';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

const getMemberTypeById = async (memberTypeId: string, fastify: FastifyInstance): Promise<MemberTypeEntity> => {
  const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberTypeId });

  await assertMemberTypeExists(memberType, fastify);

  return memberType!;
};

export { getMemberTypeById };
