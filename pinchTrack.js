var __pt = PinchTrack = (function(){
	
	var settings, log, attachEventToObject, coordinates;
	settings = {
		objectToZoom: "",
		logActivityOn: ""
	};

	this.constructor = (function(){
		if(typeof arguments[0][0] !== 'undefined') {
			settings.objectToZoom = document.getElementById(arguments[0][0].substr(1));
		}
		if(typeof arguments[0][1] !== 'undefined') {
			settings.logActivityOn = document.getElementById(arguments[0][1].substr(1));
		}
	})(arguments);

	/**
	* This method logs every activity. If settings.logActivityOn is not empty then
	* the log will apper inside specified DOM, other wise the log will reflect on console
	* Arguments
	* @message: <STRING> [ The message which is going to be logged ]
	*/
	log = (function(message){
		if(settings.logActivityOn !== "") {
			settings.logActivityOn.innerHTML += '<p>'+message+'</p>' 
		} else {
			console.log(message);
		}
	});

	/**
	* This object holds the coordinates of touch start and touch end
	* Description
	* start: This object holds the "point1" and "point2" coordinates of the location
	*        from where the pinch zoom effect begins. Both "point1" and "point2" holds
	*        x and y coordinates as "pageX" and "pageY"
	*
	* end: This object holds the "point1" and "point2" coordinates of the location
	*      where the pinch zoom effect ends. Both "point1" and "point2" holds
	*        x and y coordinates as "pageX" and "pageY"  
	*/
	coordinate = {
		start: {
			point1: {
				pageX: 0,
				pageY: 0	
			},
			point2: {
				pageX: 0,
				pageY: 0	
			}
			
		},
		end: {
			point1: {
				pageX: 0,
				pageY: 0	
			},
			point2: {
				pageX: 0,
				pageY: 0	
			}
		}
	};

	/**
	* This method when called begin the tracking of pinch zoom effect. The effect will not apper
	* on screen it will just log the coordinates of the event.
	* Arguments
	* @callback: <FUNCTION> [A callback method which is triggered every moment when the coordinates
	*                        are changing in pinch zoom event. To callback 2 objects are passed, 1st
	*                        an error object and the coordinate object]
	*/
	this.trackPinch = (function(callback) {
		var myImage=settings.objectToZoom, tempCoordinateObject = coordinate, endFired;
		
		myImage.addEventListener("touchstart", function (event) {
	    	endFired = false;	    	
	    	if (event.touches.length > 1) {
	    		// touch start event will only start if there are more than one touch point
		    	coordinate.start.point1.pageX = event.touches.item(0).pageX;
		    	coordinate.start.point1.pageY = event.touches.item(0).pageY;
		    	coordinate.start.point2.pageX = event.touches.item(1).pageX;
		    	coordinate.start.point2.pageY = event.touches.item(1).pageY;

		    	coordinate.end.point1.pageX = event.touches.item(0).pageX;
		    	coordinate.end.point1.pageY = event.touches.item(0).pageY;
		    	coordinate.end.point2.pageX = event.touches.item(1).pageX;
		    	coordinate.end.point2.pageY = event.touches.item(1).pageY;

		    	// backing up the start coordinates to temp variable at zoom start
		    	tempCoordinateObject = coordinate;

		    	log("START");
		    	log(JSON.stringify(coordinate));
		    	if(typeof callback !== 'undefined') {
		    		callback(null, coordinate);
		    	}
	    	}
	    	event.preventDefault();
	    }, false);

		myImage.addEventListener("touchmove", function (event) {
			if (event.touches.length > 1) {
				// touchmove event only counts if touch points are greater than 1

				// logging present end point positions to temp object, it will update
				// periodically on finger moov
	    		tempCoordinateObject.end.point1.pageX = event.touches.item(0).pageX;
		    	tempCoordinateObject.end.point1.pageY = event.touches.item(0).pageY;
		    	tempCoordinateObject.end.point2.pageX = event.touches.item(1).pageX;
		    	tempCoordinateObject.end.point2.pageY = event.touches.item(1).pageY; 
	    		if(typeof callback !== 'undefined') {
		    		callback(null, tempCoordinateObject);
		    	}
	    	}
	    	event.preventDefault();

		}, false);
		myImage.addEventListener("touchend", function (event) {
			// touchend event will be fired as soon as the touch points on 
			// object goes below 2
			if(!endFired) {
				endFired = true;
				coordinate.end.point1.pageX = tempCoordinateObject.end.point1.pageX;
		    	coordinate.end.point1.pageY = tempCoordinateObject.end.point1.pageY;
		    	
		    	coordinate.end.point2.pageX = tempCoordinateObject.end.point2.pageX;
		    	coordinate.end.point2.pageY = tempCoordinateObject.end.point2.pageY;
		    	
		    	log("END");
		    	log(JSON.stringify(coordinate));
		    	event.preventDefault();
		    	if(typeof callback !== 'undefined') {
		    		callback(null, coordinate);
		    	}
	    	}
		}, false);
	})
});
