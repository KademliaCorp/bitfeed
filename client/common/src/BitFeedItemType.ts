
export enum BitFeedItemType {
    Text,                   // plain text, like status updates
    Image,                  // images, like an image gallery
    Video,                  // one or more videos
    Link,                   // link(s) to a page
    ContactInfo,            // changes to contact info, vCard
    File,                   // any kind of file
    Article,                // news or blog post 
    Event,                  // an event, importable to calendar
    Location,               // gps and other location data
    Podcast,                // audio or video podcast
    Recipe,                 // food recipe
    Book,                   // text or audiobook
    Paper,                  // academic paper
    Retail,                 // sales, products, services or any of these mixed
    Album,                  // audio album
    Track,                  // an audio track
    Movie,                  // a movie film, very niicee
    Game,                   // a video game release, steam or epic deep link
    Ticket,                 // a ticket to an event
    Update,                 // an update to the current bitfeed, might be a change in backgrounds or descriptions
}