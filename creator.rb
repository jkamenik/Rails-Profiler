require 'sqlite3'

module Creator
  
def Creator.create(file)

# this is the contract for the watcher and the server

db = SQLite3::Database.new( file )

db.execute("drop table if exists profile")
db.execute("drop table if exists sql")

sql = <<SQL
create table profile (
  id INTEGER PRIMARY KEY ASC,
  controller TEXT,
  action TEXT,
  date INTEGER,
  parameters TEXT,
  total_time_ms REAL,
  sql_count INTEGER,
  longest_sql_ms REAL
);
SQL
db.execute(sql)

sql = <<SQL
create table sql (
  id INTEGER PRIMARY KEY ASC,
  profile INTEGER references profile (rowid) on delete cascade,
  time_ms REAL,
  query TEXT
)
SQL
db.execute(sql)

#now return the data for other's use
db

end

end