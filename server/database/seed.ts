import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import bcrypt from 'bcrypt'
import * as schema from './schema'

// Load environment variables from .env file
config()

async function seed() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  const sql = neon(databaseUrl)
  const db = drizzle(sql, { schema })

  console.log('🌱 Seeding database...')

  // Hash passwords
  const saltRounds = 10
  const adminPassword = await bcrypt.hash('admin123', saltRounds)
  const userPassword = await bcrypt.hash('password123', saltRounds)

  try {
    // Clear existing data (in correct order due to foreign keys)
    console.log('🗑️  Clearing existing data...')
    await db.delete(schema.reviewLikes)
    await db.delete(schema.reviews)
    await db.delete(schema.movieListItems)
    await db.delete(schema.movieLists)
    await db.delete(schema.paymentMethods)
    await db.delete(schema.users)
    await db.delete(schema.paymentTypes)
    await db.delete(schema.roles)
    console.log('✓ Existing data cleared')

    // 1. Create roles with fixed IDs
    console.log('Creating roles...')
    const [userRole, adminRole] = await db.insert(schema.roles).values([
      { id: 1, name: 'user', description: 'Standard user with basic permissions' },
      { id: 2, name: 'admin', description: 'Administrator with full permissions' },
    ]).returning()

    console.log('✓ Roles created')

    // 2. Create payment types with fixed IDs
    console.log('Creating payment types...')
    const [creditCardType, debitCardType, paypalType] = await db.insert(schema.paymentTypes).values([
      { id: 1, name: 'credit_card', displayName: 'Credit Card' },
      { id: 2, name: 'debit_card', displayName: 'Debit Card' },
      { id: 3, name: 'paypal', displayName: 'PayPal' },
    ]).returning()

    console.log('✓ Payment types created')

    // 3. Create users
    console.log('Creating users...')
    const [adminUser, user1, user2, user3, goku, tonymontana, aldebaran, shion, cloud] = await db.insert(schema.users).values([
      {
        email: 'admin@videovision.com',
          password: adminPassword,
          name: 'Admin User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
          phone: '+1-555-0001',
          roleId: adminRole.id,
        },
        {
          email: 'john.doe@example.com',
          password: userPassword,
          name: 'John Doe',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          phone: '+1-555-0002',
          roleId: userRole.id,
        },
        {
          email: 'jane.smith@example.com',
          password: userPassword,
          name: 'Jane Smith',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          phone: '+1-555-0003',
          roleId: userRole.id,
        },
        {
          email: 'mike.johnson@example.com',
          password: userPassword,
          name: 'Mike Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
          phone: '+1-555-0004',
          roleId: userRole.id,
        },
        {
          email: 'goku@videovision.com',
          password: userPassword,
          name: 'Goku',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Goku',
          phone: '+1-555-0005',
          roleId: adminRole.id,
        },
        {
          email: 'tonymontana@videovision.com',
          password: userPassword,
          name: 'Tony Montana',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony',
          phone: '+1-555-0006',
          roleId: userRole.id,
        },
        {
          email: 'aldebaran@videovision.com',
          password: userPassword,
          name: 'Aldebaran',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aldebaran',
          phone: '+1-555-0007',
          roleId: userRole.id,
        },
        {
          email: 'shion@videovision.com',
          password: userPassword,
          name: 'Shion',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shion',
          phone: '+1-555-0008',
          roleId: userRole.id,
        },
        {
          email: 'cloud@videovision.com',
          password: userPassword,
          name: 'Cloud',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cloud',
          phone: '+1-555-0009',
          roleId: userRole.id,
        },
      ]).returning()

    console.log('✓ Users created')

    // 4. Create payment methods
    console.log('Creating payment methods...')
    await db.insert(schema.paymentMethods).values([
      {
        userId: adminUser.id,
        paymentTypeId: creditCardType.id,
        cardLast4: '4242',
        cardBrand: 'visa',
        expiryMonth: '12',
        expiryYear: '2025',
        isDefault: true,
      },
      {
        userId: user1.id,
        paymentTypeId: creditCardType.id,
        cardLast4: '5555',
        cardBrand: 'mastercard',
        expiryMonth: '06',
        expiryYear: '2026',
        isDefault: true,
      },
      {
        userId: user1.id,
        paymentTypeId: debitCardType.id,
        cardLast4: '1234',
        cardBrand: 'visa',
        expiryMonth: '03',
        expiryYear: '2027',
        isDefault: false,
      },
      {
        userId: user2.id,
        paymentTypeId: creditCardType.id,
        cardLast4: '8888',
        cardBrand: 'amex',
        expiryMonth: '09',
        expiryYear: '2025',
        isDefault: true,
      },
      {
        userId: goku.id,
        paymentTypeId: creditCardType.id,
        cardLast4: '9999',
        cardBrand: 'visa',
        expiryMonth: '11',
        expiryYear: '2026',
        isDefault: true,
      },
      {
        userId: tonymontana.id,
        paymentTypeId: debitCardType.id,
        cardLast4: '7777',
        cardBrand: 'mastercard',
        expiryMonth: '04',
        expiryYear: '2028',
        isDefault: true,
      },
    ])
    console.log('✓ Payment methods created')

    // 5. Create movie lists
    console.log('Creating movie lists...')
    const [list1, list2, list3, list4] = await db.insert(schema.movieLists).values([
      {
        userId: user1.id,
        name: 'My Favorites',
        description: 'Movies I absolutely love',
        isDefault: true,
      },
      {
        userId: user1.id,
        name: 'To Watch',
        description: 'Movies on my watchlist',
        isDefault: false,
      },
      {
        userId: user2.id,
        name: 'My List',
        description: 'Default movie list',
        isDefault: true,
      },
      {
        userId: user3.id,
        name: 'Action Movies',
        description: 'My favorite action-packed films',
        isDefault: true,
      },
    ]).returning()

    console.log('✓ Movie lists created')

    // 5. Create movie list items
    console.log('Creating movie list items...')
    await db.insert(schema.movieListItems).values([
      // John's Favorites
      {
        listId: list1.id,
        omdbId: 'tt1375666',
        movieTitle: 'Inception',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        movieYear: '2010',
        movieType: 'movie',
      },
      {
        listId: list1.id,
        omdbId: 'tt0111161',
        movieTitle: 'The Shawshank Redemption',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
        movieYear: '1994',
        movieType: 'movie',
      },
      {
        listId: list1.id,
        omdbId: 'tt0468569',
        movieTitle: 'The Dark Knight',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
        movieYear: '2008',
        movieType: 'movie',
      },
      // John's To Watch
      {
        listId: list2.id,
        omdbId: 'tt0816692',
        movieTitle: 'Interstellar',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
        movieYear: '2014',
        movieType: 'movie',
      },
      {
        listId: list2.id,
        omdbId: 'tt0109830',
        movieTitle: 'Forrest Gump',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
        movieYear: '1994',
        movieType: 'movie',
      },
      // Jane's List
      {
        listId: list3.id,
        omdbId: 'tt0137523',
        movieTitle: 'Fight Club',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BNDIzNDU0YzEtYzE5Ni00ZjlkLTk5ZjgtNjM3NWE4YzA3Nzk3XkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg',
        movieYear: '1999',
        movieType: 'movie',
      },
      {
        listId: list3.id,
        omdbId: 'tt0110912',
        movieTitle: 'Pulp Fiction',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
        movieYear: '1994',
        movieType: 'movie',
      },
      // Mike's Action Movies
      {
        listId: list4.id,
        omdbId: 'tt0133093',
        movieTitle: 'The Matrix',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
        movieYear: '1999',
        movieType: 'movie',
      },
      {
        listId: list4.id,
        omdbId: 'tt6751668',
        movieTitle: 'Parasite',
        moviePoster: 'https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg',
        movieYear: '2019',
        movieType: 'movie',
      },
    ])

    console.log('✓ Movie list items created')

    // 6. Create reviews
    console.log('Creating reviews...')
    const [review1, review2, review3, review4] = await db.insert(schema.reviews).values([
      {
        userId: user1.id,
        omdbId: 'tt1375666',
        rating: 5,
        comment: 'Absolutely mind-blowing! Christopher Nolan at his finest. The dream-within-a-dream concept is executed perfectly.',
        likes: 12,
      },
      {
        userId: user2.id,
        omdbId: 'tt1375666',
        rating: 4,
        comment: 'Great movie with stunning visuals. The plot can be a bit confusing at times, but it\'s worth watching multiple times.',
        likes: 8,
      },
      {
        userId: user1.id,
        omdbId: 'tt0111161',
        rating: 5,
        comment: 'The greatest film ever made. The story of hope and friendship is beautifully told. A masterpiece.',
        likes: 25,
      },
      {
        userId: user3.id,
        omdbId: 'tt0468569',
        rating: 5,
        comment: 'Heath Ledger\'s performance as the Joker is legendary. This is how superhero movies should be made.',
        likes: 18,
      },
    ]).returning()

    console.log('✓ Reviews created')

    // 7. Create review likes
    console.log('Creating review likes...')
    await db.insert(schema.reviewLikes).values([
      { reviewId: review1.id, userId: user2.id },
      { reviewId: review1.id, userId: user3.id },
      { reviewId: review2.id, userId: user1.id },
      { reviewId: review3.id, userId: user2.id },
      { reviewId: review3.id, userId: user3.id },
      { reviewId: review4.id, userId: user1.id },
      { reviewId: review4.id, userId: user2.id },
    ])

    console.log('✓ Review likes created')

    console.log('✅ Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`  - 2 roles`)
    console.log(`  - 4 users (admin@videovision.com / john.doe@example.com)`)
    console.log(`  - 4 movie lists`)
    console.log(`  - 9 movie list items`)
    console.log(`  - 4 reviews`)
    console.log(`  - 7 review likes`)
    console.log('\n🔑 Login credentials (all users use password: "password123"):')
    console.log('  Admin: admin@videovision.com')
    console.log('  User:  john.doe@example.com')

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log('\n✨ Seed completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Failed to seed database:', error)
    process.exit(1)
  })
