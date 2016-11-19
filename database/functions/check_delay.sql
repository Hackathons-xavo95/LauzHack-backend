DROP FUNCTION check_delay(
  line_id TEXT, table_time TEXT
);

CREATE OR REPLACE FUNCTION check_delay(
  line_id TEXT, table_time TEXT
)
  RETURNS TEXT
AS $$
DECLARE

  delay_amount TEXT;

BEGIN

  IF NOT exists(SELECT
                FROM public.delay
                WHERE public.delay.linien_id = 1731
                AND (date_part('hour', public.delay.ankunftszeit) = 17
                  AND date_part('minute', public.delay.ankunftszeit) = 59))
  THEN
    RAISE EXCEPTION 'No delay';
  END IF;

  delay_amount = '5emZKMYUB9C2vT6';

  RETURN new_token;

END;
$$ LANGUAGE plpgsql;