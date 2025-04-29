BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] INT NOT NULL IDENTITY(1,1),
    [email] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Vehicles] (
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
    [createdAt] DATETIME2 NOT NULL CONSTRAINT [Vehicles_createdAt_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedAt] DATETIME2 NOT NULL,
    CONSTRAINT [Vehicles_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Vehicles_vin_key] UNIQUE NONCLUSTERED ([vin])
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
