#!/usr/bin/python3
import csv
import pymysql
import json

config = './baseConfig.json'
# config = './connectAWS.json'

user_csv = './UserData.csv'

with open(config) as f:
    data = json.load(f)

print(data)
db = pymysql.connect(host=data['host'],
    user=data['user'],
    passwd=data['password'],
    db=data['database'])
cursor = db.cursor()

i = 0
with open(user_csv,encoding='utf-8') as file:
	f = csv.reader(file)
	for row in f:
	    list_row = row
	    list_row.append(0)
	    # print(list_row)
	    cursor.execute('INSERT INTO users (fname,lname, address, city,state,zip, email,username,password,isadmin ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)', list_row)
	    i += 1
	    if i % 100 == 0:
	    	print("insert "+str(i)+" records finished")
	    	# break

# #close the connection to the database.
db.commit()
cursor.close()
# print "Done"