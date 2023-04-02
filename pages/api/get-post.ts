// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getPost(id: number) {
  try {
    const response = await prisma.posts.findUnique({
      where: {
        id: id,
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
  ok: boolean
  message: string
  status: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { id: postId } = req.query

  if (postId == null) {
    res.status(400).json({ message: 'No Id', ok: false, status: 400 })
  }
  try {
    const post = await getPost(Number(postId))
    res
      .status(200)
      .json({ data: post, ok: true, message: 'Success', status: 200 })
  } catch (error) {
    res.status(400).json({ message: 'Failed', ok: false, status: 400 })
  }
}
