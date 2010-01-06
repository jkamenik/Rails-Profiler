require 'json'

class Watcher
  def initialize
    @actions = {}
  end

  def set_file(file)
    @log_to = file
  end

  def run(file, interval=1)
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
           # there is something outstanding to log
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

         if interval > 0
           sleep interval
         else
           if globals[:last_call] && !alreadyLogged
             # there is something outstanding to log
             log_process globals, locals
             alreadyLogged = true
           end
           break
         end
       end
     end
  end

private
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

  def new_locals
    return {
      time: nil,
      is_sql: false,
      continue_sql: false,
      is_process: false,
      match: false
    }
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
      File.open("#{@log_to}.json",'w') do |f|
        f.write @actions.to_json
        f.write "\n"
      end
    
      File.open("#{@log_to}.csv",'w') do |f|
        f.write "Action\tparams\tdate\ttotal time (ms)\tsql count\tlongest sql (ms)\n"
        @actions.each do |k,v|
          v.each do |x|
            f.write "#{k}\t#{x[:last_params]}\t#{x[:date]}\t#{x[:total_time]}\t#{x[:sql_count]}\t#{x[:longest_time]}\n"
            if x[:sql]
              f.write "\tTime (ms)\tSql\n"
              sorted = x[:sql].sort {|x,y| x[:query] <=> y[:query]}
              sorted.each do |y|
                f.write "\t#{y[:time]}\t#{y[:query]}\n"
              end
            end
          end
        end
      end
    end
  end
end
