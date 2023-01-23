import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
      const users = fastify.db.users.findMany();

      return users;
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply ): Promise<UserEntity | null> {
        const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id});

        if (user === null) {
            throw fastify.httpErrors.notFound('User not found');
        }

        return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        const user = await fastify.db.users.create(request.body);

        return user;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        const user = await fastify.db.users.findOne({ key: 'id', equals: request.params.id });

        if (user === null) {
            throw fastify.httpErrors.badRequest('User not found');
        }

        const userPosts = await fastify.db.posts.findMany({ key: 'userId', equals: request.params.id});

        for (const post of userPosts) {
            await fastify.db.posts.delete(post.id)
        }

        const userProfile = await fastify.db.profiles.findOne({ key: 'userId', equals: request.params.id});

        if (userProfile !== null) {
            await fastify.db.profiles.delete(userProfile.id)
        }

        const userFollowers = await fastify.db.users.findMany({ key: 'subscribedToUserIds', inArray: request.params.id });

        for (const follower of userFollowers) {
            const followerUserIndex = follower.subscribedToUserIds.indexOf(request.params.id);

            follower.subscribedToUserIds.splice(followerUserIndex, 1);

            await fastify.db.users.change(follower.id, { subscribedToUserIds: follower.subscribedToUserIds});
        }

        const deletedUser = await fastify.db.users.delete(request.params.id);

        return deletedUser;
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        const currentUser = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId});
        const userToSubscribeFor = await fastify.db.users.findOne({ key: 'id', equals: request.params.id});

        if (currentUser === null || userToSubscribeFor === null) {
            throw fastify.httpErrors.badRequest('User not found');
        }

        const userAlreadySubscribed = currentUser.subscribedToUserIds.includes(request.params.id);

        if (userAlreadySubscribed) {
            return currentUser;
        }

        const userTriesToSubscribeToHimself = request.body.userId === request.params.id;

        if (userTriesToSubscribeToHimself) {
            throw fastify.httpErrors.badRequest('You can\'t subscribe to yourself');
        }

        try {
            const patchedUser = await fastify.db.users.change(request.body.userId, { subscribedToUserIds: [...currentUser.subscribedToUserIds, request.params.id]});

            return patchedUser;
        } catch (error: any) {
            throw fastify.httpErrors.badRequest(error);
        }
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        const currentUser = await fastify.db.users.findOne({ key: 'id', equals: request.body.userId});
        const userToUnsubscribeFrom = await fastify.db.users.findOne({ key: 'id', equals: request.params.id});

        if (currentUser === null || userToUnsubscribeFrom === null) {
            throw fastify.httpErrors.badRequest('User not found');
        }

        const userSubscribedToAnotherUser = currentUser.subscribedToUserIds.includes(request.params.id);

        if (!userSubscribedToAnotherUser) {
            throw fastify.httpErrors.badRequest('You are not following this user');
        }

        const userTriesToUnsubscribeFromHimself = request.body.userId === request.params.id;

        if (userTriesToUnsubscribeFromHimself) {
            throw fastify.httpErrors.badRequest('You can\'t unsubscribe from yourself');
        }

        try {
            const subscribedUserIndex = currentUser.subscribedToUserIds.indexOf(request.params.id);

            currentUser.subscribedToUserIds.splice(subscribedUserIndex, 1);

            const patchedUser = await fastify.db.users.change(request.body.userId, { subscribedToUserIds: currentUser.subscribedToUserIds});

            return patchedUser;
        } catch (error: any) {
            throw fastify.httpErrors.badRequest(error);
        }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
        try {
            const patchedUser = await fastify.db.users.change(request.params.id, request.body);

            return patchedUser;
        } catch (error: any) {
            throw fastify.httpErrors.badRequest(error);
        }
    }
  );
};

export default plugin;
