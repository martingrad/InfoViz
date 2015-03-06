    /**
    * k means algorithm
    * @param data
    * @param k
    * @return {Object}
    */
   
    var nearestCentroidIndices;
   
    function kmeans(data, k) {
        var headers = d3.keys(data[0]);
        // Call function to create centroids
        var centroids = createCentroids(k, headers, data);
        // console.log(centroids);

        // Call function (in which the Euclidean distance is used) to create an array consisting indicies for the nearest Centroids.
        nearestCentroidIndices = findNearestCentroidIndices(data, centroids);
        //console.log("length: " + nearestCentroidIndices.length);
        // console.log("Först");
        // console.log(nearestCentroidIndices);

		centroids = optimizeCentroids(data, k, centroids);
		//console.log("Centroider");
        //console.log(centroids);
        // console.log("Sist");
        // console.log(nearestCentroidIndices);
        


        return nearestCentroidIndices;
        

        // return an array of assignments 
        // that will be used to color code the polylines in the parallel coordinates
		// according to which cluster they belong to.
    };
    
    // Function which returns an array with the indicies for the nearest centroids
    function  findNearestCentroidIndices(data, centroids){
        console.log("2. Determine nearest distance");
        var headers = d3.keys(data[0]);
    	var nearestCentroidIndices = [];
    	// var dataA = [];
        var dataA;
        var temp, nearestCentroidIndex;
        
        var euclideanDistance;

        for(var i = 0; i < data.length; i++)					// for each line
        {
        	nearestCentroidIndex = 666;
        	euclideanDistance = 666;
        	
        	for(var j = 0; j < centroids.length; j++)			// for each centroid
        	{
                temp = 0;
                for(var k = 0; k < headers.length; k++)
                {
                    dataA = data[i][headers[k]] - centroids[j][headers[k]];
                    temp += Number(dataA * dataA);     
                }
                 
				temp = Math.sqrt(temp);
                // console.log(data[5599][headers[4]]);
				if(temp < euclideanDistance)
				{
					euclideanDistance = temp;
					nearestCentroidIndex = j;
				}
        	}
        	nearestCentroidIndices[i] = nearestCentroidIndex;
        }
        console.log(nearestCentroidIndices);

        return nearestCentroidIndices;
    };


    // Function to create the Centroids
    function createCentroids(k, headers, _data){
    	// var _centroids = [];
     //    var tempCentroid = [];
    	// for(var i = 0; i < k; ++i)
     //    {
     //        tempCentroid = [];
     //        for(var j = 0; j < headers.length; ++j)
     //        {
     //            tempCentroid.push(Math.random());
     //        }
     //        _centroids.push(tempCentroid);             // Random number 0-1

     //    }

        var _centroids = [];
        var dataLength = _data.length;
        for(var i = 0; i < k; ++i)
        {
            _centroids.push( _data[Math.min( Math.round(Math.random() * dataLength), dataLength - 1) ] );
        }
        console.log("1. Creating centroids");
        console.log(_centroids);

        return _centroids;
    };

    function optimizeCentroids(data, k, centroids){
        console.log("3. Optimize centroids ");
        var oldCentroids = centroids;

    	var cluster = [];
    	var clusters = [];
    	var tempCluster = [];
    	
    	for(var indexValue = 0; indexValue < k; ++indexValue)
    	{
    		cluster = [];
    		for(var i = 0; i < nearestCentroidIndices.length; ++i)
    		{
    			if(nearestCentroidIndices[i] == indexValue)
    			{
    				cluster.push(data[i]);
    			}
    		}
    		//if(cluster.length != 0)
    		//{
    			clusters.push(cluster);                  // Ska ett tomt kluster verkligen tas bort? Eller ska den ges en ny slumpad centroid?
    		//}
    	}

        console.log("Antal kluster:");
        console.log(clusters.length);
        console.log(clusters);

        var headers = d3.keys(data[0]);
    	var meanValues = [];
        var currentPropertySum = [];
        var tempMeanValues = {};
    	for(var i = 0; i < clusters.length; ++i)                            // for each cluster
    	{
            tempMeanValues = {}; // här är vi
    		currentCluster = clusters[i];

            for(var k = 0; k < headers.length; ++k)                         // for each property of the data
            {
                currentPropertySum[k] = 0;
        		for(var j = 0; j < currentCluster.length; ++j)              // for each line within the cluster
        		{
                    currentPropertySum[k] += Number(currentCluster[j][headers[k]]);
        		}
                tempMeanValues[headers[k]] = currentPropertySum[k] / (currentCluster.length);
            }

            meanValues.push(tempMeanValues);
    	}
        console.log("Meanvalues");
        console.log(meanValues);

        var isEqualNumberOfCentroids = (oldCentroids.length == meanValues.length);
        var difference = 0.0;

        console.log("4. Something");
        if(isEqualNumberOfCentroids)
        {
            for(var i = 0; i < meanValues.length; ++i)                      // for each cluster
            {
                for(var j = 0; j < headers.length; ++j)                     // for each property
                {
                    difference += Math.pow(oldCentroids[i][headers[j]] - meanValues[i][headers[j]], 2);
                }
                
            }
        }

        console.log(difference);

        if(!isEqualNumberOfCentroids || difference > 0.2)
        {
            //console.log("Nu förbättrar jag! Anledning var:");
            //console.log(isEqualNumberOfCentroids);
            //console.log(difference > 0.05);
            // console.log(oldCentroids);
            // numberOfRecursions++;
            // console.log(numberOfRecursions);
            // console.log("Nu ändrar jag på nearest centroid indicies");
            nearestCentroidIndices = findNearestCentroidIndices(data,meanValues);
            // console.log(nearestCentroidIndices);
            meanValues = optimizeCentroids(data, k, meanValues);
        }
        
        
            //console.log("Nu räcker det!");
            // console.log(oldCentroids);
            // console.log("och de nya är");
             // console.log(meanValues);
            return meanValues;
        


        // var equal = true;
        // if(oldCentroids.length == meanValues.length)
        // {
        //     for(var i = 0; i < oldCentroids.length; ++i)
        //     {
        //         if(oldCentroids[i] != meanValues[i])
        //         {
        //             equal = false;
        //             break;
        //         }
        //     }
        // }

        // if(!equal)
        // {
        //     console.log("Nu förbättrar jag! Centroiderna var: ");
        //     console.log(oldCentroids);
        //     numberOfRecursions++;
        //     console.log(numberOfRecursions);
        //     if(numberOfRecursions < 10){
        //         optimizeCentroids(data, k, meanValues, findNearestCentroidIndices(data, meanValues), numberOfRecursions);
        //     }
            
        // }
        // else
        // {
        //     console.log("Nu räcker det! De gamla centroiderna var: ");
        //     console.log(oldCentroids);
        //     console.log("och de nya är");
        //     console.log(meanValues);
        //     return meanValues;
        // }
    	
    };
    








