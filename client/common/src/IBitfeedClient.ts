import { BitFeed } from "./BitFeed";
import { BitFeedItem } from "./BitFeedItem";
import { LoginResult } from "./LoginResult";

export enum ItemOrder {
    Normal = 0,
    Reverse = 1,
};

export interface IBitfeedClient {
	logon(provider: string, username: string, password: string): Promise<LoginResult>;
    logoff(): Promise<void>;
    getFeeds(): AsyncIterator<BitFeed>;
    getFeedItems(feed: BitFeed, order: ItemOrder, filter: (item: BitFeedItem) => boolean): AsyncIterator<BitFeedItem>;
}