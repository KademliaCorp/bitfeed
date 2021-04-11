
export enum BitFeedType {
	Public = 0,
	Private = 1,
}

export type BitFeedBackground = {
	width: number,				// the width of the image
	height: number,				// the height of the image
	density: number,			// the pixel density it's for
	address: string,			// the ipfs address of the image
}

export type BitFeed = {
	type: BitFeedType,					// public or private
	title: string,						// title of this feed
	description: string,				// description of the feed contents
	address: string,					// the orbitdb feed address
	backgrounds: BitFeedBackground[],	// the backgrounds for this feed
};

export type PrivateBitFeed = BitFeed & { recipient: string };	// private bit feeds require a recipient
