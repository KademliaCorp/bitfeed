exports.up = (pgm) => {
	pgm.createExtension('uuid-ossp', {
		ifNotExists: true,
	});

	// users
	pgm.createTable('user', {
		user_id: {
			type: 'uuid',
			primaryKey: true,
			unique: true,
			default: pgm.func('uuid_generate_v4()'),
		},
		username: {
			type: 'text',
			unique: true,
		},
		password: { type: 'text' },
		enabled: {
			type: 'boolean',
			notNull: true,
			default: true,
		},

		// meta
		meta_schema_version: { type: 'smallint', default: 1 },
		meta_created_on: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
	});

	// user profile
	pgm.createTable('user_profile', {
		profile_id: {
			type: 'uuid',
			primaryKey: true,
			unique: true,
			default: pgm.func('uuid_generate_v4()'),
		},
		user_id: {
			type: 'uuid',
			unique: true,
			references: '"user"(user_id)',
			onDelete: 'cascade',
		},
		first_name: { type: 'text' },
		last_name: { type: 'text' },

		// meta
		meta_schema_version: { type: 'smallint', default: 1 },
		meta_created_on: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
	});

	// access rights
	pgm.createTable('access_right', {
		access_right_id: {
			type: 'uuid',
			primaryKey: true,
			unique: true,
			default: pgm.func('uuid_generate_v4()'),
		},
		name: { type: 'text', notNull: true },
		description: { type: 'text' },

		// meta
		meta_schema_version: { type: 'smallint', default: 1 },
		meta_created_on: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
	});

	// user access mapping
	pgm.createTable('user_access_right', {
		access_right_id: {
			type: 'uuid',
			default: pgm.func('uuid_generate_v4()'),
			references: 'access_right(access_right_id)',
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
		user_id: {
			type: 'uuid',
			references: '"user"(user_id)',
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},

		// meta
		meta_schema_version: { type: 'smallint', default: 1 },
		meta_created_on: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
	});

	pgm.createType('feed_access', [
		'public', // public, searchable
		'private', // private, not visible, has acl
	]);

	pgm.createType('feed_paradigm', ['centralized', 'decentralized']);

	// bitfeeds
	pgm.createTable('feed', {
		feed_id: {
			type: 'uuid',
			primaryKey: true,
			unique: true,
			default: pgm.func('uuid_generate_v4()'),
		},
		access: { type: 'feed_access', notNull: true },
		paradigm: { type: 'feed_paradigm', notNull: true },
		title: { type: 'text' },
		description: { type: 'text' },
		image: { type: 'jsonb' }, // the image to show for a preview
		preview: { type: 'jsonb' }, // possibly animated image on mouse over or focus
		creator_id: {
			type: 'uuid',
			references: '"user"(user_id)',
			onUpdate: 'cascade',
			onDelete: 'set null',
		},

		// meta
		meta_schema_version: { type: 'smallint', default: 1 },
		meta_created_on: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
	});

	// acl for private feeds
	pgm.createTable('feed_acl_map', {
		feed_id: {
			type: 'uuid',
			references: 'feed(feed_id)',
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
		user_id: {
			type: 'uuid',
			references: '"user"(user_id)',
			onUpdate: 'cascade',
			onDelete: 'cascade',
		},
	});

	pgm.createIndex('feed_acl_map', 'feed_id');
	pgm.createIndex('feed_acl_map', 'user_id');

	pgm.createType('feed_item_type', [
		'Text', // plain text, like status updates
		'Image', // images, like an image gallery
		'Video', // one or more videos
		'Link', // link(s) to a page
		'ContactInfo', // changes to contact info, vCard
		'File', // any kind of file
		'Article', // news or blog post
		'Event', // an event, importable to calendar
		'Location', // gps and other location data
		'Podcast', // audio or video podcast
		'Recipe', // food recipe
		'Book', // text or audiobook
		'Paper', // academic paper
		'Retail', // sales, products, services or any of these mixed
		'Album', // audio album
		'Track', // an audio track
		'Movie', // a movie film, very niicee
		'Game', // a video game release, steam or epic deep link
		'Ticket', // a ticket to an event
		'Update', // an update to the current bitfeed, might be a change in backgrounds or descriptions
	]);

	// feed items
	pgm.createTable('feed_item', {
		feed_item_id: {
			type: 'uuid',
			primaryKey: true,
			unique: true,
			default: pgm.func('uuid_generate_v4()'),
		},
		original_feed_id: { type: 'uuid' }, // the feed it belongs to originally
		title: { type: 'text' },
		description: { type: 'text' },
		type: { type: 'feed_item_type' },
		data: { type: 'jsonb' },
		image: { type: 'jsonb' }, // the image to show for a preview
		preview: { type: 'jsonb' }, // possibly animated image on mouse over or focus

		// meta
		meta_schema_version: { type: 'smallint', default: 1 },
		meta_created_on: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
	});

	pgm.createTable('feed_item_map', {
		feed_item_id: { type: 'uuid' },
		feed_id: { type: 'uuid' }, // the feed it belongs to originally
	});

	pgm.createIndex('feed_item_map', 'feed_item_id');
	pgm.createIndex('feed_item_map', 'feed_id');

	console.log(process.env.NODE_ENV);
	if (process.env.NODE_ENV === "development") {
		pgm.sql(/* sql */`
			INSERT INTO
				"user" (username, password)
			VALUES 
				-- username: dev
				-- password: 123
				('dev', '$2b$12$DvRjY2mIfBTJZ/PIQDUudeYN0SE.ElQRI8El3WvuDf3RadpEss15e')
		`);
	}
};

exports.down = (pgm) => {
	pgm.dropTable('user', { ifExists: true, cascade: true });
	pgm.dropTable('user_profile', { ifExists: true, cascade: true });
	pgm.dropTable('access_right', { ifExists: true, cascade: true });
	pgm.dropTable('user_access_right', { ifExists: true, cascade: true });
	pgm.dropTable('feed', { ifExists: true, cascade: true });
	pgm.dropTable('feed_acl_map', { ifExists: true, cascade: true });
	pgm.dropType('feed_paradigm');
	pgm.dropType('feed_access');
	pgm.dropTable('feed_item', { ifExists: true, cascade: true });
	pgm.dropTable('feed_item_map', { ifExists: true, cascade: true });
	pgm.dropType('feed_item_type');
	pgm.dropExtension('uuid-ossp');
};
