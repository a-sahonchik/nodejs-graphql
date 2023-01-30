import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async function (): Promise<ProfileEntity[]> {
    const profiles = fastify.db.profiles.findMany();

    return profiles;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id });

      if (profile === null) {
        throw fastify.httpErrors.notFound('Profile not found');
      }

      return profile;
    },
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });

      if (memberType === null) {
        throw fastify.httpErrors.badRequest('Member type not found');
      }

      const userAlreadyHasAProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.body.userId });

      if (userAlreadyHasAProfile) {
        throw fastify.httpErrors.badRequest('User already has a profile');
      }

      const profile = await fastify.db.profiles.create(request.body);

      return profile;
    },
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({ key: 'id', equals: request.params.id });

      if (profile === null) {
        throw fastify.httpErrors.badRequest('Profile not found');
      }

      const deletedProfile = await fastify.db.profiles.delete(request.params.id);

      return deletedProfile;
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<ProfileEntity> {
      if (request.body.memberTypeId !== undefined) {
        const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.body.memberTypeId });

        if (memberType === null) {
          throw fastify.httpErrors.badRequest('Member type not found');
        }
      }

      try {
        const patchedProfile = await fastify.db.profiles.change(request.params.id, request.body);

        return patchedProfile;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }
    },
  );
};

export default plugin;
