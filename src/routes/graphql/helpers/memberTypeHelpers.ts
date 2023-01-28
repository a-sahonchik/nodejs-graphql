import { FastifyInstance } from 'fastify';
import { assertMemberTypeExists } from '../asserts';
import { MemberTypeEntity } from '../../../utils/DB/entities/DBMemberTypes';

const getMemberTypeById = async (memberTypeId: string, fastify: FastifyInstance): Promise<MemberTypeEntity> => {
  const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberTypeId });

  await assertMemberTypeExists(memberType, fastify);

  return memberType!;
};

const updateMemberTypeFromInput = async (
  memberTypeId: string,
  input: any,
  fastify: FastifyInstance,
): Promise<MemberTypeEntity> => {
  const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: memberTypeId });

  await assertMemberTypeExists(memberType, fastify);

  return fastify.db.memberTypes.change(memberTypeId, input);
};

export { getMemberTypeById, updateMemberTypeFromInput };
