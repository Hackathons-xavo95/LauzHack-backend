DROP FUNCTION check_delay(
  line_id TEXT, table_time TEXT
);

CREATE OR REPLACE FUNCTION check_delay(
  line_id TEXT, table_time TEXT
)
  RETURNS TIMESTAMP
AS $$
DECLARE

  hours_late TEXT;
  mins_late TIMESTAMP;

BEGIN

  IF NOT exists(SELECT *
                FROM public.delay
                WHERE public.delay.linien_id = 1731
                AND (date_part('hour', public.delay.ankunftszeit) = 17
                  AND date_part('minute', public.delay.ankunftszeit) = 59))
  THEN
    RAISE EXCEPTION 'No delay';
  END IF;

  SELECT *
                FROM public.delay
                WHERE public.delay.linien_id = 1731
                AND (date_part('hour', public.delay.ankunftszeit) = 17
                  AND date_part('minute', public.delay.ankunftszeit) = 59);

  /*hours_late = date_part('hour', public.delay.an_prognose) - date_part('hour', public.delay.ankunftszeit);*/
  /*mins_late = date_part('minute', public.delay.an_prognose) - date_part('minute', public.delay.ankunftszeit);*/

  RETURN SETOF public.delay as 'SELECT *
                FROM public.delay
                WHERE public.delay.linien_id = 1731
                AND (date_part(''hour'', public.delay.ankunftszeit) = 17
                  AND date_part(''minute'', public.delay.ankunftszeit) = 59);' language 'sql';

END;
$$ LANGUAGE plpgsql;