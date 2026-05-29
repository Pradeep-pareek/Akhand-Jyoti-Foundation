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


-- ============================================================
-- Table: homepage_content
-- Stores all editable sections of the homepage
-- ============================================================

IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='homepage_content' AND xtype='U')
BEGIN
    CREATE TABLE homepage_content (
        id              INT IDENTITY(1,1) PRIMARY KEY,
        section_key     NVARCHAR(100) NOT NULL UNIQUE,  -- e.g. 'iocl_section', 'slum_section'
        section_data    NVARCHAR(MAX) NOT NULL,          -- JSON blob for that section
        updated_at      DATETIME2 DEFAULT GETDATE(),
        updated_by      NVARCHAR(100) NULL
    );
END

-- ============================================================
-- Seed default data
-- ============================================================

	-- IOCL / NIPUN Section
	IF NOT EXISTS (SELECT 1 FROM homepage_content WHERE section_key = 'iocl_section')
	BEGIN
		INSERT INTO homepage_content (section_key, section_data) VALUES (
			'iocl_section',
			N'{
				"badge": "Skills & Industry",
				"heading": "IOCL Panipat Collaboration — NIPUN Programme",
				"description": "Akhandjyoti Foundation collaborated with the Hydrocarbon Sector Skill Council at IOCL Panipat to deliver comprehensive vocational training. The NIPUN programme aimed to equip participants with the technical knowledge needed to excel in the hydrocarbon industry.",
				"outcome_text": "A group of individuals were successfully trained and empowered to contribute effectively to the hydrocarbon sector — enhancing technical skills, safety measures, and professionalism.",
				"outcome_icon": "/images/outcome-icon.png",
				"section_image": "/images/outcome-img.png",
				"cta_label": "Stand With Her",
				"cta_href": ""
			}'
		);
	END

	-- Slum Development Section
	IF NOT EXISTS (SELECT 1 FROM homepage_content WHERE section_key = 'slum_section')
	BEGIN
		INSERT INTO homepage_content (section_key, section_data) VALUES (
			'slum_section',
			N'{
				"badge": "Skills & Industry",
				"heading": "Slum Development Initiatives",
				"description": "Akhandjyoti Foundation is committed to creating awareness and driving positive change in sanitation, hygiene, education, and overall community development. We have conducted dental hygiene campaigns in Kirti Nagar and menstrual hygiene awareness drives in Noida slums to empower communities with better health practices.",
				"card1_title": "Dental Hygiene Drive",
				"card1_text": "Conducted in Kirti Nagar slum area — promoting oral health awareness and improving hygiene practices.",
				"card2_title": "Menstrual Hygiene Awareness",
				"card2_text": "Organized in Noida slums — breaking stigma and educating women about hygiene and health.",
				"section_image": "/images/skills-industry-img.png",
				"stat1_value": "3+",
				"stat1_label": "Slum Areas",
				"stat2_value": "500+",
				"stat2_label": "People Impacted",
				"stat3_value": "4",
				"stat3_label": "Campaigns"
			}'
		);
	END

	-- Arts & Culture Section
	IF NOT EXISTS (SELECT 1 FROM homepage_content WHERE section_key = 'arts_section')
	BEGIN
		INSERT INTO homepage_content (section_key, section_data) VALUES (
			'arts_section',
			N'{
				"badge": "Arts & Culture",
				"heading": "Govt Girls College Visit — Kiran Nadar Museum of Art",
				"description1": "Akhandjyoti Foundation arranged an enriching cultural visit for students of Govt Girls Inter College Noida to the Kiran Nadar Museum of Art, Noida. The initiative offered students an opportunity to explore diverse artworks and exhibitions.",
				"description2": "By facilitating this visit, Akhandjyoti Foundation aimed to inspire creativity, broaden horizons, and promote a deeper understanding and love for art among students.",
				"section_image": "/images/arts-culture-img.png",
				"tags": [
					{ "emoji": "✨", "label": "Creativity" },
					{ "emoji": "📚", "label": "Education" },
					{ "emoji": "🌱", "label": "Inspiration" },
					{ "emoji": "🎨", "label": "Cultural Exposure" }
				]
			}'
		);
	END

	IF NOT EXISTS (SELECT 1 FROM homepage_content WHERE section_key = 'sensitizing_section')
	BEGIN
		INSERT INTO homepage_content (section_key, section_data) VALUES (
			'sensitizing_section',
			N'{
				"heading": "Sensitizing Society on Menstrual Hygiene",
				"description1": "Menstruation remains a sensitive and often stigmatized topic in the lives of adolescents.",
				"description2": "Project Swecha empowers girls with knowledge and hygiene support. Our diverse range of services empowers clients to cultivate and enhance their skill sets while maintaining high standards of quality, transparency, authenticity, and productivity.",
				"cta_label": "Stand With Her",
				"cta_href": "#",
				"images": [
					"/images/sensitizing-society.png",
					"/images/skills-industry-img.png",
					"/images/arts-culture-img.png"
				]
			}'
		);
	END



    CREATE TABLE ContactUs (
    ContactID INT IDENTITY(1,1) PRIMARY KEY,

    FirstName NVARCHAR(100) NOT NULL,
    LastName NVARCHAR(100) NULL,

    Email NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20) NULL,

    Message NVARCHAR(MAX) NULL,

    IsRead BIT NOT NULL DEFAULT(0),

    CreatedDate DATETIME NOT NULL DEFAULT(GETDATE())
)


