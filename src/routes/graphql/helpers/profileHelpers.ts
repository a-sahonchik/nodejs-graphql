import { FastifyInstance } from 'fastify';
import * as DataLoader from 'dataloader';
import {
  assertMemberTypeExists,
  assertProfileExists,
  assertUserExists,
  assertUserHasNoProfile,
} from '../asserts';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';

const getProfileById = async (profileId: string, fastify: FastifyInstance): Promise<ProfileEntity> => {
  const profile = await fastify.db.profiles.findOne({ key: 'id', equals: profileId });

  await assertProfileExists(profile, fastify);

  return profile!;
};

const createProfileFromInput = async (input: any, fastify: FastifyInstance): Promise<ProfileEntity> => {
  const user = await fastify.db.users.findOne({ key: 'id', equals: input.userId });

  await assertUserExists(user, fastify);

  const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: input.memberTypeId });

  await assertMemberTypeExists(memberType, fastify);

  await assertUserHasNoProfile(input.userId, fastify);

  return fastify.db.profiles.create(input);
};

const updateProfileFromInput = async (
  profileId: string,
  input: any,
  fastify: FastifyInstance,
): Promise<ProfileEntity> => {
  const profile = await fastify.db.profiles.findOne({ key: 'id', equals: profileId });

  await assertProfileExists(profile, fastify);

  const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: input.memberTypeId });

  await assertMemberTypeExists(memberType, fastify);

  return fastify.db.profiles.change(profileId, input);
};

const getUserProfileDataLoader = async (fastify: FastifyInstance) => new DataLoader(async (userIds) => {
  const profiles = await fastify.db.profiles.findMany();

  const profilesMap = profiles.reduce(
    (map, profile) => map.set(profile.userId, profile),
    new Map<string, ProfileEntity>(),
  );

  return userIds.map((userId) => profilesMap.get(String(userId)) ?? null);
});

export {
  getProfileById,
  createProfileFromInput,
  updateProfileFromInput,
  getUserProfileDataLoader,
};
