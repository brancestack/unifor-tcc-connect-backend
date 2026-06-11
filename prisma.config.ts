// src/config/prisma.js
require("dotenv").config();
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");
const { PrismaClient } = require("@prisma/client");

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST || "localhost",
  user: process.env.DATABASE_USER || "root",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "sistema_tcc",
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function forcarCriacaoDoBanco() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`usuarios\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`nome\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`senha\` VARCHAR(255) NOT NULL,
        \`matricula\` VARCHAR(50) NOT NULL,
        \`telefone\` VARCHAR(50) NULL,
        \`curso\` VARCHAR(255) NULL,
        \`role\` ENUM('ALUNO', 'BIBLIOTECARIO', 'ADMIN') NOT NULL DEFAULT 'ALUNO',
        \`status\` ENUM('ATIVO', 'INATIVO') NOT NULL DEFAULT 'ATIVO',
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        UNIQUE INDEX \`usuarios_email_key\`(\`email\`),
        UNIQUE INDEX \`usuarios_matricula_key\`(\`matricula\`),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`tickets\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`titulo\` VARCHAR(255) NOT NULL,
        \`descricao\` TEXT NULL,
        \`tema\` VARCHAR(255) NULL,
        \`curso\` VARCHAR(255) NULL,
        \`aluno\` VARCHAR(255) NOT NULL,
        \`status\` ENUM('PENDENTE', 'EM_REVISAO', 'EM_CORRECAO', 'AJUSTES_NECESSARIOS', 'APROVADO', 'FECHADO') NOT NULL DEFAULT 'PENDENTE',
        \`versao\` INT NOT NULL DEFAULT 1,
        \`bibliotecarioResponsavel\` VARCHAR(255) NULL,
        \`dataAtribuicao\` DATETIME(3) NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`alunoId\` INT NULL,
        \`bibliotecarioId\` INT NULL,
        FOREIGN KEY (\`alunoId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        FOREIGN KEY (\`bibliotecarioId\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE,
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`feedbacks\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`ticketId\` INT NOT NULL,
        \`bibliotecario\` VARCHAR(255) NOT NULL,
        \`comentario\` TEXT NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        FOREIGN KEY (\`ticketId\`) REFERENCES \`tickets\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`historico_status\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`ticketId\` INT NOT NULL,
        \`status\` ENUM('PENDENTE', 'EM_REVISAO', 'EM_CORRECAO', 'AJUSTES_NECESSARIOS', 'APROVADO', 'FECHADO') NOT NULL,
        \`data\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        FOREIGN KEY (\`ticketId\`) REFERENCES \`tickets\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`historico_tickets\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`versao\` INT NOT NULL,
        \`nomeArquivo\` VARCHAR(255) NOT NULL,
        \`observacoes\` TEXT NULL,
        \`ticketId\` INT NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        FOREIGN KEY (\`ticketId\`) REFERENCES \`tickets\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`produtividade_analytics\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`bibliotecarioNome\` VARCHAR(255) NOT NULL,
        \`concluidas\` INT NOT NULL DEFAULT 0,
        \`emAndamento\` INT NOT NULL DEFAULT 0,
        \`tempoMedioDias\` DOUBLE NOT NULL DEFAULT 0.0,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    console.log("🚀 [PRISMA 7] TODAS AS TABELAS DO SEU TCC FORAM VERIFICADAS/CRIADAS COM SUCESSO!");
  } catch (err) {
    console.error("❌ Erro ao inicializar tabelas via Raw SQL:", err);
  }
}

forcarCriacaoDoBanco();

module.exports = prisma;