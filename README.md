movie-friends
=============

WIP. Plan a movie night with Netflix streaming. Work-in-progress. Learned the Netflix API (enough). Does not do anything yet though.

### Get Started

 * install [nvm](https://github.com/creationix/nvm)
 * install [mongodb](http://www.mongodb.org/)

#### And then

    > nvm use v0.8.11
    > npm install
    > mkdir -p data/db
    > mongod --noauth --rest --dbpath data/db
    
    moviefriends-app is WIP Derby app
    > cd movifriends-app
    > node server.js
    
    netflix-services is WIP Node.js app that downloads Netflix data
    > cd netflix-services
    > node server.js
   
### Notes

http://developer.netflix.com/page/Netflix_API_20_Release_Notes#full_catalog
http://developer.netflix.com/blog

see also https://github.com/Leonidas-from-XIV/node-xml2js for XML to JSON

### TODO

   * Streaming videos don't all seem to have 197px wide covers.
   * Mmmm. Derby.js I can't quite figure out your store.fetch API?