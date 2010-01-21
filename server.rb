#!/usr/local/bin/ruby
require 'Logger'

if ARGV.size < 1
  puts "./server.rb <development log>"
  exit 1
end

# must fork before we become a sinatra app
pid = fork
if pid.nil?
  #child
  logger = Logger.new('development.log')
  logger.level = Logger::INFO
  
  require 'watcher'
  watch = Watcher.new(logger)
  watch.set_file './public/out'
  watch.set_db 'profile.db'
  watch.run ARGV[0], 1
else
  Process.detach(pid)
  
  require 'rubygems'
  require 'sinatra'
  require 'erb'
  require 'Json'
  require 'sqlite3'
  
  set :db, SQLite3::Database.new( 'profile.db' )
  set :json_type, 'text/plain'

  get '/' do
    erb :index
  end
  
  get '/actions.json' do
    content_type options.json_type
    
    rows = []
    options.db.execute("select id, action, date, datetime(date,'unixepoch'), total_time_ms, sql_count, longest_sql_ms, parameters from profile order by date;") do |row|
      x = {
        id: row[0],
        action: row[1],
        date_number: row[2],
        date: row[3],
        total_time_ms: row[4],
        sql_count: row[5],
        longest_sql_ms: row[6],
        parameters: row[7]
      }
      rows.push x
    end
    
    rows.to_json
  end
  
  get '/sql/:id.json' do
    content_type options.json_type
    puts "ID: #{params[:id]}"
    
    # rows = []
    options.db.execute("select * from sql where profile = ?", params[:id]).to_json
    # rows.to_json
  end
  
  get '/sql_summary/:id.json' do
    content_type options.json_type
    
    rows = []
    options.db.execute("select count(*), max(time_ms), avg(time_ms), query from sql where profile = 2 group by query;") do |row|
      x = {
        count: row[0],
        max_time_ms: rows[1],
        avg_time_ms: rows[2],
        query: rows[3]
      }
      rows.push x
    end
    rows.to_json
  end
end