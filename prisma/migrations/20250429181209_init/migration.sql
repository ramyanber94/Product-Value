/*
  Warnings:

  - You are about to drop the `Vehicles` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[Vehicles];

-- CreateTable
CREATE TABLE [dbo].[Vehicle] (
    [id] INT NOT NULL IDENTITY(1,1),
    [make] NVARCHAR(1000),
    [model] NVARCHAR(1000),
    [year] INT,
    [doors] NVARCHAR(1000),
    [seats] NVARCHAR(1000),
    [hp] NVARCHAR(1000),
    [drive] NVARCHAR(1000),
    [fuel] NVARCHAR(1000),
    [transmission] NVARCHAR(1000),
    [body] NVARCHAR(1000),
    [trim] NVARCHAR(1000),
    [vin] NVARCHAR(1000) NOT NULL,
    [engine] NVARCHAR(1000),
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Vehicle_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Vehicle_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Vehicle_vin_key] UNIQUE NONCLUSTERED ([vin])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
