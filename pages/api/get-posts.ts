// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type postsQuery = {
  skip: number
  take: number
  category_id: number
  orderBy: string
  contains: string
}

async function getPosts({
  skip,
  take,
  category_id,
  contains,
}: postsQuery) {
  const containsCondition =
    contains && contains !== ''
      ? {
          name: { contains: contains },
        }
      : undefined
  const where =
    category_id && category_id !== -1
      ? {
          category_id: category_id,
          ...containsCondition,
        }
      : containsCondition
      ? containsCondition
      : undefined

  try {
    const response = await prisma.posts.findMany({
      skip: skip ? skip : 0,
      take: take ? take : 10,
      where: where,
      orderBy: {
        createdAt: 'desc',
      },
    })
    prisma.$disconnect() // disconnect from database
    return response
  } catch (error) {
    console.error(error)
  }
}

type Data = {
  data?: any
  ok:boolean
  message: string
  status: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { skip, take, category_id, orderBy, contains } = req.query
  if (skip == null || take == null) {
    res.status(400).json({ message: 'No skip or No take', ok: false, status: 400 })
  }

  try {
    const posts = await getPosts({
      skip: Number(skip),
      take: Number(take),
      category_id: Number(category_id),
      orderBy: String(orderBy),
      contains: contains ? String(contains) : '',
    })
    res.status(200).json({ data: posts, ok: true, message: 'Success', status: 200 })
  } catch (error) {
    res.status(400).json({ message: 'Failed', ok: false, status: 400 })
  }
}
