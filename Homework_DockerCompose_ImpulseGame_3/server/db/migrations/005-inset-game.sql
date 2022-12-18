INSERT INTO game (id_game_type, id_complexity, id_file)
VALUES (
    (SELECT id_game_type FROM game_type WHERE name = N'Ударения'),
    (SELECT id_complexity FROM complexity WHERE complexity_kind = 1),
    null
)

INSERT INTO game (id_game_type, id_complexity, id_file)
VALUES (
    (SELECT id_game_type FROM game_type WHERE name = N'Ударения'),
    (SELECT id_complexity FROM complexity WHERE complexity_kind = 2),
    null
)