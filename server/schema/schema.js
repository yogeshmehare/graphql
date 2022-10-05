const { query } = require("express");
const graphql = require("graphql");
const lodash = require('lodash')

const { GraphQLObjectType, GraphQLString,GraphQLSchema } = graphql;

var people = [
    {id:"1", firstName: "fn1", lastName: "ln1", age : 30},
    {id:"2", firstName: "fn2", lastName: "ln2", age : 40},
    {id:"3", firstName: "fn3", lastName: "ln3", age : 50},
]

var books = [
    {name:"Book1",genre:"Story",id:"1",author:"author1"},
    {name:"Book2",genre:"Fantasy",id:"2",author:"author2"},
    {name:"Book3",genre:"Sci Fi",id:"3",author:"author3"},
]

var authors = [
    {name:"author1",bookName:"book1",id:"1", personId:"1"},
    {name:"author2",bookName:"book2",id:"2", personId:"2"},
    {name:"author3",bookName:"book3",id:"3", personId:"3"},
]



const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: { type: AuthorType ,
        resolve(parent, args){
            console.log(parent.author);
            return lodash.find(authors,{name:parent.author})
        }
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    id: { type: GraphQLString },
    bookName: { type: GraphQLString },
    name:{type:GraphQLString},
    personId:{type:GraphQLString},
    info: {type:PersonType,
        resolve(parent, args){
            return lodash.find(people, {id:parent.personId})
        }
    }
  }),
});

var PersonType = new GraphQLObjectType({
    name: "Person",
    fields: () => ({
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
      name: {
        type: GraphQLString,
        resolve(obj) {
          return obj.firstName + " " + obj.lastName;
        },
      },
      age: { type: graphql.GraphQLInt },
    }),
  });

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args){
        return lodash.find(books,{id:args.id})
      }
    },
    author : {
      type: AuthorType,
      args: { id: { type: GraphQLString } },
      resolve(parent, args){
        return lodash.find(authors,{id:args.id})
      }
    },
  },
});


module.exports = new GraphQLSchema({
    query:RootQuery
})