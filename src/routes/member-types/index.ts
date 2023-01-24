import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify,
): Promise<void> => {
  fastify.get('/', async function (): Promise<MemberTypeEntity[]> {
    const memberTypes = fastify.db.memberTypes.findMany();

    return memberTypes;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request): Promise<MemberTypeEntity> {
      const memberType = await fastify.db.memberTypes.findOne({ key: 'id', equals: request.params.id });

      if (memberType === null) {
        throw fastify.httpErrors.notFound('Member type not found');
      }

      return memberType;
    },
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request): Promise<MemberTypeEntity> {
      try {
        const patchedMemberType = await fastify.db.memberTypes.change(request.params.id, request.body);

        return patchedMemberType;
      } catch (error: any) {
        throw fastify.httpErrors.badRequest(error);
      }
    },
  );
};

export default plugin;
