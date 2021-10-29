import { gql } from 'apollo-server-express'
import {filter, find, remove} from 'lodash'
const people = [
    {
      id: '1',
      firstName: 'Bill',
      lastName: 'Gates'
    },
    {
      id: '2',
      firstName: 'Steve',
      lastName: 'Jobs'
    },
    {
      id: '3',
      firstName: 'Linux',
      lastName: 'Torvalds'
    }
  ]
  
  const cars = [
    {
      id: '1',
      year: '2019',
      make: 'Toyota',
      model: 'Corolla',
      price: '40000',
      personId: '1'
    },
    {
      id: '2',
      year: '2018',
      make: 'Lexus',
      model: 'LX 600',
      price: '13000',
      personId: '1'
    },
    {
      id: '3',
      year: '2017',
      make: 'Honda',
      model: 'Civic',
      price: '20000',
      personId: '1'
    },
    {
      id: '4',
      year: '2019',
      make: 'Acura ',
      model: 'MDX',
      price: '60000',
      personId: '2'
    },
    {
      id: '5',
      year: '2018',
      make: 'Ford',
      model: 'Focus',
      price: '35000',
      personId: '2'
    },
    {
      id: '6',
      year: '2017',
      make: 'Honda',
      model: 'Pilot',
      price: '45000',
      personId: '2'
    },
    {
      id: '7',
      year: '2019',
      make: 'Volkswagen',
      model: 'Golf',
      price: '40000',
      personId: '3'
    },
    {
      id: '8',
      year: '2018',
      make: 'Kia',
      model: 'Sorento',
      price: '45000',
      personId: '3'
    },
    {
      id: '9',
      year: '2017',
      make: 'Volvo',
      model: 'XC40',
      price: '55000',
      personId: '3'
    }
  ]


  const typeDefs = gql`
    type People {
        id: String!
        firstName: String
        lastName: String
    }

    type Car {
        id: String!
        year: String
        make: String
        model: String
        price: String
        personId: String
    }

  
    type PersonCar{
        id: String!
        year: String
        make: String
        model: String
        price: String
        personId: String
    }

    type Person {
      id: String!
      firstName: String
      lastName: String
      carPerson:[Car]
    }

    type Query {
        peoples: [People]!
        people(id: String!): People
        car: [Car]!
        carsPerOwner(personId: String!):[Car]!
        person(id:String!) : Person
    }

    type Mutation {
        addPeople(id:String!, firstName:String!, lastName:String!): People
        addCar(id:String!, year:String!, make:String!, model:String!, price:String!, personId:String!):Car

        updatePeople(id:String!, firstName:String!, lastName:String!): People
        updateCar(id:String!, year:String, make:String, model:String, price:String, personId:String): Car

        removePeople(id:String!):People
        removeCar(id:String!):Car
    }
  `

const resolvers = {
    Query: {
        peoples: () => people,
        people: (parent, args, context, info) => {
            return find(people,{id:args.id})
        },
      

        car: () => cars,
        carsPerOwner: (parent, args, context, info) => {
            return cars.filter(element => element.personId === args.personId)
        },

        person : (parent, args, context, info) => {
            return find(people,{id:args.id})
        }
    },

    Person : {
      carPerson : (person) => {
        return cars.filter(el => el.personId === person.id)
      }
    },


    Mutation: {
        addPeople: (root, args) => {
            const newPeople = {
                id: args.id,
                firstName: args.firstName,
                lastName: args.lastName
            }

            people.push(newPeople)
            return newPeople
        },
        addCar: (root,args) => {
            const newCar = {
                id: args.id,
                year: args.year,
                make: args.make,
                model: args.model,
                price: args.price,
                personId: args.personId
            }

            cars.push(newCar)
            return newCar
        },

        updatePeople: (root,args) => {
            const updatePeople = find(people, {id:args.id})
            if(!updatePeople){
                throw new Error("Person do not exist!")
            }

            updatePeople.firstName = args.firstName
            updatePeople.lastName = args.lastName
            return updatePeople
        },

        updateCar: (root, args) => {
            const carFound = find(cars, {id:args.id})
            if(!carFound){
              throw new Error("Car does not exist!")
            }

            carFound.year = args.year,
            carFound.make = args.make,
            carFound.model = args.model,
            carFound.price = args.price,
            carFound.personId = args.personId

            return carFound
        },

        removePeople: (root,args) => {
            const removePerson = find(people, {id:args.id})
            if(!removePerson){
                throw new Error("Person does not exist")
            }

            remove(people, p => {
                return p.id === removePerson.id;
            })

            return removePerson
        },

        removeCar: (root,args) => {
          const removeCar = find(cars, {id:args.id})
          if(!removeCar){
              throw new Error("car does not exist")
          }

          remove(cars, c => {
              return c.id === removeCar.id;
          })
          return removeCar
      }

    }
}


  export { typeDefs,resolvers } 