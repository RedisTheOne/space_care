from flask import jsonify, request
import bson
from uuid import uuid4 
import os
import datetime

def findUser(User, Nutrition, SleepDeclaration):
    username = request.args.get('username')
    users = User.find({"username": username})
    nutritions = Nutrition.find({"username": username})
    sleepDeclarations = SleepDeclaration.find({"username": username})
    nutritionsList = []
    sleepDeclarationsList = []
    usersList = []
    for user in users:
        user['_id'] = str(user['_id'])
        usersList.append(user)
    for nutrition in nutritions:
        nutrition['_id'] = str(nutrition['_id'])
        nutritionsList.append(nutrition)
    for sleepDeclaration in sleepDeclarations:
        sleepDeclaration['_id'] = str(sleepDeclaration['_id'])
        sleepDeclarationsList.append(sleepDeclaration)
    if len(usersList) > 0:
        return jsonify(status=True, user=usersList[0], nutritions=nutritionsList, sleepDeclarations=sleepDeclarationsList)
    return jsonify(status=False)

def signIn(User):
    # {
    #     "username": "rakel",
    #     "password": "rakel"
    # }  
    body = request.json
    username = body['username']
    password = body['password']
    users = User.find({ "username": username, "password": password })
    usersList = []
    isValid = False
    for user in users:
        usersList.append(user)
    print(usersList)
    if len(usersList) == 1:
        isValid = True
    return jsonify(status=isValid)

def signUp(User):
    # {
    #     "username": "rakel",
    #     "firstName": "Rakel",
    #     "lastName": "Spahi",
    #     "password": "rakel",
    #     "sleepGoal": 8,
    #     "caloriesGoal": 2000,
    #     "avatar": file
    # }
    body = request.form
    avatar = request.files['avatar']
    ext = os.path.splitext(avatar.filename)[len(os.path.splitext(avatar.filename)) - 1]
    name = str(uuid4()) + ext
    savedPath = os.path.join('./uploadedImages', name)
    avatar.save(savedPath)

    #FIND IF A USER EXISTS
    users = User.find({"username": body['username']})
    usersList = []
    for user in users:
        usersList.append(user)
    if len(usersList) > 0:
        return jsonify(status=False, msg="User with this username already exists")
    
    #CREATE USER
    user = User.insert({ "username": body['username'], "avatarPath": name, "firstName": body['firstName'], "lastName": body['lastName'], "password": body['password'], "sleepGoal": body['sleepGoal'], "caloriesGoal": body['caloriesGoal'] })
    return jsonify(status=True, msg="User created successfully.")

def createNutrition(Nutrition):
    try:
        body = request.json
        nutrition = Nutrition.insert({ "username": body['username'], "nutritionName": body['nutritionName'], "calories": body['calories'], "year": body['year'], "day": body['day'], "month": body['month']})
        return jsonify(status=True, msg="Nutrition addedd successfully.")
    except:
        return jsonify(status=False, msg="Error occured.")

def createSleepDeclaration(SleepDeclaration):
    try:
        body = request.json
        sleepDeclaration = SleepDeclaration.insert({ "username": body['username'], "hours": body['hours'], "year": body['year'], "day": body['day'], "month": body['month']})
        return jsonify(status=True, msg="Sleep declaration addedd successfully.")
    except:
        return jsonify(status=False, msg="Error occured.")

def deleteNutrition(Nutrition):
    try:
        body = request.json
        Nutrition.delete_one({"_id": bson.ObjectId(body['id'])})
        return jsonify(status=True, msg="Nutrition deleted successfully.")
    except:
        return jsonify(status=False, msg="Error occured.")

def editSleepHours(SleepDeclaration):
    try:
        body = request.json
        myquery = {"_id": bson.ObjectId(body["id"])}
        newvalues = {"$set": {"hours": body["hours"]}}
        SleepDeclaration.update_one(myquery, newvalues)
        return jsonify(status=True, msg="Sleep declaration updated successfully.")
    except:
        return jsonify(status=False, msg="Error occured.")

def updateUserInfo(User):
    try:
        body = request.json
        query = {"username": body['username']}
        newvalues = {"$set": { "firstName": body['firstName'], "lastName": body['lastName'], "password": body['password'], "sleepGoal": body['sleepGoal'], "caloriesGoal": body['caloriesGoal'] }}
        User.update_one(query, newvalues)
        return jsonify(status=True, msg="User updated successfully.")
    except:
        return jsonify(status=False, msg="Error occured.")

def getMonthlyNutritions(Nutrition):
    username = request.args.get('username')
    month = request.args.get('month')
    year = request.args.get('year')
    nutritions = Nutrition.find({ "month": int(month), "year": int(year), "username": username })
    nutritionsList = []
    for nutrition in nutritions:
        nutrition['_id'] = str(nutrition['_id'])
        nutritionsList.append(nutrition)
    return jsonify(monthlyNutritions=nutritionsList)

def getMonthlySleepDeclarations(SleepDeclaration):
    username = request.args.get('username')
    month = request.args.get('month')
    year = request.args.get('year')
    sleepDeclarations = SleepDeclaration.find({ "month": int(month), "year": int(year), "username": username })
    sleepDeclarationsList = []
    for sleepDeclaration in sleepDeclarations:
        sleepDeclaration['_id'] = str(sleepDeclaration['_id'])
        sleepDeclarationsList.append(sleepDeclaration)
    return jsonify(sleepDeclarations=sleepDeclarationsList)

def getTodayNutritions(Nutrition):
    useranme = request.args.get('username')
    now = datetime.datetime.now()
    nutritions = Nutrition.find({ "day": now.day, "month": now.month, "year": now.year, "username": useranme })
    nutritionsList = []
    for nutrition in nutritions:
        nutrition['_id'] = str(nutrition['_id'])
        nutritionsList.append(nutrition)
    return jsonify(nutritions=nutritionsList)

def getTodaySleepDeclaration(SleepDeclaration):
    useranme = request.args.get('username')
    now = datetime.datetime.now()
    sleepDeclarations = SleepDeclaration.find({ "day": now.day, "month": now.month, "year": now.year, "username": useranme })
    sleepDeclarationsList = []
    for sleepDeclaration in sleepDeclarations:
        sleepDeclaration['_id'] = str(sleepDeclaration['_id'])
        sleepDeclarationsList.append(sleepDeclaration)
    if len(sleepDeclarationsList) > 0:
        return jsonify(sleepDeclaration=sleepDeclarationsList[0])
    else:
        return jsonify(sleepDeclaration={})

def editUserInformation(User):
    body = request.json
    myquery = {"username": body['username']}
    newvalues = {"$set": {"firstName": body["firstName"], "lastName": body['lastName'], "sleepGoal": body['sleepGoal'], "caloriesGoal": body['caloriesGoal']}}
    User.update_one(myquery, newvalues)
    return jsonify(status=True, msg='User updated successfully.')