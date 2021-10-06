-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 24, 2020 at 07:02 AM
-- Server version: 10.4.14-MariaDB
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `paperbird`
--

-- --------------------------------------------------------

--
-- Table structure for table `city`
--

CREATE TABLE `city` (
  `ID` int(11) NOT NULL,
  `City` varchar(255) NOT NULL,
  `StateID` int(11) DEFAULT NULL,
  `CountryID` int(11) NOT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `city`
--

INSERT INTO `city` (`ID`, `City`, `StateID`, `CountryID`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'test city', 1, 1, 1, '2020-10-17 16:32:28', '2020-10-17 16:32:28', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `consortium_prices`
--

CREATE TABLE `consortium_prices` (
  `ID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `MinQty` int(11) NOT NULL,
  `MaxOty` varchar(255) NOT NULL,
  `PricePu` varchar(255) NOT NULL,
  `SupplierID` int(11) NOT NULL,
  `WarehouseID` int(11) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `ID` int(11) NOT NULL,
  `Country` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`ID`, `Country`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'India', 1, '2020-10-16 09:11:06', '2020-10-16 09:11:06', NULL),
(2, 'India', 1, '2020-10-16 09:11:52', '2020-10-16 09:11:52', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `ID` int(11) NOT NULL,
  `CustomerName` varchar(255) DEFAULT NULL,
  `Number` varchar(255) DEFAULT NULL,
  `ShortName` varchar(255) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `LandMark` varchar(255) DEFAULT NULL,
  `ZipCode` varchar(255) DEFAULT NULL,
  `CityID` int(11) DEFAULT NULL,
  `StateID` int(11) DEFAULT NULL,
  `CountryID` int(11) DEFAULT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `Email` varchar(255) DEFAULT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `Industry` varchar(255) DEFAULT NULL,
  `Vat_Tax_No` varchar(255) DEFAULT NULL,
  `Latitude` varchar(255) DEFAULT NULL,
  `Longitude` varchar(255) DEFAULT NULL,
  `InConsortium` tinyint(1) DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `Group`
--

CREATE TABLE `Group` (
  `ID` int(11) NOT NULL,
  `GroupName` varchar(255) NOT NULL,
  `GroupDescription` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `inquiry_details`
--

CREATE TABLE `inquiry_details` (
  `ID` int(11) NOT NULL,
  `InquiryID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Qty` float DEFAULT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `inquiry_master`
--

CREATE TABLE `inquiry_master` (
  `ID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `InquiryNo` varchar(255) NOT NULL,
  `Date` varchar(255) NOT NULL,
  `StatusID` int(11) DEFAULT NULL,
  `Remarks` int(11) NOT NULL,
  `ExpectedDate` datetime NOT NULL,
  `ExpiryDate` datetime NOT NULL,
  `FinancialYear` varchar(255) NOT NULL,
  `Fy_Seq_No` varchar(255) NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `inquiry_suppliers`
--

CREATE TABLE `inquiry_suppliers` (
  `ID` int(11) NOT NULL,
  `InquiryID` int(11) NOT NULL,
  `SupplierID` int(11) NOT NULL,
  `DataSend` varchar(255) DEFAULT NULL,
  `QoatationID` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `measurement_unit`
--

CREATE TABLE `measurement_unit` (
  `ID` int(11) NOT NULL,
  `Uom` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `menu_group`
--

CREATE TABLE `menu_group` (
  `ID` int(11) NOT NULL,
  `MenuGroup` varchar(255) NOT NULL,
  `Icon` varchar(255) NOT NULL,
  `SeqNo` varchar(255) DEFAULT NULL,
  `isActive` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `menu_group`
--

INSERT INTO `menu_group` (`ID`, `MenuGroup`, `Icon`, `SeqNo`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Region', 'fa fa-globe', '1', 1, '2020-10-20 11:10:35', '2020-10-20 11:10:35', NULL),
(2, 'User Management', 'fa fa-user', '2', 1, '2020-10-20 11:10:35', '2020-10-20 11:10:35', NULL),
(3, 'Product', 'fa fa-user', '3', 1, '2020-10-20 11:10:35', '2020-10-20 11:10:35', NULL),
(4, 'Warehouse', 'fa fa-user', '4', 1, '2020-10-20 11:10:35', '2020-10-20 11:10:35', NULL),
(5, 'Orders', 'fa fa-user', '5', 1, '2020-10-20 11:10:35', '2020-10-20 11:10:35', NULL),
(6, 'Groups', 'fa fa-user', '6', 1, '2020-10-20 11:10:35', '2020-10-20 11:10:35', NULL),
(7, 'Pricing', 'fa fa-user', '7', 1, '2020-10-20 11:10:35', '2020-10-20 11:10:35', NULL),
(8, 'Inquiry', 'fa fa-user', '8', 1, '2020-10-20 11:10:35', '2020-10-20 11:10:35', NULL),
(9, 'Offers', 'fa fa-user', '9', 1, '2020-10-20 11:10:35', '2020-10-20 11:10:35', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `menu_master`
--

CREATE TABLE `menu_master` (
  `ID` int(11) NOT NULL,
  `MenuName` varchar(255) NOT NULL,
  `Link` varchar(255) NOT NULL,
  `Icon` varchar(255) DEFAULT NULL,
  `SeqNo` int(11) DEFAULT NULL,
  `MenuGroupID` int(11) DEFAULT NULL,
  `IsActive` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `menu_master`
--

INSERT INTO `menu_master` (`ID`, `MenuName`, `Link`, `Icon`, `SeqNo`, `MenuGroupID`, `IsActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Country', '/country', NULL, 1, 1, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(2, 'State', '/state', NULL, 2, 1, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(3, 'City', '/city', NULL, 3, 1, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(4, 'Role', '/role', NULL, 1, 2, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(5, 'Permission', '/permission', NULL, 2, 2, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(6, 'Customer', '/customer', NULL, 3, 2, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(7, 'Supplier', '/supplier', NULL, 4, 2, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(9, 'Product', '/product', NULL, 1, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(10, 'Group', '/productGroup', NULL, 2, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(11, 'Sub Group', '/productSubGroup', NULL, 3, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(12, 'Paper Class', '/paperClass', NULL, 4, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(13, 'Paper Prinitibility', '/paperPrintibility', NULL, 5, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(14, 'Paper Quality', '/paperQuality', NULL, 6, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(15, 'Warehouses', '/warehouses', NULL, 1, 4, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(16, 'In Progress', '/orders/pending', NULL, 2, 5, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(17, 'My orders', '/myorders_', NULL, 2, 5, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(18, 'Groups', '/groups', NULL, 1, 6, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(19, 'All Inquiries', '/inquiry_', NULL, 1, 8, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(20, 'All Inquiries', '/bInquiry', NULL, 2, 8, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(21, 'Delivered', '/orders/delivered', NULL, 3, 5, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(22, 'GSM', '/paperGsm', NULL, 7, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(23, 'Grain', '/paperGrain', NULL, 8, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(24, 'Offers Master', '/offerMaster', NULL, 1, 9, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(25, 'Pricing', '/pricing', NULL, 2, 9, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(26, 'New orders', '/orders/new', NULL, 1, 5, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(27, 'Rejected', '/orders/rejected', NULL, 4, 5, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(29, 'Strength', '/strength', NULL, 9, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(30, 'Running Direction', '/runningDirection', NULL, 10, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(31, 'Ries', '/ries', NULL, 11, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL),
(32, 'Color', '/paperColor', NULL, 12, 3, 1, '2020-10-20 11:11:36', '2020-10-20 11:11:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `offers_master`
--

CREATE TABLE `offers_master` (
  `ID` int(11) NOT NULL,
  `OfferName` varchar(255) NOT NULL,
  `Description` varchar(255) NOT NULL,
  `DiscountType` varchar(255) NOT NULL,
  `DiscountValue` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `StartDate` datetime NOT NULL,
  `EndDate` datetime NOT NULL,
  `OfferStatus` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `paper_class`
--

CREATE TABLE `paper_class` (
  `ID` int(11) NOT NULL,
  `ClassName` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paper_class`
--

INSERT INTO `paper_class` (`ID`, `ClassName`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(12, 'Paper class 1', 1, '2020-10-15 12:58:30', '2020-10-15 12:58:30', NULL),
(13, 'Paper Class 2', 1, '2020-10-15 12:58:40', '2020-10-15 12:58:40', NULL),
(14, 'Paper Class 2', 1, '2020-10-15 12:58:52', '2020-10-15 12:58:52', '2020-11-13 12:43:04'),
(15, 'test2', 1, '2020-10-23 12:39:46', '2020-10-23 12:39:46', '2020-11-13 12:50:38'),
(16, 'test', 1, '2020-10-23 12:40:23', '2020-10-23 12:40:23', '2020-11-13 12:50:36'),
(17, 'test', 1, '2020-10-23 12:42:19', '2020-10-23 12:42:19', '2020-11-13 12:50:33'),
(18, 'e', 1, '2020-10-23 12:42:27', '2020-10-23 12:42:27', '2020-11-13 12:50:30'),
(19, 'a', 1, '2020-10-23 12:43:06', '2020-10-23 12:43:06', '2020-11-13 12:50:28'),
(22, 'qqqqq', 1, '2020-11-13 07:01:14', '2020-11-13 07:01:14', '2020-11-13 12:44:34'),
(23, 'qqqqq', 1, '2020-11-13 10:09:46', '2020-11-13 10:09:46', '2020-11-13 12:44:30');

-- --------------------------------------------------------

--
-- Table structure for table `paper_color`
--

CREATE TABLE `paper_color` (
  `ID` int(11) NOT NULL,
  `PaperColor` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paper_color`
--

INSERT INTO `paper_color` (`ID`, `PaperColor`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Cyan', 1, '2020-11-13 05:34:16', '2020-11-13 05:34:16', NULL),
(2, 'blue', 1, '2020-11-19 08:56:56', '2020-11-19 08:56:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `paper_grain`
--

CREATE TABLE `paper_grain` (
  `ID` int(11) NOT NULL,
  `PaperGrain` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `paper_gsm`
--

CREATE TABLE `paper_gsm` (
  `ID` int(11) NOT NULL,
  `PaperGsm` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paper_gsm`
--

INSERT INTO `paper_gsm` (`ID`, `PaperGsm`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'retro', 1, '2020-11-13 12:28:31', '2020-11-13 12:28:31', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `paper_printibility`
--

CREATE TABLE `paper_printibility` (
  `ID` int(11) NOT NULL,
  `Printibility` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paper_printibility`
--

INSERT INTO `paper_printibility` (`ID`, `Printibility`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'test', 1, '2020-10-16 12:50:30', '2020-10-16 12:50:30', NULL),
(2, 'asd', 1, '2020-10-30 12:09:36', '2020-10-30 12:09:36', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `paper_quality`
--

CREATE TABLE `paper_quality` (
  `ID` int(11) NOT NULL,
  `PaperQuality` varchar(255) NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paper_quality`
--

INSERT INTO `paper_quality` (`ID`, `PaperQuality`, `IsActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'test', 1, '2020-10-22 12:39:13', '2020-10-22 12:39:13', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `paper_ries`
--

CREATE TABLE `paper_ries` (
  `ID` int(11) NOT NULL,
  `PaperRies` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paper_ries`
--

INSERT INTO `paper_ries` (`ID`, `PaperRies`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'torned', 1, '2020-11-13 06:08:05', '2020-11-13 06:08:05', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `paper_strength`
--

CREATE TABLE `paper_strength` (
  `ID` int(11) NOT NULL,
  `PaperStrength` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `paper_strength`
--

INSERT INTO `paper_strength` (`ID`, `PaperStrength`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Strong', 1, '2020-11-13 05:43:42', '2020-11-13 05:43:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `po_del_status`
--

CREATE TABLE `po_del_status` (
  `ID` int(11) NOT NULL,
  `POID` int(11) NOT NULL,
  `StageStatus` varchar(255) NOT NULL,
  `Date` datetime NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `SupplierID` int(11) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `po_payment_details`
--

CREATE TABLE `po_payment_details` (
  `ID` int(11) NOT NULL,
  `POID` int(11) NOT NULL,
  `Date` datetime NOT NULL,
  `PaymentStatus` varchar(255) NOT NULL,
  `ConfirmationStatus` varchar(255) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `SupplierID` int(11) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product_group`
--

CREATE TABLE `product_group` (
  `ID` int(11) NOT NULL,
  `Group` varchar(255) NOT NULL,
  `Code` varchar(255) NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_group`
--

INSERT INTO `product_group` (`ID`, `Group`, `Code`, `IsActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Group 1', '1234', 1, '2020-10-16 05:55:41', '2020-11-12 11:25:27', NULL),
(2, 'asdasd', '123123', 1, '2020-11-12 10:01:06', '2020-11-12 10:01:06', NULL),
(3, 'saadasdasdasd', '1212', 1, '2020-11-12 10:01:17', '2020-11-12 10:01:17', NULL),
(4, 'group 4', '123', 1, '2020-11-13 12:05:59', '2020-11-13 12:05:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_master`
--

CREATE TABLE `product_master` (
  `ID` int(11) NOT NULL,
  `ProductNo` int(11) NOT NULL,
  `SupplierID` int(11) NOT NULL,
  `ProductName` varchar(500) NOT NULL,
  `ProductDescription` varchar(255) DEFAULT NULL,
  `SubGroupID` int(11) DEFAULT NULL,
  `PaperClassID` int(11) DEFAULT NULL,
  `PaperQualityID` int(11) DEFAULT NULL,
  `PaperPrintibilityID` int(11) DEFAULT NULL,
  `UomID` int(11) DEFAULT NULL,
  `Thickness` float DEFAULT NULL,
  `Width` float DEFAULT NULL,
  `Height` float DEFAULT NULL,
  `Weight` float DEFAULT NULL,
  `GrainGsm` float DEFAULT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `product_subgroup`
--

CREATE TABLE `product_subgroup` (
  `ID` int(11) NOT NULL,
  `SubGroup` varchar(255) NOT NULL,
  `Code` varchar(255) NOT NULL,
  `GroupID` int(11) NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `product_subgroup`
--

INSERT INTO `product_subgroup` (`ID`, `SubGroup`, `Code`, `GroupID`, `IsActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Sub group 1', '9878', 1, 1, '2020-10-16 11:18:50', '2020-11-13 11:50:30', NULL),
(2, 'asdas', '123', 2, 1, '2020-11-12 10:26:01', '2020-11-12 10:26:01', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order`
--

CREATE TABLE `purchase_order` (
  `ID` int(11) NOT NULL,
  `InquiryID` int(11) NOT NULL,
  `QuotationID` int(11) NOT NULL,
  `PurchaseOrderNo` varchar(255) NOT NULL,
  `SupplierID` int(11) NOT NULL,
  `FinancialYear` datetime NOT NULL,
  `Fy_Seq_No` varchar(255) NOT NULL,
  `GrandTotal` int(11) DEFAULT NULL,
  `CurrencyID` int(11) DEFAULT NULL,
  `AmountInWords` varchar(255) NOT NULL,
  `Remarks` varchar(255) NOT NULL,
  `ApproveStatus` varchar(255) DEFAULT NULL,
  `PoStatus` varchar(255) DEFAULT NULL,
  `ConfirmationStatus` varchar(255) DEFAULT NULL,
  `ExpDelDate` datetime DEFAULT NULL,
  `ConfirmationDate` datetime DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `purchase_order_details`
--

CREATE TABLE `purchase_order_details` (
  `ID` int(11) NOT NULL,
  `POID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `WarehouseID` int(11) NOT NULL,
  `Qty` varchar(255) DEFAULT NULL,
  `PricePU` int(11) NOT NULL,
  `Discount` int(11) NOT NULL,
  `Amount` int(11) NOT NULL,
  `Tax1` int(11) DEFAULT NULL,
  `Tax2` int(11) DEFAULT NULL,
  `Freight` varchar(255) NOT NULL,
  `OtherCharges` int(11) NOT NULL,
  `TotalValue` int(11) NOT NULL,
  `CreditDays` int(11) NOT NULL,
  `PaymentTerms` varchar(255) NOT NULL,
  `DeliveryTerms` varchar(255) NOT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `InquiryDetailID` int(11) DEFAULT NULL,
  `QuotationDetailID` int(11) DEFAULT NULL,
  `OfferID` int(11) DEFAULT NULL,
  `PRD_EXP_DEL_Date` datetime DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `quotation_details`
--

CREATE TABLE `quotation_details` (
  `ID` int(11) NOT NULL,
  `InquiryID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `WarehouseID` int(11) NOT NULL,
  `Qty` varchar(255) DEFAULT NULL,
  `PricePU` int(11) NOT NULL,
  `Discount` int(11) NOT NULL,
  `Amount` int(11) NOT NULL,
  `Tax1` int(11) DEFAULT NULL,
  `Tax2` int(11) DEFAULT NULL,
  `Freight` varchar(255) NOT NULL,
  `OtherCharges` int(11) NOT NULL,
  `TotalValue` int(11) NOT NULL,
  `CreditDays` int(11) NOT NULL,
  `PaymentTerms` varchar(255) NOT NULL,
  `DeliveryTerms` varchar(255) NOT NULL,
  `Remarks` varchar(255) DEFAULT NULL,
  `QuotationStatus` varchar(255) DEFAULT NULL,
  `OrderStatus` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `Quotation_Master`
--

CREATE TABLE `Quotation_Master` (
  `ID` int(11) NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `regular_price`
--

CREATE TABLE `regular_price` (
  `ID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `MinQty` int(11) NOT NULL,
  `MaxOty` varchar(255) NOT NULL,
  `PricePu` varchar(255) NOT NULL,
  `SupplierID` int(11) NOT NULL,
  `WarehouseID` int(11) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `role_master`
--

CREATE TABLE `role_master` (
  `ID` int(11) NOT NULL,
  `RoleName` varchar(255) NOT NULL,
  `Permission` varchar(500) NOT NULL,
  `IsActive` varchar(255) DEFAULT '1',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role_master`
--

INSERT INTO `role_master` (`ID`, `RoleName`, `Permission`, `IsActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Admin', '{\"1\":true,\"2\":true,\"3\":true,\"4\":true,\"5\":true,\"6\":true,\"7\":true,\"8\":true,\"9\":false,\"10\":true,\"11\":true,\"12\":true,\"13\":true,\"14\":true,\"17\":false,\"18\":false,\"19\":false,\"22\":true,\"23\":true,\"29\":true,\"30\":true,\"31\":true,\"32\":true}', '1', '2020-10-06 06:11:20', '2020-11-13 05:22:27', NULL),
(2, 'Supplier', '{\"1\":false,\"2\":false,\"3\":false,\"4\":false,\"5\":false,\"6\":true,\"9\":true,\"15\":true,\"16\":true,\"18\":true,\"19\":false,\"20\":true,\"21\":true,\"24\":true,\"25\":true,\"26\":true,\"27\":true}', '1', '2020-10-06 06:11:20', '2020-11-02 10:32:18', NULL),
(3, 'Customer', '{\"1\":false,\"2\":false,\"3\":false,\"4\":false,\"5\":false,\"6\":false,\"11\":false,\"16\":false,\"17\":true,\"19\":true,\"21\":false,\"24\":false}', '1', '2020-10-06 06:11:20', '2020-11-02 10:32:24', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `running_direction`
--

CREATE TABLE `running_direction` (
  `ID` int(11) NOT NULL,
  `RunningDirection` varchar(255) NOT NULL,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `running_direction`
--

INSERT INTO `running_direction` (`ID`, `RunningDirection`, `isActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Straight', 1, '2020-11-13 12:13:42', '2020-11-13 12:13:42', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `state`
--

CREATE TABLE `state` (
  `ID` int(11) NOT NULL,
  `State` varchar(255) NOT NULL,
  `CountryID` int(11) NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `state`
--

INSERT INTO `state` (`ID`, `State`, `CountryID`, `IsActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'test', 1, 1, '2020-10-17 16:31:58', '2020-10-17 16:31:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `supplier`
--

CREATE TABLE `supplier` (
  `ID` int(11) NOT NULL,
  `SupplierName` varchar(255) NOT NULL,
  `Number` varchar(255) NOT NULL,
  `ShortName` varchar(255) DEFAULT NULL,
  `Address` varchar(255) NOT NULL,
  `LandMark` varchar(255) NOT NULL,
  `ZipCode` varchar(255) NOT NULL,
  `CityID` int(11) NOT NULL,
  `StateID` int(11) NOT NULL,
  `CountryID` int(11) NOT NULL,
  `Phone` varchar(255) DEFAULT NULL,
  `Email` varchar(255) NOT NULL,
  `Currency` varchar(255) DEFAULT NULL,
  `Industry` varchar(255) NOT NULL,
  `PaymentTerms` varchar(255) DEFAULT NULL,
  `DeliveryTerms` varchar(255) DEFAULT NULL,
  `Vat_Tax_No` varchar(255) NOT NULL,
  `Latitude` varchar(255) DEFAULT NULL,
  `Longitude` varchar(255) DEFAULT NULL,
  `DeliveryMiles` int(11) DEFAULT NULL,
  `ContactPersonName` varchar(255) NOT NULL,
  `IsApproved` tinyint(1) DEFAULT 0,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `supplier`
--

INSERT INTO `supplier` (`ID`, `SupplierName`, `Number`, `ShortName`, `Address`, `LandMark`, `ZipCode`, `CityID`, `StateID`, `CountryID`, `Phone`, `Email`, `Currency`, `Industry`, `PaymentTerms`, `DeliveryTerms`, `Vat_Tax_No`, `Latitude`, `Longitude`, `DeliveryMiles`, `ContactPersonName`, `IsApproved`, `IsActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(4, 'Test', '123', NULL, 'Test Address', 'landmark', '390012', 1, 1, 1, NULL, 'supp@paperbird.com', NULL, 'industry', NULL, NULL, '123123', NULL, NULL, NULL, 'Contact person', 0, 1, '2020-10-17 11:07:30', '2020-10-17 11:07:30', NULL),
(10, 'Test', '2', NULL, 'Test Address', 'landmark', '390012', 1, 1, 1, NULL, 'supp2@paperbird.com', NULL, 'industry', NULL, NULL, '123123', NULL, NULL, NULL, 'Contact person', 0, 1, '2020-10-17 11:34:55', '2020-10-17 11:34:55', NULL),
(11, 'Test', '12', NULL, 'Test Address', 'landmark', '390012', 1, 1, 1, NULL, 'supp3@paperbird.com', NULL, 'industry', NULL, NULL, '123123', NULL, NULL, NULL, 'Contact person', 0, 1, '2020-10-17 11:41:25', '2020-10-17 11:41:25', NULL),
(12, 'Test', '3', NULL, 'Test Address', 'landmark', '390012', 1, 1, 1, NULL, 'supp4@paperbird.com', NULL, 'industry', NULL, NULL, '123123', NULL, NULL, NULL, 'Contact person', 0, 1, '2020-10-17 11:42:00', '2020-10-17 11:42:00', NULL),
(13, 'Test', '123', NULL, 'Test Address', 'landmark', '390012', 1, 1, 1, NULL, 'supp5@paperbird.com', NULL, 'industry', NULL, NULL, '123123', NULL, NULL, NULL, 'Contact person', 0, 1, '2020-10-19 05:44:56', '2020-10-19 05:44:56', NULL),
(15, 'Test', '123', NULL, 'Test Address', 'landmark', '390012', 1, 1, 1, NULL, 'supp7@paperbird.com', NULL, 'industry', NULL, NULL, '123123', NULL, NULL, NULL, 'Contact person', 0, 1, '2020-10-22 05:36:59', '2020-10-22 05:36:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `supplier_quotes`
--

CREATE TABLE `supplier_quotes` (
  `ID` int(11) NOT NULL,
  `InquiryID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `QuotationNo` varchar(255) NOT NULL,
  `Date` datetime NOT NULL,
  `SupplierID` int(11) NOT NULL,
  `ValidityDate` datetime NOT NULL,
  `GrandTotal` int(11) NOT NULL,
  `CurrencyID` int(11) DEFAULT NULL,
  `AmountInWords` varchar(255) NOT NULL,
  `Remarks` varchar(255) NOT NULL,
  `ApproveStatus` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `supplier_warehouse`
--

CREATE TABLE `supplier_warehouse` (
  `ID` int(11) NOT NULL,
  `WarehouseName` varchar(255) NOT NULL,
  `SupplierID` int(11) NOT NULL,
  `Number` varchar(255) NOT NULL,
  `ShortName` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `LandMark` varchar(255) NOT NULL,
  `ZipCode` varchar(255) NOT NULL,
  `CityID` int(11) NOT NULL,
  `StateID` int(11) NOT NULL,
  `CountryID` int(11) NOT NULL,
  `Phone` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Currency` varchar(255) NOT NULL,
  `Industry` varchar(255) NOT NULL,
  `PaymentTerms` varchar(255) NOT NULL,
  `DeliveryTerms` varchar(255) NOT NULL,
  `Vat_Tax_No` varchar(255) NOT NULL,
  `Latitude` varchar(255) NOT NULL,
  `Longitude` varchar(255) NOT NULL,
  `DeliveryMiles` int(11) NOT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user_master`
--

CREATE TABLE `user_master` (
  `ID` int(11) NOT NULL,
  `UserName` varchar(255) NOT NULL,
  `ReferenceID` int(11) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) DEFAULT NULL,
  `RoleID` int(11) DEFAULT NULL,
  `token` longtext DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp(),
  `deletedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_master`
--

INSERT INTO `user_master` (`ID`, `UserName`, `ReferenceID`, `Email`, `Password`, `RoleID`, `token`, `IsActive`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'Seed Admin', 0, 'admin@paperbird.com', '$2a$10$tuH.nrDqiKSGDhQ38wauje.RXKp3Qeu7kML/2PGSgXtGaUVtKZF8a', 1, NULL, 1, '2020-10-06 06:11:20', '2020-11-19 12:48:02', NULL),
(2, 'Seed Supplier', 0, 'supplier@paperbird.com', '$2a$10$tuH.nrDqiKSGDhQ38wauje.RXKp3Qeu7kML/2PGSgXtGaUVtKZF8a', 2, NULL, 1, '2020-10-06 06:11:20', '2020-10-06 06:11:20', NULL),
(3, 'Seed Customer', 0, 'customer@paperbird.com', '$2a$10$tuH.nrDqiKSGDhQ38wauje.RXKp3Qeu7kML/2PGSgXtGaUVtKZF8a', 3, NULL, 1, '2020-10-06 06:11:20', '2020-11-20 13:19:59', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `city`
--
ALTER TABLE `city`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `StateID` (`StateID`),
  ADD KEY `CountryID` (`CountryID`);

--
-- Indexes for table `consortium_prices`
--
ALTER TABLE `consortium_prices`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `SupplierID` (`SupplierID`),
  ADD KEY `WarehouseID` (`WarehouseID`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `Group`
--
ALTER TABLE `Group`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `inquiry_details`
--
ALTER TABLE `inquiry_details`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `InquiryID` (`InquiryID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `inquiry_master`
--
ALTER TABLE `inquiry_master`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CustomerID` (`CustomerID`);

--
-- Indexes for table `inquiry_suppliers`
--
ALTER TABLE `inquiry_suppliers`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `InquiryID` (`InquiryID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `measurement_unit`
--
ALTER TABLE `measurement_unit`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `menu_group`
--
ALTER TABLE `menu_group`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `menu_master`
--
ALTER TABLE `menu_master`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `MenuGroupID` (`MenuGroupID`);

--
-- Indexes for table `offers_master`
--
ALTER TABLE `offers_master`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `paper_class`
--
ALTER TABLE `paper_class`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `paper_color`
--
ALTER TABLE `paper_color`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `paper_grain`
--
ALTER TABLE `paper_grain`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `paper_gsm`
--
ALTER TABLE `paper_gsm`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `paper_printibility`
--
ALTER TABLE `paper_printibility`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `paper_quality`
--
ALTER TABLE `paper_quality`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `paper_ries`
--
ALTER TABLE `paper_ries`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `paper_strength`
--
ALTER TABLE `paper_strength`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `po_del_status`
--
ALTER TABLE `po_del_status`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `POID` (`POID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `SupplierID` (`SupplierID`);

--
-- Indexes for table `po_payment_details`
--
ALTER TABLE `po_payment_details`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `POID` (`POID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `SupplierID` (`SupplierID`);

--
-- Indexes for table `product_group`
--
ALTER TABLE `product_group`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `product_master`
--
ALTER TABLE `product_master`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `SubGroupID` (`SubGroupID`),
  ADD KEY `PaperClassID` (`PaperClassID`),
  ADD KEY `PaperQualityID` (`PaperQualityID`),
  ADD KEY `PaperPrintibilityID` (`PaperPrintibilityID`),
  ADD KEY `UomID` (`UomID`);

--
-- Indexes for table `product_subgroup`
--
ALTER TABLE `product_subgroup`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `GroupID` (`GroupID`);

--
-- Indexes for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `InquiryID` (`InquiryID`),
  ADD KEY `QuotationID` (`QuotationID`),
  ADD KEY `SupplierID` (`SupplierID`);

--
-- Indexes for table `purchase_order_details`
--
ALTER TABLE `purchase_order_details`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `POID` (`POID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `WarehouseID` (`WarehouseID`),
  ADD KEY `InquiryDetailID` (`InquiryDetailID`),
  ADD KEY `QuotationDetailID` (`QuotationDetailID`),
  ADD KEY `OfferID` (`OfferID`);

--
-- Indexes for table `quotation_details`
--
ALTER TABLE `quotation_details`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `InquiryID` (`InquiryID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `WarehouseID` (`WarehouseID`);

--
-- Indexes for table `Quotation_Master`
--
ALTER TABLE `Quotation_Master`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `regular_price`
--
ALTER TABLE `regular_price`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `ProductID` (`ProductID`),
  ADD KEY `SupplierID` (`SupplierID`),
  ADD KEY `WarehouseID` (`WarehouseID`);

--
-- Indexes for table `role_master`
--
ALTER TABLE `role_master`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `running_direction`
--
ALTER TABLE `running_direction`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `state`
--
ALTER TABLE `state`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CountryID` (`CountryID`);

--
-- Indexes for table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `CityID` (`CityID`),
  ADD KEY `StateID` (`StateID`),
  ADD KEY `CountryID` (`CountryID`);

--
-- Indexes for table `supplier_quotes`
--
ALTER TABLE `supplier_quotes`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `InquiryID` (`InquiryID`),
  ADD KEY `CustomerID` (`CustomerID`),
  ADD KEY `SupplierID` (`SupplierID`);

--
-- Indexes for table `supplier_warehouse`
--
ALTER TABLE `supplier_warehouse`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `SupplierID` (`SupplierID`),
  ADD KEY `CityID` (`CityID`),
  ADD KEY `StateID` (`StateID`),
  ADD KEY `CountryID` (`CountryID`);

--
-- Indexes for table `user_master`
--
ALTER TABLE `user_master`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `RoleID` (`RoleID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `city`
--
ALTER TABLE `city`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `consortium_prices`
--
ALTER TABLE `consortium_prices`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `country`
--
ALTER TABLE `country`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Group`
--
ALTER TABLE `Group`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiry_details`
--
ALTER TABLE `inquiry_details`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiry_master`
--
ALTER TABLE `inquiry_master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `inquiry_suppliers`
--
ALTER TABLE `inquiry_suppliers`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `measurement_unit`
--
ALTER TABLE `measurement_unit`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `menu_group`
--
ALTER TABLE `menu_group`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `menu_master`
--
ALTER TABLE `menu_master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `offers_master`
--
ALTER TABLE `offers_master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paper_class`
--
ALTER TABLE `paper_class`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `paper_color`
--
ALTER TABLE `paper_color`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `paper_grain`
--
ALTER TABLE `paper_grain`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `paper_gsm`
--
ALTER TABLE `paper_gsm`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `paper_printibility`
--
ALTER TABLE `paper_printibility`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `paper_quality`
--
ALTER TABLE `paper_quality`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `paper_ries`
--
ALTER TABLE `paper_ries`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `paper_strength`
--
ALTER TABLE `paper_strength`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `po_del_status`
--
ALTER TABLE `po_del_status`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `po_payment_details`
--
ALTER TABLE `po_payment_details`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_group`
--
ALTER TABLE `product_group`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `product_master`
--
ALTER TABLE `product_master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_subgroup`
--
ALTER TABLE `product_subgroup`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `purchase_order`
--
ALTER TABLE `purchase_order`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchase_order_details`
--
ALTER TABLE `purchase_order_details`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quotation_details`
--
ALTER TABLE `quotation_details`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Quotation_Master`
--
ALTER TABLE `Quotation_Master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `regular_price`
--
ALTER TABLE `regular_price`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role_master`
--
ALTER TABLE `role_master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `running_direction`
--
ALTER TABLE `running_direction`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `state`
--
ALTER TABLE `state`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `supplier_quotes`
--
ALTER TABLE `supplier_quotes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `supplier_warehouse`
--
ALTER TABLE `supplier_warehouse`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_master`
--
ALTER TABLE `user_master`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `city`
--
ALTER TABLE `city`
  ADD CONSTRAINT `city_ibfk_1` FOREIGN KEY (`StateID`) REFERENCES `state` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `city_ibfk_2` FOREIGN KEY (`CountryID`) REFERENCES `country` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `consortium_prices`
--
ALTER TABLE `consortium_prices`
  ADD CONSTRAINT `consortium_prices_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `consortium_prices_ibfk_2` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `consortium_prices_ibfk_3` FOREIGN KEY (`WarehouseID`) REFERENCES `supplier_warehouse` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `inquiry_details`
--
ALTER TABLE `inquiry_details`
  ADD CONSTRAINT `inquiry_details_ibfk_1` FOREIGN KEY (`InquiryID`) REFERENCES `inquiry_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inquiry_details_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `inquiry_master`
--
ALTER TABLE `inquiry_master`
  ADD CONSTRAINT `inquiry_master_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `inquiry_suppliers`
--
ALTER TABLE `inquiry_suppliers`
  ADD CONSTRAINT `inquiry_suppliers_ibfk_1` FOREIGN KEY (`InquiryID`) REFERENCES `inquiry_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `inquiry_suppliers_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `supplier` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `menu_master`
--
ALTER TABLE `menu_master`
  ADD CONSTRAINT `menu_master_ibfk_1` FOREIGN KEY (`MenuGroupID`) REFERENCES `menu_group` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `offers_master`
--
ALTER TABLE `offers_master`
  ADD CONSTRAINT `offers_master_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `po_del_status`
--
ALTER TABLE `po_del_status`
  ADD CONSTRAINT `po_del_status_ibfk_1` FOREIGN KEY (`POID`) REFERENCES `purchase_order` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `po_del_status_ibfk_2` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `po_del_status_ibfk_3` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `po_payment_details`
--
ALTER TABLE `po_payment_details`
  ADD CONSTRAINT `po_payment_details_ibfk_1` FOREIGN KEY (`POID`) REFERENCES `purchase_order` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `po_payment_details_ibfk_2` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `po_payment_details_ibfk_3` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `product_master`
--
ALTER TABLE `product_master`
  ADD CONSTRAINT `product_master_ibfk_1` FOREIGN KEY (`SubGroupID`) REFERENCES `product_subgroup` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `product_master_ibfk_2` FOREIGN KEY (`PaperClassID`) REFERENCES `paper_class` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `product_master_ibfk_3` FOREIGN KEY (`PaperQualityID`) REFERENCES `paper_quality` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `product_master_ibfk_4` FOREIGN KEY (`PaperPrintibilityID`) REFERENCES `paper_printibility` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `product_master_ibfk_5` FOREIGN KEY (`UomID`) REFERENCES `measurement_unit` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `product_subgroup`
--
ALTER TABLE `product_subgroup`
  ADD CONSTRAINT `product_subgroup_ibfk_1` FOREIGN KEY (`GroupID`) REFERENCES `product_group` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `purchase_order`
--
ALTER TABLE `purchase_order`
  ADD CONSTRAINT `purchase_order_ibfk_1` FOREIGN KEY (`InquiryID`) REFERENCES `inquiry_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_order_ibfk_2` FOREIGN KEY (`QuotationID`) REFERENCES `supplier_quotes` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_order_ibfk_3` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `purchase_order_details`
--
ALTER TABLE `purchase_order_details`
  ADD CONSTRAINT `purchase_order_details_ibfk_1` FOREIGN KEY (`POID`) REFERENCES `purchase_order` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_order_details_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_order_details_ibfk_3` FOREIGN KEY (`WarehouseID`) REFERENCES `supplier_warehouse` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_order_details_ibfk_4` FOREIGN KEY (`InquiryDetailID`) REFERENCES `inquiry_details` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_order_details_ibfk_5` FOREIGN KEY (`QuotationDetailID`) REFERENCES `quotation_details` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `purchase_order_details_ibfk_6` FOREIGN KEY (`OfferID`) REFERENCES `offers_master` (`ID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `quotation_details`
--
ALTER TABLE `quotation_details`
  ADD CONSTRAINT `quotation_details_ibfk_1` FOREIGN KEY (`InquiryID`) REFERENCES `inquiry_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `quotation_details_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `product_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `quotation_details_ibfk_3` FOREIGN KEY (`WarehouseID`) REFERENCES `supplier_warehouse` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `regular_price`
--
ALTER TABLE `regular_price`
  ADD CONSTRAINT `regular_price_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `product_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `regular_price_ibfk_2` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `regular_price_ibfk_3` FOREIGN KEY (`WarehouseID`) REFERENCES `supplier_warehouse` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `state`
--
ALTER TABLE `state`
  ADD CONSTRAINT `state_ibfk_1` FOREIGN KEY (`CountryID`) REFERENCES `country` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `supplier`
--
ALTER TABLE `supplier`
  ADD CONSTRAINT `supplier_ibfk_1` FOREIGN KEY (`CityID`) REFERENCES `city` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_ibfk_2` FOREIGN KEY (`StateID`) REFERENCES `state` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_ibfk_3` FOREIGN KEY (`CountryID`) REFERENCES `country` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `supplier_quotes`
--
ALTER TABLE `supplier_quotes`
  ADD CONSTRAINT `supplier_quotes_ibfk_1` FOREIGN KEY (`InquiryID`) REFERENCES `inquiry_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_quotes_ibfk_2` FOREIGN KEY (`CustomerID`) REFERENCES `customer` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_quotes_ibfk_3` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `supplier_warehouse`
--
ALTER TABLE `supplier_warehouse`
  ADD CONSTRAINT `supplier_warehouse_ibfk_1` FOREIGN KEY (`SupplierID`) REFERENCES `supplier` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_warehouse_ibfk_2` FOREIGN KEY (`CityID`) REFERENCES `city` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_warehouse_ibfk_3` FOREIGN KEY (`StateID`) REFERENCES `state` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `supplier_warehouse_ibfk_4` FOREIGN KEY (`CountryID`) REFERENCES `country` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Constraints for table `user_master`
--
ALTER TABLE `user_master`
  ADD CONSTRAINT `user_master_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `role_master` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
