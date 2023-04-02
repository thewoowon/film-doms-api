// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type commentQuery = {
  postId?: number
}

async function getPostsByPostId({
  postId
}: commentQuery) {
  try {
    const response = await prisma.comments.findMany({
      where: {
        postId: postId
      },
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
  const { postId } = req.query
  try {
    const posts = await getPostsByPostId({
      postId: Number(postId)
    })
    res.status(200).json({ data: posts, ok: true, message: 'Success', status: 200 })
  } catch (error) {
    res.status(400).json({ message: 'Failed', ok: false, status: 400 })
  }
}
