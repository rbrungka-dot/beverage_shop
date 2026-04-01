CREATE TABLE `stories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`authorName` varchar(200) NOT NULL,
	`authorTitle` varchar(200),
	`content` text NOT NULL,
	`imageUrl` varchar(500),
	`isApproved` boolean NOT NULL DEFAULT false,
	`isFeatured` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `stories_id` PRIMARY KEY(`id`)
);
