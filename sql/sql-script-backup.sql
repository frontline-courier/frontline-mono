USE [master]
GO
/****** Object:  Database [CouriersHubDB]    Script Date: 01-07-2020 23:03:47 ******/
CREATE DATABASE [CouriersHubDB]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'CouriersHubDB', FILENAME = N'E:\MSSQL.MSSQLSERVER\DATA\CouriersHubDB.mdf' , SIZE = 14336KB , MAXSIZE = 204800KB , FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'CouriersHubDB_log', FILENAME = N'D:\MSSQL.MSSQLSERVER\DATA\CouriersHubDB_log.ldf' , SIZE = 21504KB , MAXSIZE = 102400KB , FILEGROWTH = 1024KB )
GO
ALTER DATABASE [CouriersHubDB] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CouriersHubDB].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [CouriersHubDB] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [CouriersHubDB] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [CouriersHubDB] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [CouriersHubDB] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [CouriersHubDB] SET ARITHABORT OFF 
GO
ALTER DATABASE [CouriersHubDB] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [CouriersHubDB] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [CouriersHubDB] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [CouriersHubDB] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [CouriersHubDB] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [CouriersHubDB] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [CouriersHubDB] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [CouriersHubDB] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [CouriersHubDB] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [CouriersHubDB] SET  ENABLE_BROKER 
GO
ALTER DATABASE [CouriersHubDB] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [CouriersHubDB] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [CouriersHubDB] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [CouriersHubDB] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [CouriersHubDB] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [CouriersHubDB] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [CouriersHubDB] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [CouriersHubDB] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [CouriersHubDB] SET  MULTI_USER 
GO
ALTER DATABASE [CouriersHubDB] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [CouriersHubDB] SET DB_CHAINING OFF 
GO
ALTER DATABASE [CouriersHubDB] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [CouriersHubDB] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [CouriersHubDB]
GO
/****** Object:  User [CouriersHubDB]    Script Date: 01-07-2020 23:03:51 ******/
CREATE USER [CouriersHubDB] FOR LOGIN [CouriersHubDB] WITH DEFAULT_SCHEMA=[CouriersHubDB]
GO
/****** Object:  User [aramaster]    Script Date: 01-07-2020 23:03:51 ******/
CREATE USER [aramaster] FOR LOGIN [aramaster] WITH DEFAULT_SCHEMA=[aramaster]
GO
/****** Object:  User [ara_worldbases]    Script Date: 01-07-2020 23:03:51 ******/
CREATE USER [ara_worldbases] FOR LOGIN [ara_worldbases] WITH DEFAULT_SCHEMA=[ara_worldbases]
GO
/****** Object:  DatabaseRole [gd_execprocs]    Script Date: 01-07-2020 23:03:51 ******/
CREATE ROLE [gd_execprocs]
GO
ALTER ROLE [db_securityadmin] ADD MEMBER [CouriersHubDB]
GO
ALTER ROLE [db_ddladmin] ADD MEMBER [CouriersHubDB]
GO
ALTER ROLE [db_backupoperator] ADD MEMBER [CouriersHubDB]
GO
ALTER ROLE [db_datareader] ADD MEMBER [CouriersHubDB]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [CouriersHubDB]
GO
ALTER ROLE [db_securityadmin] ADD MEMBER [aramaster]
GO
ALTER ROLE [db_ddladmin] ADD MEMBER [aramaster]
GO
ALTER ROLE [db_backupoperator] ADD MEMBER [aramaster]
GO
ALTER ROLE [db_datareader] ADD MEMBER [aramaster]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [aramaster]
GO
ALTER ROLE [db_securityadmin] ADD MEMBER [ara_worldbases]
GO
ALTER ROLE [db_ddladmin] ADD MEMBER [ara_worldbases]
GO
ALTER ROLE [db_backupoperator] ADD MEMBER [ara_worldbases]
GO
ALTER ROLE [db_datareader] ADD MEMBER [ara_worldbases]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [ara_worldbases]
GO
/****** Object:  Schema [ara_worldbases]    Script Date: 01-07-2020 23:03:53 ******/
CREATE SCHEMA [ara_worldbases]
GO
/****** Object:  Schema [aramaster]    Script Date: 01-07-2020 23:03:53 ******/
CREATE SCHEMA [aramaster]
GO
/****** Object:  Schema [CouriersHubDB]    Script Date: 01-07-2020 23:03:53 ******/
CREATE SCHEMA [CouriersHubDB]
GO
/****** Object:  Table [aramaster].[ConsignmentDetail]    Script Date: 01-07-2020 23:03:53 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[ConsignmentDetail](
	[ConsignmentID] [int] IDENTITY(1,1) NOT NULL,
	[ClientId] [int] NOT NULL,
	[CourierId] [int] NULL,
	[BookedDate] [date] NOT NULL,
	[courier_details_updated_time] [timestamp] NOT NULL,
	[ConsignmentNumber] [varchar](24) NOT NULL,
	[CourierName] [varchar](24) NOT NULL,
	[Destination] [varchar](24) NOT NULL,
	[Pincode] [varchar](6) NOT NULL,
	[TransportMode] [varchar](24) NOT NULL,
	[ConsignmentType] [varchar](24) NULL,
	[VolumetricWeight] [decimal](7, 3) NULL,
	[VolumetricWeightLength] [decimal](6, 2) NULL,
	[VolumetricWeightBreadth] [decimal](6, 2) NULL,
	[VolumetricWeightHeight] [decimal](6, 2) NULL,
	[ActualWeight] [decimal](7, 3) NULL,
	[Nos] [int] NOT NULL,
	[Cash] [smallmoney] NULL,
	[Credit] [smallmoney] NULL,
	[TotalAmount] [smallmoney] NULL,
	[PaymentType] [varchar](50) NOT NULL,
	[CashSource] [varchar](50) NOT NULL,
	[LeafOwner] [varchar](24) NOT NULL,
	[Remark] [nvarchar](128) NULL,
	[PouchNumber] [varchar](24) NULL,
	[RiskType] [varchar](24) NULL,
	[Content] [nvarchar](48) NULL,
PRIMARY KEY CLUSTERED 
(
	[ConsignmentID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[ConsignmentNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[ConsignmentTransportMode]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[ConsignmentTransportMode](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Mode] [varchar](24) NOT NULL,
	[Description] [varchar](96) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[CourierDetail]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[CourierDetail](
	[CourierId] [int] IDENTITY(1,1) NOT NULL,
	[CourierName] [varchar](48) NOT NULL,
	[CourierServiceType] [varchar](20) NOT NULL,
	[TrackUrl] [nvarchar](256) NOT NULL,
	[ServiceDetailUrl] [nvarchar](256) NOT NULL,
	[Rating] [varchar](48) NULL,
	[OfficialUrl] [nvarchar](256) NOT NULL,
	[Complaint] [nvarchar](256) NULL,
	[CustomerCareEmail] [nvarchar](256) NULL,
	[CustomerCarePhone] [nvarchar](256) NULL,
PRIMARY KEY CLUSTERED 
(
	[CourierId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[fl_courierdetails_27jul18]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[fl_courierdetails_27jul18](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AWBNumber] [nvarchar](24) NOT NULL,
	[ReferenceNumber] [nvarchar](24) NULL,
	[BookedDate] [smalldatetime] NOT NULL,
	[ShipperName] [nvarchar](48) NOT NULL,
	[Origin] [nvarchar](24) NOT NULL,
	[ReceiverName] [nvarchar](48) NOT NULL,
	[Destination] [nvarchar](48) NOT NULL,
	[Courier] [int] NOT NULL,
	[DoxType] [int] NOT NULL,
	[ShipmentMode] [int] NOT NULL,
	[TransportMode] [int] NOT NULL,
	[ShipmentStatus] [int] NOT NULL,
	[DeliveredDate] [smalldatetime] NULL,
	[ReceivedPersonName] [nvarchar](48) NULL,
	[ReceivedPersonRelation] [int] NULL,
	[Remarks] [nvarchar](max) NULL,
	[DeliveryOfficeAddress] [nvarchar](max) NULL,
	[TimeStamp] [timestamp] NOT NULL,
	[AdditionalContacts] [nvarchar](50) NULL,
	[AdditionalWeights] [nvarchar](50) NULL,
	[AdditionalLeaf] [nvarchar](50) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[FL_CourierDetailsBK17jul18]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[FL_CourierDetailsBK17jul18](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AWBNumber] [nvarchar](24) NOT NULL,
	[ReferenceNumber] [nvarchar](24) NULL,
	[BookedDate] [smalldatetime] NOT NULL,
	[ShipperName] [nvarchar](48) NOT NULL,
	[Origin] [nvarchar](24) NOT NULL,
	[ReceiverName] [nvarchar](48) NOT NULL,
	[Destination] [nvarchar](48) NOT NULL,
	[Courier] [int] NOT NULL,
	[DoxType] [int] NOT NULL,
	[ShipmentMode] [int] NOT NULL,
	[TransportMode] [int] NOT NULL,
	[ShipmentStatus] [int] NOT NULL,
	[DeliveredDate] [smalldatetime] NULL,
	[ReceivedPersonName] [nvarchar](48) NULL,
	[ReceivedPersonRelation] [int] NULL,
	[Remarks] [nvarchar](max) NULL,
	[DeliveryOfficeAddress] [nvarchar](max) NULL,
	[TimeStamp] [timestamp] NOT NULL,
	[AdditionalContacts] [nvarchar](50) NULL,
	[AdditionalWeights] [nvarchar](50) NULL,
	[AdditionalLeaf] [nvarchar](50) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[FrontlineDetails]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[FrontlineDetails](
	[ID] [int] NOT NULL,
	[POD] [nvarchar](50) NOT NULL,
	[FromName] [nvarchar](50) NULL,
	[FromLocation] [nvarchar](50) NULL,
	[ToName] [nvarchar](50) NULL,
	[ToLocation] [nvarchar](50) NULL,
	[Courier] [int] NULL,
	[CourierMode] [int] NULL,
	[CurrentStatus] [int] NULL,
	[DeliveredOn] [datetime] NULL,
	[DeliveredTo] [nvarchar](50) NULL,
	[DeliveredRelation] [int] NULL,
	[DeliveryRemarks] [nvarchar](max) NULL,
 CONSTRAINT [PK_FrontlineDetails] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[FrontlineMaster]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[FrontlineMaster](
	[ID] [int] NOT NULL,
	[GroupId] [int] NOT NULL,
	[GroupDescription] [nvarchar](50) NULL,
	[GroupValue] [nvarchar](50) NOT NULL,
	[Status] [int] NOT NULL,
 CONSTRAINT [PK_FrontlineMaster] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[UserDetail]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[UserDetail](
	[UserId] [int] NOT NULL,
	[FirstName] [varchar](48) NULL,
	[LastName] [varchar](24) NULL,
	[Email] [nvarchar](50) NULL,
	[CompanyName] [nvarchar](50) NULL,
	[Phone] [varchar](12) NULL,
	[AddressLine1] [nvarchar](50) NULL,
	[AddressLine2] [nvarchar](50) NULL,
	[City] [varchar](24) NULL,
	[State] [varchar](24) NULL,
	[Country] [varchar](24) NULL,
	[Pincode] [varchar](6) NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[UserProfile]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[UserProfile](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[LoginId] [nvarchar](56) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[LoginId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[webpages_Membership]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[webpages_Membership](
	[UserId] [int] NOT NULL,
	[CreateDate] [datetime] NULL,
	[ConfirmationToken] [nvarchar](128) NULL,
	[IsConfirmed] [bit] NULL,
	[LastPasswordFailureDate] [datetime] NULL,
	[PasswordFailuresSinceLastSuccess] [int] NOT NULL,
	[Password] [nvarchar](128) NOT NULL,
	[PasswordChangedDate] [datetime] NULL,
	[PasswordSalt] [nvarchar](128) NOT NULL,
	[PasswordVerificationToken] [nvarchar](128) NULL,
	[PasswordVerificationTokenExpirationDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[webpages_OAuthMembership]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[webpages_OAuthMembership](
	[Provider] [nvarchar](30) NOT NULL,
	[ProviderUserId] [nvarchar](100) NOT NULL,
	[UserId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Provider] ASC,
	[ProviderUserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [aramaster].[webpages_Roles]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [aramaster].[webpages_Roles](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](256) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[__MigrationHistory]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[__MigrationHistory](
	[MigrationId] [nvarchar](150) NOT NULL,
	[ContextKey] [nvarchar](300) NOT NULL,
	[Model] [varbinary](max) NOT NULL,
	[ProductVersion] [nvarchar](32) NOT NULL,
 CONSTRAINT [PK_dbo.__MigrationHistory] PRIMARY KEY CLUSTERED 
(
	[MigrationId] ASC,
	[ContextKey] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetRoles]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetRoles](
	[Id] [nvarchar](128) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetRoles] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserClaims]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserClaims](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
	[ClaimType] [nvarchar](max) NULL,
	[ClaimValue] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.AspNetUserClaims] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserLogins]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserLogins](
	[LoginProvider] [nvarchar](128) NOT NULL,
	[ProviderKey] [nvarchar](128) NOT NULL,
	[UserId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserLogins] PRIMARY KEY CLUSTERED 
(
	[LoginProvider] ASC,
	[ProviderKey] ASC,
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUserRoles]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUserRoles](
	[UserId] [nvarchar](128) NOT NULL,
	[RoleId] [nvarchar](128) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUserRoles] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AspNetUsers]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AspNetUsers](
	[Id] [nvarchar](128) NOT NULL,
	[Email] [nvarchar](256) NULL,
	[EmailConfirmed] [bit] NOT NULL,
	[PasswordHash] [nvarchar](max) NULL,
	[SecurityStamp] [nvarchar](max) NULL,
	[PhoneNumber] [nvarchar](max) NULL,
	[PhoneNumberConfirmed] [bit] NOT NULL,
	[TwoFactorEnabled] [bit] NOT NULL,
	[LockoutEndDateUtc] [datetime] NULL,
	[LockoutEnabled] [bit] NOT NULL,
	[AccessFailedCount] [int] NOT NULL,
	[UserName] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_dbo.AspNetUsers] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FL_BookingCost]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FL_BookingCost](
	[CostId] [int] IDENTITY(1,1) NOT NULL,
	[Shipment] [int] NOT NULL,
	[Transport] [int] NOT NULL,
	[Country] [int] NOT NULL,
	[Courier] [int] NOT NULL,
	[DoxType] [int] NOT NULL,
	[Weight] [int] NOT NULL,
	[Cost] [numeric](10, 2) NOT NULL,
	[Status] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[CostId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FL_BookingWeight]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FL_BookingWeight](
	[WeightId] [int] IDENTITY(1,1) NOT NULL,
	[Description] [nvarchar](50) NOT NULL,
	[Status] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[WeightId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FL_Courier]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FL_Courier](
	[CourierId] [int] IDENTITY(1,1) NOT NULL,
	[Courier] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](128) NULL,
	[Track] [nvarchar](max) NULL,
	[Status] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[CourierId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FL_CourierDetail]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FL_CourierDetail](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AWBNumber] [nvarchar](24) NOT NULL,
	[ReferenceNumber] [nvarchar](24) NULL,
	[BookedDate] [smalldatetime] NOT NULL,
	[ShipperName] [nvarchar](48) NOT NULL,
	[Origin] [nvarchar](24) NOT NULL,
	[ReceiverName] [nvarchar](48) NOT NULL,
	[Destination] [nvarchar](48) NOT NULL,
	[Courier] [int] NOT NULL,
	[DoxType] [int] NOT NULL,
	[ShipmentMode] [int] NOT NULL,
	[TransportMode] [int] NOT NULL,
	[ShipmentStatus] [int] NOT NULL,
	[DeliveredDate] [smalldatetime] NULL,
	[ReceivedPersonName] [nvarchar](48) NULL,
	[ReceivedPersonRelation] [int] NULL,
	[Remarks] [nvarchar](max) NULL,
	[DeliveryOfficeAddress] [nvarchar](max) NULL,
	[TimeStamp] [timestamp] NOT NULL,
	[AdditionalContacts] [nvarchar](50) NULL,
	[AdditionalWeights] [nvarchar](50) NULL,
	[AdditionalLeaf] [nvarchar](50) NULL,
	[BookingAmount] [numeric](18, 0) NULL,
	[BillAmount] [numeric](18, 0) NULL,
 CONSTRAINT [PK_FLCourierId] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[AWBNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FL_CourierStatus]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FL_CourierStatus](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CourierId] [int] NOT NULL,
	[StatusId] [int] NOT NULL,
	[StatusDate] [datetime] NULL,
	[Remark] [nvarchar](124) NULL,
	[TimeStamp] [timestamp] NULL,
	[status] [int] NULL,
 CONSTRAINT [PK_FLCourierStatusId] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FL_ReceivedRelation]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FL_ReceivedRelation](
	[RelationId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Status] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RelationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FL_Status]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FL_Status](
	[StatusId] [int] IDENTITY(1,1) NOT NULL,
	[ShipmentStatus] [nvarchar](24) NULL,
	[Sequence] [int] NULL,
	[Description] [nvarchar](128) NULL,
PRIMARY KEY CLUSTERED 
(
	[StatusId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Master_City]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Master_City](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](30) NOT NULL,
	[StateId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Master_Country]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Master_Country](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [varchar](3) NOT NULL,
	[Name] [varchar](48) NOT NULL,
	[PhoneCode] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Master_State]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Master_State](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](30) NOT NULL,
	[CountryId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Setting]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Setting](
	[SettingId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[DisplayName] [nvarchar](50) NOT NULL,
	[Description] [nvarchar](max) NULL,
	[Value] [nvarchar](50) NULL,
	[Status] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[SettingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UK_SettingName] UNIQUE NONCLUSTERED 
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VE_Booking]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VE_Booking](
	[BookingId] [int] IDENTITY(1,1) NOT NULL,
	[BookingMode] [int] NOT NULL,
	[BookingDate] [date] NOT NULL,
	[CourierId] [int] NOT NULL,
	[AwbNumber] [nvarchar](24) NOT NULL,
	[RefNumber] [nvarchar](24) NULL,
	[Destination] [nvarchar](50) NOT NULL,
	[Pincode] [nvarchar](6) NULL,
	[IsVolume] [bit] NOT NULL,
	[VolumeL] [numeric](8, 2) NULL,
	[VolumeB] [numeric](8, 2) NULL,
	[VolumeH] [numeric](8, 2) NULL,
	[Weight] [numeric](9, 3) NULL,
	[TotalAmount] [numeric](12, 2) NOT NULL,
	[PaidAmount] [numeric](12, 2) NULL,
	[PendingAmount]  AS ([TotalAmount]-[PaidAmount]),
	[ClientId] [int] NULL,
	[TransportMode] [int] NOT NULL,
	[ShipmentMode] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[ShipmentType] [int] NOT NULL,
	[RiskType] [int] NOT NULL,
	[Leaf] [nvarchar](50) NULL,
	[Pouch] [nvarchar](50) NULL,
	[Content] [nvarchar](200) NULL,
	[Remarks] [nvarchar](max) NULL,
	[ModifiedDate] [timestamp] NOT NULL,
 CONSTRAINT [Pk_BookingId] PRIMARY KEY CLUSTERED 
(
	[BookingId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [Uk_BookingAwbNumber] UNIQUE NONCLUSTERED 
(
	[AwbNumber] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VE_BookingCost]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VE_BookingCost](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[CountryId] [int] NOT NULL,
	[StateId] [int] NOT NULL,
	[CityId] [int] NOT NULL,
	[CourierId] [int] NOT NULL,
	[ProductId] [int] NOT NULL,
	[TransportMode] [int] NOT NULL,
	[WeightId] [int] NOT NULL,
	[Cost] [decimal](8, 2) NOT NULL,
	[LocationType] [int] NOT NULL,
 CONSTRAINT [PK_BookingCost] PRIMARY KEY CLUSTERED 
(
	[Id] ASC,
	[CountryId] ASC,
	[StateId] ASC,
	[CityId] ASC,
	[CourierId] ASC,
	[ProductId] ASC,
	[TransportMode] ASC,
	[WeightId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VE_Client]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VE_Client](
	[ClientId] [int] IDENTITY(1,1) NOT NULL,
	[Salutation] [int] NULL,
	[FirstName] [nvarchar](24) NOT NULL,
	[LastName] [nvarchar](24) NULL,
	[Company] [nvarchar](50) NULL,
	[Email] [nvarchar](50) NULL,
	[Mobile] [nvarchar](15) NULL,
	[Phone] [nvarchar](15) NULL,
	[AddressLine1] [nvarchar](50) NULL,
	[AddressLine2] [nvarchar](50) NULL,
	[City] [nvarchar](24) NULL,
	[State] [int] NULL,
	[Pincode] [nvarchar](6) NULL,
	[Website] [nvarchar](max) NULL,
	[Status] [int] NULL,
	[Remarks] [nvarchar](max) NULL,
	[Last_Updated] [timestamp] NULL,
 CONSTRAINT [Pk_ClientId] PRIMARY KEY CLUSTERED 
(
	[ClientId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VE_Courier]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VE_Courier](
	[CourierId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NOT NULL,
	[Status] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[CourierId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VE_ProductMode]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VE_ProductMode](
	[ProductId] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](50) NULL,
	[Description] [nvarchar](124) NULL,
	[Status] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[ProductId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VE_Weight]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VE_Weight](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Weight] [decimal](8, 3) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [U_Pod_FrontlineCourier]    Script Date: 01-07-2020 23:03:54 ******/
CREATE UNIQUE NONCLUSTERED INDEX [U_Pod_FrontlineCourier] ON [aramaster].[FrontlineDetails]
(
	[POD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [RoleNameIndex]    Script Date: 01-07-2020 23:03:54 ******/
CREATE UNIQUE NONCLUSTERED INDEX [RoleNameIndex] ON [dbo].[AspNetRoles]
(
	[Name] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_UserId]    Script Date: 01-07-2020 23:03:54 ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserClaims]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_UserId]    Script Date: 01-07-2020 23:03:54 ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserLogins]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_RoleId]    Script Date: 01-07-2020 23:03:54 ******/
CREATE NONCLUSTERED INDEX [IX_RoleId] ON [dbo].[AspNetUserRoles]
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [IX_UserId]    Script Date: 01-07-2020 23:03:54 ******/
CREATE NONCLUSTERED INDEX [IX_UserId] ON [dbo].[AspNetUserRoles]
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
/****** Object:  Index [UserNameIndex]    Script Date: 01-07-2020 23:03:54 ******/
CREATE UNIQUE NONCLUSTERED INDEX [UserNameIndex] ON [dbo].[AspNetUsers]
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, DROP_EXISTING = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT ((0)) FOR [VolumetricWeight]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT ((0)) FOR [VolumetricWeightLength]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT ((0)) FOR [VolumetricWeightBreadth]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT ((0)) FOR [VolumetricWeightHeight]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT ((0)) FOR [ActualWeight]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT ((1)) FOR [Nos]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT ((0)) FOR [Cash]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT ((0)) FOR [Credit]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT ((0)) FOR [TotalAmount]
GO
ALTER TABLE [aramaster].[ConsignmentDetail] ADD  DEFAULT (NULL) FOR [LeafOwner]
GO
ALTER TABLE [aramaster].[webpages_Membership] ADD  DEFAULT ((0)) FOR [IsConfirmed]
GO
ALTER TABLE [aramaster].[webpages_Membership] ADD  DEFAULT ((0)) FOR [PasswordFailuresSinceLastSuccess]
GO
ALTER TABLE [dbo].[FL_BookingCost] ADD  DEFAULT ((1)) FOR [Status]
GO
ALTER TABLE [dbo].[FL_BookingWeight] ADD  DEFAULT ((1)) FOR [Status]
GO
ALTER TABLE [dbo].[FL_Courier] ADD  DEFAULT ((1)) FOR [Status]
GO
ALTER TABLE [dbo].[FL_ReceivedRelation] ADD  DEFAULT ((1)) FOR [Status]
GO
ALTER TABLE [dbo].[Master_City] ADD  DEFAULT ('0') FOR [StateId]
GO
ALTER TABLE [dbo].[Master_State] ADD  DEFAULT ('0') FOR [CountryId]
GO
ALTER TABLE [dbo].[Setting] ADD  DEFAULT ((1)) FOR [Status]
GO
ALTER TABLE [dbo].[VE_Booking] ADD  DEFAULT ((0)) FOR [IsVolume]
GO
ALTER TABLE [dbo].[VE_Booking] ADD  DEFAULT ((0)) FOR [TransportMode]
GO
ALTER TABLE [dbo].[VE_Booking] ADD  DEFAULT ((0)) FOR [ShipmentMode]
GO
ALTER TABLE [dbo].[VE_Booking] ADD  DEFAULT ((0)) FOR [ProductId]
GO
ALTER TABLE [dbo].[VE_Booking] ADD  DEFAULT ((0)) FOR [ShipmentType]
GO
ALTER TABLE [dbo].[VE_Booking] ADD  DEFAULT ((0)) FOR [RiskType]
GO
ALTER TABLE [dbo].[VE_BookingCost] ADD  DEFAULT ((0)) FOR [ProductId]
GO
ALTER TABLE [dbo].[VE_BookingCost] ADD  DEFAULT ((1)) FOR [LocationType]
GO
ALTER TABLE [dbo].[VE_Client] ADD  DEFAULT ((1)) FOR [Status]
GO
ALTER TABLE [dbo].[VE_Courier] ADD  DEFAULT ((1)) FOR [Status]
GO
ALTER TABLE [dbo].[VE_ProductMode] ADD  DEFAULT ((1)) FOR [Status]
GO
ALTER TABLE [aramaster].[ConsignmentDetail]  WITH CHECK ADD  CONSTRAINT [fk_ClientId] FOREIGN KEY([ClientId])
REFERENCES [aramaster].[UserProfile] ([UserId])
GO
ALTER TABLE [aramaster].[ConsignmentDetail] CHECK CONSTRAINT [fk_ClientId]
GO
ALTER TABLE [aramaster].[UserDetail]  WITH CHECK ADD  CONSTRAINT [fk_UserDetailId] FOREIGN KEY([UserId])
REFERENCES [aramaster].[UserProfile] ([UserId])
GO
ALTER TABLE [aramaster].[UserDetail] CHECK CONSTRAINT [fk_UserDetailId]
GO
ALTER TABLE [dbo].[AspNetUserClaims]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserClaims] CHECK CONSTRAINT [FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserLogins]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserLogins] CHECK CONSTRAINT [FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[AspNetRoles] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetRoles_RoleId]
GO
ALTER TABLE [dbo].[AspNetUserRoles]  WITH CHECK ADD  CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[AspNetUsers] ([Id])
ON DELETE CASCADE
GO
ALTER TABLE [dbo].[AspNetUserRoles] CHECK CONSTRAINT [FK_dbo.AspNetUserRoles_dbo.AspNetUsers_UserId]
GO
ALTER TABLE [dbo].[FL_BookingCost]  WITH CHECK ADD  CONSTRAINT [Fkey_CourierBooking] FOREIGN KEY([Courier])
REFERENCES [dbo].[FL_Courier] ([CourierId])
GO
ALTER TABLE [dbo].[FL_BookingCost] CHECK CONSTRAINT [Fkey_CourierBooking]
GO
ALTER TABLE [dbo].[FL_BookingCost]  WITH CHECK ADD  CONSTRAINT [Fkey_WeightBooking] FOREIGN KEY([Weight])
REFERENCES [dbo].[FL_BookingWeight] ([WeightId])
GO
ALTER TABLE [dbo].[FL_BookingCost] CHECK CONSTRAINT [Fkey_WeightBooking]
GO
ALTER TABLE [dbo].[FL_CourierDetail]  WITH CHECK ADD  CONSTRAINT [FK_CourierId] FOREIGN KEY([Courier])
REFERENCES [dbo].[FL_Courier] ([CourierId])
GO
ALTER TABLE [dbo].[FL_CourierDetail] CHECK CONSTRAINT [FK_CourierId]
GO
ALTER TABLE [dbo].[FL_CourierDetail]  WITH CHECK ADD  CONSTRAINT [FK_DeliveryStatus] FOREIGN KEY([ShipmentStatus])
REFERENCES [dbo].[FL_Status] ([StatusId])
GO
ALTER TABLE [dbo].[FL_CourierDetail] CHECK CONSTRAINT [FK_DeliveryStatus]
GO
ALTER TABLE [dbo].[FL_CourierDetail]  WITH CHECK ADD  CONSTRAINT [FK_RelationId] FOREIGN KEY([ReceivedPersonRelation])
REFERENCES [dbo].[FL_ReceivedRelation] ([RelationId])
GO
ALTER TABLE [dbo].[FL_CourierDetail] CHECK CONSTRAINT [FK_RelationId]
GO
ALTER TABLE [dbo].[FL_CourierStatus]  WITH CHECK ADD  CONSTRAINT [FK_CourierDetailsId] FOREIGN KEY([CourierId])
REFERENCES [dbo].[FL_CourierDetail] ([Id])
GO
ALTER TABLE [dbo].[FL_CourierStatus] CHECK CONSTRAINT [FK_CourierDetailsId]
GO
ALTER TABLE [dbo].[FL_CourierStatus]  WITH CHECK ADD  CONSTRAINT [FK_StatusId] FOREIGN KEY([StatusId])
REFERENCES [dbo].[FL_Status] ([StatusId])
GO
ALTER TABLE [dbo].[FL_CourierStatus] CHECK CONSTRAINT [FK_StatusId]
GO
ALTER TABLE [dbo].[Master_City]  WITH CHECK ADD  CONSTRAINT [Fk_StateId] FOREIGN KEY([StateId])
REFERENCES [dbo].[Master_State] ([Id])
GO
ALTER TABLE [dbo].[Master_City] CHECK CONSTRAINT [Fk_StateId]
GO
ALTER TABLE [dbo].[Master_State]  WITH CHECK ADD  CONSTRAINT [Fk_CountryId] FOREIGN KEY([CountryId])
REFERENCES [dbo].[Master_Country] ([Id])
GO
ALTER TABLE [dbo].[Master_State] CHECK CONSTRAINT [Fk_CountryId]
GO
ALTER TABLE [dbo].[VE_Booking]  WITH CHECK ADD  CONSTRAINT [Fk_BookingClientId] FOREIGN KEY([ClientId])
REFERENCES [dbo].[VE_Client] ([ClientId])
GO
ALTER TABLE [dbo].[VE_Booking] CHECK CONSTRAINT [Fk_BookingClientId]
GO
ALTER TABLE [dbo].[VE_Booking]  WITH CHECK ADD  CONSTRAINT [Fk_BookingCourierId] FOREIGN KEY([CourierId])
REFERENCES [dbo].[VE_Courier] ([CourierId])
GO
ALTER TABLE [dbo].[VE_Booking] CHECK CONSTRAINT [Fk_BookingCourierId]
GO
ALTER TABLE [dbo].[VE_Booking]  WITH CHECK ADD  CONSTRAINT [Fk_BookingProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[VE_ProductMode] ([ProductId])
GO
ALTER TABLE [dbo].[VE_Booking] CHECK CONSTRAINT [Fk_BookingProductId]
GO
ALTER TABLE [dbo].[VE_BookingCost]  WITH CHECK ADD  CONSTRAINT [Fk_BookingCityId] FOREIGN KEY([CityId])
REFERENCES [dbo].[Master_City] ([Id])
GO
ALTER TABLE [dbo].[VE_BookingCost] CHECK CONSTRAINT [Fk_BookingCityId]
GO
ALTER TABLE [dbo].[VE_BookingCost]  WITH CHECK ADD  CONSTRAINT [Fk_BookingCountryId] FOREIGN KEY([CountryId])
REFERENCES [dbo].[Master_Country] ([Id])
GO
ALTER TABLE [dbo].[VE_BookingCost] CHECK CONSTRAINT [Fk_BookingCountryId]
GO
ALTER TABLE [dbo].[VE_BookingCost]  WITH CHECK ADD  CONSTRAINT [Fk_BookingStateId] FOREIGN KEY([StateId])
REFERENCES [dbo].[Master_State] ([Id])
GO
ALTER TABLE [dbo].[VE_BookingCost] CHECK CONSTRAINT [Fk_BookingStateId]
GO
ALTER TABLE [dbo].[VE_BookingCost]  WITH CHECK ADD  CONSTRAINT [Fkey_BookingCourierId] FOREIGN KEY([CourierId])
REFERENCES [dbo].[VE_Courier] ([CourierId])
GO
ALTER TABLE [dbo].[VE_BookingCost] CHECK CONSTRAINT [Fkey_BookingCourierId]
GO
ALTER TABLE [dbo].[VE_BookingCost]  WITH CHECK ADD  CONSTRAINT [Fkey_BookingProductId] FOREIGN KEY([ProductId])
REFERENCES [dbo].[VE_ProductMode] ([ProductId])
GO
ALTER TABLE [dbo].[VE_BookingCost] CHECK CONSTRAINT [Fkey_BookingProductId]
GO
ALTER TABLE [dbo].[VE_BookingCost]  WITH CHECK ADD  CONSTRAINT [Fkey_BookingWeightId] FOREIGN KEY([WeightId])
REFERENCES [dbo].[VE_Weight] ([Id])
GO
ALTER TABLE [dbo].[VE_BookingCost] CHECK CONSTRAINT [Fkey_BookingWeightId]
GO
/****** Object:  StoredProcedure [aramaster].[GetDomesticCost]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [aramaster].[GetDomesticCost]	
	AS
	BEGIN
	SELECT * FROM dbo.FLBookingCost where Shipment = '1';
END;
GO
/****** Object:  StoredProcedure [aramaster].[GetInternationalCost]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [aramaster].[GetInternationalCost]	
	AS
	BEGIN
	SELECT * FROM dbo.FLBookingCost where Shipment = '2';
END;
GO
/****** Object:  StoredProcedure [dbo].[GetBookingCost]    Script Date: 01-07-2020 23:03:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE  PROCEDURE [dbo].[GetBookingCost] 
	-- Add the parameters for the stored procedure here
	@pLocationType int,
	@pCountryId int,
	@pStateId int,
	@pCityId int,
	@pCourierId int
AS
	
BEGIN

	DECLARE @locationType int = @pLocationType ;
	DECLARE @countryId int = @pCountryId ;
	DECLARE @stateId int = @pStateId ;
	DECLARE @cityId int = @pCityId ;
	DECLARE @courierId int = @pCourierId ;



	-- Level 1 -- Group by International or Domestic
	--if @locationType IS NULL
	--	select 
	--	  case when LocationType = 1 then 'Domestic' else 'International' end as Location, 
	--	  count(LocationType) Total 
	--	from 
	--	  VE_BookingCost 
	--	group by 
	--	  LocationType;


	-- Level 2 - Group by state, city & courier

	if @locationType IS NOT null and  @countryId IS null and @stateId IS null and @cityId IS null and @courierId IS null
		select
		  0 as Id,
		  LocationType, case when LocationType = 1 then 'Domestic' else 'International' end as Location, 
		  country.Name as Country, country.Id as CountryId,
		  state.Name as State, state.Id as StateId,
		  city.Name as City, city.Id as CityId, 
		  courier.Name as Courier, courier.CourierId as CourierId, 
		  '' as Product, 0 as ProductId,
		  0 as TransportMode, 
		  0.0 as Weight,  0 as WeightId,
		  0.0 as Cost
		from 
		  VE_BookingCost bc 
		  inner join Master_Country country on country.id = CountryId 
		  inner join Master_State state on state.id = StateId 
		  inner join Master_City city on city.id = CityId 
		  inner join VE_Courier courier on courier.CourierId = bc.CourierId 
		where 
		  LocationType = @locationType 
		group by 
		  LocationType, 
		  country.Name,  country.Id,
		  state.Name, state.Id,
		  city.Name, city.Id,
		  courier.Name, courier.CourierId;
	  
	 -- Level 3 - Without Weight & Cost

	 else

		if @locationType IS NOT null and  @countryId IS NOT null and @stateId IS NOT null and @cityId IS NOT null and @courierId IS NOT null
			select 
		      bc.Id,
			  LocationType, case when LocationType = 1 then 'Domestic' else 'International' end as Location, 
			  country.Name as Country, country.Id as CountryId,
			  state.Name as State, state.Id as StateId,
			  city.Name as City, city.Id as CityId, 
			  courier.Name as Courier, courier.CourierId as CourierId,
			  product.Name as Product, product.ProductId as ProductId,
			  TransportMode, 
			  weight.Id as WeightId, weight.Weight, 
			  Cost 
			from 
			  VE_BookingCost bc 
			  inner join Master_Country country on country.id = CountryId 
			  inner join Master_State state on state.id = StateId 
			  inner join Master_City city on city.id = CityId 
			  inner join VE_Courier courier on courier.CourierId = bc.CourierId 
			  inner join VE_ProductMode product on product.ProductId = bc.ProductId 
			  inner join VE_Weight weight on weight.Id = bc.WeightId 
			where 
			  LocationType = @locationType 
			  and bc.CountryId = @countryId 
			  and bc.StateId = @stateId 
			  and bc.CityId = @cityId 
			  and bc.CourierId = @courierId ;

		 

END
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'1 - Domestic, 2 - International' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'VE_BookingCost', @level2type=N'COLUMN',@level2name=N'LocationType'
GO
USE [master]
GO
ALTER DATABASE [CouriersHubDB] SET  READ_WRITE 
GO
