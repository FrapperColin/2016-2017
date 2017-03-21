import json
import sqlite3
import time

conn = sqlite3.connect('./Database/assignment_2.db')
#conn = sqlite3.connect('example.db')

print ("Opened database successfully");



# Function definition is here
def create_table():
    conn.execute('''CREATE TABLE IF NOT EXISTS User
       (author TEXT PRIMARY KEY);''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS SubReddit
       (subreddit_id TEXT PRIMARY KEY,
        subreddit TEXT UNIQUE);''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS Suscribe_to
       (s_subreddit TEXT ,
        s_author TEXT ,
        FOREIGN KEY(s_subreddit) REFERENCES SubReddit(subreddit_id),
        FOREIGN KEY(s_author) REFERENCES User(author));''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS Post
       (name_post TEXT PRIMARY KEY,
        post_subreddit TEXT,
        post_author TEXT,
        FOREIGN KEY(post_subreddit) REFERENCES SubReddit(subreddit_id),
        FOREIGN KEY(post_author) REFERENCES User(author));''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS Comment
                (id_comment INTEGER PRIMARY KEY,
                 parent_id TEXT,
                 link_id TEXT,
                 created_utc TEXT NOT NULL,
                 body TEXT,
                 score INTEGER,
                 author_comment TEXT,
                 subreddit_comment TEXT,
                 post_comment TEXT,
                 FOREIGN KEY(author_comment) REFERENCES User(author),
                 FOREIGN KEY(subreddit_comment) REFERENCES SubReddit(subreddit_id),
                 FOREIGN KEY(post_comment) REFERENCES Post(name_post));''')
    print ("Table created successfully");
    
    return


def create_table_without_constraint():
    conn.execute('''CREATE TABLE IF NOT EXISTS User
       (author TEXT);''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS SubReddit
       (subreddit_id TEXT ,
        subreddit TEXT);''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS Suscribe_to
       (s_subreddit  ,
        s_author);''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS Post
       (name_post TEXT ,
        post_subreddit TEXT,
        post_author TEXT);''')

    
    conn.execute('''CREATE TABLE IF NOT EXISTS Comment
                (id_comment INTEGER ,
                 parent_id TEXT,
                 link_id TEXT,
                 created_utc TEXT,
                 body TEXT,
                 score INTEGER,
                 author_comment TEXT,
                 subreddit_comment TEXT,
                 post_comment TEXT );''')
    print ("Table created successfully");
    
    return



def base36decode(number):
    return int(number, 36)


def delete_content() :
    conn.execute('''DELETE FROM User ''')
    conn.execute('''DELETE FROM Comment ''')
    conn.execute('''DELETE FROM Post ''')
    conn.execute('''DELETE FROM SubReddit ''')
    conn.execute('''DELETE FROM Suscribe_to ''')
    return

def drop_table() :
    conn.execute('''DROP TABLE User ''')
    conn.execute('''DROP TABLE Comment ''')
    conn.execute('''DROP TABLE Post ''')
    conn.execute('''DROP TABLE SubReddit ''')
    conn.execute('''DROP TABLE Suscribe_to ''')
    return





        
def insert_value_first_file():
    with open('RC_2007-10.json') as f:
        for line in f:
            data = []
            data.append(json.loads(line))
            var2 = base36decode(data[0]["id"])
            var3 = data[0]["parent_id"]
            var4 = data[0]["link_id"]
            var5 = data[0]["created_utc"]
            var6 = data[0]["body"]
            var7 = data[0]["score"]
            var8 = data[0]["author"]
            var9 = data[0]["subreddit_id"]
            var10 = data[0]["subreddit"]
            var11 = data[0]["name"]

            conn.execute("INSERT OR IGNORE INTO User VALUES (?)", (var8,))
            conn.execute("INSERT OR IGNORE INTO SubReddit VALUES (?,?)", (var9,var10,))
            conn.execute("INSERT INTO Suscribe_to VALUES (?,?)", (var9,var8,))
            conn.execute("INSERT OR IGNORE INTO Post VALUES (?,?,?)", (var11,var9,var8,))
            conn.execute("INSERT INTO Comment VALUES (?,?,?,?,?,?,?,?,?)", (var2,var3,var4,var5,var6,var7,var8,var9,var11,))

    return



def insert_value_first_file_bis():
    with open('RC_2007-10.json') as f:
        for line in f:
            data = []
            data.append(json.loads(line))
            var2 = base36decode(data[0]["id"])
            var3 = data[0]["parent_id"]
            var4 = data[0]["link_id"]
            var5 = data[0]["created_utc"]
            var6 = data[0]["body"]
            var7 = data[0]["score"]
            var8 = data[0]["author"]
            var9 = data[0]["subreddit_id"]
            var10 = data[0]["subreddit"]
            var11 = data[0]["name"]

            conn.execute("INSERT INTO User VALUES (?)", (var8,))
            conn.execute("INSERT INTO SubReddit VALUES (?,?)", (var9,var10,))
            conn.execute("INSERT INTO Suscribe_to VALUES (?,?)", (var9,var8,))
            conn.execute("INSERT INTO Post VALUES (?,?,?)", (var11,var9,var8,))
            conn.execute("INSERT INTO Comment VALUES (?,?,?,?,?,?,?,?,?)", (var2,var3,var4,var5,var6,var7,var8,var9,var11,))

    return


def insert_value_second_file():
    with open('RC_2011-07.json') as f:
        for line in f:
            data = []
            data.append(json.loads(line))
            var2 = base36decode(data[0]["id"])
            var3 = data[0]["parent_id"]
            var4 = data[0]["link_id"]
            var5 = data[0]["created_utc"]
            var6 = data[0]["body"]
            var7 = data[0]["score"]
            var8 = data[0]["author"]
            var9 = data[0]["subreddit_id"]
            var10 = data[0]["subreddit"]
            var11 = data[0]["name"]

            conn.execute("INSERT OR IGNORE INTO User VALUES (?)", (var8,))
            conn.execute("INSERT OR IGNORE INTO SubReddit VALUES (?,?)", (var9,var10,))
            conn.execute("INSERT INTO Suscribe_to VALUES (?,?)", (var9,var8,))
            conn.execute("INSERT OR IGNORE INTO Post VALUES (?,?,?)", (var11,var9,var8,))
            conn.execute("INSERT INTO Comment VALUES (?,?,?,?,?,?,?,?,?)", (var2,var3,var4,var5,var6,var7,var8,var9,var11,))

    return



def insert_value_second_file_bis():
    with open('RC_2011-07.json') as f:
        for line in f:
            data = []
            data.append(json.loads(line))
            var2 = base36decode(data[0]["id"])
            var3 = data[0]["parent_id"]
            var4 = data[0]["link_id"]
            var5 = data[0]["created_utc"]
            var6 = data[0]["body"]
            var7 = data[0]["score"]
            var8 = data[0]["author"]
            var9 = data[0]["subreddit_id"]
            var10 = data[0]["subreddit"]
            var11 = data[0]["name"]

            conn.execute("INSERT INTO User VALUES (?)", (var8,))
            conn.execute("INSERT INTO SubReddit VALUES (?,?)", (var9,var10,))
            conn.execute("INSERT INTO Suscribe_to VALUES (?,?)", (var9,var8,))
            conn.execute("INSERT INTO Post VALUES (?,?,?)", (var11,var9,var8,))
            conn.execute("INSERT INTO Comment VALUES (?,?,?,?,?,?,?,?,?)", (var2,var3,var4,var5,var6,var7,var8,var9,var11,))

    return





def insert_value_third_file():
    with open('RC_2012-12.json') as f:
        for line in f:
            data = []
            data.append(json.loads(line))
            var2 = base36decode(data[0]["id"])
            var3 = data[0]["parent_id"]
            var4 = data[0]["link_id"]
            var5 = data[0]["created_utc"]
            var6 = data[0]["body"]
            var7 = data[0]["score"]
            var8 = data[0]["author"]
            var9 = data[0]["subreddit_id"]
            var10 = data[0]["subreddit"]
            var11 = data[0]["name"]

            conn.execute("INSERT OR IGNORE INTO User VALUES (?)", (var8,))
            conn.execute("INSERT OR IGNORE INTO SubReddit VALUES (?,?)", (var9,var10,))
            conn.execute("INSERT INTO Suscribe_to VALUES (?,?)", (var9,var8,))
            conn.execute("INSERT OR IGNORE INTO Post VALUES (?,?,?)", (var11,var9,var8,))
            conn.execute("INSERT INTO Comment VALUES (?,?,?,?,?,?,?,?,?)", (var2,var3,var4,var5,var6,var7,var8,var9,var11,))

    return


def insert_value_third_file_bis():
    with open('RC_2012-12.json') as f:
        for line in f:
            data = []
            data.append(json.loads(line))
            var2 = base36decode(data[0]["id"])
            var3 = data[0]["parent_id"]
            var4 = data[0]["link_id"]
            var5 = data[0]["created_utc"]
            var6 = data[0]["body"]
            var7 = data[0]["score"]
            var8 = data[0]["author"]
            var9 = data[0]["subreddit_id"]
            var10 = data[0]["subreddit"]
            var11 = data[0]["name"]

            conn.execute("INSERT INTO User VALUES (?)", (var8,))
            conn.execute("INSERT INTO SubReddit VALUES (?,?)", (var9,var10,))
            conn.execute("INSERT INTO Suscribe_to VALUES (?,?)", (var9,var8,))
            conn.execute("INSERT INTO Post VALUES (?,?,?)", (var11,var9,var8,))
            conn.execute("INSERT INTO Comment VALUES (?,?,?,?,?,?,?,?,?)", (var2,var3,var4,var5,var6,var7,var8,var9,var11,))

    return




# Import with first file 
#drop_table()
delete_content()
create_table()
start = time.time()
insert_value_first_file()
end = time.time()
print ("The first file took ", end-start, " seconds")


#drop_table()
#create_table_without_constraint()
#start = time.time()
#insert_value_first_file_bis()
#end = time.time()
#print ("The first file with no constrain took  ", end-start, " seconds")


# Import the second file 
#drop_table()
#create_table()
#start = time.time()
#insert_value_second_file()
#end = time.time()
#print ("The second file took ", end-start, " seconds")


#drop_table()
#create_table_without_constrain()
#start = time.time()
#insert_value_second_file_bis()
#end = time.time()
#print ("The second file with no constrain took  ", end-start, " seconds")


# Import the third file 

#drop_table()
#create_table()
#start = time.time()
#insert_value_third_file()
#end = time.time()
#print ("The third file took ", end-start, " seconds")


#drop_table()
#create_table_without_constrain()
#start = time.time()
#insert_value_third_file_bis()
#end = time.time()
#print ("The third file with no constrain took  ", end-start, " seconds")

conn.commit()








# Question 1 : How many comments have a specific user posted?

def sql_question_1() :
    print("How many comments have a specific user posted? ","\n")
    cursor = conn.execute("SELECT COUNT (*) FROM Comment WHERE author_comment = 'igiveyoumylife'")
    for row in cursor:
        print ("Result (example with author ='igiveyoumylife') = ", row[0])

    print("\n")
    return


def sql_question_1_random() :
    print("How many comments have a specific user posted? ","\n")
    cursor = conn.execute("SELECT COUNT(*),author_comment FROM Comment WHERE author_comment = (SELECT author_comment FROM Comment ORDER BY RANDOM() LIMIT 1)")
    for row in cursor:
        print ("Number of comments = ", row[0])
        print ("Author = ", row[1])

    print("\n")
    return


#Question2 : How many comments does a specific subreddit get per day?

def sql_question_2() :
    print("How many comments does a specific subreddit get per day? ","\n")
    cursor = conn.execute("SELECT (COUNT (*)  / 30) AS COMMENT_PER_DAY  FROM Comment JOIN SubReddit ON Comment.subreddit_comment = SubReddit.subreddit_id WHERE subreddit = 'reddit.com' ")
    for row in cursor:
        print ("Number of comments = ", row[0])

    print("\n")
    return

def sql_question_2_random() :
    print("How many comments does a specific subreddit get per day? ","\n")
    cursor = conn.execute("SELECT (COUNT(*) / 30),subreddit FROM Comment JOIN SubReddit ON Comment.subreddit_comment = SubReddit.subreddit_id WHERE subreddit =(SELECT subreddit FROM SubReddit ORDER BY RANDOM() LIMIT 1)")
    for row in cursor:
        print ("Number of comments = ", row[0])
        print ("Subreddit = ", row[1])

    print("\n")
    return

#Question3 : How many comments include the word ‘lol’?

def sql_question_3() :
    print("How many comments include the word ‘lol’?","\n")
    cursor = conn.execute("SELECT COUNT(*)FROM Comment WHERE body LIKE '%lol%'")
    for row in cursor:
        print ("Number of comments including 'lol' = ", row[0])

    print("\n")
    return

#Question4 : Users that commented on a specific link has also posted to which subreddits?

def sql_question_4() :
    print("Users that commented on a specific link has also posted to which subreddits?","\n")
    cursor = conn.execute("SELECT DISTINCT subreddit FROM SubReddit JOIN Comment ON  SubReddit.subreddit_id = Comment.subreddit_comment WHERE author_comment IN (Select author_comment FROM Comment WHERE link_id = 't3_2zvjj')")
    for row in cursor:
        print ("The specific link : t3_2zvjj, subreddit  = ", row[0])

    print("\n")
    return

def sql_question_4_random() :
    print("Users that commented on a specific link has also posted to which subreddits?","\n")
    cursor = conn.execute("SELECT DISTINCT subreddit FROM SubReddit JOIN Comment ON  SubReddit.subreddit_id = Comment.subreddit_comment WHERE author_comment IN (Select author_comment FROM Comment WHERE link_id =(SELECT link_id FROM Comment ORDER BY RANDOM() LIMIT 1))")
    for row in cursor:
        print ("The random link, subreddit  = ", row[0])

    print("\n")
    return



#Question5 : Which users have the highest and lowest combined scores? (combined as the sum of all scores)

def sql_question_5() :
    print("Which users have the highest and lowest combined scores? (combined as the sum of all scores)","\n")
    cursor = conn.execute("SELECT  author_comment, SUM(score) AS highscores FROM Comment GROUP BY author_comment Order by highscores DESC LIMIT 2")
    for row in cursor:
        print ("User who have the highest score  = ", row[0])

    print("\n")
    cursor = conn.execute("SELECT  author_comment, SUM(score) AS lowestscore FROM Comment GROUP BY author_comment Order by lowestscore LIMIT 1")
    for row in cursor:
        print ("User who have the lowest score  = ", row[0])

    print("\n")
    return


#Question6 : Which subreddits have the highest and lowest scored comments?

def sql_question_6() :
    print("Which subreddits have the highest and lowest scored comments?","\n")
    cursor = conn.execute("SELECT subreddit, SUM(score) AS highscore FROM SubReddit JOIN Comment ON  SubReddit.subreddit_id = Comment.subreddit_comment GROUP BY subreddit ORDER BY highscore DESC LIMIT 1")
    for row in cursor:
        print ("Subreddit who have the highest scrore  = ", row[0])

    print("\n")
    cursor = conn.execute("SELECT subreddit, SUM(score) AS lowestscore FROM SubReddit JOIN Comment ON  SubReddit.subreddit_id = Comment.subreddit_comment GROUP BY subreddit ORDER BY lowestscore LIMIT 1")
    for row in cursor:
        print ("Subreddit who have the lowest scrore  = ", row[0])

    print("\n")
    return


#Question7 : Given a specific user, list all the users he or she has potentially interacted with (i.e., everyone who as commented
#on a link that the specific user has commented on)

def sql_question_7() :
    print("Given a specific user, list all the users he or she has potentially interacted with (i.e., everyone who as commentedon a link that the specific user has commented on).","\n")
    cursor = conn.execute("SELECT DISTINCT author_comment FROM Comment Where  link_id IN (SELECT link_id FROM Comment WHERE author_comment ='igiveyoumylife' )")
    for row in cursor:
        print ("igiveyoumylife has interacted with  = ", row[0])

    print("\n")
    return

def sql_question_7_random() :
    print("Given a specific user, list all the users he or she has potentially interacted with (i.e., everyone who as commentedon a link that the specific user has commented on).","\n")
    cursor = conn.execute("SELECT DISTINCT author_comment FROM Comment Where  link_id IN (SELECT link_id FROM Comment WHERE author_comment = (SELECT author FROM User ORDER BY RANDOM() LIMIT 1))")
    for row in cursor:
        print ("random user has interacted with  = ", row[0])

    print("\n")
    return

#Question8 : Which users has only posted to a single subreddit ?

def sql_question_8() :
    print("Which users has only posted to a single subreddit ?","\n")
    cursor = conn.execute("SELECT author_comment FROM Comment GROUP BY author_comment HAVING COUNT(*) = 1")
    for row in cursor:
        print ("Users who has only posted to a single subreddit  = ", row[0])

    print("\n")
    return

# optionnal question
def sql_question_optionnal() :
    print("Which subreddits share no users, i.e., have no users that have posted to the others.")
    cursor = conn.execute("SELECT subreddit FROM Comment JOIN SubReddit ON Comment.subreddit_comment = SubReddit.subreddit_id WHERE author_comment IN (SELECT author_comment FROM Comment GROUP BY author_comment HAVING COUNT(*) = 1) AND subreddit_comment IN (SELECT subreddit_comment FROM Comment GROUP BY subreddit_comment HAVING COUNT(*) = 1)")
    for row in cursor:
        print ("Subreddit who share no users  = ", row[0])
 
    print("\n")
    return
    
#sql_question_1()
#sql_question_1_random()

#sql_question_2()
#sql_question_2_random()

#sql_question_3()

#sql_question_4()
#sql_question_4_random()

#sql_question_5()

#sql_question_6()

#sql_question_7()
#sql_question_7_random()


#sql_question_8()


#sql_question_optionnal()


conn.close()






