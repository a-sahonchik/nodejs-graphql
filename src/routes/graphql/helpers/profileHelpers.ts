import { FastifyInstance } from 'fastify';
import { assertProfileExists } from '../asserts';
import { ProfileEntity } from '../../../utils/DB/entities/DBProfiles';

const getProfileById = async (profileId: string, fastify: FastifyInstance): Promise<ProfileEntity> => {
  const profile = await fastify.db.profiles.findOne({ key: 'id', equals: profileId });

  await assertProfileExists(profile, fastify);

  return profile!;
};

export { getProfileById };
