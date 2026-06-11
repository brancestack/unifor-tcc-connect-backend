-- AlterTable
ALTER TABLE `historico_status` MODIFY `status` ENUM('PENDENTE', 'EM_REVISAO', 'EM_CORRECAO', 'AJUSTES_NECESSARIOS', 'APROVADO', 'FECHADO') NOT NULL;

-- AlterTable
ALTER TABLE `tickets` ADD COLUMN `alunoId` INTEGER NULL,
    ADD COLUMN `bibliotecarioId` INTEGER NULL,
    ADD COLUMN `dataAtribuicao` DATETIME(3) NULL,
    MODIFY `status` ENUM('PENDENTE', 'EM_REVISAO', 'EM_CORRECAO', 'AJUSTES_NECESSARIOS', 'APROVADO', 'FECHADO') NOT NULL DEFAULT 'PENDENTE';

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `senha` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `telefone` VARCHAR(191) NULL,
    `curso` VARCHAR(191) NULL,
    `role` ENUM('ALUNO', 'BIBLIOTECARIO', 'ADMIN') NOT NULL DEFAULT 'ALUNO',
    `status` ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historico_tickets` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `versao` INTEGER NOT NULL,
    `nomeArquivo` VARCHAR(191) NOT NULL,
    `observacoes` TEXT NULL,
    `ticketId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produtividade_analytics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bibliotecarioNome` VARCHAR(191) NOT NULL,
    `concluidas` INTEGER NOT NULL DEFAULT 0,
    `emAndamento` INTEGER NOT NULL DEFAULT 0,
    `tempoMedioDias` DOUBLE NOT NULL DEFAULT 0.0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tickets` ADD CONSTRAINT `tickets_bibliotecarioId_fkey` FOREIGN KEY (`bibliotecarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historico_tickets` ADD CONSTRAINT `historico_tickets_ticketId_fkey` FOREIGN KEY (`ticketId`) REFERENCES `tickets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
