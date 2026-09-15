CREATE TABLE `analytics_daily` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`day` text NOT NULL,
	`event` text NOT NULL,
	`dimension` text NOT NULL,
	`language` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	`score_sum` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_analytics_daily_group` ON `analytics_daily` (`day`,`event`,`dimension`,`language`);