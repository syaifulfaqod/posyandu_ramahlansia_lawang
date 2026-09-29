CREATE TABLE `account` (
	`id` varchar(255) NOT NULL,
	`accountId` varchar(255) NOT NULL,
	`providerId` varchar(255) NOT NULL,
	`userId` varchar(255) NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` datetime,
	`refreshTokenExpiresAt` datetime,
	`scope` text,
	`password` text,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `berita` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`excerpt` text,
	`content` text,
	`image` text,
	`authorId` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `berita_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `galeri` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text NOT NULL,
	`authorId` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `galeri_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jadwal` (
	`id` varchar(36) NOT NULL,
	`desa` varchar(100) NOT NULL,
	`rw` varchar(10) NOT NULL,
	`tgl` date NOT NULL,
	`waktu` time NOT NULL,
	`tempat` varchar(255) NOT NULL,
	`authorId` varchar(255),
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `jadwal_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `lansia` (
	`id` varchar(36) NOT NULL,
	`nik` varchar(16) NOT NULL,
	`nama` varchar(255) NOT NULL,
	`jk` varchar(1) NOT NULL,
	`usia` int,
	`tglLahir` date NOT NULL,
	`alamat` text,
	`kelurahan` varchar(100) NOT NULL,
	`rw` varchar(10) NOT NULL,
	`rt` varchar(10) NOT NULL,
	`lastVisit` date,
	`status` varchar(50) NOT NULL DEFAULT 'Terdaftar',
	`skilas` varchar(50),
	`aks` int,
	`puma` int,
	`golDarah` varchar(3),
	`statusKawin` varchar(50),
	`pekerjaan` varchar(100),
	`keteranganMeninggal` text,
	`isDeleted` boolean NOT NULL DEFAULT false,
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `lansia_id` PRIMARY KEY(`id`),
	CONSTRAINT `lansia_nik_unique` UNIQUE(`nik`)
);
--> statement-breakpoint
CREATE TABLE `master_regions` (
	`id` varchar(36) NOT NULL,
	`kelurahan` varchar(100) NOT NULL,
	`rw` varchar(10) NOT NULL,
	`rt` varchar(10) NOT NULL,
	CONSTRAINT `master_regions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pemeriksaan` (
	`id` varchar(36) NOT NULL,
	`lansiaId` varchar(36) NOT NULL,
	`tglKunjungan` date NOT NULL,
	`bb` decimal(5,2),
	`tb` decimal(5,2),
	`lingkarPerut` decimal(5,2),
	`lingkarLengan` decimal(5,2),
	`tdSistole` int,
	`tdDiastole` int,
	`skilas` varchar(50),
	`aks` int,
	`puma` int,
	`status` varchar(50),
	`catatan` text,
	`gulaDarah` int,
	`kolesterol` int,
	`asamUrat` decimal(5,2),
	`trigliserida` int,
	`hdl` int,
	`ekg` text,
	`mataKanan` varchar(50),
	`mataKiri` varchar(50),
	`telingaKanan` varchar(50),
	`telingaKiri` varchar(50),
	`createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `pemeriksaan_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(255) NOT NULL,
	`expiresAt` datetime NOT NULL,
	`token` varchar(255) NOT NULL,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` varchar(255) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` text NOT NULL,
	`email` varchar(255) NOT NULL,
	`emailVerified` boolean NOT NULL,
	`image` text,
	`createdAt` datetime NOT NULL,
	`updatedAt` datetime NOT NULL,
	`role` varchar(50) NOT NULL DEFAULT 'Kader',
	`kelurahan` varchar(100),
	`rw` varchar(10),
	`isPermanent` boolean DEFAULT false,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(255) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` datetime NOT NULL,
	`createdAt` datetime,
	`updatedAt` datetime,
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `berita` ADD CONSTRAINT `berita_authorId_user_id_fk` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `galeri` ADD CONSTRAINT `galeri_authorId_user_id_fk` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `jadwal` ADD CONSTRAINT `jadwal_authorId_user_id_fk` FOREIGN KEY (`authorId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pemeriksaan` ADD CONSTRAINT `pemeriksaan_lansiaId_lansia_id_fk` FOREIGN KEY (`lansiaId`) REFERENCES `lansia`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_userId_user_id_fk` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;