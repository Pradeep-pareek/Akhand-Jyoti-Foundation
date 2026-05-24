CREATE TABLE ajf_transaction (
    transaction_id BIGINT IDENTITY(1,1) PRIMARY KEY,

    txn_id NVARCHAR(100) NULL UNIQUE,

    donor_name NVARCHAR(200) NOT NULL,
    donor_email NVARCHAR(200) NULL,
    donor_phone NVARCHAR(20) NULL,
    donor_pan NVARCHAR(20) NULL,

    amount DECIMAL(18,2) NOT NULL,

    payment_gateway NVARCHAR(50) DEFAULT 'PAYU',

    product_info NVARCHAR(255) NULL,

    payu_payment_id NVARCHAR(150) NULL,
    bank_ref_num NVARCHAR(150) NULL,

    payment_status NVARCHAR(50) NOT NULL DEFAULT 'INITIATED',
    /*
        INITIATED
        PENDING
        SUCCESS
        FAILED
        CANCELLED
        HASH_MISMATCH
        VERIFICATION_FAILED
    */

    hash_value NVARCHAR(MAX) NULL,

    request_payload NVARCHAR(MAX) NULL,
    response_payload NVARCHAR(MAX) NULL,

    gateway_response_code NVARCHAR(50) NULL,
    gateway_response_message NVARCHAR(MAX) NULL,

    success_url NVARCHAR(500) NULL,
    failure_url NVARCHAR(500) NULL,

    remarks NVARCHAR(MAX) NULL,

    created_at DATETIME NOT NULL DEFAULT GETDATE(),
    updated_at DATETIME NOT NULL DEFAULT GETDATE()
);






CREATE PROCEDURE sp_createOrder
(
    @donor_name NVARCHAR(200),
    @donor_email NVARCHAR(200),
    @donor_phone NVARCHAR(20),
    @donor_pan NVARCHAR(20),
    @amount DECIMAL(18,2),
    @product_info NVARCHAR(255) = NULL,
    @hash_value NVARCHAR(MAX) = NULL,
    @success_url NVARCHAR(500) = NULL,
    @failure_url NVARCHAR(500) = NULL,
    @request_payload NVARCHAR(MAX) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @InsertedTable TABLE
    (
        transaction_id BIGINT
    );
    DECLARE @transaction_id BIGINT;
    DECLARE @txn_id NVARCHAR(100);

    INSERT INTO ajf_transaction
    (
        donor_name,
        donor_email,
        donor_phone,
        donor_pan,
        amount,
        product_info,
        hash_value,
        success_url,
        failure_url,
        request_payload,
        payment_status,
        created_at,
        updated_at
    )
    OUTPUT INSERTED.transaction_id
    INTO @InsertedTable(transaction_id)
    VALUES
    (
        @donor_name,
        @donor_email,
        @donor_phone,
        @donor_pan,
        @amount,
        @product_info,
        @hash_value,
        @success_url,
        @failure_url,
        @request_payload,
        'INITIATED',
        GETDATE(),
        GETDATE()
    );

    SELECT TOP 1
        @transaction_id = transaction_id
    FROM @InsertedTable;


    SET @txn_id =
        'AJF'
        + CONVERT(VARCHAR(8), GETDATE(), 112)
        + RIGHT('000000' + CAST(@transaction_id AS VARCHAR), 6);

    UPDATE ajf_transaction
    SET
        txn_id = @txn_id
    WHERE transaction_id = @transaction_id;

    SELECT *
    FROM ajf_transaction
    WHERE transaction_id = @transaction_id;
END;

CREATE PROCEDURE sp_updateOrder
(
    @txn_id NVARCHAR(100),
    @payment_status NVARCHAR(50),
    @payu_payment_id NVARCHAR(150) = NULL,
    @bank_ref_num NVARCHAR(150) = NULL,

    @gateway_response_code NVARCHAR(50) = NULL,
    @gateway_response_message NVARCHAR(MAX) = NULL,

    @response_payload NVARCHAR(MAX) = NULL,

    @remarks NVARCHAR(MAX) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE ajf_transaction
    SET
        payment_status = @payment_status,
        payu_payment_id = ISNULL(@payu_payment_id, payu_payment_id),
        bank_ref_num = ISNULL(@bank_ref_num, bank_ref_num),
        gateway_response_code = ISNULL(@gateway_response_code, gateway_response_code),
        gateway_response_message = ISNULL(@gateway_response_message, gateway_response_message),
        response_payload = ISNULL(@response_payload, response_payload),
        remarks = ISNULL(@remarks, remarks),
        updated_at = GETDATE()
    WHERE txn_id = @txn_id;

    SELECT *
    FROM ajf_transaction
    WHERE txn_id = @txn_id;
END;