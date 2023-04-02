import { PrismaClient, Prisma, Posts, Critics, Comments } from '@prisma/client'

const prisma = new PrismaClient()

const userData: Prisma.UsersCreateInput[] = Array.apply(null, Array(10)).map(
  (_, index) => ({
    name: `user${index}`,
    email: `user${index}@naver.com`,
    password: `user${index}`,
    Posts: undefined,
    Critics: undefined,
    Comments: undefined,
  })
)

async function main() {
  for (const user of userData) {
    const newUser = await prisma.users.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        Posts: user.Posts,
        Critics: user.Critics,
        Comments: user.Comments,
      },
    })
    console.log(`Created Id : ${newUser.id}`)
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
