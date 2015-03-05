/**
* DBSCAN (Density-based spatial clustering of applications with noise)
* @param data
* @param eps
* @param minPts
* @return {Object}
*/

var visitedPoints;

function dbscan(data, eps, minPts)
{
	visitedPoints = Array.apply(null, new Array(data.length)).map(Number.prototype.valueOf,0);

	console.log("visited points", visitedPoints);
	var clusterIndex = 0;

	for(var i = 0; i < data.length; ++i)
	{
		var currentPoint = data[i];
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