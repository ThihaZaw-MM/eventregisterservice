var mongojs = require("mongojs");
var express = require("express");
var validator = require('express-validator');
var router = express.Router();

var auth = require("../auth");
var config = require("../config");

var db = mongojs('eventmanager', ['events']);
var dbRegs = mongojs('eventmanager', ['registrations']);
var dbNewVisitor = mongojs('eventmanager', ['newvisitors']);

// Get statuses
router.get("/statuses", auth.ensureAuth(), function(req, res) {
  res.status(200).json(config.status);
});

// Get types
router.get("/types", auth.ensureAuth(), function(req, res) {
  res.status(200).json(config.type);
  //Need to add new table document for flexible types 
});

//Get all events
router.get("/", auth.ensureAuth(), function(req, res) {
	db.events.find({}, function(err, data) {
		res.status(200).json(data);
	});
});

//Get one event
router.get("/:id", auth.ensureAuth(), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Event ID").isMongoId();
	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	db.events.findOne({_id: mongojs.ObjectId(iid)}, function(err, data) {
		if(data) res.status(200).json(data);
		else res.sendStatus(400);
	});
});

router.post("/register", function(req, res){
	console.log(req.body);
	var newRegistration = {
		eventName: req.body.eventName,
		visitorId: req.body.visitorId,
		visitorName: req.body.visitorName,
		companyName: req.body.companyName,
		touchedLocation: req.body.touchedLocation,
		touchedAt: new Date(),
		submittedAt: new Date(),
		submittedBy: req.body.touchedLocation
	};

	dbRegs.registrations.insert(newRegistration, function(err, data) {
		if(err) res.status(500).json(err);
		else res.status(200).json(data);
	});
});

router.post("/registernew", function(req, res){
	var newVisitor = {
		eventName: req.body.eventName,
		visitorId: req.body.visitorId,
		visitorName: req.body.visitorName,
		companyName: req.body.companyName,
		address : req.body.address,
		phoneNumber: req.body.phoneNumber,
		registeredAt: new Date(),
		submittedAt: new Date(),
	};
	dbNewVisitor.newvisitors.insert(newVisitor, function(err, data) {
		if(err) res.status(500).json(err);
		else res.status(200).json(data);
	});
});

//Create a new event
router.post("/", auth.ensureRole(1), function(req, res) {
	//Validation
	req.checkBody("eventName", "Invalid Event Name").notEmpty();
	req.checkBody("eventDescription", "Invalid Description").notEmpty();
	req.checkBody("startDate", "Invalid start date").notEmpty();
	req.checkBody("endDate", "Invalid end date").notEmpty();
	req.checkBody("startTime", "Invalid start time").notEmpty();
	req.checkBody("endTime", "Invalid end time").notEmpty();
	req.checkBody("type", "Invalid Type").isInt();

	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	var organizers = [];
	var organizer = {
						userId: req.body.userId,
						fullName: req.body.fullName,
					};
	organizers.push(organizer);

	var newEvent = {
		eventName: req.body.eventName,
		eventDescription: req.body.eventDescription,
		startDate: req.body.startDate,
		endDate: req.body.endDate,
		startTime: req.body.startTime,
		endTime: req.body.endTime,
		latitude: req.body.latitude,
		longitude: req.body.longitude,
		mapurl: req.body.mapurl,
		enquireNumber: req.body.enquireNumber,
		enquireEmail: req.body.enquireEmail,
		status: 1,
		type: req.body.type,
		submittedAt: new Date(),
		submittedBy: mongojs.ObjectId(req.user._id),
		organizers: organizers
	};

	db.issues.insert(newIssue, function(err, data) {
		if(err) res.status(500).json(err);
		else res.status(200).json(data);
	});
});

//Update event type
router.patch("/type/:id", auth.ensureRole(1), function(req, res) {
	var iid = req.params.id;

	//Validation
	req.checkParams("id", "Invalid Event ID").isMongoId();
	req.checkBody("type", "Invalid Type").isInt();

	var errors = req.validationErrors();
	if(errors) {
		res.status(400).json(errors);
		return false;
	}

	var newData = {
		type: req.body.type,
		typeLabel: config.type[req.body.type],
		modifiedAt: new Date()
	};

	db.events.update(
		{ _id: mongojs.ObjectId(iid) },
		{ $set: newData },
		{ multi: false },
		function(err, data) {
			if(err) res.status(500).json(err);
			else res.status(200).json(data);
		}
	);
});

//Update an event
router.put("/:id", auth.ensureRole(1), function(req, res) {
	var iid = req.params.id;
	//TODO: need coding to update an event
});

//Delete an event
router.delete("/:id", auth.ensureRole(1), function(req, res) {
	var iid = req.params.id;
	//TODO: need coding to delete an event
});

//Close an event
router.patch("/close/:id", auth.ensureSuper(), function(req, res) {
	var iid = req.params.id;
	//TODO: need coding to close an event
});

//Comments
router.post("/comments", auth.ensureAuth(), function(req, res) {
	//TODO: need coding to add comments
});

router.delete("/comments", auth.ensureAuth(), function(req, res) {
	//TODO: need coding to delete comments
});

module.exports = router;