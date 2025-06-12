import { PrismaClient, Role, Gender } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Create a user
  const user = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: Role.ADMIN,
    },
  });

  // Create a profile for the user
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      title: faker.name.jobTitle(),
      name: faker.person.fullName(),
      telephone: faker.phone.number(),
      location: faker.location.city(),
      age: faker.number.int({ min: 20, max: 50 }),
      gender: Gender.MAN,
      about: faker.lorem.paragraph(),
      resumeUrl: faker.internet.url(),
      websiteUrl: faker.internet.url(),
      imageUrl: faker.image.avatar(),
    },
  });

  // Create some skills
  const skills = await prisma.skill.createMany({
    data: Array.from({ length: 5 }).map(() => ({
      name: faker.hacker.noun() + '-' + faker.string.uuid().slice(0, 5),
      category: faker.hacker.adjective(),
    })),
  });

  const allSkills = await prisma.skill.findMany();

  // Link skills to profile
  for (const skill of allSkills.slice(0, 3)) {
    await prisma.profileSkill.create({
      data: {
        profileId: profile.id,
        skillId: skill.id,
        proficiencyLevel: faker.number.int({ min: 1, max: 10 }),
      },
    });
  }

  // Add contacts
  await prisma.contact.createMany({
    data: [
      {
        profileId: profile.id,
        type: 'email',
        value: faker.internet.email(),
        icon: 'mail',
      },
      {
        profileId: profile.id,
        type: 'linkedin',
        value: faker.internet.url(),
        icon: 'linkedin',
      },
    ],
  });

  // Create a project
  const project = await prisma.project.create({
    data: {
      profileId: profile.id,
      title: faker.commerce.productName(),
      slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
      description: faker.commerce.productDescription(),
      content: faker.lorem.paragraphs(2),
      imageUrl: faker.image.url(),
      githubUrl: 'https://github.com/' + faker.internet.userName(),
      liveUrl: faker.internet.url(),
      isFeatured: true,
    },
  });

  // Link skills to project
  for (const skill of allSkills.slice(0, 2)) {
    await prisma.projectSkill.create({
      data: {
        projectId: project.id,
        skillId: skill.id,
      },
    });
  }

  // Add blog post and tags
  const tag = await prisma.tag.create({
    data: {
      name: faker.hacker.noun(),
    },
  });

  const post = await prisma.blogPost.create({
    data: {
      profileId: profile.id,
      title: faker.lorem.sentence(),
      slug: faker.helpers.slugify(faker.lorem.words(3)),
      content: faker.lorem.paragraphs(3),
      excerpt: faker.lorem.sentences(2),
      status: 'published',
      publishedAt: new Date(),
    },
  });

  await prisma.blogPostTag.create({
    data: {
      postId: post.id,
      tagId: tag.id,
    },
  });

  // Add file
  await prisma.file.create({
    data: {
      profileId: profile.id,
      filename: faker.system.fileName(),
      originalName: 'CV.pdf',
      mimeType: 'application/pdf',
      size: BigInt(faker.number.int({ min: 50000, max: 300000 })),
      path: faker.system.filePath(),
    },
  });

  console.log('✅ Seeding selesai!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
