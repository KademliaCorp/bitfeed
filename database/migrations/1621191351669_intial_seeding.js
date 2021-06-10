exports.up = (pgm) => {
	if (process.env.NODE_ENV !== "development") { return; }

	pgm.sql(/* sql */`
		INSERT INTO
			"user" (username, password)
		VALUES 
			-- username: dev
			-- password: 123
			('dev', '$2b$12$DvRjY2mIfBTJZ/PIQDUudeYN0SE.ElQRI8El3WvuDf3RadpEss15e')
	`);
};

exports.down = (pgm) => {
	if (process.env.NODE_ENV !== "development") { return; }

	pgm.sql(/* sql */`DELETE FROM "user" WHERE username = 'dev'`);
};
