/**
* DBSCAN (Density-based spatial clustering of applications with noise)
* @param data
* @param eps
* @param minPts
* @return {Object}
*/




function dbscan(data, eps, minPts)
{
	console.log("dbscan(data, " + eps + ", " + minPts + ") results:");
	
	// initializing array of zeros, with the size of the data (zeros - not visited, ones - visited)
	var pointsAreVisited = Array.apply(null, new Array(data.length)).map(Number.prototype.valueOf,0);
	//console.log("visited points", pointsAreVisited);

	// copying the array of zeros
	var pointsAreNoise = pointsAreVisited;
	
	var clusters = [];
	//clusters[0] = new Array();
	//console.log("clusters", clusters);

	var currentPoint;
	var pointAlreadyVisited;
	var neighborPtsIndices;		// holds indices to neighboring data points (for one point at a time)
	
	// (C = 0)
	var clusterIndex = -1;
	// (for each unvisited point P in dataset D)
	for(var i = 0; i < data.length; ++i)
	{
		pointAlreadyVisited = pointsAreVisited[i];
		if(!pointAlreadyVisited){
			//console.log("Point " + i + " not already visited!");
			currentPoint = data[i];
			// (mark P as visited)
			pointsAreVisited[i] = 1;
			neighborPtsIndices = regionQuery(currentPoint, eps);
			if(neighborPtsIndices.length < minPts){
				// (mark P as NOISE)
				console.log("noise!");
	    		pointsAreNoise[i] = 1;
	    	}
		  	else{
		  		// (C = next cluster)
				clusterIndex++;
		 		expandCluster(currentPoint, neighborPtsIndices, clusterIndex, eps, minPts);
		 	}
		}
		else{
			//console.log("Point " + i + " already visited!");
		}
	}

	console.log(clusters);


	// function that returns data indices for neigboring points
	function regionQuery(_currentPoint, _eps){
		//console.log("regionQuery()");
		var neighbors = [];
		var euclideanDist = 0;
		var curNeigh;
		for(var i = 0; i < data.length; ++i){
			curNeigh = data[i];
			euclideanDist = Math.abs(curNeigh["inkomst"] - _currentPoint["inkomst"]);
			// skillnaden för a^2 + b^2 osv ... roten ur det. = det nya euklidiska distansen som ska beräknas.
			if( curNeigh != _currentPoint && euclideanDist <= _eps && !pointIsPartOfAnyCluster(curNeigh) ){
				//console.log("Jag hittade en granne!");
				neighbors.push(i);
			}
		}
		return neighbors;
	}

	function expandCluster(_currentPoint, _neighborPtsIndices, _clusterIndex, _eps, _minPts){
		//console.log("expandCluster()");
		var currentNeighborPoint;
		var currentNeighborPointIndex;
		var newNeighborPtsIndices;

		// (add P to cluster C)
		if(!clusters[_clusterIndex]){
			clusters[_clusterIndex] = new Array();
		}
		clusters[_clusterIndex].push(_currentPoint);
		//console.log("clusters[" + _clusterIndex + "]:" + clusters[_clusterIndex]);

		// (for each point P' in neighborPtsIndices)
		for(var i = 0; i < _neighborPtsIndices.length; ++i){
			// store the data index of the current neigbor point being examined.
			currentNeighborPointIndex = _neighborPtsIndices[i];
			// get the data point using the index
			currentNeighborPoint = data[currentNeighborPointIndex];
			// (if P' is not visited)
			// if this point has not already been visited...
			if(!pointsAreVisited[currentNeighborPointIndex]){
				// (mark P' as visited)
				pointsAreVisited[currentNeighborPointIndex] = 1;
				newNeighborPtsIndices = regionQuery(currentNeighborPoint, _eps)
				if(newNeighborPtsIndices >= _minPts){
					// NeighborPts = NeighborPts joined with NeighborPts'
					_neighborPtsIndices.concat(newNeighborPtsIndices);
				}
			}
			//if P' is not yet member of any cluster
			if(test(currentNeighborPointIndex)){
				// detta är ett test, touch it and you'll die ;)
			}

			if( !pointIsPartOfAnyCluster(+currentNeighborPointIndex) ){
				// add P' to cluster C
				clusters[_clusterIndex].push(data[currentNeighborPointIndex]);
			}
		}
	}

	function test(value){

	}

	function pointIsPartOfAnyCluster(_currentNeighborPointIndex){
		var isPart = false;
		console.log(_currentNeighborPointIndex);
		for(var i = 0; i < clusters.length; ++i){
			//console.log("Is _currentNeighborPointIndex = " + _currentNeighborPointIndex + " part of clusters[" + i + "]?");
			//console.log(_currentNeighborPointIndex);
			if( clusters[i].indexOf(data[_currentNeighborPointIndex]) != -1 ){		//if it doesn't exist it returns -1
				isPart = true;
				//console.log("hey man, this is already part!");
				break;
			}
			else{
				//console.log("No!");
			}
		}
		return isPart;
	}


/*	pseudo-code
	DBSCAN(D, eps, MinPts)
	C = 0
	for each unvisited point P in dataset D
	  	mark P as visited
	  	NeighborPts = regionQuery(P, eps)
	  	if sizeof(NeighborPts) < MinPts
	    	mark P as NOISE
	  	else
			C = next cluster
	 		expandCluster(P, NeighborPts, C, eps, MinPts)
          
	expandCluster(P, NeighborPts, C, eps, MinPts)
   		add P to cluster C
   		for each point P' in NeighborPts 
      		if P' is not visited
     			mark P' as visited
         		NeighborPts' = regionQuery(P', eps)
         		if sizeof(NeighborPts') >= MinPts
            		NeighborPts = NeighborPts joined with NeighborPts'
      		if P' is not yet member of any cluster
         		add P' to cluster C
          
	regionQuery(P, eps)
   		return all points within P's eps-neighborhood (including P)
*/
}