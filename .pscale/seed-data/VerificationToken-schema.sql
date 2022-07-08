CREATE TABLE `VerificationToken` (
  `identifier` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires` datetime(3) NOT NULL,
  UNIQUE KEY `VerificationToken_token_key` (`token`),
  UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`,`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
