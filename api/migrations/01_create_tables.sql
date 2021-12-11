CREATE TABLE IF NOT EXISTS currency (
    code                   CHAR(3) PRIMARY KEY,
    symbol                 VARCHAR(10),
    decimal_digits         INT NOT NULL,
    country_flag           CHAR(4) NOT NULL
);

CREATE TABLE IF NOT EXISTS app_user (
    id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    display_name           VARCHAR(100) NOT NULL,
    email                  VARCHAR(255) UNIQUE NOT NULL,
    email_confirmed        BOOLEAN DEFAULT FALSE NOT NULL,
    phone                  VARCHAR(50),
    phone_confirmed        BOOLEAN DEFAULT FALSE NOT NULL,
    password_hash          VARCHAR(255) NOT NULL,
    default_currency_code  CHAR(3) REFERENCES currency(code) NOT NULL
);

CREATE TABLE IF NOT EXISTS wallet (
    id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    wallet_name            VARCHAR(100) NOT NULL,
    description            TEXT,
    funds                  BIGINT DEFAULT 0 NOT NULL,
    user_id                BIGINT REFERENCES app_user(id) ON DELETE CASCADE NOT NULL,
    currency_code          CHAR(3) REFERENCES currency(code) NOT NULL
);

CREATE TABLE IF NOT EXISTS tag (
    id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tag_name               VARCHAR(100) NOT NULL,
    user_id                BIGINT REFERENCES app_user(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_alert_transactions (
    id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transactions_value     BIGINT NOT NULL,
    alert_type             BIT(2) NOT NULL,
    time_period_multiplier INT CHECK (time_period_multiplier > 0),
    time_period            VARCHAR(5) CHECK (time_period IN ('WEEK', 'MONTH', 'YEAR', 'DAY')),
    tag_id                 BIGINT REFERENCES tag(id) ON DELETE CASCADE,
    wallet_id              BIGINT REFERENCES wallet(id) ON DELETE CASCADE,
    user_id                BIGINT REFERENCES app_user(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS user_alert_funds (
    id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    funds_value            BIGINT NOT NULL,
    alert_type             BIT(2) NOT NULL,
    wallet_id              BIGINT REFERENCES wallet(id) ON DELETE CASCADE,
    user_id                BIGINT REFERENCES app_user(id) ON DELETE CASCADE NOT NULL,
    recurring              BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS app_transaction (
    id                     BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    transaction_value      BIGINT NOT NULL,
    description            TEXT,
    transaction_timestamp  TIMESTAMP NOT NULL DEFAULT NOW(),
    location_name          VARCHAR(100),
    location_lat_lng       POINT,
    user_id                BIGINT REFERENCES app_user(id) ON DELETE CASCADE NOT NULL,
    wallet_id              BIGINT REFERENCES wallet(id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction_tags (
    transaction_id         BIGINT REFERENCES app_transaction(id) ON DELETE CASCADE,
    tag_id                 BIGINT REFERENCES tag(id) ON DELETE CASCADE,
    PRIMARY KEY(transaction_id, tag_id)
);
