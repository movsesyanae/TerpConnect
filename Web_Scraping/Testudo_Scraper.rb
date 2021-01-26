require 'rubygems'
require 'httparty'
require 'nokogiri'
require "json"

class Testudo
    include HTTParty
    base_uri "https://app.testudo.umd.edu/soc"

    def create_majors_list 
        html = self.class.get('/')
        html_doc = Nokogiri::HTML(html)
        @majors_list = []
        major_wrapper_list = html_doc.xpath("//*[@class=\"course-prefix row\"]")
        major_wrapper_list.each do |major_wrapper| 
            @majors_list.push(major_wrapper.children[1].children[1].content)
        end
        @majors_list
    end

    def get_all_classes(term_id) 
        course_hash = {}
        majors_list = create_majors_list
        majors_list.each do |major_id|
            get_classes(major_id, term_id, course_hash)
        end
        course_hash
    end


    def get_classes(major_id, term_id, course_hash)
        end_point = "/#{term_id}/#{major_id}"
        puts end_point
        raw_html = self.class.get(end_point)
        noko_html = Nokogiri::HTML(raw_html)
        course_wrapper_list = noko_html.xpath("//div[@class=\"courses-container\"]")
        course_wrapper_list.children.each do |course| 
            name = course.attributes["id"]
            if name != NIL then 
                name = name.to_s
                course_hash[name] = (get_professors_for_course(name, term_id))
                # puts name + " " + course_hash[name]
            end
        end
        puts course_hash
        course_hash
    end

    def get_professors_for_course(course_id, term_id) 
        professors = []
        end_point = "/search?courseId=#{course_id}&sectionId=&termId=#{term_id}&_openSectionsOnly=on&creditCompare=&credits=&courseLevelFilter=ALL&instructor=&_facetoface=on&_blended=on&_online=on&courseStartCompare=&courseStartHour=&courseStartMin=&courseStartAM=&courseEndHour=&courseEndMin=&courseEndAM=&teachingCenter=ALL&_classDay1=on&_classDay2=on&_classDay3=on&_classDay4=on&_classDay5=on"
        raw_html = self.class.get(end_point)
        noko_html = Nokogiri::HTML(raw_html)
        # puts noko_html
        professor_wrapper_list = noko_html.xpath("//*[@class=\"section-instructor\"]")
        professor_wrapper_list.children.each do |professor_wrapper| 
            if professor_wrapper.is_a?(Nokogiri::XML::Element) then 
                professor = professor_wrapper.content
            else 
                professor = professor_wrapper.to_s
            end
            if !professors.include? professor then 
                professors.push(professor)
            end
        end
        professors

    end

end

soc = Testudo.new
# puts soc.create_majors_list
class_hash = soc.get_all_classes("202101")
puts class_hash.keys.length
# class_hash = {}
# class_hash["CMSC351"] = ["Kruskal"]
File.write('new_classes.json', JSON.dump(class_hash))
# puts soc.get_classes("MATH","202101")
# soc.get_professors_for_course("CMSC351","202101")