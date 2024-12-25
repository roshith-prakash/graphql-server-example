import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { PrismaClient } from '@prisma/client';
import gql from 'graphql-tag';

// Initialize Prisma Client
const prisma = new PrismaClient();

// Define GraphQL Schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User!
    deleteUser(id: ID!): User
  }
`;

// Define Resolvers
const resolvers = {
    Query: {
        users: async () => await prisma.user.findMany(),
        user: async (_, { id }) => await prisma.user.findUnique({ where: { id } }),
    },
    Mutation: {
        createUser: async (_, { name, email }) => {
            return await prisma.user.create({
                data: { name, email },
            });
        },
        deleteUser: async (_, { id }) => {
            return await prisma.user.delete({
                where: { id },
            });
        },
    },
};

// Initialize Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Start the server
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});

console.log(`Server running at ${url}`);
