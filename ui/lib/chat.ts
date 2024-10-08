'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { type Chat } from '@/lib/types'
import { kv as redis } from "@vercel/kv";
import cache from '@/lib/cache'
import kysely from '@/kysely/db'
import { sql } from 'kysely'
import { getUTC8ISOString } from '@/lib/utils'
import { getUser } from '@/lib/actions/user'

export async function getAllChats(): Promise<Pick<Chat, 'id' | 'createdAt'>[]> {
  // save the chats in redis and refresh every 5 minutes
  const key = 'allChats'
  const cached: string | null | undefined = await redis.get(key)
  if (cached) {
    try {
      return JSON.parse(cached)
    } catch (error) {
      console.error('Failed to parse cached chats', error)
    }
  }
  const chats: Pick<Chat, 'id' | 'createdAt'>[] = await kysely
    .selectFrom('Chat')
    .select(['id', 'createdAt'])
    .orderBy('createdAt', 'desc')
    .limit(100)
    .execute()

  console.log('chats', chats)

  // await redis.set(key, JSON.stringify(chats))
  // await redis.expire(key, 300)
  return chats
}

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  if (cache.has(`chats:${userId}`)) {
    return cache.get(`chats:${userId}`) as Chat[]
  }

  try {
    const anonymousTokens = await redis.smembers(`user:anonymousToken:${userId}`)

    let history = await kysely
      .selectFrom('Chat')
      .select(['id', 'title', 'path', 'createdAt'])
      .where((eb) => eb.and([
        eb('userId', '=', userId),
        eb('isDeleted', '=', false),
      ]))
      .orderBy('createdAt', 'desc')
      .execute()

    for (const token of anonymousTokens) {
      const chats = await kysely
        .selectFrom('Chat')
        .selectAll()
        .where((eb) => eb.and([
          eb('userId', '=', token),
          eb('isDeleted', '=', false),
        ]))
        .orderBy('createdAt', 'desc')
        .execute()

      history = history.concat(chats)
    }

    history.sort((a: any, b: any) => b.createdAt - a.createdAt)

    cache.set(`chats:${userId}`, history)

    return history as any as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string) {
  console.log('getChat', id)
  if (!id) {
    return null
  }
  if (cache.has(`chat:${id}`)) {
    return cache.get(`chat:${id}`) as Chat
  }
  // console.time('getChat');
  const chat = await kysely
    .selectFrom('Chat')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  // console.timeEnd('getChat');
  if (!chat) {
    console.log('fail to find chat', id)
    return null
  }

  cache.set(`chat:${id}`, chat)

  return {
    ...chat,
    messages: chat.messages as Chat[]
  }
}

export async function clearChats(): Promise<{ error?: string }> {
  const user = await getUser()
  if (!user) {
    return { error: 'No user found' }
  }
  const chats = await kysely
    .selectFrom('Chat')
    .selectAll()
    .where('userId', '=', user.uid)
    .execute()

  if (!chats.length) {
    return { error: 'No chats to clear' }
  }

  await kysely
    .updateTable('Chat')
    .set(() => ({
      isDeleted: true,
    }))
    .where('userId', '=', user.uid)
    .execute();

  try {
    const anonymousTokens = await redis.smembers(`user:anonymousToken:${user.uid}`)

    for (const token of anonymousTokens) {
      await kysely
        .updateTable('Chat')
        .set(() => ({
          isDeleted: true,
        }))
        .where('userId', '=', token)
        .execute();
    }
  } catch (error) {
    console.error('Failed to clear history', error)
  }

  await cache.set(`chats:${user.uid}`, [])

  revalidatePath('/')
  redirect('/')
}

export async function saveChat(chat: Chat) {
  if (!chat.id) {
    return null
  }

  cache.set(`chat:${chat.id}`, chat)
  const dateTime = getUTC8ISOString()
  const messages = sql`${JSON.stringify(chat.messages)}::jsonb`
  // upsert
  await kysely
    .insertInto('Chat')
    .values({ ...chat, messages, updatedAt: dateTime, createdAt: dateTime })
    .onConflict((oc) => {
      return oc
        .column('id')
        .doUpdateSet({
          updatedAt: dateTime,
          messages: messages,
          summary: chat.summary,
        })
    })
    .executeTakeFirst()

  return chat
}

export async function getSharedChat(id: string) {
  const chat = await kysely
    .selectFrom('Chat')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  if (!chat || !chat.sharePath) {
    return null
  }

  return chat
}

export async function shareChat(id: string, userId: string = 'anonymous') {
  const chat = await kysely
    .selectFrom('Chat')
    .selectAll()
    .where('id', '=', id)
    .executeTakeFirst()

  if (!chat || chat.userId !== userId) {
    return null
  }

  const payload = {
    ...chat,
    sharePath: `/share/${id}`
  }

  await kysely
    .updateTable('Chat')
    .set(() => ({
      sharePath: payload.sharePath,
      updatedAt: new Date()
    }))
    .where('id', '=', id)
    .executeTakeFirst()

  return payload
}

export async function saveQuery(id: string, query: { input: string }) {
  await redis.set(`chat:query:${id}`, query)
}

export async function getQuery(id: string) {
  return redis.get<{ input: string }>(`chat:query:${id}`)
}

export async function saveLikeStatus(
  messageId: string,
  data: { messageId: string; chatId: string; userId: string; like: number }
) {
  const dateTime = getUTC8ISOString()
  // upsert
  await kysely
    .insertInto('LikeStatus')
    .values({ ...data, id: `${data.chatId}:${data.messageId}:${data.userId}`, updatedAt: dateTime, createdAt: dateTime })
    .onConflict((oc) => {
      return oc
        .column('id')
        .doUpdateSet({
          updatedAt: dateTime,
          like: data.like,
        })
    })
    .executeTakeFirst()
}

export async function getLikeStatus(chatId: string, messageId: string, userId: string) {
  const status = await kysely
    .selectFrom('LikeStatus')
    .selectAll()
    .where('id', '=', `${chatId}:${messageId}:${userId}`)
    .executeTakeFirst()

  return status
}

// push anonymousToken to list keyed by userId
export async function bindAnonymousToken(
  userId: string,
  anonymousToken: string,
) {
  return redis.sadd(`user:anonymousToken:${userId}`, anonymousToken)
}