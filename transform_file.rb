#!/usr/bin/env ruby

def capitalize(str)
	s = str.downcase
	s[0] = s[0].upcase
	s
end

def main()
	f_input = File.open(ARGV.first)
	f_output = File.open("output.txt", "w+")
	while (line = f_input.gets) do
		f_output.write capitalize(line.split(" ").first) + "\n"
	end
end

main()