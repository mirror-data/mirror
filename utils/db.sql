-- LEAGUE_ID,TEAM_ID,MIN_YEAR,MAX_YEAR,ABBREVIATION,NICKNAME,YEARFOUNDED,CITY,ARENA,ARENACAPACITY,OWNER,GENERALMANAGER,HEADCOACH,DLEAGUEAFFILIATION
-- 00,1610612737,1949,2019,ATL,Hawks,1949,Atlanta,State Farm Arena,18729,Tony Ressler,Travis Schlenk,Lloyd Pierce,Erie Bayhawks
-- 00,1610612738,1946,2019,BOS,Celtics,1946,Boston,TD Garden,18624,Wyc Grousbeck,Danny Ainge,Brad Stevens,Maine Red Claws
-- 00,1610612740,2002,2019,NOP,Pelicans,2002,New Orleans,Smoothie King Center,,Tom Benson,Trajan Langdon,Alvin Gentry,No Affiliate
-- 00,1610612741,1966,2019,CHI,Bulls,1966,Chicago,United Center,21711,Jerry Reinsdorf,Gar Forman,Jim Boylen,Windy City Bulls
-- 00,1610612742,1980,2019,DAL,Mavericks,1980,Dallas,American Airlines Center,19200,Mark Cuban,Donnie Nelson,Rick Carlisle,Texas Legends
-- 00,1610612743,1976,2019,DEN,Nuggets,1976,Denver,Pepsi Center,19099,Stan Kroenke,Tim Connelly,Michael Malone,No Affiliate
-- 00,1610612745,1967,2019,HOU,Rockets,1967,Houston,Toyota Center,18104,Tilman Fertitta,Daryl Morey,Mike D'Antoni,Rio Grande Valley Vipers
-- 00,1610612746,1970,2019,LAC,Clippers,1970,Los Angeles,Staples Center,19060,Steve Ballmer,Michael Winger,Doc Rivers,Agua Caliente Clippers of Ontario
-- 00,1610612747,1948,2019,LAL,Lakers,1948,Los Angeles,Staples Center,19060,Jerry Buss Family Trust,Rob Pelinka,Frank Vogel,South Bay Lakers
-- 00,1610612748,1988,2019,MIA,Heat,1988,Miami,AmericanAirlines Arena,19600,Micky Arison,Pat Riley,Erik Spoelstra,Sioux Falls Skyforce
-- 00,1610612749,1968,2019,MIL,Bucks,1968,Milwaukee,Fiserv Forum,17500,Wesley Edens & Marc Lasry,Jon Horst,Mike Budenholzer,Wisconsin Herd
-- 00,1610612750,1989,2019,MIN,Timberwolves,1989,Minnesota,Target Center,19356,Glen Taylor,Scott Layden,Ryan Saunders,Iowa Wolves
-- 00,1610612751,1976,2019,BKN,Nets,1976,Brooklyn,Barclays Center,,Joe Tsai,Sean Marks,Kenny Atkinson,Long Island Nets
-- 00,1610612752,1946,2019,NYK,Knicks,1946,New York,Madison Square Garden,19763,Cablevision (James Dolan),Steve Mills,David Fizdale,Westchester Knicks
-- 00,1610612753,1989,2019,ORL,Magic,1989,Orlando,Amway Center,0,Rick DeVos,John Hammond,Steve Clifford,Lakeland Magic
-- 00,1610612754,1976,2019,IND,Pacers,1976,Indiana,Bankers Life Fieldhouse,18345,Herb Simon,Kevin Pritchard,Nate McMillan,Fort Wayne Mad Ants
-- 00,1610612755,1949,2019,PHI,76ers,1949,Philadelphia,Wells Fargo Center,,Joshua Harris,Elton Brand,Brett Brown,Delaware Blue Coats
-- 00,1610612756,1968,2019,PHX,Suns,1968,Phoenix,Talking Stick Resort Arena,,Robert Sarver,James Jones,Monty Williams,Northern Arizona Suns
-- 00,1610612757,1970,2019,POR,Trail Blazers,1970,Portland,Moda Center,19980,Paul Allen,Neil Olshey,Terry Stotts,No Affiliate
-- 00,1610612758,1948,2019,SAC,Kings,1948,Sacramento,Golden 1 Center,17500,Vivek Ranadive,Vlade Divac,Luke Walton,Stockton Kings
-- 00,1610612759,1976,2019,SAS,Spurs,1976,San Antonio,AT&T Center,18694,Peter Holt,Brian Wright,Gregg Popovich,Austin Spurs
-- 00,1610612760,1967,2019,OKC,Thunder,1967,Oklahoma City,Chesapeake Energy Arena,19163,Clay Bennett,Sam Presti,Billy Donovan,Oklahoma City Blue
-- 00,1610612761,1995,2019,TOR,Raptors,1995,Toronto,Scotiabank Arena,19800,Maple Leaf Sports and Entertainment,Masai Ujiri,Nick Nurse,Raptors 905
-- 00,1610612762,1974,2019,UTA,Jazz,1974,Utah,Vivint Smart Home Arena,20148,Greg Miller,Dennis Lindsey,Quin Snyder,Salt Lake City Stars
-- 00,1610612763,1995,2019,MEM,Grizzlies,1995,Memphis,FedExForum,18119,Robert Pera,Zach Kleiman,Taylor Jenkins,Memphis Hustle
-- 00,1610612764,1961,2019,WAS,Wizards,1961,Washington,Capital One Arena,20647,Ted Leonsis,Tommy Sheppard,Scott Brooks,Capital City Go-Go
-- 00,1610612765,1948,2019,DET,Pistons,1948,Detroit,Little Caesars Arena,21000,Tom Gores,Ed Stefanski,Dwane Casey,Grand Rapids Drive
-- 00,1610612766,1988,2019,CHA,Hornets,1988,Charlotte,Spectrum Center,19026,Michael Jordan,Mitch Kupchak,James Borrego,Greensboro Swarm
-- 00,1610612739,1970,2019,CLE,Cavaliers,1970,Cleveland,Quicken Loans Arena,20562,Dan Gilbert,Koby Altman,John Beilein,Canton Charge
-- 00,1610612744,1946,2019,GSW,Warriors,1946,Golden State,Chase Center,19596,Joe Lacob,Bob Myers,Steve Kerr,Santa Cruz Warriors
--     'LEAGUE_ID' text,
--     'TEAM_ID' integer,
--     'MIN_YEAR' smallint,
--     'MAX_YEAR' smallint,
--     'ABBREVIATION' varchar(3),
--     'NICKNAME' varchar(25),
--     'YEARFOUNDED' smallint,
--     'CITY' text,
--     'ARENA' text,
--     'ARENACAPACITY' text,
--     'OWNER' text,
--     'GENERALMANAGER' text,
--     'HEADCOACH' text,
--     'DLEAGUEAFFILIATION' text
CREATE TABLE Team (
    LEAGUE_ID text,
    TEAM_ID integer,
    MIN_YEAR smallint,
    MAX_YEAR smallint,
    ABBREVIATION varchar(3),
    NICKNAME varchar(25),
    YEARFOUNDED smallint,
    CITY text,
    ARENA text,
    ARENACAPACITY text,
    OWNER text,
    GENERALMANAGER text,
    HEADCOACH text,
    DLEAGUEAFFILIATION text
);

    


