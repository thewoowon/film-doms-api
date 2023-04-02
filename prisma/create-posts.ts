import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const postData: Prisma.PostsCreateInput[] = Array.apply(null, Array(100)).map(
  (_, index) => ({
    name: `Post ${index + 1}`,
    category_id: (index+1) % 5 + 1,
    contents: `Post ${index + 1} contents`,
    user : {
      connect: {
        id: index % 10 + 1,
      },
    },
    Comments: undefined,
  })
);

async function main() {
  for (const post of postData) {
    const newPost = await prisma.posts.create({
      data: {
        name: post.name,
        category_id: post.category_id,
        contents: post.contents,
        user: post.user,
        Comments: post.Comments,
      },
    });
    console.log(`Created Id : ${newPost.id}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
  });
