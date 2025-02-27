-- phpMyAdmin SQL Dump
-- version 4.9.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 27, 2025 at 03:21 PM
-- Server version: 8.0.17
-- PHP Version: 7.3.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `studentId` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `branch` varchar(255) NOT NULL,
  `faculty` varchar(255) NOT NULL,
  `university` varchar(255) NOT NULL,
  `gpa` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `filename` varchar(255) NOT NULL,
  `filepath` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `studentId`, `branch`, `faculty`, `university`, `gpa`, `username`, `email`, `password`, `filename`, `filepath`, `createdAt`) VALUES
(1, 'รัศมี อัยวรรณ์', '', '', '', '', '', 'admin', '673170010204@rmu.ac.th', '1234', '', '', '2025-02-27 07:15:49'),
(2, '', '', '', '', '', '', 'admin01@gmail.com', '', '1234', '', '', '2025-02-27 13:14:34'),
(3, '', '', '', '', '', '', 'admin02@gmail.com', '', '1234', '', '', '2025-02-27 13:16:05'),
(6, '', '', '', '', '', '', 'admin03@gmail.com', '', '1234', '', '', '2025-02-27 13:49:18'),
(10, '5', '5', '5', '5', '5', '5', 'admin05@gmail.com', 'admin05@gmail.com', '$2b$10$r7YTg0R1nKJtJvNznFH3wOJuHnvdXp1mia20hqcYl9toLdxt4SnKK', '', '', '2025-02-27 14:00:02'),
(11, 'รัศมี อัยวรรณ์', '673170010204', 'เทคโนโลยีสารสนเทศ', 'เทคโนโลยีสารสนเทศ', 'มหาวิทยาลัยราชภัฏมหาสารคาม', '3.96', 'admin06@gmail.com', 'admin06@gmail.com', '$2b$10$PUVyL0cPBLIdA7E8dMD4yemVW2iJUalkj2n.PYqO8bWWlA57612da', '', '', '2025-02-27 14:44:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
