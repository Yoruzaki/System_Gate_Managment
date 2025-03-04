-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 04, 2025 at 07:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gate_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `entries`
--

CREATE TABLE `entries` (
  `id` int(11) NOT NULL,
  `carPlate` varchar(20) NOT NULL,
  `entry_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `entry_logs`
--

CREATE TABLE `entry_logs` (
  `id` int(11) NOT NULL,
  `carPlate` varchar(20) NOT NULL,
  `status` enum('Inside','Outside') NOT NULL,
  `entry_time` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `entry_logs`
--

INSERT INTO `entry_logs` (`id`, `carPlate`, `status`, `entry_time`) VALUES
(1, 'SDAS', 'Inside', '2025-03-04 01:13:07'),
(14, '0093110307', 'Inside', '2025-03-04 02:27:36'),
(15, '0093110307', 'Inside', '2025-03-04 02:27:41'),
(16, '0093110307', 'Inside', '2025-03-04 02:27:42'),
(17, '0093110307', 'Inside', '2025-03-04 02:27:45'),
(19, '0093110307', 'Inside', '2025-03-04 03:07:22'),
(20, '0093110307', 'Inside', '2025-03-04 03:07:24'),
(21, '3025410416', 'Inside', '2025-03-04 05:54:02'),
(22, '3025410416', 'Inside', '2025-03-04 05:54:06'),
(23, '3025410416', 'Inside', '2025-03-04 05:54:09'),
(24, '3025410416', 'Inside', '2025-03-04 05:54:13'),
(25, '3025410416', 'Inside', '2025-03-04 06:00:36'),
(26, '3025410416', 'Inside', '2025-03-04 06:00:42'),
(27, '3025410416', 'Inside', '2025-03-04 06:00:53'),
(28, '3025410416', 'Inside', '2025-03-04 06:00:59'),
(29, '3025410416', 'Inside', '2025-03-04 06:01:06'),
(30, '3025410416', 'Inside', '2025-03-04 06:02:36'),
(31, '3025410416', 'Inside', '2025-03-04 06:02:43'),
(32, '3025410416', 'Inside', '2025-03-04 06:02:49'),
(33, '3025410416', 'Inside', '2025-03-04 06:02:55');

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `mobile` varchar(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `carName` varchar(100) DEFAULT NULL,
  `carPlate` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `name`, `photo`, `mobile`, `address`, `carName`, `carPlate`) VALUES
(32, 'asda', '\"C:\\Users\\ZAKIA\\Pictures\\Screenshot 2025-01-14 231712.png\"', 'dasda', 'sda', 'sda', 'sdas'),
(33, 'Zakaria', 'zaz', '0656170916', 'Khenchela', 'Kia ', 'ABC1234'),
(34, 'Zakaria', 'zaz', '0656170916', 'Khenchela', 'Kia ', '0093110307'),
(35, 'Zakaria', 'zaz', '0656170916', 'Khenchela', 'Kia ', '3025410416');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('Admin','Agent') NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `role`, `password`) VALUES
(6, 'Zaki', 'Agent', '19021970'),
(7, 'Zaki', 'Agent', '19021970'),
(8, 'Zaki', 'Agent', '19021970'),
(9, 'Zaki', 'Agent', '19021970');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `entries`
--
ALTER TABLE `entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `carPlate` (`carPlate`);

--
-- Indexes for table `entry_logs`
--
ALTER TABLE `entry_logs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `carPlate` (`carPlate`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `entries`
--
ALTER TABLE `entries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `entry_logs`
--
ALTER TABLE `entry_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `entries`
--
ALTER TABLE `entries`
  ADD CONSTRAINT `entries_ibfk_1` FOREIGN KEY (`carPlate`) REFERENCES `members` (`carPlate`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
