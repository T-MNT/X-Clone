-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : lun. 15 juil. 2024 à 12:41
-- Version du serveur : 8.0.31
-- Version de PHP : 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `x`
--

-- --------------------------------------------------------

--
-- Structure de la table `conversation`
--

DROP TABLE IF EXISTS `conversation`;
CREATE TABLE IF NOT EXISTS `conversation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_8A8E26E956AE248B` (`user1_id`),
  KEY `IDX_8A8E26E9441B8B65` (`user2_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `conversation`
--

INSERT INTO `conversation` (`id`, `user1_id`, `user2_id`, `date`) VALUES
(1, 3, 5, '2024-05-30 16:16:50');

-- --------------------------------------------------------

--
-- Structure de la table `doctrine_migration_versions`
--

DROP TABLE IF EXISTS `doctrine_migration_versions`;
CREATE TABLE IF NOT EXISTS `doctrine_migration_versions` (
  `version` varchar(191) COLLATE utf8mb3_unicode_ci NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int DEFAULT NULL,
  PRIMARY KEY (`version`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Déchargement des données de la table `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20240512143948', '2024-05-12 14:40:01', 620),
('DoctrineMigrations\\Version20240514160722', '2024-05-14 16:07:31', 310),
('DoctrineMigrations\\Version20240514163156', '2024-05-14 16:32:03', 1369),
('DoctrineMigrations\\Version20240514163329', '2024-05-14 16:33:33', 1851),
('DoctrineMigrations\\Version20240514163819', '2024-05-14 16:38:25', 1120),
('DoctrineMigrations\\Version20240516155959', '2024-05-16 16:00:11', 2037),
('DoctrineMigrations\\Version20240516161347', '2024-05-16 16:13:57', 986),
('DoctrineMigrations\\Version20240517140414', '2024-05-17 14:04:25', 2063),
('DoctrineMigrations\\Version20240519142815', '2024-05-19 14:28:23', 383),
('DoctrineMigrations\\Version20240519153800', '2024-05-19 15:38:06', 653),
('DoctrineMigrations\\Version20240520125814', '2024-05-20 12:58:42', 660),
('DoctrineMigrations\\Version20240522123634', '2024-05-22 12:36:43', 934),
('DoctrineMigrations\\Version20240529145314', '2024-05-29 14:53:21', 1792),
('DoctrineMigrations\\Version20240529145636', '2024-05-29 14:56:44', 1509),
('DoctrineMigrations\\Version20240607120604', '2024-06-07 12:06:14', 1847),
('DoctrineMigrations\\Version20240609134626', '2024-06-09 13:46:47', 836);

-- --------------------------------------------------------

--
-- Structure de la table `follow`
--

DROP TABLE IF EXISTS `follow`;
CREATE TABLE IF NOT EXISTS `follow` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL,
  `follower_id` int NOT NULL,
  `followed_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_68344470AC24F853` (`follower_id`),
  KEY `IDX_68344470D956F010` (`followed_id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `follow`
--

INSERT INTO `follow` (`id`, `date`, `follower_id`, `followed_id`) VALUES
(46, '2024-06-08 14:08:07', 8, 7),
(47, '2024-06-08 14:08:11', 8, 5),
(48, '2024-06-08 14:23:09', 7, 5),
(49, '2024-06-08 14:23:43', 7, 8),
(51, '2024-06-08 14:38:59', 3, 6),
(55, '2024-06-08 14:56:38', 3, 7),
(57, '2024-06-08 15:23:11', 3, 5),
(58, '2024-06-08 15:39:43', 5, 7),
(59, '2024-06-08 15:42:39', 5, 3),
(60, '2024-06-08 15:45:21', 5, 6),
(61, '2024-06-10 11:54:33', 3, 8);

-- --------------------------------------------------------

--
-- Structure de la table `like_retweet`
--

DROP TABLE IF EXISTS `like_retweet`;
CREATE TABLE IF NOT EXISTS `like_retweet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int NOT NULL,
  `tweet_id` int NOT NULL,
  `type` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_166B3790F675F31B` (`author_id`),
  KEY `IDX_166B37901041E39B` (`tweet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `like_retweet`
--

INSERT INTO `like_retweet` (`id`, `author_id`, `tweet_id`, `type`, `date`) VALUES
(79, 3, 69, 'like', '2024-05-27 15:32:15'),
(91, 3, 106, 'like', '2024-06-07 15:45:25'),
(93, 3, 69, 'retweet', '2024-06-07 17:31:48'),
(94, 8, 116, 'like', '2024-06-08 16:07:06'),
(95, 8, 116, 'retweet', '2024-06-08 16:07:08'),
(96, 8, 113, 'like', '2024-06-08 16:07:15'),
(97, 7, 123, 'like', '2024-06-08 16:20:57'),
(98, 7, 123, 'retweet', '2024-06-08 16:20:58'),
(99, 7, 121, 'like', '2024-06-08 16:21:02'),
(100, 7, 121, 'retweet', '2024-06-08 16:21:06'),
(102, 5, 115, 'retweet', '2024-06-08 17:31:18'),
(103, 3, 127, 'like', '2024-06-09 15:32:34'),
(105, 3, 135, 'like', '2024-06-09 16:43:53'),
(107, 3, 137, 'like', '2024-06-11 15:45:13'),
(111, 3, 140, 'like', '2024-06-11 16:16:38'),
(115, 3, 141, 'retweet', '2024-06-11 16:33:23'),
(122, 3, 142, 'retweet', '2024-06-11 16:43:53');

-- --------------------------------------------------------

--
-- Structure de la table `message`
--

DROP TABLE IF EXISTS `message`;
CREATE TABLE IF NOT EXISTS `message` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int NOT NULL,
  `conversation_id` int NOT NULL,
  `date` datetime NOT NULL,
  `content` varchar(1200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_url` varchar(1200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_B6BD307FF675F31B` (`author_id`),
  KEY `IDX_B6BD307F9AC0396` (`conversation_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `message`
--

INSERT INTO `message` (`id`, `author_id`, `conversation_id`, `date`, `content`, `media_url`) VALUES
(1, 3, 1, '2024-05-31 14:07:42', 'test', NULL),
(2, 3, 1, '2024-05-31 14:08:14', 'test media', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fgoku_sticker.png?alt=media&token=e4c82e9a-bab6-4da8-9d03-07cc43732fcb'),
(3, 3, 1, '2024-05-31 14:31:27', 'test vod', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2FJJK_trailer2.mp4?alt=media&token=0ae6fcd7-3708-4af7-9b5a-a233921772d9'),
(4, 5, 1, '2024-05-31 14:40:01', 'stylé le trailer', NULL),
(24, 3, 1, '2024-06-07 14:05:51', 'de fou', NULL),
(25, 3, 1, '2024-06-07 14:08:14', 'yes', NULL),
(26, 3, 1, '2024-06-07 14:08:36', 'fff', NULL),
(27, 3, 1, '2024-06-07 14:11:37', 'test', NULL),
(28, 3, 1, '2024-06-07 14:12:12', 'aaaa', NULL),
(29, 3, 1, '2024-06-07 14:18:19', 'test v', NULL),
(30, 5, 1, '2024-06-07 14:19:43', 'ouai ouai', NULL),
(31, 5, 1, '2024-06-07 14:19:50', 'test', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `messenger_messages`
--

DROP TABLE IF EXISTS `messenger_messages`;
CREATE TABLE IF NOT EXISTS `messenger_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `body` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `headers` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue_name` varchar(190) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)',
  PRIMARY KEY (`id`),
  KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  KEY `IDX_75EA56E016BA31DB` (`delivered_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `signet`
--

DROP TABLE IF EXISTS `signet`;
CREATE TABLE IF NOT EXISTS `signet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tweet_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_30CC8A7A76ED395` (`user_id`),
  KEY `IDX_30CC8A71041E39B` (`tweet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `signet`
--

INSERT INTO `signet` (`id`, `user_id`, `tweet_id`) VALUES
(17, 5, 115),
(21, 3, 115),
(23, 3, 120);

-- --------------------------------------------------------

--
-- Structure de la table `tweet`
--

DROP TABLE IF EXISTS `tweet`;
CREATE TABLE IF NOT EXISTS `tweet` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author_id` int NOT NULL,
  `date` datetime NOT NULL,
  `content` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `media_url` varchar(1200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `related_tweet_id` int DEFAULT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hashtags` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_3D660A3BF675F31B` (`author_id`),
  KEY `IDX_3D660A3BB6C2AD36` (`related_tweet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `tweet`
--

INSERT INTO `tweet` (`id`, `author_id`, `date`, `content`, `media_url`, `related_tweet_id`, `type`, `hashtags`) VALUES
(0, 3, '2024-05-29 12:55:40', 'Ce tweet a été supprimé', NULL, NULL, 'placeholder', NULL),
(21, 3, '2024-05-16 14:54:12', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent hendrerit dignissim nulla eget commodo.\nAliquam id lectus quam. Sed pretium consequat laoreet.', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fuser_profil_pic.jpg?alt=media&token=891ed71b-d9ca-4aa5-8e0e-e4b64363f85f', NULL, NULL, NULL),
(22, 3, '2024-05-16 17:03:27', 'test hotaire', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Falbum_cover.jpg?alt=media&token=4c995478-3f47-4841-b30c-9b9b8ed34ef3', NULL, NULL, NULL),
(23, 3, '2024-05-16 17:05:55', '\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent justo quam, lobortis ac est quis, tempor bibendum est. Nulla facilisi. Pellentesque vel tempus turpis. In tincidunt lectus ut accumsan rhoncus.\nPhasellus consectetur eu risus eget eleifend', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fnaruto-gif-6.gif?alt=media&token=3d7c9948-d29c-45ed-9241-6766598601e3', NULL, NULL, NULL),
(26, 3, '2024-05-16 17:21:32', 'fzfezfzef', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2FDS_gif.gif?alt=media&token=bfb7dccc-edfe-4982-afe7-276e548f2906', NULL, NULL, NULL),
(28, 3, '2024-05-16 17:35:25', 'test vod', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2FJJK_trailer.mp4?alt=media&token=76fee7ac-8901-469d-8220-bd9ff5aca48c', NULL, NULL, NULL),
(30, 3, '2024-05-16 18:53:39', 'Salut la team !', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2FNS_gif.gif?alt=media&token=6095fb0c-e14f-42ef-b9eb-d894a6c06582', NULL, NULL, NULL),
(31, 3, '2024-05-17 18:18:41', 'retest', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2FJJS_gif.gif?alt=media&token=95edf708-73f4-456f-8584-8c3cf6d77a4c', NULL, NULL, NULL),
(66, 3, '2024-05-22 17:40:34', 'test ssssss', NULL, 0, 'quote', NULL),
(69, 3, '2024-05-22 18:33:33', 'test', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fnaruto_preview.png?alt=media&token=21309fa7-2061-4f54-ab83-f74652ba7b2a', 66, 'answer', NULL),
(82, 3, '2024-05-26 17:16:00', 'ffff', NULL, 66, 'answer', NULL),
(99, 3, '2024-05-29 15:39:07', 'test delete', NULL, 0, 'quote', NULL),
(103, 3, '2024-05-29 16:00:36', 'C\'est con', NULL, 99, 'answer', NULL),
(105, 3, '2024-05-29 17:40:02', 'nan nan', NULL, 0, 'quote', NULL),
(106, 3, '2024-05-31 16:29:52', 'yy', NULL, NULL, NULL, NULL),
(107, 8, '2024-06-07 15:44:36', 'Just got back from an amazing hike in the mountains 🏞️✨. The view was breathtaking and totally worth the climb! Who else loves exploring the great outdoors? #NatureLover #HikingAdventures 🌲🌄\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fpexels-matthew-montrone-230847-1374295.jpg?alt=media&token=d5fd8647-a05a-4867-bcbb-563fd27297b8', NULL, NULL, NULL),
(108, 8, '2024-06-08 15:48:18', 'Baking some delicious cookies today 🍪👩‍🍳. Tried a new recipe and they turned out perfect! Can\'t wait to share them with friends. Do you have a favorite cookie recipe? #BakingLove #SweetTreats ❤️\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fcookies.JPG?alt=media&token=7d2ffd92-fda7-4d32-8c7c-6ffe923097fa', NULL, NULL, NULL),
(109, 6, '2024-06-07 19:24:55', 'Movie night with friends! 🎬🍿 We\'re watching the latest Marvel\'s Avenger and it\'s epic! What are your go-to movies for a fun night in? #MovieLover #CinemaMagic ⭐🎥', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Favengers.jpg?alt=media&token=492e6c2f-d000-461e-a3c3-d115da190204', NULL, NULL, NULL),
(110, 7, '2024-06-07 14:31:07', 'Gearing up for my next DIY project 🛠️✨. Going to transform an old dresser into something new and stylish. Any tips or ideas? #DIYHome #CraftingFun 🏡🖌️\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fpcb.jpg?alt=media&token=1950de47-8e3d-42a5-bf5d-14352bf19d6a', NULL, NULL, NULL),
(111, 6, '2024-06-01 19:31:17', '1. Read a book 📚\n2. Meditate 🧘‍♀️\n3. Take a walk 🚶‍♂️\n4. Listen to music 🎧\nSimple ways to relax and recharge. What do you do to unwind? #SelfCare #RelaxationTips 🌿💆‍♀️\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fpexels-photo-346529.webp?alt=media&token=b8151e57-841d-4ed2-8009-5fdbda5830f8', NULL, NULL, NULL),
(112, 6, '2024-06-06 18:25:24', 'Trying out a new Japanese restaurant tonight 🍣🍜. The menu looks fantastic and I\'m excited to try some authentic dishes. What\'s your favorite Japanese food? #Foodie #JapaneseCuisine 🍱🍤\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fjapanese-restaurants-la-01.webp?alt=media&token=0dc95d22-d237-4810-b116-3a0e99f5ccc4', NULL, NULL, NULL),
(113, 6, '2024-06-06 11:26:46', 'Celebrating my birthday today! 🎉🎂 Feeling grateful for another year of adventures, growth, and amazing memories. Thank you for all the love and wishes! #BirthdayCelebration #GratefulHeart 💖🎁\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Flasse-i-gatan-45.jpg?alt=media&token=d2e26efa-1a01-46bf-8211-ca3f7a84869b', NULL, NULL, NULL),
(114, 7, '2024-06-03 00:00:00', 'Just witnessed a breakthrough in AI technology today! 🤖✨ The future of machine learning is looking brighter than ever. Can\'t wait to see how this transforms industries. #AITech #Innovation 🚀💡', NULL, NULL, NULL, NULL),
(115, 7, '2024-06-08 16:05:02', 'Attended an incredible tech conference this weekend! 💻🎉 Learned so much about quantum computing and its potential. Exciting times ahead for science and technology! #TechConference #QuantumComputing 🔬🌐\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2FCES-2017-qu-attendre-du-plus-grand-salon-des-technologies.jpg?alt=media&token=6e46f075-e6ec-48a1-9608-b643049e43d9', NULL, NULL, NULL),
(116, 7, '2024-06-01 09:10:57', 'Exploring the latest advancements in renewable energy technology 🌍🔋. Solar and wind power innovations are truly game-changing. Let\'s make the world a greener place! #RenewableEnergy #GreenTech 🌱🌞\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fgreentech-btp-760x490.jpg?alt=media&token=255b38c1-64b1-4280-824c-a32255669cc6', NULL, NULL, NULL),
(117, 8, '2024-06-06 14:06:14', 'Happy Birthday !! 🎉🎂💖', NULL, 113, 'answer', NULL),
(118, 8, '2024-06-03 00:00:00', 'Absolutely agree, Raj! 🌿 The progress in solar and wind energy is remarkable. Have you seen the new developments in battery storage as well? It’s crucial for a sustainable future. #SustainableTech #CleanEnergy 💡🔋\n', NULL, 116, 'answer', NULL),
(120, 8, '2024-06-07 20:32:20', 'Experimenting in the kitchen tonight! 🍳🧑‍🍳 Trying out a new fusion recipe that combines Indian spices with Italian pasta. The aromas are incredible! What\'s your favorite culinary experiment? #Foodie #FusionCuisine 🍝🌶️\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fitalian-pasta-1.jpeg?alt=media&token=984e63e5-22cd-4c21-9079-b93d5debd7ed', NULL, NULL, NULL),
(121, 5, '2024-06-05 16:17:04', 'Excited to announce that SpaceX will be launching its first crewed mission to Mars in 2025! 🚀🌌 The future of space exploration is here. Let\'s make life multi-planetary! #MarsMission #SpaceX\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2FElon-Mars.jpg?alt=media&token=a3dc89e9-4032-484e-b9b8-bc444a1debae', NULL, NULL, NULL),
(122, 5, '2024-06-02 13:27:16', 'Neuralink is making great strides in brain-machine interfaces. 🧠💻 Imagine a future where we can directly communicate with technology using our minds. #Neuralink #FutureTech\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2F001454192_896x598_c.jpg?alt=media&token=2db8b033-3419-4ac6-9f0f-4b9c3d2bba46', NULL, NULL, NULL),
(123, 5, '2024-06-05 13:54:00', 'Tesla\'s new battery technology is a game changer! ⚡🔋 With increased range and faster charging, our cars are leading the way in sustainable transportation. #Tesla #EVRevolution\n', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fsuperchargeur-chambery.webp?alt=media&token=e02029b3-7b67-4870-9629-4ce55e1b6539', NULL, NULL, NULL),
(124, 7, '2024-06-05 00:00:00', 'Incredible news, Elon! 🚀 The possibilities for human exploration and colonization are endless. Looking forward to seeing humanity take its first steps on Mars. #SpaceExploration #MarsMission 🌌🪐\n', NULL, 121, 'answer', NULL),
(125, 7, '2024-06-08 16:22:07', 'Fantastic innovation, Elon! ⚡ Tesla\'s advancements in battery tech are paving the way for a sustainable future. Can\'t wait to see these new batteries in action. #EVRevolution #GreenTech 🔋🚗\n', NULL, 123, 'answer', NULL),
(126, 7, '2024-06-04 00:00:00', 'Incredible progress, Elon! 🧠💻 While the potential of Neuralink is fascinating, it\'s crucial to address ethical concerns and ensure this technology is safe and beneficial for all. Looking forward to seeing responsible advancements in this field. #Neuralink', NULL, 122, 'answer', NULL),
(127, 3, '2024-06-08 16:39:56', 'Best movie ! 🎬🍿 ', NULL, 109, 'answer', NULL),
(135, 3, '2024-06-09 16:24:11', 'test #test', NULL, NULL, NULL, '#test'),
(136, 3, '2024-06-09 16:48:52', 'retest #test', NULL, NULL, 'post', '#test'),
(137, 3, '2024-06-09 17:01:13', 'egerge #test #lol', NULL, NULL, 'post', '#test,#lol'),
(140, 3, '2024-06-11 16:12:57', 'yes', NULL, 137, 'answer', ''),
(141, 3, '2024-06-11 16:27:08', 'grgrggr', NULL, NULL, NULL, ''),
(142, 3, '2024-06-11 16:33:48', 'fefefe', NULL, 141, 'answer', ''),
(143, 3, '2024-06-11 16:54:46', 'lol', NULL, 142, 'quote', ''),
(144, 3, '2024-06-11 16:56:30', 'dazazd', NULL, 142, 'quote', ''),
(145, 3, '2024-06-11 16:56:39', 'dd', NULL, 144, 'answer', '');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fullname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `birthdate` datetime NOT NULL,
  `pseudo` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(65) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profil_pic` varchar(1200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cover_pic` varchar(1200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `website` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `register_date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `fullname`, `birthdate`, `pseudo`, `username`, `profil_pic`, `cover_pic`, `bio`, `website`, `location`, `register_date`) VALUES
(3, 'minettheo06@gmail.com', '[\"ROLE_USER\"]', '$2y$13$5O.zIG99Rn.wxMzZD.MH4O8VhylkfG7yLYCPnr4ApZdcwAf8sjDc6', 'Théo Minet', '1998-06-06 16:09:31', 'Urizen', '@Theo_mnt', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fnaruto_sticker.png?alt=media&token=16ee61a8-3f4a-4943-90aa-6b8ccdb3d43b', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fsasuke_bg.jpg?alt=media&token=d2478600-7011-466a-a560-d8fb8d7c2482', 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime nobis, consectetur natus amet error nesciunt quidem odio impedit. Magni fugiat in, quos ipsa est optio odit vitae quia tempore cumque rerum, fuga quisquam? Ab accusamus temporibus adipisci, ', 'www.x.com', 'Wismes', '0000-00-00 00:00:00'),
(5, 'e.musk@gmail.com', '[\"ROLE_USER\"]', '$2y$13$GWjAKrGX0Y/14U91K58FK.SZTPyx4l0VDNZ.0XW98ZF0Ylwz9L8XS', 'Elon Musk', '1979-06-14 12:58:39', 'Emusk', '@e_musk', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2F-1x-1.jpg?alt=media&token=7fb4a514-f2c7-48ed-8c5b-ab64c16060c7', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2F620293-espace-spacex-envoie-143-satellites-en-orbite-grace-a-une-seule-fusee.jpg?alt=media&token=5adfdabd-ae90-4b84-aa36-87620ca063f6', NULL, NULL, NULL, '2024-05-22 12:58:39'),
(6, 'emily.johnson@example.com', '[\"ROLE_USER\"]', '$2y$13$8/9.y44B3v06fOYne1R2pulaTXc.ElQwhZMfEKAWlxURYp.DV4PDS', 'Johnson Emily', '1985-03-15 13:15:59', 'Stargazer', '@Em_johnson', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fem_johnson.jpg?alt=media&token=f5ee486f-8e0d-403e-83b6-d16bd5bfc4f1', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fnight-sky-stars-background-starry-a-colorful-outer-space-with-star-field-texture_9906094.jpg!sw800?alt=media&token=c19437a5-f58b-42ed-9ee1-975e768478fb', 'Passionate traveler ✈️, foodie 🍔, and tech enthusiast 💻. Love exploring new cultures 🌍, trying exotic foods 🍣, and diving into the latest tech trends 🚀. Always on the lookout for new adventures', NULL, NULL, '2024-06-08 13:15:59'),
(7, 'p.raj@example.com', '[\"ROLE_USER\"]', '$2y$13$3Kuho6Fv6xLKFFAai/lPJemDttJZRErghDYUfzdaDcoKsy8H1IyV6', 'Patel Raj', '1995-07-15 13:23:29', 'Ratel95', '@PRAJ', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Frick_sanchez__rick_and_morty__render_by_ty50ntheskeleton_df8ftht-fullview.png?alt=media&token=f77100d2-dd00-4d27-84d0-413c6f0b5df3', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fjjk-bg.jpg?alt=media&token=ea81e8c7-a866-447c-9308-ec31c25103b8', 'Innovateur technologique 💡, passionné de science 🔬, et explorateur curieux 🌍. Toujours en quête de la prochaine grande découverte 🚀. Amoureux des gadgets high-tech 📱', NULL, 'Paris', '2024-06-08 13:23:29'),
(8, 'c.denoit@example.com', '[\"ROLE_USER\"]', '$2y$13$S1nn5qMhZeOOJ8EEq546Qey6Zaxa9FiwiHA21Wf7IwBm3P7Qpuluu', 'Denoit Claire', '2000-10-29 13:34:45', 'Clia', '@C_DNT', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Ff67e76732ea9defe152fa49b1ee63e38.jpg?alt=media&token=7efe6a6b-3ed6-4125-a721-7da240ac7289', 'https://firebasestorage.googleapis.com/v0/b/xv2024-2a994.appspot.com/o/uploads%2Fnight-sky-stars-background-starry-a-colorful-outer-space-with-star-field-texture_9906094.jpg!sw800?alt=media&token=6e0e2250-37ef-4d42-9125-45cc7e2ca07f', 'Manga lover 📚, Japan enthusiast 🇯🇵, and anime binge-watcher 🎥', NULL, 'Senzen', '2024-06-08 13:34:45');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `FK_8A8E26E9441B8B65` FOREIGN KEY (`user2_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_8A8E26E956AE248B` FOREIGN KEY (`user1_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `follow`
--
ALTER TABLE `follow`
  ADD CONSTRAINT `FK_68344470AC24F853` FOREIGN KEY (`follower_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_68344470D956F010` FOREIGN KEY (`followed_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `like_retweet`
--
ALTER TABLE `like_retweet`
  ADD CONSTRAINT `FK_166B37901041E39B` FOREIGN KEY (`tweet_id`) REFERENCES `tweet` (`id`),
  ADD CONSTRAINT `FK_166B3790F675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `FK_B6BD307F9AC0396` FOREIGN KEY (`conversation_id`) REFERENCES `conversation` (`id`),
  ADD CONSTRAINT `FK_B6BD307FF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `signet`
--
ALTER TABLE `signet`
  ADD CONSTRAINT `FK_30CC8A71041E39B` FOREIGN KEY (`tweet_id`) REFERENCES `tweet` (`id`),
  ADD CONSTRAINT `FK_30CC8A7A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Contraintes pour la table `tweet`
--
ALTER TABLE `tweet`
  ADD CONSTRAINT `FK_3D660A3BB6C2AD36` FOREIGN KEY (`related_tweet_id`) REFERENCES `tweet` (`id`),
  ADD CONSTRAINT `FK_3D660A3BF675F31B` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
