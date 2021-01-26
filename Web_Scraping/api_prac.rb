require 'rubygems'
require 'httparty'
require "json"

class UMDIO
    include HTTParty
    base_uri "https://api.umd.io/v1"

    def course_list 
        self.class.get('/courses/list')
    end

    def get_professors course_id
        classes = self.class.get("/professors?course_id=" + course_id)
        puts classes
    end

end

umd_data = UMDIO.new
result = umd_data.course_list
parsed = JSON.parse(result.body)
course_hash = {}
parsed.each do |course| 
    course_id = course["course_id"]
    course_hash[course_id] = []
end
puts course_hash.keys.length

# my_hash = {}
# my_hash["CMSC351"] = "Kruskal"
# puts course_hash
# puts JSON.generate(my_hash)

# umd_data.get_professors "CMSC351"