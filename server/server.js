import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core/dist/plugin/drainHttpServer'
import http from 'http'
import { typeDefs, resolvers } from './src/schema'


const startApolloServer = async (typeDefs,resolvers) => {
    const app = express()

    const httpServer = http.createServer(app)

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
    })

    await server.start()
    server.applyMiddleware({app})

    await new Promise(
        resolve => httpServer.listen({port:4000}, resolve)
    )

    console.log(`server running at port 4000 ${server.graphqlPath}`)
}

startApolloServer(typeDefs,resolvers);