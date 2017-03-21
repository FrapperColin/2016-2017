import json
import sqlite3
import time
from bs4 import BeautifulSoup



conn = sqlite3.connect('assignment_3.db')

print ("Opened database successfully");



# Function definition is here
def create_table():
    conn.execute('''CREATE TABLE IF NOT EXISTS Home_university
       (id_home_univ INTEGER PRIMARY KEY,
        name_home_university TEXT NOT NULL,
        country_home TEXT NOT NULL,
        number_place_offering_home INTEGER,
        name_coordinator_home TEXT NOT NULL,
        email_coordinator_home TEXT NOT NULL);''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS Arrival_university
       (id_arrival_univ INTEGER PRIMARY KEY,
        name_arrival_university TEXT NOT NULL,
        country_arrival TEXT NOT NULL,
        number_place_offering_arrival INTEGER,
        name_coordinator_arrival TEXT,
        email_coordinator_arrival TEXT);''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS Student
       (id_student INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        surname TEXT NOT NULL,
        country TEXT NOT NULL,
        email_student TEXT NOT NULL,
        university_id INTEGER NOT NULL,
        FOREIGN KEY(university_id) REFERENCES Home_university(id_home_univ));''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS Home_course
       (id_course_home TEXT PRIMARY KEY,
        name_home_course TEXT,
        credit DECIMAL NOT NULL,
        university_id INTEGER,
        FOREIGN KEY(university_id) REFERENCES Home_university(id_home_univ));''')


    conn.execute('''CREATE TABLE IF NOT EXISTS Arrival_course
       (id_course_arrival TEXT PRIMARY KEY,
        name_arrival_course TEXT,
        credit DECIMAL NOT NULL,
        university_id INTEGER,
        FOREIGN KEY(university_id) REFERENCES Arrival_university(id_arrival_univ));''')
    
    conn.execute('''CREATE TABLE IF NOT EXISTS Learning_agreement
       (id_learning INTEGER PRIMARY KEY,
        student_id INTEGER,
        home_university_id INTEGER,
        arrival_university_id INTEGER,
        duration INTEGER,
        stage BOOLEAN,
        name_faculty TEXT NOT NULL,
        FOREIGN KEY(student_id) REFERENCES Student(id_student),
        FOREIGN KEY(home_university_id) REFERENCES Home_university(id_home_univ),
        FOREIGN KEY(arrival_university_id) REFERENCES Arrival_university (id_arrival_univ));''')


    conn.execute('''CREATE TABLE IF NOT EXISTS Have_contact
       (id_home_univ INTEGER,
        id_arrival_univ INTEGER,
        FOREIGN KEY(id_home_univ) REFERENCES Home_university(id_home_univ),
        FOREIGN KEY(id_arrival_univ) REFERENCES Arrival_university(id_arrival_univ));''')

    conn.execute('''CREATE TABLE IF NOT EXISTS Correspond
       (id_learning_agreement INTEGER,
        id_home_course TEXT,
        id_arrival_course TEXT,
        FOREIGN KEY(id_learning_agreement) REFERENCES Learning_agreement(id_learning),
        FOREIGN KEY(id_home_course) REFERENCES Home_university(id_home_univ),
        FOREIGN KEY(id_arrival_course) REFERENCES Arrival_university (id_arrival_univ));''')


    
    return


def delete_content() :
    conn.execute('''DELETE FROM Home_university ''')
    conn.execute('''DELETE FROM Arrival_university ''')
    conn.execute('''DELETE FROM Student ''')
    conn.execute('''DELETE FROM Home_course ''')
    conn.execute('''DELETE FROM Arrival_course ''')
    conn.execute('''DELETE FROM Learning_agreement ''')
    conn.execute('''DELETE FROM Have_contact ''')
    conn.execute('''DELETE FROM Correspond ''')

    return

def drop_table() :
    conn.execute('''DROP TABLE Home_university ''')
    conn.execute('''DROP TABLE Arrival_university ''')
    conn.execute('''DROP TABLE Student ''')
    conn.execute('''DROP TABLE Home_course ''')
    conn.execute('''DROP TABLE Arrival_course ''')
    conn.execute('''DROP TABLE Learning_agreement ''')
    conn.execute('''DROP TABLE Have_contact ''')
    conn.execute('''DROP TABLE Correspond ''')

    return




def insert_value():
    with open('data.json') as f:
        data = json.load(f)
        for a in data['Home_university']:
            id_home = a['id']
            name = a['name']
            country = a['country']
            place_offering = a['place_offering']
            name_coord = a['name_coordinator']
            email_coord = a['email_coordinator']
            conn.execute("INSERT INTO Home_university VALUES (?,?,?,?,?,?)", (id_home,name,country,place_offering,name_coord,email_coord,))
        for a in data['Arrival_university']:
            id_home = a['id']
            name = a['name']
            country = a['country']
            place_offering = a['place_offering']
            name_coord = a['name_coordinator']
            email_coord = a['email_coordinator']
            conn.execute("INSERT INTO Arrival_university VALUES (?,?,?,?,?,?)", (id_home,name,country,place_offering,name_coord,email_coord,))
        for a in data['Student']:
            id_ = a['id']
            name = a['name']
            surname = a['surname']
            country = a['country']
            email = a['email']
            id_home = a['id_home']
            conn.execute("INSERT INTO Student VALUES (?,?,?,?,?,?)", (id_,name,surname,country,email,id_home,))
        for a in data['Home_course']:
            id_ = a['id']
            name = a['name']
            credit = a['credit']
            id_univ = a['id_univ']
            conn.execute("INSERT INTO Home_course VALUES (?,?,?,?)", (id_,name,credit,id_univ,))
        for a in data['Arrival_course']:
            id_ = a['id']
            name = a['name']
            credit = a['credit']
            id_univ = a['id_univ']
            conn.execute("INSERT INTO Arrival_course VALUES (?,?,?,?)", (id_,name,credit,id_univ,))
        for a in data['Learning_agreement']:
            id_ = a['id']
            id_student = a['id_student']
            id_home = a['id_home']
            id_arrival = a['id_arrival']
            duration = a['duration']
            stage = a['stage']
            name_faculty = a['name_faculty']
            conn.execute("INSERT INTO Learning_agreement VALUES (?,?,?,?,?,?,?)", (id_,id_student,id_home,id_arrival,duration,stage,name_faculty,))
        for a in data['Have_contact']:
            id_home = a['id_home']
            id_arrival = a['id_arrival']
            conn.execute("INSERT INTO Have_contact VALUES (?,?)", (id_home,id_arrival,))
        for a in data['Correspond']:
            id_learning = a['id_learning']
            id_home = a['id_home_course']
            id_arrival = a['id_arrival_course']
            conn.execute("INSERT INTO Correspond VALUES (?,?,?)", (id_learning,id_home,id_arrival,))
    return



# Import data
#drop_table()
delete_content()
create_table()
start = time.time()
insert_value()
end = time.time()
print ("The data took ", end-start, " seconds")



# Question 1 : I want information about a person who study in a special university and from my own country so I can contact him/her?

def sql_question_1() :
    print("I want information about a person who study in a special university and from my own country so I can contact him/her? ","\n")
    cursor = conn.execute("SELECT name, surname, email_student FROM Student JOIN Arrival_university ON university_id = id_arrival_univ WHERE name_arrival_university = 'Linnaeus University' AND country = 'France'")
    for row in cursor:
        print ("Person = ", row[0], "    ", row[1], "    ", row[2])

    #help_1(cursor)
    print("\n")
    return

def help_1(cursor):
    with open("assignment_3.html") as file:
        htmlFile = file.read()
        soup = BeautifulSoup(htmlFile,"html.parser")
        var = "I want information about a person who study in a special university and from my own country so I can contact him/her? (example with home country = France and arrival university = Linnaeus University) "
        elm = soup.find('p')
        elm.string = var
        for i in soup.findAll('tr'):
            i.replaceWith('')

        tag_thead = soup.find('thead')
        newTr = soup.new_tag('tr')
        newTh = soup.new_tag('th')
        newTh.string = "name"
        newTh1 = soup.new_tag('th')
        newTh1.string = "surname"
        newTh2 = soup.new_tag('th')
        newTh2.string = "email_student"
        newTr.append(newTh)
        newTr.append(newTh1)
        newTr.append(newTh2)

        tag_thead.append(newTr)
        
        tag_tbody = soup.find('tbody')
        for row in cursor:
            newTr1 = soup.new_tag('tr') 
            for i in range(len(row)):
                newTd = soup.new_tag('td')
                newTd.string = row[i]
                newTr1.append(newTd)
            print ("Person = ", row[0], "    ", row[1], "    ", row[2])

        tag_tbody.append(newTr1)




    html = soup.prettify(soup.original_encoding)
    html_file = open('assignment_3.html','w')
    html_file.write(html)
    html_file.close()
    return

    
#Question2 : I don't know yet which university I wanna take but I'm sure that I wanna make an Erasmus exchanges in Dublin, I wanna know which university offer this opportunity

def sql_question_2() :
    print("I don't know yet which university I wanna take but I'm sure that I wanna make an Erasmus exchanges in Dublin, I wanna know which university offer this opportunity","\n")
    cursor = conn.execute("SELECT name_home_university, email_coordinator_home FROM Home_university JOIN Arrival_university ON id_home_univ = id_arrival_univ WHERE name_arrival_university = 'University of Dublin' ")
    for row in cursor:
        print ("Name of the university = ", row[0])
        print ("Email of the coordinator = ", row[1])


    #help_2(cursor)
    return

def help_2(cursor):
    with open("assignment_3.html") as file:
        htmlFile = file.read()
        soup = BeautifulSoup(htmlFile,"html.parser")
        var = "I don't know yet which university I wanna take but I'm sure that I wanna make an Erasmus exchanges in Dublin, I wanna know which university offer this opportunity (example with arrival university = Dublin"
        elm = soup.find('p')
        elm.string = var
        for i in soup.findAll('tr'):
            i.replaceWith('')

        tag_thead = soup.find('thead')
        newTr = soup.new_tag('tr')
        newTh = soup.new_tag('th')
        newTh.string = "University's name"
        newTh1 = soup.new_tag('th')
        newTh1.string = "Email's coordinator"
        newTr.append(newTh)
        newTr.append(newTh1)


        tag_thead.append(newTr)

        
        tag_tbody = soup.find('tbody')
        for row in cursor:
            newTr1 = soup.new_tag('tr') 
            for i in range(len(row)):
                newTd = soup.new_tag('td')
                newTd.string = row[i]
                newTr1.append(newTd)
            print ("Name of the university = ", row[0])
            print ("Email of the coordinator = ", row[1])

        tag_tbody.append(newTr1)




    html = soup.prettify(soup.original_encoding)
    html_file = open('assignment_3.html','w')
    html_file.write(html)
    html_file.close()
    return
    

def sql_question_2_bis() :
    print("Same as previous question but I wanna know how many place the university offer? ","\n")
    cursor = conn.execute("SELECT name_home_university, number_place_offering_home FROM Home_university JOIN Arrival_university ON id_home_univ = id_arrival_univ WHERE name_arrival_university = 'University of Dublin'")
    for row in cursor:
        print ("Name of the university = ", row[0])
        print ("Number of place = ", row[1])


    #help_2_bis(cursor)
        

    print("\n")
    return

def help_2_bis(cursor):
    with open("assignment_3.html") as file:
        htmlFile = file.read()
        soup = BeautifulSoup(htmlFile,"html.parser")
        var = "I don't know yet which university I wanna take but I'm sure that I wanna make an Erasmus exchanges in Dublin, I wanna know which university offer this opportunity and how many places there is ? ( example with arrival university = Dublin"
        elm = soup.find('p')
        elm.string = var
        for i in soup.findAll('tr'):
            i.replaceWith('')

        tag_thead = soup.find('thead')
        newTr = soup.new_tag('tr')
        newTh = soup.new_tag('th')
        newTh.string = "University's name"
        newTh1 = soup.new_tag('th')
        newTh1.string = "Number of place"
        newTr.append(newTh)
        newTr.append(newTh1)

        tag_thead.append(newTr)
        
        tag_tbody = soup.find('tbody')
        for row in cursor:
            newTr1 = soup.new_tag('tr') 
            for i in range(len(row)):
                newTd = soup.new_tag('td')
                newTd.string = str(row[i])
                newTr1.append(newTd)
        print ("Name of the university = ", row[0])
        print ("Number of place = ", row[1])
        
        tag_tbody.append(newTr1)




    html = soup.prettify(soup.original_encoding)
    html_file = open('assignment_3.html','w')
    html_file.write(html)
    html_file.close()
    return


#I wanna know which course took a special user during his Erasmus Exchanges

def sql_question_3() :
    print("I wanna know which course took a special user during his Erasmus Exchanges (example with name = Colin) ","\n")
    cursor = conn.execute("SELECT DISTINCT name_arrival_course FROM Student JOIN Learning_agreement ON id_student = student_id JOIN Correspond ON id_learning = id_learning_agreement JOIN Arrival_course ON id_arrival_course = id_course_arrival WHERE name = 'Colin'")
    for row in cursor:
        print ("Course = ", row[0])


    #help_3(cursor)
    
    print("\n")
    return


def help_3(cursor):
    with open("assignment_3.html") as file:
        htmlFile = file.read()
        soup = BeautifulSoup(htmlFile,"html.parser")
        var = "I wanna know which course took a special user during his Erasmus Exchanges ? (example with name = Colin "
        elm = soup.find('p')
        elm.string = var
        for i in soup.findAll('tr'):
            i.replaceWith('')
        tag_thead = soup.find('thead')
        newTr = soup.new_tag('tr')
        newTh = soup.new_tag('th')
        newTh.string = "Course"
        newTr.append(newTh)

        tag_thead.append(newTr)
        
        tag_tbody = soup.find('tbody')
        for row in cursor:
            newTr1 = soup.new_tag('tr') 
            newTd = soup.new_tag('td')
            newTd.string = row[0]
            newTr1.append(newTd)
            print ("Course = ", row[0])
            tag_tbody.append(newTr1)




    html = soup.prettify(soup.original_encoding)
    html_file = open('assignment_3.html','w')
    html_file.write(html)
    html_file.close()
    return


#Question4 : Which person make a stage more than one year and in which faculty he/she took? 

def sql_question_4() :
    print("Which person make a stage more than one year and in which faculty ? ","\n")
    cursor = conn.execute("SELECT name, surname , email_student,name_faculty FROM Student JOIN Learning_agreement ON id_student = student_id WHERE stage = 'true' AND duration > 12")
    for row in cursor:
        print (" Person  = ", row[0], "    ", row[1], "    ", row[2], "    ", row[3])

    #help_4(cursor)

    print("\n")
    return


def help_4(cursor):
    with open("assignment_3.html") as file:
        htmlFile = file.read()
        soup = BeautifulSoup(htmlFile,"html.parser")
        var = "Which person make a stage more than one year and which faculty ? "
        elm = soup.find('p')
        elm.string = var
        for i in soup.findAll('tr'):
            i.replaceWith('')
        tag_thead = soup.find('thead')
        newTr = soup.new_tag('tr')
        newTh = soup.new_tag('th')
        newTh.string = "Name"
        newTh1 = soup.new_tag('th')
        newTh1.string = "Surname"
        newTh2 = soup.new_tag('th')
        newTh2.string = "Email_student"
        newTh3 = soup.new_tag('th')
        newTh3.string = "Name_faculty"
        newTr.append(newTh)
        newTr.append(newTh1)
        newTr.append(newTh2)
        newTr.append(newTh3)

        tag_thead.append(newTr)
        
        tag_tbody = soup.find('tbody')
        for row in cursor:
            newTr1 = soup.new_tag('tr') 
            for i in range(len(row)):
                newTd = soup.new_tag('td')
                newTd.string = str(row[i])
                newTr1.append(newTd)
        print (" Person  = ", row[0], "    ", row[1], "    ", row[2], "    ", row[3])

        
        tag_tbody.append(newTr1)



    html = soup.prettify(soup.original_encoding)
    html_file = open('assignment_3.html','w')
    html_file.write(html)
    html_file.close()
    return


#Question5 : I wanna information about the people who are in the same faculty as mine and where they make their Erasmus

def sql_question_5() :
    print("I wanna information about the people who are in the same faculty as mine and where they make their Erasmus (example with faculty of psychology)","\n")
    cursor = conn.execute("SELECT name_arrival_university, country_arrival, email_coordinator_arrival FROM Arrival_university JOIN Learning_agreement ON id_arrival_univ = arrival_university_id WHERE name_faculty ='Faculty of psychology'")
    for row in cursor :
        print ("Information about the university  = ", row[0], "  ", row[1], "   ", row[2])

    #help_5(cursor)

    print("\n")
    return

def help_5(cursor):
    with open("assignment_3.html") as file:
        htmlFile = file.read()
        soup = BeautifulSoup(htmlFile,"html.parser")
        var = "I wanna information about the people who are in the same faculty as mine and where they make their Erasmus (example with faculty of psychology) "
        elm = soup.find('p')
        elm.string = var
        for i in soup.findAll('tr'):
            i.replaceWith('')
        tag_thead = soup.find('thead')
        newTr = soup.new_tag('tr')
        newTh = soup.new_tag('th')
        newTh.string = "Name arrival university"
        newTh1 = soup.new_tag('th')
        newTh1.string = "Country arrival"
        newTh2 = soup.new_tag('th')
        newTh2.string = "Email_coordinator"
        newTr.append(newTh)
        newTr.append(newTh1)
        newTr.append(newTh2)

        tag_thead.append(newTr)
        
        tag_tbody = soup.find('tbody')
        for row in cursor:
            newTr1 = soup.new_tag('tr') 
            for i in range(len(row)):
                newTd = soup.new_tag('td')
                newTd.string = str(row[i])
                newTr1.append(newTd)
        print ("Information about the university  = ", row[0], "  ", row[1], "   ", row[2])

        
        tag_tbody.append(newTr1)



    html = soup.prettify(soup.original_encoding)
    html_file = open('assignment_3.html','w')
    html_file.write(html)
    html_file.close()
    return

sql_question_1()
sql_question_2()
sql_question_2_bis()
sql_question_3()
sql_question_4()
sql_question_5()


conn.commit()

conn.close()






