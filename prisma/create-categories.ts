import { PrismaClient, Prisma } from '@prisma/client'

const tag = ['영화', 'OTT', '드라마', '이벤트', '굿즈']

const prisma = new PrismaClient()

const categoryData: Prisma.CategoriesCreateInput[] = Array.apply(
  null,
  Array(5)
).map((_, index) => ({
  name: tag[index],
}))

async function main() {
  for (const category of categoryData) {
    const newCategory = await prisma.categories.create({
      data: {
        name: category.name,
      },
    })
    console.log(`Created Id : ${newCategory.id}`)
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
