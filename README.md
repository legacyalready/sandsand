# Expressive

Expressive is a RESTful JSON API using ExpressJS. It's set out in an MVC style and should feel just like a real app.

To keep things simple, there's only one resource, a Thing.

## Setup

To run this project you must have [Node.js](https://nodejs.org/en/download/), [Docker](https://www.docker.com/community-edition) and [Docker Compose](https://docs.docker.com/compose/install/) installed.

To get started, run these three commands:

```
npm install
npm run docker:migrate
npm run docker:test
```

You should see two failing tests. Your job is to get these two tests passing!

Remember, we'd much rather see an incomplete response than nothing at all. Wherever you get to in the time limit, commit and push it.

## Feature One

In order to make sure we've got enough Things on hand for emergencies, there must always be at least 10 in stock. Any operation that reduces the available quantity of any Thing below 10 is illegal under the Expressive business rules. Please ensure that this never happens.

## Feature Two

The naming structure for Things is a little archaic. It's a legacy requirement for other components of the system that names contain metadata in a colon (:) delimited format with the schema `name:danger flag:colour`. eg:

`teddy bears:false:brown`

`dynamite:true:red`

Only authorised administrators are allowed to alter dangerous Things! Please ensure that no regular users can update or create anything dangerous.
