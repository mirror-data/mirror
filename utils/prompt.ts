//
export const BASE_TEMPLATE = `# Postgres SQL 
Table 'Games'
  #columne_name: description
  game_date_est: 'Game date'
  game_id: ID of the game
  game_status_text: Status : Final means that the is completed
  home_team_id: ID of the home team
  visitor_team_id: ID of the visitor team
  season: year when the game occurred
  team_id_home: ID of the home team (duplicate of HOME_TEAM_ID)
  pts_home: Number of points scored by home team
  fg_pct_home: Field Goal Percentage home team
  ft_pct_home: Free Throw Percentage of the home team
  fg3_pct_home: Three Point Percentage of the home team
  ast_home: Assists of the home team
  reb_home: Rebounds of the home team
  team_id_away: ID of the away team (duplicate of VISITOR_TEAM_ID)
  pts_away: Number of points scored by away team
  fg_pct_away: Field Goal Percentage away team
  ft_pct_away: Free Throw Percentage of the away team
  fg3_pct_away: Three Point Percentage of the away team
  ast_away: Assists of the away team
  reb_away: Rebounds of the away team
  home_team_wins: If home team won the game
  
Table 'Teams'
  #columne_name: description
  league_id:
  team_id:
  min_year:
  max_year:
  abbreviation:
  nickname:
  yearfounded:
  city:
  arena:
  arenacapacity:
  owner:
  generalmanager:
  headcoach:
  dleagueaffiliation:

Table 'Games_details'
  #columne_name: description
  game_id: 'ID of the game'
  team_id: ID of the team
  team_abbreviation: 'Team\\'s abbreviation'
  player_id: ID of the player
  player_name: 'Player\\'s name'
  nickname: 'Position of the player (if nothing then he\\'s on the bench)'
  start_position: Comment
  comment: Minutes played
  min: Field Goals Made
  fgm: Field Goals Attempted
  fga: Field Goal Percentage
  fg_pct: Three Pointers Made
  fg3m: Three Pointers Attempted
  fg3a: Three Point Percentage
  fg3_pct: Free Throws Made
  ftm: Free Throws Attempted
  fta: Free Throw Percentage
  ft_pct: Offensive Rebounds
  oreb: Defensive Rebounds
  dreb: Rebounds
  reb: Assists
  ast: Steals
  stl: Blocks
  blk: Turnovers
  pto: Personal Fouls
  pf: Points
  pts: Plus/Minus
  plus_minus: Double Doubles
  
define team_id = home_team_id or visitor_team_id. 

tips: if question use team nickname, use table Teams to find the team_id.
tips: games.game_id = games_details.game_id
tips: games.home_team_id = teams.team_id
`


export const getSQLEditorPrompt = ({question, sql}: { question: string, sql: string, histories?: [] }) => {
  return `${BASE_TEMPLATE}
# Question:
# ${question}?
# Limit not more than 100 rows
---SQL---
${sql}`
}


