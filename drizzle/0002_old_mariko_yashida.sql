CREATE TABLE `inquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`company` varchar(200),
	`email` varchar(200) NOT NULL,
	`phone` varchar(50),
	`productType` varchar(200),
	`moq` varchar(100),
	`message` text NOT NULL,
	`status` varchar(50) NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inquiries_id` PRIMARY KEY(`id`)
);
