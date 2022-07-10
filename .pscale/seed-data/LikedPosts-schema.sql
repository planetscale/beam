CREATE TABLE `LikedPosts` (
  `postId` int NOT NULL,
  `userId` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`postId`,`userId`),
  KEY `LikedPosts_postId_idx` (`postId`),
  KEY `LikedPosts_userId_idx` (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
