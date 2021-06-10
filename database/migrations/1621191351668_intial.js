exports.up = (pgm) => {
	pgm.createExtension('uuid-ossp', {
		ifNotExists: true,
	});

	const meta = {
		meta_schema_version: { type: 'smallint', default: 1 },
		meta_created_on: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
		meta_updated_on: {
			type: 'timestamp',
			notNull: true,
			default: pgm.func('current_timestamp'),
		},
	};

	pgm.sql(/* sql */`
		CREATE OR REPLACE FUNCTION update_updated_on()
		RETURNS TRIGGER AS $$
		BEGIN
			NEW.meta_updated_on = now(); 
		RETURN NEW;
		END;
		$$ language 'plpgsql';
	`);

	function addUpdateTrigger(table) {
		pgm.sql(/* sql */`
			CREATE TRIGGER update_updated_on_${table} BEFORE UPDATE
			ON "${table}" FOR EACH ROW EXECUTE PROCEDURE
			update_updated_on();
		`);
		pgm.createIndex(table, 'meta_updated_on');
	}

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
		...meta
	});

	addUpdateTrigger('user');

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
		...meta
	});

	addUpdateTrigger('user_profile');

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
		...meta
	});

	addUpdateTrigger('access_right');

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
		...meta
	});

	addUpdateTrigger('user_access_right');

	pgm.createType('feed_access', [
		'Public', // public, searchable
		'Private', // private, not visible, has acl
	]);

	pgm.createType('feed_paradigm', [
		'Centralized',	// hosted by us
		'Decentralized' // hosted using a decentralized means, e.g. ipfs, blockchain, torrent, etc
	]);

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
		...meta
	});
	addUpdateTrigger('feed');

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
		...meta
	});
	addUpdateTrigger('feed_item');

	pgm.createTable('feed_item_map', {
		feed_item_id: { type: 'uuid' },
		feed_id: { type: 'uuid' }, // the feed it belongs to originally
	});

	pgm.createIndex('feed_item_map', 'feed_item_id');
	pgm.createIndex('feed_item_map', 'feed_id');

	pgm.createType('document_type', [
		'Feed',
		'Feed Item',
	]);

	pgm.createTable('document', {
		document_id: {
			type: 'uuid',
			primaryKey: true,
			unique: true,
			notNull: true,
		},
		type: {
			type: 'document_type',
			notNull: true,
		},
		hash_id: {
			type: 'text',
			unique: true,
			notNull: true,
		},
		content_id: {
			type: 'text',
			unique: true,
			notNull: true,
		},
		data: { type: 'jsonb', notNull: true },

		// meta
		...meta
	});
	addUpdateTrigger('document');

	pgm.createTable('feed_subscription', {
		user_id: {
			type: 'uuid',
			references: '"user"(user_id)',
			onDelete: 'cascade',
		},
		feed_id: {
			type: 'uuid',
			references: 'feed(feed_id)',
			notNull: true,
			onDelete: 'cascade',
		},

		// meta
		...meta
	});
	addUpdateTrigger('feed_subscription');
	pgm.createIndex('feed_subscription', 'user_id');
	pgm.createIndex('feed_subscription', 'feed_id');


	pgm.createTable('user_feed_item_state', {
		user_id: {
			type: 'uuid',
			references: '"user"(user_id)',
			onDelete: 'cascade',
		},
		feed_item_id: {
			type: 'uuid',
			references: 'feed_item(feed_item_id)',
			notNull: true,
			onDelete: 'cascade',
		},
		is_seen: {
			type: 'boolean',
			notNull: true,
			default: false,
		},
		is_hidden: {
			type: 'boolean',
			notNull: true,
			default: false,
		},
		is_purchased: {
			type: 'boolean',
			notNull: true,
			default: false,
		},
		state: { type: 'jsonb' },

		// meta
		...meta
	});
	addUpdateTrigger('user_feed_item_state');
	pgm.createIndex('user_feed_item_state', 'user_id');
	pgm.createIndex('user_feed_item_state', 'feed_item_id');

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
	pgm.dropTable('document', { ifExists: true, cascade: true });
	pgm.dropType('document_type');
	pgm.dropExtension('uuid-ossp');
	pgm.dropTable('user_feed_map', { ifExists: true, cascade: true });
	pgm.dropTable('user_feed_item_state', { ifExists: true, cascade: true });
	pgm.dropFunction('update_updated_on', [], { ifExists: true, cascade: true });
};
