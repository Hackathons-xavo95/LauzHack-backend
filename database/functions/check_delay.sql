create function check_delay(INT, INT, INT) RETURNS SETOF public.delay as 'SELECT *
                FROM public.delay
                WHERE public.delay.linien_id = $1
                AND (date_part(''hour'', public.delay.ankunftszeit) = $2
                  AND date_part(''minute'', public.delay.ankunftszeit) = $3);' language 'sql';