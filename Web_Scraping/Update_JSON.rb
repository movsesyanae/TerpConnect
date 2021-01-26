require "json"
require 'rubygems'


file = File.read('new_classes.json')
data_hash = JSON.parse(file)
puts data_hash.class
data_hash.keys.each do |key| 
    array = data_hash[key]
    if array.include? 'Instructor: TBA' then 
        data_hash[key].delete('Instructor: TBA')
        data_hash[key].push('Unknown')
    elsif array.length == 0 then 
        data_hash[key].push('Unknown')
    end
end
puts data_hash

# File.write('classes_2.json', JSON.dump({}))
File.write('new_updated_classes.json', JSON.dump(data_hash))

         

