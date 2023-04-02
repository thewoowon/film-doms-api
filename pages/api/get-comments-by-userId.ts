// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getCommentsByUserId(id: number) {
  try {
    const response = await prisma.comments.findMany({
      where:{
        userId: id
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
  const { id: userId } = req.query

  if (userId == null) {
    res.status(400).json({ message: 'No Id', ok: false, status: 400  })
  }
  try {
    const comments = await getCommentsByUserId(Number(userId))
    res.status(200).json({ data: comments, ok: true, message: 'Success', status: 200 })
  } catch (error) {
    res.status(400).json({ message: 'Failed', ok: false, status: 400  })
  }
}
