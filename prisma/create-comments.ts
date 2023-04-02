import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const commentData: Prisma.CommentsCreateInput[] = Array.apply(
  null,
  Array(100)
).map((_, index) => ({
  contents: `Comment ${index + 1} contents`,
  user: {
    connect: {
      id: index % 10 + 1,
    },
  },
  post: undefined,
}))

async function main() {
  for (const comment of commentData) {
    const newComment = await prisma.comments.create({
      data: {
        contents: comment.contents,
        user: comment.user,
        post: comment.post,
      },
    })
    console.log(`Created Id : ${newComment.id}`)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })
