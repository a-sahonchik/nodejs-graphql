import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';
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

const getMemberTypeLoader = async (fastify: FastifyInstance) => new DataLoader(async (memberTypeIds) => {
  const memberTypes = await fastify.db.memberTypes.findMany();

  const memberTypesMap = memberTypes.reduce(
    (map, memberType) => map.set(memberType.id, memberType),
    new Map<string, MemberTypeEntity>(),
  );

  return memberTypeIds.map((memberTypeId) => memberTypesMap.get(String(memberTypeId)) ?? null);
});

export { getMemberTypeById, updateMemberTypeFromInput, getMemberTypeLoader };
