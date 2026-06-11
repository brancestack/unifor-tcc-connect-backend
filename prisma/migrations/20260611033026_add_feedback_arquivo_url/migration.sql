-- AlterTable
ALTER TABLE `feedbacks` ADD COLUMN `arquivoUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `historico_tickets` ADD COLUMN `caminho` VARCHAR(191) NULL,
    ADD COLUMN `nomeOriginal` VARCHAR(191) NULL,
    ADD COLUMN `tipo` VARCHAR(191) NULL,
    ADD COLUMN `url` VARCHAR(191) NULL;
