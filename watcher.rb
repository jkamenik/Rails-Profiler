@actions = {}
@log_to = nil

def new_locals
  return {
    time: nil,
    is_sql: false,
    continue_sql: false,
    is_process: false,
    match: false
  }
end

def new_globals
  return {
    last_call: nil,
    last_params: 'None',
    date: nil,
    total_time: 0,
    sql_count: 0,
    longest_time: 0,
    last_sql: nil,
    last_sql_time: 0
  }
end

def tail(file, interval=1)
   raise "Illegal interval #{interval}" if interval < 0

   File.open(file) do |io|
     #things that need to stay between loops
     globals = new_globals
     
     #things that need to reset between loops
     locals = new_locals
     count = 0
     alreadyLogged = false
     loop do
       puts "loop #{count}"
       if globals[:last_call] && !alreadyLogged
         # there is something outstanding that to log
         log_process globals, locals
         alreadyLogged = true
       end
       
       while ( line = io.gets )
         locals = new_locals
         
         if line =~ /Processing ([a-zA-Z]+)#([a-zA-Z0-9_]+)/
           log_process globals, locals if globals[:last_call] && !alreadyLogged
           globals = new_globals
           globals[:last_call] = "#{$1} -> #{$2}"
           # in case there is no time
           line =~ /at (\d+-\d+-\d+ \d+:\d+:\d+)/
           globals[:date] = $1
           locals[:match] = true
         end
         if line =~ /Parameters: ({.*})/
           globals[:last_params] = $1
           locals[:match] = true
         end
         if line =~ /\(([0-9]+\.[0-9]+)ms\)/
           locals[:time] = $1.to_f
           globals[:total_time] = locals[:time] + globals[:total_time]
           globals[:longest_time] = [globals[:longest_time],locals[:time]].max
           locals[:match] = true
         end
         if line =~ /(SQL\s)|(SET|SELECT|SHOW|CREATE|UPDATE|DELETE)/
           log_sql globals, locals if globals[:last_sql]
           locals[:is_sql] = true
           locals[:match]  = true
           x = line.gsub(/[[:cntrl:]]/,'')
           x =~ /((SET|SELECT|SHOW|CREATE|UPDATE|DELETE) [[:print:]]*)[\s\[]/
           globals[:last_sql] = $1
           globals[:last_sql_time] = locals[:time]
           globals[:sql_count] += 1
         end
         
         # if !locals[:is_sql] && !locals[:match]
         #   locals[:continue_sql] = true
         #   globals[:last_sql] += line
         #   globals[:last_sql] = globals[:last_sql].gsub(/\n/,'')
         # end
         
         alreadyLogged = false
       end
       
       count += 1
         
       # uncomment next to watch what is happening
       # puts "-"
       sleep interval
     end
   end
end

def log_sql(globals, locals)
  # puts "SQL: #{globals[:last_sql]}"
  # puts "Time: #{globals[:last_sql_time]}"
  # puts "------------------------"
  
  globals[:sql] = [] if !globals[:sql]
  
  x = {
    query: globals[:last_sql],
    time: globals[:last_sql_time]
  }
  globals[:sql].push x
  
  globals[:last_sql] = nil
  globals[:last_sql_time] = 0
end

def log_process(globals, locals)
  puts "log_process"
  log_sql globals, locals if globals[:last_sql]
  
  # puts "Summary: #{globals[:last_call]}"
  # puts "Params: #{globals[:last_params]}"
  # puts "Longest Query: #{globals[:longest_time]} ms"
  # puts "Total Time: #{globals[:total_time]} ms"
  # puts "Total SQL calls: #{globals[:sql_count]}"
  # puts "======================="
  
  idx = globals[:last_call]
  
  @actions[idx] = [] if !@actions[idx]
  
  globals.delete(:last_sql)
  globals.delete(:last_sql_time)

  @actions[idx].push globals
  
  # puts @actions.to_s
  
  if @log_to
    File.open(@log_to,'w') do |f|
      f.write @actions.to_s
    end
  end
end


if ARGV.count < 2
  puts "ruby watcher.rb <interval> <read> [<write>]"
  puts "  interval: number of seconds to wake up and attempt to read <read>"
  puts "  read:     log file to read benchmark data from"
  puts "  write:    log file to write json data to"
  
  exit 1
end

@log_to = ARGV[2] if ARGV[2]

tail(ARGV[1],ARGV[0].to_i)
