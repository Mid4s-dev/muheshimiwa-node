-- DropForeignKey
ALTER TABLE `BursaryApplication` DROP FOREIGN KEY `BursaryApplication_voterId_fkey`;

-- DropForeignKey
ALTER TABLE `BursaryApplication` DROP FOREIGN KEY `BursaryApplication_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Voter` DROP FOREIGN KEY `Voter_userId_fkey`;

-- DropTable
DROP TABLE `BursaryApplication`;

-- DropTable
DROP TABLE `Voter`;