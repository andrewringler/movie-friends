movie-friends
=============

WIP. Plan a movie night with Netflix streaming. If you are not me you probably should not be here.

### Get Started

 * install [nvm](https://github.com/creationix/nvm)
 * install [mongodb](http://www.mongodb.org/)

#### And then

    > nvm use v0.8.11
    > npm install
    > mkdir -p data/db
    > mongod --noauth --rest --dbpath data/db
    > node server.js
   
### Notes

http://developer.netflix.com/page/Netflix_API_20_Release_Notes#full_catalog
http://developer.netflix.com/blog

see also https://github.com/Leonidas-from-XIV/node-xml2js for XML to JSON