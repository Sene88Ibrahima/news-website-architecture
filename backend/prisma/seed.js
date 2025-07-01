const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash password for demo users
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create categories
  const techCategory = await prisma.category.upsert({
    where: { name: 'Technologie' },
    update: {},
    create: {
      name: 'Technologie',
      description: 'Articles sur les nouvelles technologies et innovations'
    }
  });

  const sportsCategory = await prisma.category.upsert({
    where: { name: 'Sports' },
    update: {},
    create: {
      name: 'Sports',
      description: 'Actualités sportives et résultats'
    }
  });

  const politicsCategory = await prisma.category.upsert({
    where: { name: 'Politique' },
    update: {},
    create: {
      name: 'Politique',
      description: 'Actualités politiques nationales et internationales'
    }
  });

  // Create users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@news.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@news.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  const editorUser = await prisma.user.upsert({
    where: { email: 'editor@news.com' },
    update: {},
    create: {
      username: 'editor',
      email: 'editor@news.com',
      password: hashedPassword,
      role: 'EDITOR'
    }
  });

  const visitorUser = await prisma.user.upsert({
    where: { email: 'visitor@news.com' },
    update: {},
    create: {
      username: 'visitor',
      email: 'visitor@news.com',
      password: hashedPassword,
      role: 'VISITOR'
    }
  });

  // Create sample articles
  await prisma.article.createMany({
    data: [
      {
        title: 'Les dernières innovations en intelligence artificielle',
        content: 'L\'intelligence artificielle continue de révolutionner notre monde avec des avancées remarquables dans le machine learning, le traitement du langage naturel et la vision par ordinateur. Les nouvelles architectures de réseaux de neurones permettent des performances inégalées...',
        summary: 'Découvrez les dernières avancées en IA qui transforment notre quotidien.',
        published: true,
        authorId: editorUser.id,
        categoryId: techCategory.id
      },
      {
        title: 'Championnat du monde de football : résultats et analyses',
        content: 'Le championnat du monde de football bat son plein avec des matchs spectaculaires et des performances exceptionnelles. Les équipes favorites confirment leur statut tandis que quelques surprises émergent...',
        summary: 'Suivez les résultats et analyses du championnat du monde de football.',
        published: true,
        authorId: editorUser.id,
        categoryId: sportsCategory.id
      },
      {
        title: 'Nouvelles réformes économiques annoncées',
        content: 'Le gouvernement a annoncé une série de réformes économiques visant à stimuler la croissance et réduire le chômage. Ces mesures incluent des incitations fiscales pour les entreprises et des investissements dans l\'infrastructure...',
        summary: 'Analyse des nouvelles réformes économiques et leur impact potentiel.',
        published: true,
        authorId: adminUser.id,
        categoryId: politicsCategory.id
      },
      {
        title: 'Révolution dans le développement web avec les nouvelles frameworks',
        content: 'Les frameworks de développement web évoluent rapidement, offrant de nouvelles possibilités pour créer des applications plus performantes et maintenables. React, Vue.js et Angular continuent d\'innover...',
        summary: 'Exploration des nouvelles tendances en développement web.',
        published: false,
        authorId: editorUser.id,
        categoryId: techCategory.id
      },
      {
        title: 'Transferts d\'été : les mouvements qui marquent le mercato',
        content: 'Le mercato d\'été réserve son lot de surprises avec des transferts spectaculaires qui redessinent l\'équilibre des championnats européens. Les clubs investissent massivement pour renforcer leurs effectifs...',
        summary: 'Tour d\'horizon des transferts les plus marquants de l\'été.',
        published: true,
        authorId: editorUser.id,
        categoryId: sportsCategory.id
      }
    ]
  });

  // Create API tokens for testing
  await prisma.authToken.create({
    data: {
      token: 'dev-api-token-12345',
      type: 'API',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      userId: adminUser.id
    }
  });

  console.log('✅ Database seeded successfully!');
  console.log('👤 Demo users created:');
  console.log('   - Admin: admin@news.com / password123');
  console.log('   - Editor: editor@news.com / password123');
  console.log('   - Visitor: visitor@news.com / password123');
  console.log('🏷️  Categories created: Technologie, Sports, Politique');
  console.log('📰 Sample articles created');
  console.log('🔑 API token created: dev-api-token-12345');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });