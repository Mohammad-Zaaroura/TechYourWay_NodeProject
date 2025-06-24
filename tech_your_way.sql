-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 24, 2025 at 11:32 PM
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
-- Database: `tech_your_way`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1 CHECK (`quantity` > 0),
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(7, 'Cases'),
(8, 'Coolers'),
(11, 'Graphics Card (GPU)'),
(2, 'Graphics Cards'),
(10, 'Monitors'),
(3, 'Motherboards'),
(9, 'Peripherals'),
(6, 'Power Supplies'),
(1, 'Processors'),
(12, 'Processors (CPU)'),
(4, 'RAM'),
(5, 'Storage');

-- --------------------------------------------------------

--
-- Table structure for table `chatbot`
--

CREATE TABLE `chatbot` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `answer` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `feedback`
--

CREATE TABLE `feedback` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `UserName` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Subject` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `feedback`
--

INSERT INTO `feedback` (`id`, `user_id`, `product_id`, `content`, `rating`, `created_at`, `UserName`, `Email`, `Subject`) VALUES
(8, 9, NULL, 'Name: mohammad Zaaroura\nEmail: M7mdxza123@gmail.com\nSubject: about the product\n\ni like the products', NULL, '2025-06-23 00:08:47', '', '', ''),
(9, 9, NULL, 'Name: Amir Fahmawi\nEmail: Fahmawi@gmail.com\nSubject: About your nice products\n\ni really like the products', NULL, '2025-06-23 20:10:31', '', '', ''),
(10, 9, NULL, 'tung tung tung sahur', NULL, '2025-06-23 22:14:06', '', '', ''),
(11, 9, NULL, 'ssssss', NULL, '2025-06-23 22:18:07', 'Name: nameee n', 'Email: test@gmail.com\n', 'Subject: subject\n\n'),
(12, 9, NULL, 'i like those products :D', NULL, '2025-06-23 22:38:07', 'mohammad', 'm7mdxza123@gmail.com', 'about the really good products'),
(13, 9, NULL, 'i sing only hehe', NULL, '2025-06-24 16:14:58', 'maikel', 'jackson@gmail.com', 'hehe'),
(14, 9, NULL, 'suiiiiiiii', NULL, '2025-06-24 16:49:14', 'cristiano', 'ronaldo@gmail.com', 'about testing'),
(15, 9, NULL, 'niceeeeee', NULL, '2025-06-24 17:17:22', 'The Tester', 'tester@gmail.com', 'just testing'),
(16, 9, NULL, 'subjectoooo is subject', NULL, '2025-06-24 17:42:39', 'testing', 'testor@gmail.com', 'subjectoooo'),
(17, 9, NULL, 'the test is good', NULL, '2025-06-24 18:01:17', 'Amir Fahmawi', 'Fahmawi@gmail.com', 'im testing');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) NOT NULL,
  `status` varchar(30) DEFAULT 'Pending',
  `shipping_address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1 CHECK (`quantity` > 0),
  `unit_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL CHECK (`price` >= 0),
  `units_in_stock` int(11) DEFAULT 0 CHECK (`units_in_stock` >= 0),
  `supplier_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Tag` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `units_in_stock`, `supplier_id`, `category_id`, `image`, `created_at`, `updated_at`, `Tag`) VALUES
(14, 'Intel Core i9-13900K', 'High performance CPU for gaming and productivity.', 1599.99, 80, 1, 12, 'intel_i9.jpg', '2025-06-21 18:57:13', '2025-06-24 19:19:18', 'Processors (CPU)'),
(15, 'AMD Ryzen 9 7900X', 'Powerful 12-core processor from AMD.', 1449.99, 75, 2, 12, 'ryzen_9.jpg', '2025-06-21 18:57:13', '2025-06-24 21:10:20', 'Processors (CPU)'),
(16, 'NVIDIA RTX 4080', 'High-end graphics card for gaming and AI.', 2699.99, 30, 3, 2, 'rtx_4080.jpg', '2025-06-21 18:57:13', '2025-06-22 17:56:24', 'Graphics Card (GPU)'),
(17, 'Corsair Vengeance 32GB DDR5', 'High-speed RAM kit for enthusiasts.', 379.99, 100, 4, 4, 'corsair_ddr5.jpg', '2025-06-21 18:57:13', '2025-06-22 17:56:29', 'Memory (RAM)'),
(18, 'Samsung 980 PRO 1TB NVMe SSD', 'Fast SSD storage for high performance needs.', 329.99, 70, 5, 5, 'samsung_980pro.jpg', '2025-06-21 18:57:13', '2025-06-22 17:56:33', 'Storage (SSD/HDD)'),
(19, 'Corsair RM850x Power Supply', '850W PSU with full modular support.', 439.99, 60, 4, 6, 'corsair_psu.jpg', '2025-06-21 18:57:13', '2025-06-22 17:56:38', 'Power Supplies'),
(20, 'Cooler Master MasterBox MB511', 'Gaming case with RGB and tempered glass.', 289.99, 45, 6, 7, 'coolermaster_case.jpg', '2025-06-21 18:57:13', '2025-06-22 17:56:42', 'PC Cases'),
(21, 'Noctua NH-D15 Cooler', 'Top-tier air cooler with quiet performance.', 99.99, 35, 6, 8, 'noctua_nhd15.jpg', '2025-06-21 18:57:13', '2025-06-21 21:59:27', 'Cooling'),
(22, 'Logitech MX Master 3 Mouse', 'High-end productivity mouse.', 249.99, 80, 7, 9, 'logitech_mx3.jpg', '2025-06-21 18:57:13', '2025-06-22 17:57:10', 'Accessories'),
(23, 'Dell 27\" 4K Monitor', 'Crisp and sharp monitor for work and play.', 949.99, 25, 5, 10, 'dell_4k.jpg', '2025-06-21 18:57:13', '2025-06-22 17:57:00', 'Accessories'),
(25, 'RTX 4060', 'a really good budget graphics card with 8GB VRAM', 1000.00, 70, 1, 11, '1750790634188-652098864.jpg', '2025-06-24 18:43:54', '2025-06-24 18:43:54', 'Graphics Card (GPU)');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `shipped_date` date DEFAULT NULL,
  `delivery_status` varchar(50) DEFAULT NULL,
  `provider` varchar(100) DEFAULT NULL,
  `tracking_number` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `suppliers`
--

CREATE TABLE `suppliers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `suppliers`
--

INSERT INTO `suppliers` (`id`, `name`, `email`, `phone`) VALUES
(1, 'Intel Corp', 'support@intel.com', '1234567890'),
(2, 'AMD Inc', 'sales@amd.com', '1234567891'),
(3, 'NVIDIA Corp', 'contact@nvidia.com', '1234567892'),
(4, 'Corsair', 'info@corsair.com', '1234567893'),
(5, 'Samsung', 'support@samsung.com', '1234567894'),
(6, 'Cooler Master', 'help@coolermaster.com', '1234567895'),
(7, 'Logitech', 'contact@logitech.com', '1234567896');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `Last_Name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `registered_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `age` int(11) DEFAULT NULL,
  `is_admin` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `Last_Name`, `email`, `phone`, `city`, `password`, `registered_at`, `age`, `is_admin`) VALUES
(9, 'mohammad', 'zaaaaa', 'm7mdxza123@gmail.com', '0522090019', NULL, '$2b$10$WR2sFraL.LNCmiVABaw5QO1MN.lZAyQPmsTRcPybXVrU4GIuqWgK2', '2025-06-21 19:29:21', NULL, 0),
(10, 'firas', 'najar', 'firas123@gmail.com', '0512345678', NULL, '$2b$10$3AFs.5tyQA6gSc4Os/r3sOAoHFqvl1wlu02VffAEDHSStcgBWTYou', '2025-06-21 21:20:52', NULL, 0),
(11, 'Tester', 'testing', 'tester@gmail.com', '0511223344', NULL, '$2b$10$zpvvMfa2F/LzpEP6DfqueuY35eiMyyEfArdylxAdagYzV7gvmJ.Y2', '2025-06-22 10:33:46', NULL, 0),
(12, 'maikel', 'jackson', 'jackson123@gmail.com', '0533445566', NULL, '$2b$10$ipQAtaIebsqZpvX4qm68jOEcIMWapvUA91HJ.4M3cXyNYfpvTRpmy', '2025-06-22 17:42:10', NULL, 0),
(13, 'hamood', 'meow', 'kaadanman16@gmail.com', '0525164474', NULL, '$2b$10$t/DxoD71k3C3G3AEwxJ.b.lAjgWId.ixObAX8LSFIh9UCHeKlTbY2', '2025-06-22 18:55:32', NULL, 0),
(14, 'wakonda', 'Weekend', 'kaadanman6@gmail.com', '0512345678', NULL, '$2b$10$AoVUFKfSuI0lpaoKOl6FlOxQL2NA3vIluSxVJwoBMVAqywal4XdAy', '2025-06-22 19:27:55', NULL, 0),
(15, 'Mr', 'Beast', 'beast@gmail.com', '0599999999', NULL, '$2b$10$hStYTdFU1.LLpKGe/RDr5.ohCVonhyl/es2FEy5.t/9TnCGTtLmuO', '2025-06-24 17:20:32', NULL, 0),
(16, 'araba', 'city', 'araba@gmail.com', '0544444444', NULL, '$2b$10$057WoySNcxx8Kr5/KTKU0u4kkQGCwngOLSps/gRjs5AgEX4Uv5Mae', '2025-06-24 17:22:14', NULL, 0),
(17, 'Big', 'Poppa', '50cent@gmail.com', '0550505050', NULL, '$2b$10$s0Fp8cpzlJCyDxVnmV1hbu0E2Ip8BCs.R.DspjBv7i7BO1vu8buuK', '2025-06-24 17:25:16', NULL, 0),
(18, 'salam', 'shibly', 'shibly@gmail.com', '0599992243', NULL, '$2b$10$Jku5UOipzKeWhrP/zESxC.U9l.K.uhTvIaXXIjkzfL1z52y1ik./G', '2025-06-24 18:14:37', NULL, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `chatbot`
--
ALTER TABLE `chatbot`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `feedback`
--
ALTER TABLE `feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `supplier_id` (`supplier_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `suppliers`
--
ALTER TABLE `suppliers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `chatbot`
--
ALTER TABLE `chatbot`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `feedback`
--
ALTER TABLE `feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `shipping`
--
ALTER TABLE `shipping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `suppliers`
--
ALTER TABLE `suppliers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `chatbot`
--
ALTER TABLE `chatbot`
  ADD CONSTRAINT `chatbot_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `feedback`
--
ALTER TABLE `feedback`
  ADD CONSTRAINT `feedback_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `feedback_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`),
  ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `shipping`
--
ALTER TABLE `shipping`
  ADD CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
