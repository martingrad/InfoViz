/**
* DBSCAN (Density-based spatial clustering of applications with noise)
* @param data
* @param eps
* @param minPts
* @return {Object}
*/




function dbscan(data, eps, minPts)
{
	// initializing array of zeros, with the size of the data
	var pointsAreVisited = Array.apply(null, new Array(data.length)).map(Number.prototype.valueOf,0);
	console.log("visited points", pointsAreVisited);

	// copying the array of zeros
	var pointsAreNoise = pointsAreVisited;
	
	var clusters = [];
	clusters[0] = new Array();
	clusters[0].push(data[0]);
	clusters[0].push(data[1]);
	clusters[1] = new Array();
	clusters[1].push(data[2]);
	console.log("clusters", clusters);

	var currentPoint;
	var pointAlreadyVisited;
	var neighborPtsIndices;		// holds indices to neighboring data points (for one point at a time)
	
	// (C = 0)
	var clusterIndex = 0;
	// (for each unvisited point P in dataset D)
	for(var i = 0; i < data.length; ++i)
	{
		pointAlreadyVisited = pointsAreVisited[i];
		if(!pointAlreadyVisited){
			console.log("Point " + i + " not already visited!");
			currentPoint = data[i];
			// (mark P as visited)
			pointsAreVisited[i] = 1;
			neighborPtsIndices = regionQuery(currentPoint, eps);
			if(neighborPtsIndices.length < minPts){
				// (mark P as NOISE)
	    		pointsAreNoise[i] = 1;
	    	}
		  	else{
		  		// (C = next cluster)
				clusterIndex++;
		 		expandCluster(currentPoint, neighborPtsIndices, clusterIndex, eps, minPts);
		 	}
		}
		else{
			console.log("Point " + i + " already visited!");
		}
	}

	function regionQuery(_currentPoint, _eps){
		
		return [0,1];
	}

	function expandCluster(_currentPoint, _neighborPtsIndices, _clusterIndex, _eps, _minPts){
		var currentNeighborPoint;
		var currentNeighborPointIndex;
		var newNeighborPtsIndices;

		// (add P to cluster C)
		clusters[_clusterIndex] = new Array();
		clusters[_clusterIndex].push(_currentPoint);
		// (for each point P' in neighborPtsIndices)
		for(var i = 0; i < neighborPtsIndices.length; ++i){
			// store the data index of the current neigbor point being examined.
			currentNeighborPointIndex = neighborPtsIndices[i];
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
			if( pointIsPartOfAnyCluster(currentNeighborPointIndex) ){
				// add P' to cluster C
				clusters[_clusterIndex].push(data[currentNeighborPointIndex]);
			}
		}
	}

	function pointIsPartOfAnyCluster(_currentNeighborPointIndex){
		var isPart = false;
		for(var i = 0; i < clusters.length; ++i){
			if( clusters[i].indexOf(_currentNeighborPointIndex != -1) ){
				isPart = true;
				break;
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