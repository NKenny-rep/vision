import { config } from 'dotenv'
import { neon } from '@neondatabase/serverless'
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import bcrypt from 'bcrypt'
import * as schema from './schema'

const { Pool } = pg

// Load environment variables from .env file
config()

const isDocker = process.env.DOCKER_ENV === 'true'

async function seed() {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }

  let db
  if (isDocker) {
    const pool = new Pool({ 
      connectionString: databaseUrl,
      ssl: false
    })
    db = drizzlePostgres(pool, { schema })
  } else {
    const sql = neon(databaseUrl)
    db = drizzleNeon(sql, { schema })
  }

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
    await db.delete(schema.userSubscriptions)
    await db.delete(schema.subscriptionPlans)
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
    const [creditCardType, debitCardType, _paypalType] = await db.insert(schema.paymentTypes).values([
      { id: 1, name: 'credit_card', displayName: 'Credit Card' },
      { id: 2, name: 'debit_card', displayName: 'Debit Card' },
      { id: 3, name: 'paypal', displayName: 'PayPal' },
    ]).returning()

    console.log('✓ Payment types created')

    // 3. Create users
    console.log('Creating users...')
    
    // Helper function to generate random users
    const generateRandomUsers = (count: number, startId: number) => {
      const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 
        'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander',
        'Abigail', 'Michael', 'Emily', 'Daniel', 'Elizabeth', 'Matthew', 'Sofia', 'Jackson', 'Avery', 'Sebastian',
        'Ella', 'David', 'Scarlett', 'Joseph', 'Grace', 'Samuel', 'Chloe', 'John', 'Victoria', 'Owen',
        'Riley', 'Dylan', 'Aria', 'Luke', 'Lily', 'Gabriel', 'Aubrey', 'Anthony', 'Zoey', 'Isaac']
      
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
        'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
        'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
        'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
        'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts']
      
      return Array.from({ length: count }, (_, i) => {
        const firstName = firstNames[i % firstNames.length]
        const lastName = lastNames[i % lastNames.length]
        const uniqueId = startId + i
        
        return {
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueId}@videovision.com`,
          password: userPassword,
          name: `${firstName} ${lastName}`,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${uniqueId}`,
          phone: `+1-555-${String(uniqueId).padStart(4, '0')}`,
          roleId: userRole.id,
        }
      })
    }
    
    const [adminUser, user1, user2, user3, goku, tonymontana, _aldebaran, _shion, _cloud] = await db.insert(schema.users).values([
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

    // Create additional 50 users
    console.log('Creating additional 50 users...')
    const additionalUsers = await db.insert(schema.users).values(
      generateRandomUsers(50, 10)
    ).returning()

    console.log('✓ Users created')

    // 4. Create payment methods
    console.log('Creating payment methods...')
    
    // Helper to generate random payment methods
    const generateRandomPaymentMethods = (users: typeof additionalUsers) => {
      const cardBrands = ['visa', 'mastercard', 'amex', 'discover']
      const paymentTypeIds = [creditCardType.id, debitCardType.id]
      
      return users.map(user => {
        // Generate random expiry date after March 2026
        const year = 2026 + Math.floor(Math.random() * 4) // 2026-2029
        const month = year === 2026 
          ? 4 + Math.floor(Math.random() * 9) // April-December for 2026
          : 1 + Math.floor(Math.random() * 12) // Any month for 2027+
        
        return {
          userId: user.id,
          paymentTypeId: paymentTypeIds[Math.floor(Math.random() * paymentTypeIds.length)],
          cardLast4: String(Math.floor(1000 + Math.random() * 9000)),
          cardBrand: cardBrands[Math.floor(Math.random() * cardBrands.length)],
          expiryMonth: String(month).padStart(2, '0'),
          expiryYear: String(year),
          isDefault: true,
        }
      })
    }
    
    await db.insert(schema.paymentMethods).values([
      {
        userId: adminUser.id,
        paymentTypeId: creditCardType.id,
        cardLast4: '4242',
        cardBrand: 'visa',
        expiryMonth: '12',
        expiryYear: '2027',
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
        expiryYear: '2027',
        isDefault: true,
      },
      {
        userId: user3.id,
        paymentTypeId: creditCardType.id,
        cardLast4: '3333',
        cardBrand: 'visa',
        expiryMonth: '08',
        expiryYear: '2027',
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
      {
        userId: _aldebaran.id,
        paymentTypeId: debitCardType.id,
        cardLast4: '6666',
        cardBrand: 'mastercard',
        expiryMonth: '05',
        expiryYear: '2027',
        isDefault: true,
      },
      {
        userId: _shion.id,
        paymentTypeId: creditCardType.id,
        cardLast4: '5544',
        cardBrand: 'visa',
        expiryMonth: '10',
        expiryYear: '2026',
        isDefault: true,
      },
      {
        userId: _cloud.id,
        paymentTypeId: creditCardType.id,
        cardLast4: '2211',
        cardBrand: 'amex',
        expiryMonth: '07',
        expiryYear: '2028',
        isDefault: true,
      },
    ])
    
    // Add payment methods for additional users
    await db.insert(schema.paymentMethods).values(
      generateRandomPaymentMethods(additionalUsers)
    )
    
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

    // 8. Create subscription plans
    console.log('Creating subscription plans...')
    const [basicPlan, standardPlan, premiumPlan] = await db.insert(schema.subscriptionPlans).values([
      {
        name: 'Basic',
        description: 'Perfect for casual viewers',
        price: 999, // $9.99
        billingPeriod: 'monthly',
        features: JSON.stringify(['HD Quality', 'Watch on 1 device', 'Cancel anytime']),
        maxDevices: 1,
        maxQuality: 'HD',
        isActive: true,
      },
      {
        name: 'Standard',
        description: 'Great for families',
        price: 1499, // $14.99
        billingPeriod: 'monthly',
        features: JSON.stringify(['Full HD Quality', 'Watch on 2 devices', 'Download available', 'Cancel anytime']),
        maxDevices: 2,
        maxQuality: 'Full HD',
        isActive: true,
      },
      {
        name: 'Premium',
        description: 'Ultimate entertainment',
        price: 1999, // $19.99
        billingPeriod: 'monthly',
        features: JSON.stringify(['4K Quality', 'Watch on 4 devices', 'Download available', 'Priority support', 'Cancel anytime']),
        maxDevices: 4,
        maxQuality: '4K + HDR',
        isActive: true,
      },
    ]).returning()

    console.log('✓ Subscription plans created')

    // 9. Create user subscriptions
    console.log('Creating user subscriptions...')
    
    // Helper to generate random subscriptions
    const generateRandomSubscriptions = (users: typeof additionalUsers) => {
      const statuses: Array<'active' | 'cancelled' | 'expired'> = ['active', 'active', 'active', 'cancelled', 'expired']
      const allPlans = [basicPlan, standardPlan, premiumPlan]
      
      return users.map(user => {
        const status = statuses[Math.floor(Math.random() * statuses.length)]
        const plan = allPlans[Math.floor(Math.random() * allPlans.length)]
        const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(1 + Math.random() * 28))
        
        return {
          userId: user.id,
          planId: plan.id,
          status,
          startDate,
          autoRenew: status === 'active' ? Math.random() > 0.3 : false,
          ...(status === 'cancelled' && { cancelledAt: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000) }),
          ...(status === 'expired' && { endDate: new Date(startDate.getTime() + 60 * 24 * 60 * 60 * 1000) })
        }
      })
    }
    
    await db.insert(schema.userSubscriptions).values([
      {
        userId: adminUser.id,
        planId: premiumPlan.id,
        status: 'active',
        startDate: new Date('2024-01-01'),
        autoRenew: true,
      },
      {
        userId: user1.id,
        planId: standardPlan.id,
        status: 'active',
        startDate: new Date('2024-06-15'),
        autoRenew: true,
      },
      {
        userId: user2.id,
        planId: basicPlan.id,
        status: 'active',
        startDate: new Date('2024-08-01'),
        autoRenew: false,
      },
      {
        userId: user3.id,
        planId: standardPlan.id,
        status: 'active',
        startDate: new Date('2024-07-10'),
        autoRenew: true,
      },
      {
        userId: goku.id,
        planId: premiumPlan.id,
        status: 'active',
        startDate: new Date('2024-03-20'),
        autoRenew: true,
      },
      {
        userId: tonymontana.id,
        planId: standardPlan.id,
        status: 'active',
        startDate: new Date('2024-05-05'),
        autoRenew: true,
      },
      {
        userId: _aldebaran.id,
        planId: basicPlan.id,
        status: 'active',
        startDate: new Date('2024-09-12'),
        autoRenew: true,
      },
      {
        userId: _shion.id,
        planId: basicPlan.id,
        status: 'active',
        startDate: new Date('2024-10-01'),
        autoRenew: false,
      },
      {
        userId: _cloud.id,
        planId: premiumPlan.id,
        status: 'active',
        startDate: new Date('2024-04-15'),
        autoRenew: true,
      },
    ])
    
    // Add subscriptions for additional users
    await db.insert(schema.userSubscriptions).values(
      generateRandomSubscriptions(additionalUsers)
    )

    console.log('✓ User subscriptions created')

    console.log('✅ Database seeded successfully!')
    console.log('\n📊 Summary:')
    console.log(`  - 2 roles`)
    console.log(`  - 59 users (9 initial + 50 additional)`)
    console.log(`  - 3 subscription plans`)
    console.log(`  - 53 active subscriptions (initial + random)`)
    console.log(`  - 59 payment methods`)
    console.log(`  - 4 movie lists`)
    console.log(`  - 9 movie list items`)
    console.log(`  - 4 reviews`)
    console.log(`  - 7 review likes`)
    console.log('\n🔑 Login credentials (all users use password: "password123"):')
    console.log('  Admin: admin@videovision.com (Premium Plan)')
    console.log('  User:  john.doe@example.com (Standard Plan)')
    console.log('\n📧 Additional 50 users: firstname.lastnameNUMBER@videovision.com')
    console.log('  Example: emma.smith10@videovision.com, liam.johnson11@videovision.com, etc.')

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
