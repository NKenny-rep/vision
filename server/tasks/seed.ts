import { useDB } from '../database'
import * as schema from '../database/schema'

export default defineTask({
  meta: {
    name: 'db:seed',
    description: 'Seed the database with initial data',
  },
  async run() {
    console.log('🌱 Seeding database...')

    const db = useDB()

    try {
      // 1. Create roles
      console.log('Creating roles...')
      const [userRole, adminRole] = await db.insert(schema.roles).values([
        { name: 'user', description: 'Standard user with basic permissions' },
        { name: 'admin', description: 'Administrator with full permissions' },
      ]).returning()

      console.log('✓ Roles created')

      // 2. Create users
      console.log('Creating users...')
      const [_adminUser, user1, user2, user3, _goku, _tonymontana, _aldebaran, _shion, _cloud] = await db.insert(schema.users).values([
        {
          email: 'admin@videovision.com',
          password: '$2a$10$rQj5PqJYZ8J5qZ8J5qZ8JOZxK5K5K5K5K5K5K5K5K5K5K5K5K5K5K', // "admin123"
          name: 'Admin User',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
          roleId: adminRole.id,
        },
        {
          email: 'john.doe@example.com',
          password: '$2a$10$rQj5PqJYZ8J5qZ8J5qZ8JOZxK5K5K5K5K5K5K5K5K5K5K5K5K5K5K', // "password123"
          name: 'John Doe',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
          roleId: userRole.id,
        },
        {
          email: 'jane.smith@example.com',
          password: '$2a$10$rQj5PqJYZ8J5qZ8J5qZ8JOZxK5K5K5K5K5K5K5K5K5K5K5K5K5K5K',
          name: 'Jane Smith',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
          roleId: userRole.id,
        },
        {
          email: 'mike.johnson@example.com',
          password: '$2a$10$rQj5PqJYZ8J5qZ8J5qZ8JOZxK5K5K5K5K5K5K5K5K5K5K5K5K5K5K',
          name: 'Mike Johnson',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
          roleId: userRole.id,
        },
        {
          email: 'goku@videovision.com',
          password: '$2a$10$rQj5PqJYZ8J5qZ8J5qZ8JOZxK5K5K5K5K5K5K5K5K5K5K5K5K5K5K',
          name: 'Goku',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Goku',
          roleId: adminRole.id,
        },
        {
          email: 'tonymontana@videovision.com',
          password: '$2a$10$rQj5PqJYZ8J5qZ8J5qZ8JOZxK5K5K5K5K5K5K5K5K5K5K5K5K5K5K',
          name: 'Tony Montana',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tony',
          roleId: userRole.id,
        },
        {
          email: 'aldebaran@videovision.com',
          password: '$2a$10$rQj5PqJYZ8J5qZ8J5qZ8JOZxK5K5K5K5K5K5K5K5K5K5K5K5K5K5K',
          name: 'Aldebaran',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aldebaran',
          roleId: userRole.id,
        },
        {
          email: 'shion@videovision.com',
          password: '$2a$10$rQj5PqJYZ8J5qZ8J5qZ8JOZxK5K5K5K5K5K5K5K5K5K5K5K5K5K5K',
          name: 'Shion',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shion',
          roleId: userRole.id,
        },
        {
          email: 'cloud@videovision.com',
          password: '$2a$10$rQj5PqJYZ8J5qZ8J5qZ8JOZxK5K5K5K5K5K5K5K5K5K5K5K5K5K5K',
          name: 'Cloud',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cloud',
          roleId: userRole.id,
        },
      ]).returning()

      console.log('✓ Users created')

      // 3. Create movie lists
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

      // 4. Create movie list items
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

      // 5. Create reviews
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

      // 6. Create review likes
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
      console.log(`  - 9 users (2 admins, 7 users)`)
      console.log(`  - 4 movie lists`)
      console.log(`  - 9 movie list items`)
      console.log(`  - 4 reviews`)
      console.log(`  - 7 review likes`)
      console.log('\n🔑 Login credentials (all users use password: "password123"):')
      console.log('  Admins: admin@videovision.com, goku@videovision.com')
      console.log('  Users:  john.doe@example.com, tonymontana@videovision.com, aldebaran@videovision.com')
      console.log('          shion@videovision.com, cloud@videovision.com')

      return { result: 'Database seeded successfully' }
    } catch (error) {
      console.error('❌ Error seeding database:', error)
      throw error
    }
  },
})
