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
  watch.run ARGV[0], 1
else
  Process.detach(pid)
  
  require 'rubygems'
  require 'sinatra'
  require 'erb'

  get '/' do
    erb :index
  end
end