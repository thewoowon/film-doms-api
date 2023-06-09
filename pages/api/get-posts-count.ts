// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getPostsCount(category_id: number, contains: string) {
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
    const response = await prisma.posts.count({ where: where })
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
  const { category_id, contains } = req.query
  try {
    const postsCount = await getPostsCount(
      Number(category_id),
      String(contains)
    )
    res.status(200).json({ data: postsCount, ok: true, message: 'Success', status: 200 })
  } catch (error) {
    res.status(400).json({ message: 'Failed', ok: false, status: 400 })
  }
}
