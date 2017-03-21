/**
 * Created by moi on 14/01/2017.
 */

conn = new Mongo();
db = conn.getDB("Assignment");

create_collection = function()
{
    db.createCollection("Home_university");
    db.createCollection("Arrival_university");
    db.createCollection("Students");
    db.createCollection("Home_course");
    db.createCollection("Arrival_course");

}
insert_data = function()
{
    db.Home_university.insert(
        [
            {
                "id" : "1",
                "name": "University of Nantes",
                "country" : "France",
                "place_offering" : "20",
                "name_coordinator" : "Victoire Morel",
                "email_coordinator" : "VictoireMorel@rhyta.com",
                "Student" :
                    [
                        {
                            "id_student" : "1"
                        }
                    ],
                "Course" :
                    [
                        {
                            "id_course": "2DV517"
                        },
                        {
                            "id_course": "2DV518"
                        }
                    ],
                "Contact_university" :
                    [
                        {
                            "id_contact_univ" : "1"
                        }
                    ]
            },
            {
                "id" : "2",
                "name": "Linnaeus University",
                "country" : "Sweden",
                "place_offering" : "15",
                "name_coordinator" : "PontusJansson",
                "email_coordinator" : "PontusJansson@jourrapide.com",
                "Student" :
                    [
                        {
                            "id_student" : "2"
                        }
                    ],
                "Course" :
                    [
                        {
                            "id_course": "2DV519"
                        },
                        {
                            "id_course": "2DV520"
                        }
                    ],
                "Contact_university" :
                    [
                        {
                            "id_contact_univ" : "2"
                        }
                    ]
            },
            {
                "id" : "3",
                "name": "University of Berlin",
                "country" : "Germany",
                "place_offering" : "25",
                "name_coordinator" : "Florian Duerr",
                "email_coordinator" : "FlorianDuerr@armyspy.com",
                "Student" :
                    [
                        {
                            "id_student" : "3"
                        }
                    ],
                "Course" :
                    [
                        {
                            "id_course": "2DV521"
                        },
                        {
                            "id_course": "2DV522"
                        }
                    ],
                "Contact_university" :
                    [
                        {
                            "id_contact_univ" : "3"
                        }
                    ]
            },
            {
                "id" : "4",
                "name": "University of Barcelona ",
                "country" : "Spain",
                "place_offering" : "30",
                "name_coordinator" : "Kalid Fajardo Juárez",
                "email_coordinator" : "KalidFajardoJuarez@teleworm.us",
                "Student" :
                    [
                        {
                            "id_student" : "4"
                        }
                    ],
                "Course" :
                    [
                        {
                            "id_course": "2DV523"
                        },
                        {
                            "id_course": "2DV524"
                        }
                    ],
                "Contact_university" :
                    [
                        {
                            "id_contact_univ" : "4"
                        }
                    ]
            }
        ]);

    db.Arrival_university.insert(

        [
            {
                "id" : "1",
                "name": "Linnaeus University",
                "country" : "Sweden",
                "place_offering" : "15",
                "name_coordinator" : "Pontus Jansson",
                "email_coordinator" : "PontusJansson@jourrapide.com",
                "Student" :
                    [
                        {
                            "id_student" : "1"
                        }
                    ],
                "Course" :
                    [
                        {
                            "id_course": "2DV525"
                        },
                        {
                            "id_course": "2DV526"
                        }
                    ],
                "Contact_university" :
                    [
                        {
                            "id_contact_univ" : "1"
                        }
                    ]
            },
            {
                "id" : "2",
                "name": "University of London",
                "country" : "England",
                "place_offering" : "20",
                "name_coordinator" : "Lilly Power",
                "email_coordinator" : "LillyPower@armyspy.com",
                "Student" :
                    [
                        {
                            "id_student" : "2"
                        }
                    ],
                "Course" :
                    [
                        {
                            "id_course": "2DV527"
                        },
                        {
                            "id_course": "2DV528"
                        }
                    ],
                "Contact_university" :
                    [
                        {
                            "id_contact_univ" : "2"
                        }
                    ]
            },
            {
                "id" : "3",
                "name": "University of Bordeaux",
                "country" : "France",
                "place_offering" : "5",
                "name_coordinator" : "Margaux Racicot",
                "email_coordinator" : "MargauxRacicot@jourrapide.com",
                "Student" :
                    [
                        {
                            "id_student" : "3"
                        }
                    ],
                "Course" :
                    [
                        {
                            "id_course": "2DV529"
                        },
                        {
                            "id_course": "2DV530"
                        }
                    ],
                "Contact_university" :
                    [
                        {
                            "id_contact_univ" : "3"
                        }
                    ]
            },
            {
                "id" : "4",
                "name": "University of Dublin",
                "country" : "Ireland",
                "place_offering" : "20",
                "name_coordinator" : "Aleah Boyle",
                "email_coordinator" : "AleahBoyle@jourrapide.com",
                "Student" :
                    {
                        "id_student" : "4"
                    }
                    ,
                "Course" :
                    [
                        {
                            "id_course": "2DV531"
                        },
                        {
                            "id_course": "2DV532"
                        }
                    ],
                "Contact_university" :
                    [
                        {
                            "id_contact_univ" : "4"
                        }
                    ]
            }
        ]);

    db.Students.insert(
        [
            {
                "id" : "1",
                "name": "Colin",
                "surname" : "Frapper",
                "country": "France",
                "email": "colin.frapper@hotmail.fr",
                "Learning_agreement" :
                    [
                        {
                            "name_faculty": "Faculty of technologie",
                            "stage": "false",
                            "duration" : 12,
                            "Course_home": [
                                {
                                    "id_course": "2DV517"
                                },
                                {
                                    "id_course": "2DV518"
                                }
                            ],
                            "Course_arrival": [
                                {
                                    "id_course": "2DV525"
                                },
                                {
                                    "id_course": "2DV526"
                                }
                            ]
                        }
                    ]
            },
            {
                "id" : "2",
                "name": "Thomas",
                "surname" : "Martinsson",
                "country": "Sweden",
                "email": "ThomasMartinsson@rhyta.com",
                "Learning_agreement" :
                    [
                        {
                            "name_faculty": "Faculty of economics",
                            "stage": "false",
                            "duration" : 12,
                            "Course_home": [
                                {
                                    "id_course": "2DV519"
                                },
                                {
                                    "id_course": "2DV520"
                                }
                            ],
                            "Course_arrival": [
                                {
                                    "id_course": "2DV527"
                                },
                                {
                                    "id_course": "2DV528"
                                }
                            ]
                        }
                    ]
            },
            {
                "id" : "3",
                "name": "Luca",
                "surname" : "Jung",
                "country": "Germany",
                "email": "LucaJung@rhyta.com",
                "Learning_agreement" :
                    [
                        {
                            "name_faculty": "Faculty of psychology",
                            "stage": "false",
                            "duration" : 6,

                            "Course_home": [
                                {
                                    "id_course": "2DV521"
                                },
                                {
                                    "id_course": "2DV522"
                                }
                            ],
                            "Course_arrival": [
                                {
                                    "id_course": "2DV529"
                                },
                                {
                                    "id_course": "2DV530"
                                }
                            ]
                        }
                    ]
            },
            {
                "id" : "4",
                "name": "Paloma",
                "surname" : "Mejía Alejandro",
                "country": "Spain",
                "email": "Paloma@rrerefe.com",
                "Learning_agreement" :
                [
                    {
                        "name_faculty": "Faculty of language",
                        "stage": "true",
                        "duration" : 24,
                        "Course_home": [
                            {
                                "id_course": "2DV523"
                            },
                            {
                                "id_course": "2DV524"
                            }
                        ],
                        "Course_arrival": [
                            {
                                "id_course": "2DV531"
                            },
                            {
                                "id_course": "2DV532"
                            }
                        ]
                    }
                ]
            }
        ]);

    db.Home_course.insert(
        [
            {
                "id": "2DV517",
                "name" : "Base de donnée",
                "credit": "7,5",
            },
            {
                "id": "2DV518",
                "name" : "Introduction au technologie du web",
                "credit": "7,5",
            },
            {
                "id": "2DV519",
                "name" : "Statistics",
                "credit": "7,5",
            },
            {
                "id": "2DV520",
                "name" : "Economics of the Northen Coutnry",
                "credit": "7,5",
            },
            {
                "id": "2DV521",
                "name" : "Freudsche Psychologie",
                "credit": "7,5",
            },
            {
                "id": "2DV522",
                "name" : "instruktiv Psychologie",
                "credit": "7,5",
            },
            {
                "id": "2DV523",
                "name" : "Francia",
                "credit": "7,5",
            },
            {
                "id": "2DV524",
                "name" : "Inglés",
                "credit": "7,5",
            }
        ]);

    db.Arrival_course.insert(
        [
            {
                "id": "2DV525",
                "name" : "Database theory",
                "credit": "7,5",
            },
            {
                "id": "2DV526",
                "name" : "Introduction to web programming",
                "credit": "7,5",
            },
            {
                "id": "2DV527",
                "name" : "Statistics",
                "credit": "7,5",
            },
            {
                "id": "2DV528",
                "name" : "Economics of Northen Country",
                "credit": "7,5",
            },
            {
                "id": "2DV529",
                "name" : "Psychologie freudienne",
                "credit": "7,5",
            },
            {
                "id": "2DV530",
                "name" : "Psychologie instructive",
                "credit": "7,5",
            },
            {
                "id": "2DV531",
                "name" : "French",
                "credit": "7,5",
            },
            {
                "id": "2DV532",
                "name" : "English",
                "credit": "7,5",
            }
        ]);
}

drop_collection_content = function()
{
    db.Home_university.remove({});
    db.Arrival_university.remove({});
    db.Students.remove({});
}

query_1 = function ()
{
    db.Arrival_university.aggregate([
        { $unwind : "$Student"},
        {
            $lookup:
            {
                from: "Students",
                localField: "Student.id_student",
                foreignField: "id",
                as: "Students_home"
            }
        },
        { $match  : { $and : [  { "name" : 'Linnaeus University' }, { "Students_home.country" : 'France' } ] } },
        { $project : { "Students_home.name" : 1, "Students_home.surname" : 1, "Students_home.email" : 1, "_id" : 0 }},
        {$out:"result_query_1"}
        ])
    print ("\n" + "Result of query 1 ");

    cursor = db.result_query_1.find();
        while ( cursor.hasNext() ) {
            printjson( cursor.next() );
        }

}

query_2 = function ()
{
    db.Home_university.aggregate([
        { $unwind : "$Contact_university"},
        {
            $lookup:
            {
                from: "Arrival_university",
                localField: "Contact_university.id_contact_univ",
                foreignField: "id",
                as: "Contact_between_university"
            }
        },
        { $match  : {  "Contact_between_university.name" : 'University of Dublin' } },
        { $project : { "name" : 1, "email_coordinator" : 1, "_id" : 0 }},
        {$out:"result_query_2"}
    ])

    cursor = db.result_query_2.find();
    print ("\n" + "Result of query 2 ");
    while ( cursor.hasNext() ) {
        printjson( cursor.next() );
    }
}


query_2_bis = function ()
{
    db.Home_university.aggregate([
        { $unwind : "$Contact_university"},
        {
            $lookup:
            {
                from: "Arrival_university",
                localField: "Contact_university.id_contact_univ",
                foreignField: "id",
                as: "Contact_between_university"
            }
        },
        { $match  : {  "Contact_between_university.name" : 'University of Dublin' } },
        { $project : { "name" : 1,  "place_offering" : 1 ,"_id" : 0 }},
        {$out:"result_query_2_bis"}
    ])

    cursor = db.result_query_2_bis.find();
    print ("\n" + "Result of query 2 bis ");
    while ( cursor.hasNext() ) {
        printjson( cursor.next() );
    }

}

query_3 = function ()
{
    db.Students.aggregate([
        { $unwind : "$Learning_agreement"},
        { $unwind : "$Learning_agreement.Course_arrival"},
        {
            $lookup:
            {
                from: "Arrival_course",
                localField: "Learning_agreement.Course_arrival.id_course",
                foreignField: "id",
                as: "Course_arrival_student"
            }
        },
        { $match  : {  "name" : 'Colin' } },
        { $project : { "Course_arrival_student.name" : 1, "_id" : 0 }},
        {$out:"result_query_3"}
    ])

    var cursor = db.result_query_3.distinct("Course_arrival_student.name");
    print ("\n" + "Result of query 3 ");
    printjson( cursor);
}

query_4= function ()
{
    db.Students.aggregate([

        { $unwind : "$Learning_agreement"},
        { $match  : { $and : [  { "Learning_agreement.stage" : 'true' }, { "Learning_agreement.duration" : { $gt: 12 } } ] } },
        { $project : { "name" : 1,  "surname" : 1 , "email" : 1, "Learning_agreement.name_faculty" : 1, "_id" : 0 }},
        {$out:"result_query_4"}
    ])

    cursor = db.result_query_4.find();
    print ("\n" + "Result of query 4 ");
    while ( cursor.hasNext() ) {
        printjson( cursor.next() );
    }

}

query_5 = function ()
{
    db.Arrival_university.aggregate([
        { $unwind : "$Student"},
        {
            $lookup:
            {
                from: "Students",
                localField: "Student.id_student",
                foreignField: "id",
                as: "Contact_between_university"
            }
        },
        { $unwind : "$Contact_between_university"},
        { $unwind : "$Contact_between_university.Learning_agreement"},
        { $match  : {  "Contact_between_university.Learning_agreement.name_faculty" : 'Faculty of psychology' } },
        { $project : { "name" : 1, "country" : 1, "email_coordinator" : 1, "_id" : 0 }},
        {$out:"result_query_5"}
    ])

    cursor = db.result_query_5.find();
    print ("\n" + "Result of query 5 ");
    while ( cursor.hasNext() )
    {
        printjson( cursor.next() );
    }
}


create_collection();
drop_collection_content();
insert_data();
query_1();
query_2();
query_2_bis();
query_3();
query_4();
query_5();
