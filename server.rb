#!/usr/local/bin/ruby

if ARGV.size < 1
  puts "./server.rb <development log>"
  exit 1
end

# must fork before we become a sinatra app
puts 'test'
pid = fork
if pid.nil?
  #child
  require 'watcher'
  watch = Watcher.new
  watch.set_file './public/out'
  watch.run ARGV[0], 1
else
  Process.detach(pid)
  
  require 'rubygems'
  require 'sinatra'

  get '/' do
    'This is where things go'
  end
end