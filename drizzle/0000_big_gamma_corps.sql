CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer NOT NULL,
	`work_type` text NOT NULL,
	`volume` integer NOT NULL,
	`days` integer NOT NULL,
	`people` integer NOT NULL,
	`estimate_amount` integer NOT NULL,
	`address` text NOT NULL,
	`phone` text NOT NULL,
	`file_name` text,
	`file_key` text,
	`file_size` integer,
	`file_type` text,
	`status` text DEFAULT 'new' NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_leads_created_at` ON `leads` (`created_at`);